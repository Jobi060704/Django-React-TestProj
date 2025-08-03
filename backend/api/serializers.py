from django.core.exceptions import PermissionDenied
from rest_framework import serializers
from .models import *
from django.contrib.auth.models import User

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # ✅ Add extra claims
        token["username"] = user.username

        return token

class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}, "email": {"required": True}}

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CompanySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Company
        fields = ["id", "name", "owner", "center", 'color']

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)

    def validate(self, data):
        # Only owners can modify their own companies
        if self.instance and self.instance.owner != self.context["request"].user:
            raise PermissionDenied("You do not own this company.")
        return data


class RegionSerializer(serializers.ModelSerializer):
    company = serializers.ReadOnlyField(source='company.name')
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), source='company'
    )

    class Meta:
        model = Region
        fields = ["id", "name", "center", "company", "company_id", 'color']

    def validate_company(self, company):
        if company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own this company.")
        return company


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
            "region", "region_id", "pivot_count", "total_pivot_area", 'color'
        ]
        read_only_fields = ["area_ha"]

    def validate_region(self, region):
        if region.company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own the region's company.")
        return region


class CropPivotSerializer(serializers.ModelSerializer):
    sector = serializers.ReadOnlyField(source='sector.name')
    sector_id = serializers.PrimaryKeyRelatedField(
        queryset=WaterwaySector.objects.all(), source='sector'
    )

    class Meta:
        model = CropPivot
        fields = [
            "id", "logical_name", "area", "crop_1", "crop_2", "crop_3", "crop_4",
            "seeding_date", "harvest_date", "center", "radius_m", "sector", "sector_id", 'color'
        ]

    def validate_sector(self, sector):
        if sector.region.company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own the sector's region's company.")
        return sector


class CropFieldSerializer(serializers.ModelSerializer):
    sector = serializers.ReadOnlyField(source='sector.name')
    sector_id = serializers.PrimaryKeyRelatedField(
        queryset=WaterwaySector.objects.all(), source='sector'
    )

    class Meta:
        model = CropField
        fields = [
            "id", "logical_name", "area", "crop_1", "crop_2", "crop_3", "crop_4",
            "seeding_date", "harvest_date", "center", "shape", "color",
            "sector", "sector_id"
        ]
        read_only_fields = ["area"]

    def validate_sector(self, sector):
        if sector.region.company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own the sector's region's company.")
        return sector


class CropRotationSerializer(serializers.ModelSerializer):
    pivot = serializers.ReadOnlyField(source='pivot.logical_name')
    pivot_id = serializers.PrimaryKeyRelatedField(
        queryset=CropPivot.objects.all(), source='pivot'
    )

    class Meta:
        model = CropRotation
        fields = [
            'id', 'pivot', 'pivot_id', 'year', 'crop',
            'seeding_date', 'harvest_date', 'yield_tons', 'notes'
        ]

    def validate_pivot(self, pivot):
        if pivot.sector.region.company.owner != self.context["request"].user:
            raise PermissionDenied("You do not own the pivot's company.")
        return pivot
