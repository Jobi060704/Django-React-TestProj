from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.core.exceptions import PermissionDenied

# JWT Token Serializer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        return token

# User Registration Serializer
class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

# Company Serializer
class CompanySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Company
        fields = ["id", "name", "owner", "center", "color"]

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)

    def validate(self, data):
        if self.instance and self.instance.owner != self.context["request"].user:
            raise PermissionDenied("You do not own this company.")
        return data

# Region Serializer
class RegionSerializer(serializers.ModelSerializer):
    company = serializers.ReadOnlyField(source='company.name')
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), source='company'
    )

    class Meta:
        model = Region
        fields = ["id", "name", "center", "company", "company_id", "color"]

    def validate_company(self, company):
        if company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own this company.")
        return company

# Waterway Sector Serializer
class WaterwaySectorSerializer(serializers.ModelSerializer):
    region = serializers.ReadOnlyField(source='region.name')
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), source='region'
    )
    pivot_count = serializers.ReadOnlyField()
    total_pivot_area = serializers.ReadOnlyField()

    class Meta:
        model = WaterwaySector
        fields = [
            "id", "name", "area_ha", "total_water_requirement", "shape",
            "region", "region_id", "pivot_count", "total_pivot_area", "color"
        ]
        read_only_fields = ["area_ha"]

    def validate_region(self, region):
        if region.company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own the company of this region.")
        return region

# Crop Serializer
class CropSerializer(serializers.ModelSerializer):
    class Meta:
        model = Crop
        fields = ["id", "name", "subtype", "best_season"]

# CropPivot Serializer
class CropPivotSerializer(serializers.ModelSerializer):
    sector = serializers.ReadOnlyField(source='sector.name')
    sector_id = serializers.PrimaryKeyRelatedField(
        queryset=WaterwaySector.objects.all(), source='sector'
    )
    crops = CropSerializer(many=True, read_only=True)
    crop_ids = serializers.PrimaryKeyRelatedField(
        queryset=Crop.objects.all(), source='crops', many=True, write_only=True
    )

    class Meta:
        model = CropPivot
        fields = [
            "id", "logical_name", "area", "crops", "crop_ids",
            "seeding_date", "harvest_date", "center", "radius_m",
            "sector", "sector_id", "color"
        ]

    def validate_sector(self, sector):
        if sector.region.company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own this sector's company.")
        return sector

# CropField Serializer
class CropFieldSerializer(serializers.ModelSerializer):
    sector = serializers.ReadOnlyField(source='sector.name')
    sector_id = serializers.PrimaryKeyRelatedField(
        queryset=WaterwaySector.objects.all(), source='sector'
    )
    crops = CropSerializer(many=True, read_only=True)
    crop_ids = serializers.PrimaryKeyRelatedField(
        queryset=Crop.objects.all(), source='crops', many=True, write_only=True
    )

    class Meta:
        model = CropField
        fields = [
            "id", "logical_name", "area", "crops", "crop_ids",
            "seeding_date", "harvest_date", "shape", "color",
            "sector", "sector_id"
        ]

    def validate_sector(self, sector):
        if sector.region.company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own this sector's company.")
        return sector

# CropRotationEntry (Nested in Rotation)
class CropRotationEntrySerializer(serializers.ModelSerializer):
    crop = CropSerializer(read_only=True)
    crop_id = serializers.PrimaryKeyRelatedField(
        queryset=Crop.objects.all(), source='crop', write_only=True
    )

    class Meta:
        model = CropRotationEntry
        fields = [
            "id", "crop", "crop_id", "seeding_date", "harvest_date",
            "actual_yield_tons", "expected_yield_tons"
        ]

# CropRotation with nested entries
class CropRotationSerializer(serializers.ModelSerializer):
    pivot = serializers.ReadOnlyField(source='pivot.logical_name')
    pivot_id = serializers.PrimaryKeyRelatedField(
        queryset=CropPivot.objects.all(), source='pivot', required=False
    )
    field = serializers.ReadOnlyField(source='field.logical_name')
    field_id = serializers.PrimaryKeyRelatedField(
        queryset=CropField.objects.all(), source='field', required=False
    )
    entries = CropRotationEntrySerializer(many=True, read_only=True)

    class Meta:
        model = CropRotation
        fields = [
            "id", "year", "pivot", "pivot_id", "field", "field_id", "entries"
        ]

    def validate_pivot(self, pivot):
        if pivot and pivot.sector.region.company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own the pivot's company.")
        return pivot

    def validate_field(self, field):
        if field and field.sector.region.company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own the field's company.")
        return field
