from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Company, Region, WaterwaySector, CropPivot
from .serializers import *

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CompanyListCreate(generics.ListCreateAPIView):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Company.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

class CompanyDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Company.objects.filter(owner=self.request.user)


class RegionListCreate(generics.ListCreateAPIView):
    serializer_class = RegionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # User can see only regions under companies they own
        return Region.objects.filter(company__owner=self.request.user)

class RegionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = RegionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Region.objects.filter(company__owner=self.request.user)


class WaterwaySectorListCreate(generics.ListCreateAPIView):
    serializer_class = WaterwaySectorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WaterwaySector.objects.filter(region__company__owner=self.request.user)

class WaterwaySectorDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = WaterwaySectorSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return WaterwaySector.objects.filter(region__company__owner=self.request.user)


class CropPivotListCreate(generics.ListCreateAPIView):
    serializer_class = CropPivotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CropPivot.objects.filter(sector__region__company__owner=self.request.user)

class CropPivotDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CropPivotSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CropPivot.objects.filter(sector__region__company__owner=self.request.user)
