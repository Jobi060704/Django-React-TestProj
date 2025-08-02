from django.db import models
from django.contrib.auth.models import User
from math import pi

CROP_CHOICES = [
    ('none', 'None'),
    ('corn', 'Corn'),
    ('wheat', 'Wheat'),
    ('soybean', 'Soybean'),
    ('barley', 'Barley'),
    ('canola', 'Canola'),
    ('sunflower', 'Sunflower'),
    ('potato', 'Potato'),
]

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
    crop_1 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    crop_2 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    crop_3 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    crop_4 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
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
    crop_1 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    crop_2 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    crop_3 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    crop_4 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    seeding_date = models.DateField(null=True, blank=True)
    harvest_date = models.DateField(null=True, blank=True)
    center = models.CharField(max_length=1000, null=True, blank=True)  # WKT POINT
    shape = models.TextField(null=True, blank=True)  # WKT POLYGON
    color = models.CharField(max_length=7, default="#000080")

    def save(self, *args, **kwargs):
        # Area should be calculated client-side
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.logical_name} – {self.sector.name}"




class CropRotation(models.Model):
    pivot = models.ForeignKey(CropPivot, null=True, blank=True, on_delete=models.SET_NULL, related_name="rotations")
    pivot_name = models.CharField(max_length=50)
    sector_name = models.CharField(max_length=100)
    company_name = models.CharField(max_length=100)

    year = models.PositiveIntegerField()
    crop = models.CharField(max_length=50, choices=CROP_CHOICES)
    seeding_date = models.DateField(null=True, blank=True)
    harvest_date = models.DateField(null=True, blank=True)
    yield_tons = models.FloatField(null=True, blank=True)
    notes = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['-year']  # Sort by latest year first
        unique_together = ('pivot', 'year', 'crop')  # Optional, if business logic allows

    def save(self, *args, **kwargs):
        # If pivot is linked and names are empty, snapshot them
        if self.pivot:
            if not self.pivot_name:
                self.pivot_name = self.pivot.logical_name
            if not self.sector_name:
                self.sector_name = self.pivot.sector.name
            if not self.company_name:
                self.company_name = self.pivot.sector.region.company.name
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.year} – {self.crop} ({self.pivot_name})"
