from django.contrib.auth.models import User
from rest_framework import serializers
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

class CompanySerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Company
        fields = ["id", "name", "owner"]

class RegionSerializer(serializers.ModelSerializer):
    company = serializers.ReadOnlyField(source='company.name')
    company_id = serializers.PrimaryKeyRelatedField(
        queryset=Company.objects.all(), source='company', write_only=True
    )

    class Meta:
        model = Region
        fields = ["id", "name", "center", "company", "company_id"]

class WaterwaySectorSerializer(serializers.ModelSerializer):
    region = serializers.ReadOnlyField(source='region.name')
    region_id = serializers.PrimaryKeyRelatedField(
        queryset=Region.objects.all(), source='region', write_only=True
    )
    pivot_count = serializers.ReadOnlyField()
    total_pivot_area = serializers.ReadOnlyField()

    class Meta:
        model = WaterwaySector
        fields = [
            "id", "name", "area_ha", "total_water_requirement", "shape",
            "region", "region_id", "pivot_count", "total_pivot_area"
        ]
        read_only_fields = ["area_ha"]

class CropPivotSerializer(serializers.ModelSerializer):
    sector = serializers.ReadOnlyField(source='sector.name')
    sector_id = serializers.PrimaryKeyRelatedField(
        queryset=WaterwaySector.objects.all(), source='sector', write_only=True
    )

    class Meta:
        model = CropPivot
        fields = [
            "id", "logical_name", "area", "crop_1", "crop_2", "crop_3", "crop_4",
            "seeding_date", "harvest_date", "center", "radius_m", "sector", "sector_id"
        ]
        read_only_fields = ["area"]
