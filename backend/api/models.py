from django.db import models
from django.contrib.auth.models import User
from django.contrib.gis.db import models as geomodels
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

    def __str__(self):
        return self.name


class Region(geomodels.Model):
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='regions')
    name = models.CharField(max_length=100)  # Required
    center = geomodels.PointField(srid=4326, geography=True, null=True, blank=True)  # Optional

    def __str__(self):
        return f"{self.name} ({self.company.name})"


class WaterwaySector(geomodels.Model):
    region = models.ForeignKey(Region, on_delete=models.CASCADE, related_name='sectors')
    name = models.CharField(max_length=100)  # Required
    area_ha = models.FloatField(null=True, blank=True)  # Auto-calculated
    total_water_requirement = models.FloatField(default=0)  # Required but default to 0
    shape = geomodels.PolygonField(srid=4326, geography=True, null=True, blank=True)  # Optional
    color = models.CharField(max_length=7, default="#0000FF")  # Default blue for sectors

    def __str__(self):
        return f"{self.name} ({self.region.name})"

    @property
    def total_pivot_area(self):
        return sum(p.area for p in self.pivots.all())

    @property
    def pivot_count(self):
        return self.pivots.count()

    def save(self, *args, **kwargs):
        if self.shape:
            try:
                deg_area = self.shape.area
                self.area_ha = deg_area * 979000  # Convert degree² → ha (approx)
            except Exception as e:
                print(f"Failed to calculate area: {e}")
        super().save(*args, **kwargs)


class CropPivot(geomodels.Model):
    sector = models.ForeignKey(WaterwaySector, on_delete=models.CASCADE, related_name='pivots')
    logical_name = models.CharField(max_length=10)  # Required (short name like P01)
    area = models.FloatField()  # Auto-calculated
    crop_1 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    crop_2 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    crop_3 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    crop_4 = models.CharField(max_length=50, choices=CROP_CHOICES, blank=True, null=True)
    seeding_date = models.DateField(null=True, blank=True)
    harvest_date = models.DateField(null=True, blank=True)
    center = geomodels.PointField(srid=4326, geography=True, null=True, blank=True)
    radius_m = models.FloatField(default=100.0)
    color = models.CharField(max_length=7, default="#008000")  # Default green for pivots

    def save(self, *args, **kwargs):
        # Auto-calculate area as π * r², and convert m² to hectares (1 ha = 10,000 m²)
        self.area = round((pi * (self.radius_m ** 2)) / 10000, 2)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.logical_name} – {self.sector.name}"
