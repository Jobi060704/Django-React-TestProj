# from django.core.management.base import BaseCommand
# from django.contrib.auth.models import User
# from django.contrib.gis.geos import Point, Polygon
# from faker import Faker
# from math import pi
# from datetime import timedelta
# import random
#
# from api.models import Company, Region, WaterwaySector, CropPivot, CROP_CHOICES
#
#
# class Command(BaseCommand):
#     help = "Seed demo database with multiple users, companies, regions, sectors, and crop pivots."
#
#     def handle(self, *args, **kwargs):
#         fake = Faker()
#
#         # Clear existing data
#         CropPivot.objects.all().delete()
#         WaterwaySector.objects.all().delete()
#         Region.objects.all().delete()
#         Company.objects.all().delete()
#         User.objects.filter(is_superuser=False).delete()  # Keep admin user
#
#         def create_square_polygon(center_x, center_y, size=0.05):
#             """Generate a square Polygon for sectors."""
#             half = size / 2
#             return Polygon((
#                 (center_x - half, center_y - half),
#                 (center_x - half, center_y + half),
#                 (center_x + half, center_y + half),
#                 (center_x + half, center_y - half),
#                 (center_x - half, center_y - half),
#             ), srid=4326)
#
#         # Approx bounding box for Azerbaijan
#         min_lat, max_lat = 38.4, 41.9
#         min_lon, max_lon = 44.5, 50.5
#
#         crop_choices = [choice[0] for choice in CROP_CHOICES]
#
#         # ---------------------------
#         # Create multiple users
#         # ---------------------------
#         users = []
#         for i in range(3):  # 3 demo users
#             username = f"user{i+1}"
#             password = "123"
#             user = User.objects.create_user(username=username, password=password)
#             users.append(user)
#             self.stdout.write(self.style.SUCCESS(f"Created user: {username} / {password}"))
#
#         # ---------------------------
#         # Create companies per user
#         # ---------------------------
#         for user in users:
#             for _ in range(random.randint(1, 2)):  # Each user gets 1-2 companies
#                 company_name = f"{fake.company()} Co"
#                 company = Company.objects.create(name=company_name, owner=user)
#
#                 # ---------------------------
#                 # Regions for each company
#                 # ---------------------------
#                 for __ in range(random.randint(2, 4)):
#                     region_name = f"{fake.city()} Region"
#
#                     # Random center point in Azerbaijan bounds
#                     center_lon = random.uniform(min_lon, max_lon)
#                     center_lat = random.uniform(min_lat, max_lat)
#                     center_point = Point(center_lon, center_lat, srid=4326)
#
#                     region = Region.objects.create(
#                         company=company,
#                         name=region_name,
#                         center=center_point
#                     )
#
#                     # ---------------------------
#                     # Sectors for each region
#                     # ---------------------------
#                     for ___ in range(random.randint(2, 4)):
#                         sector_name = f"{fake.city()} Sector"
#                         water_req = round(random.uniform(500, 2000), 2)
#
#                         # Sector polygon near region center
#                         poly_center_lon = random.uniform(center_lon - 0.5, center_lon + 0.5)
#                         poly_center_lat = random.uniform(center_lat - 0.5, center_lat + 0.5)
#                         poly_size = random.uniform(0.02, 0.08)
#                         poly = create_square_polygon(poly_center_lon, poly_center_lat, size=poly_size)
#
#                         sector = WaterwaySector.objects.create(
#                             region=region,
#                             name=sector_name,
#                             total_water_requirement=water_req,
#                             shape=poly
#                         )
#
#                         # ---------------------------
#                         # Pivots for each sector
#                         # ---------------------------
#                         for ____ in range(random.randint(1, 4)):
#                             radius_m = round(random.uniform(50, 250), 2)
#                             area = round((pi * (radius_m ** 2)) / 10000, 2)
#
#                             crops = random.sample(crop_choices, random.randint(1, 4))
#                             seeding_date = fake.date_between(start_date='-2y', end_date='today')
#                             harvest_date = seeding_date + timedelta(days=random.randint(90, 150))
#
#                             # Random pivot center near sector polygon center
#                             pivot_lon = random.uniform(poly_center_lon - 0.02, poly_center_lon + 0.02)
#                             pivot_lat = random.uniform(poly_center_lat - 0.02, poly_center_lat + 0.02)
#                             center = Point(pivot_lon, pivot_lat, srid=4326)
#
#                             CropPivot.objects.create(
#                                 sector=sector,
#                                 logical_name=f"P{random.randint(10, 99)}",
#                                 area=area,
#                                 crop_1=crops[0],
#                                 crop_2=crops[1] if len(crops) > 1 else '',
#                                 crop_3=crops[2] if len(crops) > 2 else '',
#                                 crop_4=crops[3] if len(crops) > 3 else '',
#                                 seeding_date=seeding_date,
#                                 harvest_date=harvest_date,
#                                 center=center,
#                                 radius_m=radius_m
#                             )
#
#         self.stdout.write(self.style.SUCCESS("Demo DB seeding completed successfully!"))
