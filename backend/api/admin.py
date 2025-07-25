from django.contrib.gis import admin as gisadmin
from django.contrib import admin
from django import forms
from django.contrib.gis.geos import GEOSGeometry

from .models import Company, Region, WaterwaySector, CropPivot

# --- Inline for CropPivot inside WaterwaySector ---
class CropPivotInline(admin.TabularInline):
    model = CropPivot
    extra = 0
    readonly_fields = [
        'logical_name', 'area', 'crop_1', 'crop_2', 'crop_3', 'crop_4',
        'seeding_date', 'harvest_date', 'center', 'radius_m'
    ]
    can_delete = False

# --- Inline for WaterwaySector inside Region ---
class WaterwaySectorInline(admin.TabularInline):
    model = WaterwaySector
    extra = 0
    readonly_fields = [
        'name', 'area_ha', 'total_water_requirement', 'shape'
    ]
    can_delete = False
    show_change_link = True  # enables a link to edit sector in detail page

# --- Inline for Region inside Company ---
class RegionInline(admin.TabularInline):
    model = Region
    extra = 0
    readonly_fields = ['name', 'center']
    can_delete = False
    show_change_link = True  # enables a link to edit region in detail page

# --- CompanyAdmin with Region inline ---
@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'owner']
    search_fields = ['name']
    inlines = [RegionInline]

# --- RegionAdmin with WaterwaySector inline ---
class RegionAdminForm(forms.ModelForm):
    center = forms.CharField(widget=forms.Textarea, required=False, label='Center (WKT)')

    class Meta:
        model = Region
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.center:
            self.fields['center'].initial = self.instance.center.wkt

    def clean_center(self):
        data = self.cleaned_data.get('center')
        if data:
            try:
                geom = GEOSGeometry(data)
            except Exception as e:
                raise forms.ValidationError(f"Invalid geometry WKT: {e}")
            return geom
        return None

    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
        return instance

@admin.register(Region)
class RegionAdmin(admin.ModelAdmin):
    form = RegionAdminForm
    list_display = ['name', 'company', 'center']
    search_fields = ['name', 'company__name']
    list_filter = ['company']
    ordering = ['company', 'name']
    inlines = [WaterwaySectorInline]

# --- WaterwaySectorAdmin with CropPivot inline ---
class WaterwaySectorAdminForm(forms.ModelForm):
    shape = forms.CharField(widget=forms.Textarea, required=False, label='Shape (WKT)')

    class Meta:
        model = WaterwaySector
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.shape:
            self.fields['shape'].initial = self.instance.shape.wkt

    def clean_shape(self):
        data = self.cleaned_data.get('shape')
        if data:
            try:
                geom = GEOSGeometry(data)
            except Exception as e:
                raise forms.ValidationError(f"Invalid geometry WKT: {e}")
            return geom
        return None

    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
        return instance

@admin.register(WaterwaySector)
class WaterwaySectorAdmin(admin.ModelAdmin):
    form = WaterwaySectorAdminForm
    list_display = ['name', 'region', 'area_ha', 'total_water_requirement', 'pivot_count', 'total_pivot_area', 'shape']
    search_fields = ['name', 'region__name']
    readonly_fields = ['area_ha']
    list_filter = ['region']
    ordering = ['region', 'name']
    inlines = [CropPivotInline]

# --- CropPivotAdmin ---
class CropPivotAdminForm(forms.ModelForm):
    center = forms.CharField(widget=forms.Textarea, required=False, label='Center (WKT)')
    area = forms.FloatField(disabled=True, required=False)

    class Meta:
        model = CropPivot
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.instance and self.instance.center:
            self.fields['center'].initial = self.instance.center.wkt

    def clean_center(self):
        data = self.cleaned_data.get('center')
        if data:
            try:
                geom = GEOSGeometry(data)
            except Exception as e:
                raise forms.ValidationError(f"Invalid geometry WKT: {e}")
            return geom
        return None

    def save(self, commit=True):
        instance = super().save(commit=False)
        if commit:
            instance.save()
        return instance

@admin.register(CropPivot)
class CropPivotAdmin(admin.ModelAdmin):
    form = CropPivotAdminForm
    list_display = ['logical_name', 'sector', 'area', 'seeding_date', 'harvest_date', 'center', 'radius_m']
    search_fields = ['logical_name']
    list_filter = ['sector']
    ordering = ['sector', 'logical_name']
