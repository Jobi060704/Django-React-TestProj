from django.urls import path
from . import views

urlpatterns = [
    # Companies
    path("companies/", views.CompanyListCreate.as_view(), name="company-list"),
    path("companies/<int:pk>/", views.CompanyDetail.as_view(), name="company-detail"),

    # Regions
    path("regions/", views.RegionListCreate.as_view(), name="region-list"),
    path("regions/<int:pk>/", views.RegionDetail.as_view(), name="region-detail"),

    # Waterway Sectors
    path("sectors/", views.WaterwaySectorListCreate.as_view(), name="sector-list"),
    path("sectors/<int:pk>/", views.WaterwaySectorDetail.as_view(), name="sector-detail"),

    # Crop Pivots
    path("pivots/", views.CropPivotListCreate.as_view(), name="pivot-list"),
    path("pivots/<int:pk>/", views.CropPivotDetail.as_view(), name="pivot-detail"),
]