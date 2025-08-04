from django.contrib import admin
from .models import *

# Company
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner', 'center']

# Region
@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    list_display = ['name', 'company', 'center']
    search_fields = ['name', 'company__name']
    list_filter = ['company']
    ordering = ['company', 'name']

# WaterwaySector
@admin.register(WaterwaySector)
class WaterwaySectorAdmin(admin.ModelAdmin):
    list_display = ['name', 'region', 'area_ha', 'total_water_requirement', 'pivot_count', 'total_pivot_area', 'shape', 'color']
    search_fields = ['name', 'region__name']
    list_filter = ['region']
    ordering = ['region', 'name']
    readonly_fields = ['area_ha']

# CropPivot
@admin.register(CropPivot)
class CropPivotAdmin(admin.ModelAdmin):
    list_display = ['logical_name', 'sector', 'area', 'seeding_date', 'harvest_date', 'center', 'radius_m', 'color']
    search_fields = ['logical_name']
    list_filter = ['sector']
    ordering = ['sector', 'logical_name']

# CropField
@admin.register(CropField)
class CropFieldAdmin(admin.ModelAdmin):
    list_display = ['logical_name', 'sector', 'area', 'seeding_date', 'harvest_date', 'color', 'shape']
    search_fields = ['logical_name']
    list_filter = ['sector']
    ordering = ['sector', 'logical_name']

# CropRotation
@admin.register(CropRotation)
class CropRotationAdmin(admin.ModelAdmin):
    list_display = ['pivot_name', 'sector_name', 'company_name', 'year', 'crop', 'yield_tons']
    list_filter = ['year', 'crop', 'company_name']
    search_fields = ['pivot_name', 'sector_name', 'company_name', 'notes']
    ordering = ['-year', 'company_name']
    readonly_fields = ['pivot_name', 'sector_name', 'company_name']
    fieldsets = (
        (None, {'fields': ('pivot', 'pivot_name', 'sector_name', 'company_name')}),
        ('Crop Info', {'fields': ('year', 'crop', 'seeding_date', 'harvest_date', 'yield_tons')}),
        ('Additional', {'fields': ('notes',)}),
    )