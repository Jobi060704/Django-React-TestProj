from django.db import models
from django.contrib.auth.models import User
from math import pi

class Crop(models.Model):
    name = models.CharField(max_length=100)
    subtype = models.CharField(max_length=100)
    best_season = models.CharField(
        max_length=20,
        choices=[
            ('spring', 'Spring'),
            ('summer', 'Summer'),
            ('fall', 'Fall'),
            ('winter', 'Winter'),
        ],
        blank=True,
        null=True
    )

    class Meta:
        unique_together = ('name', 'subtype')  # composite uniqueness

    def __str__(self):
        return f"{self.name} ({self.subtype})"


class Company(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='owned_companies')
    name = models.CharField(max_length=100, unique=True)  # Required (so remove null/blank)
    center = models.CharField(max_length=1000, null=True, blank=True)  # WKT POINT

    color = models.CharField(max_length=7, default="#0000FF")

    def __str__(self):
        return self.name


class Region(models.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='regions')
    name = models.CharField(max_length=100)  # Required
    center = models.CharField(max_length=1000, null=True, blank=True)  # WKT POINT

    color = models.CharField(max_length=7, default="#0000FF")

    def __str__(self):
        return f"{self.name} ({self.company.name})"


class WaterwaySector(models.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='sectors')
    name = models.CharField(max_length=100)
    area_ha = models.FloatField(null=True, blank=True)
    total_water_requirement = models.FloatField(default=0)
    shape = models.TextField(null=True, blank=True)  # WKT POLYGON
    color = models.CharField(max_length=7, default="#0000FF")

    def __str__(self):
        return f"{self.name} ({self.region.name})"

    @property
    def total_pivot_area(self):
        return sum(p.area for p in self.pivots.all())

    @property
    def pivot_count(self):
        return self.pivots.count()

    def save(self, *args, **kwargs):
        # Area should be calculated on the client and passed in
        super().save(*args, **kwargs)


class CropPivot(models.Model):
    sector = models.ForeignKey(WaterwaySector, on_delete=models.CASCADE, related_name='pivots')
    logical_name = models.CharField(max_length=10)
    area = models.FloatField()  # Now must be calculated client-side and passed in

    crops = models.ManyToManyField(Crop, blank=True)

    seeding_date = models.DateField(null=True, blank=True)
    harvest_date = models.DateField(null=True, blank=True)
    center = models.CharField(max_length=1000, null=True, blank=True)  # WKT POINT
    radius_m = models.FloatField(default=100.0)
    color = models.CharField(max_length=7, default="#008000")

    def __str__(self):
        return f"{self.logical_name} – {self.sector.name}"


class CropField(models.Model):
    sector = models.ForeignKey(WaterwaySector, on_delete=models.CASCADE, related_name='fields')
    logical_name = models.CharField(max_length=10)
    area = models.FloatField()

    crops = models.ManyToManyField(Crop, blank=True)

    seeding_date = models.DateField(null=True, blank=True)
    harvest_date = models.DateField(null=True, blank=True)
    shape = models.TextField(null=True, blank=True)  # WKT POLYGON
    color = models.CharField(max_length=7, default="#000080")

    def save(self, *args, **kwargs):
        # Area should be calculated client-side
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.logical_name} – {self.sector.name}"




class CropRotation(models.Model):
    pivot = models.ForeignKey(CropPivot, null=True, blank=True, on_delete=models.SET_NULL, related_name="pivot_rotations")
    field = models.ForeignKey(CropField, null=True, blank=True, on_delete=models.SET_NULL, related_name="field_rotations")

    # New proper FK references
    sector = models.ForeignKey(WaterwaySector, on_delete=models.SET_NULL, null=True, related_name="crop_rotations")
    region = models.ForeignKey(Region, on_delete=models.SET_NULL, null=True, related_name="crop_rotations")
    company = models.ForeignKey(Company, on_delete=models.SET_NULL, null=True, related_name="crop_rotations")

    year = models.PositiveIntegerField()
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-year']
        unique_together = ('pivot', 'field', 'year')

    def save(self, *args, **kwargs):
        # Auto-fill sector, region, company
        if self.pivot:
            self.sector = self.pivot.sector
            self.region = self.pivot.sector.region
            self.company = self.pivot.sector.region.company
        elif self.field:
            self.sector = self.field.sector
            self.region = self.field.sector.region
            self.company = self.field.sector.region.company
        super().save(*args, **kwargs)

    def __str__(self):
        name = self.pivot.logical_name if self.pivot else self.field.logical_name if self.field else "Unknown"
        return f"{self.year} – {name} ({self.sector.name if self.sector else 'No sector'})"

class CropRotationEntry(models.Model):
    rotation = models.ForeignKey(CropRotation, on_delete=models.CASCADE, related_name="entries")
    crop = models.ForeignKey(Crop, on_delete=models.CASCADE)

    seeding_date = models.DateField(null=True, blank=True)
    harvest_date = models.DateField(null=True, blank=True)

    actual_yield_tons = models.FloatField(null=True, blank=True)
    expected_yield_tons = models.FloatField(null=True, blank=True)

    class Meta:
        unique_together = ('rotation', 'crop')  # Optional, prevents same crop repeated

    def __str__(self):
        return f"{self.crop.name} ({self.rotation.year})"
