import json
import random
from datetime import timedelta, date
from math import pi
from django.core.management.base import BaseCommand
from faker import Faker
from ...models import *
from django.contrib.auth.models import User

GEOJSON_DATA = '''
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.421967230090615,
          39.83223721665317
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.429685314757705,
          39.83923118391519
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.43728696654128,
          39.84635710675403
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.44499672195175,
          39.853351767000106
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.43227757588906,
          39.828003781997836
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.43959033553048,
          39.83481160435255
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.44699112619355,
          39.84139969458829
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.45436210647378,
          39.84804009483318
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.440884021169865,
          39.822742421495974
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.44823731089946,
          39.82910871191666
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.455683459624396,
          39.83574857341637
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.46308408092142,
          39.84239974104395
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.450365276974736,
          39.81637539034057
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.456179191445614,
          39.82407911731653
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.4636174122281,
          39.82943115031563
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.47134969390112,
          39.836129873931526
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.46268013933735,
          39.8183559064193
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.47149985696757,
          39.82348711530216
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.47998538242484,
          39.829557500824905
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.45957890700507,
          39.80638878603804
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.47057925956838,
          39.810474671152605
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.47037778790914,
          39.80004280123583
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.48182137812208,
          39.80567682666842
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.48269512902294,
          39.79526846750332
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.50509681567789,
          39.77580239676902
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.51337407901892,
          39.78408388010803
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.51064332499021,
          39.79179524597714
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.5075198293905,
          39.79380523042332
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.50695552639533,
          39.80013651545116
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.51456904692063,
          39.80085642931553
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.51962017287448,
          39.79490868736727
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.52689314605618,
          39.79378923596377
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.52517522347679,
          39.79012921953918
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.5134327874305,
          39.77063056172142
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.522591421990995,
          39.77411984700643
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.53561879011497,
          39.77151048512272
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.54564591588331,
          39.77108569591957
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.527249693017154,
          39.78206868861852
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.534276576429846,
          39.77930793547765
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.541777182319805,
          39.77779099100218
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.54959360319518,
          39.7762740130905
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.531498136281016,
          39.78783496056883
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.53788238333618,
          39.793440335642885
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.546843633532234,
          39.79016436664102
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.552725687624275,
          39.78743427329718
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.55734722841643,
          39.78358109259594
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.533124100256,
          39.75495616908498
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.53859522520864,
          39.760758000977034
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.542339431512175,
          39.76582780456576
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.54322017259889,
          39.75764948657664
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.54521482360096,
          39.76007638686909
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.54842569983148,
          39.764438231343746
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.55116178768401,
          39.76087891529971
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.552329482039596,
          39.768683465431565
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.55567236679798,
          39.763917462180245
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.55656752261035,
          39.77420874896433
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.55984309614604,
          39.76960338866289
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.56306131473275,
          39.7649732245722
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.561693543315926,
          39.77851969901775
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.56516720687503,
          39.77348143798136
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.568490538004625,
          39.7685380720919
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.56559810298526,
          39.784171475228504
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.569725596279596,
          39.77989745636714
        ],
        "type": "Point"
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          47.57545636702102,
          39.77403198376308
        ],
        "type": "Point"
      }
    }
  ]
}
'''

# Pivot radii for each pivot in meters (64 values)
PIVOT_RADII = [
    500, 500, 500, 500, 480, 480, 480, 480, 450, 480, 480, 480, 600, 380, 480, 500, 450, 450, 520,
    450, 600, 530, 490, 630,
    500, 650, 230, 130, 380, 270, 450, 130, 250,
    240, 620, 520, 330, 330, 330, 330, 330, 330, 480, 350, 220, 280,
    340, 235, 270, 230, 215, 230, 215, 280, 280, 280, 280, 280, 310, 310, 300, 250, 330, 470
]

# Sector names in order with number of pivots per sector
SECTOR_NAMES_SIZES = [
    ("Sector 5", 19),
    ("Sector 4", 5),
    ("Sector 3", 9),
    ("Sector 2", 13),
    ("Sector 1", 18),
]

def polygon_to_wkt(points):
    """Convert a list of (lon, lat) tuples to a WKT polygon string."""
    coords = ", ".join([f"{lng} {lat}" for lng, lat in points])
    return f"SRID=4326;POLYGON(({coords}))"

SECTOR_POLYGONS_WKT = [
    # Sector 5
    "SRID=4326;POLYGON((47.44598444842816 39.81126117754371, 47.45088482690497 39.8090007627373, 47.469682930841714 39.81652948543294, 47.488844303275926 39.82935264904518, 47.466250853104185 39.84708205907879, 47.4438176489121 39.85952741569062, 47.41688387583383 39.835109892816405, 47.41527279740805 39.82920576392971, 47.43454877573734 39.821928706677596, 47.442391379289944 39.816783677870404, 47.44598444842816 39.81126117754371))",

    # Sector 4
    "SRID=4326;POLYGON((47.454249199232606 39.809150243235905, 47.45426219891476 39.80468652002983, 47.465868503186925 39.796012033984226, 47.481895565715064 39.78849457877004, 47.48952795182706 39.791796033327785, 47.491033242236824 39.796589079575085, 47.48533045627576 39.80146667476288, 47.490709339109856 39.80634714526872, 47.47132773182025 39.81726620238916, 47.454249199232606 39.809150243235905))",

    # Sector 3
    "SRID=4326;POLYGON((47.50513223729055 39.793611509456156, 47.50825398028044 39.79046858248506, 47.49814882026109 39.77666917168793, 47.49943973935399 39.77162908114926, 47.506965560898294 39.77088224317731, 47.51869404635556 39.77880678698389, 47.528286788933684 39.78931001490855, 47.52947633905961 39.79452515866447, 47.5170867975811 39.80321745257402, 47.505667526302375 39.804370976724584, 47.50179348197517 39.80064343887858, 47.50513223729055 39.793611509456156))",

    # Sector 2
    "SRID=4326;POLYGON((47.51140991092194 39.77259589064764, 47.50979995870125 39.770116338199216, 47.51205515237646 39.76854485963227, 47.52172899110414 39.7682941134604, 47.534208665419754 39.76680163919153, 47.540452607153725 39.76861990247468, 47.54357557235204 39.76828853457488, 47.54766873346168 39.76853595651602, 47.55241055991232 39.774992613808905, 47.561684048978606 39.783937294062554, 47.55931283258593 39.78559348409232, 47.549721362184584 39.79279787062998, 47.53840567120042 39.798097626630096, 47.53355646037434 39.796936800831446, 47.52828126270677 39.7895611688634, 47.5235483963003 39.783681132614504, 47.51667020227069 39.778135826330896, 47.51140991092194 39.77259589064764))",

    # Sector 1
    "SRID=4326;POLYGON((47.565937523042265 39.78665985985046, 47.55613413786199 39.77857321525522, 47.54745357999798 39.76749438082754, 47.54220022201886 39.76890155002212, 47.53909659862808 39.767127324105445, 47.5383816688134 39.76364070786548, 47.529874510759385 39.757221929653895, 47.52884349897593 39.754411097958666, 47.53059366906055 39.75190464796296, 47.53504582795577 39.75153594964905, 47.573575817175964 39.767984093571215, 47.58098761491672 39.771780007413525, 47.58139037723154 39.77569916481764, 47.565937523042265 39.78665985985046))",
]

def random_color():
    """Generate a random HEX color like #AABBCC."""
    return "#{:06x}".format(random.randint(0, 0xFFFFFF))

CROPS_WITH_SUBTYPES = {
    "corn": ["sweetcorn", "popcorn"],
    "wheat": ["durum", "hard red"],
    "soybean": ["edamame", "tofu"],
    "barley": ["hulled", "pearl"],
    "canola": ["spring", "winter"],
    "sunflower": ["oilseed", "non-oilseed"],
    "potato": ["russet", "red"],
}

class Command(BaseCommand):
    help = "Seed the database with all data."

    def handle(self, *args, **kwargs):
        fake = Faker()

        # Clear existing
        CropRotationEntry.objects.all().delete()
        CropRotation.objects.all().delete()
        CropField.objects.all().delete()
        CropPivot.objects.all().delete()
        WaterwaySector.objects.all().delete()
        Region.objects.all().delete()
        Company.objects.all().delete()
        Crop.objects.all().delete()
        User.objects.all().delete()

        # ----------------------------
        # Create User
        user = User.objects.create_user(username="vugar", email="bs.vugar@gmail.com", password="123")

        User.objects.create_superuser(username="admin", email="admin@example.com", password="admin")

        # Create Crops
        all_crops = []
        for name, subtypes in CROPS_WITH_SUBTYPES.items():
            for subtype in subtypes:
                crop = Crop.objects.create(name=name, subtype=subtype, best_season=random.choice(["spring", "summer", "fall"]))
                all_crops.append(crop)

        # Create Company, Region
        company = Company.objects.create(
            name="Karabakh Crops LLC", owner=user,
            center="SRID=4326;POINT(46.5 39.82)", color=random_color()
        )
        region = Region.objects.create(
            company=company, name="Beylagan",
            center="SRID=4326;POINT(47.5 39.82)", color=random_color()
        )

        # Create Sectors
        sectors = []
        for i, (name, count) in enumerate(SECTOR_NAMES_SIZES):
            sector = WaterwaySector.objects.create(
                region=region, name=name, area_ha=count,
                total_water_requirement=0,
                shape=SECTOR_POLYGONS_WKT[i],
                color=random_color()
            )
            sectors.append((sector, count))

        # Create Pivots
        pivot_counter = 1
        coord_idx = 0
        all_pivots = []
        data = json.loads(GEOJSON_DATA)
        coords = [(f['geometry']['coordinates'][0], f['geometry']['coordinates'][1]) for f in data['features']]

        for sector, count in sectors:
            for _ in range(count):
                if coord_idx >= len(coords) or coord_idx >= len(PIVOT_RADII):
                    break
                lon, lat = coords[coord_idx]
                radius = PIVOT_RADII[coord_idx]
                coord_idx += 1
                area_ha = round((pi * radius ** 2) / 10000, 2)
                pivot = CropPivot.objects.create(
                    sector=sector,
                    logical_name=f"P{pivot_counter:02d}",
                    area=area_ha,
                    seeding_date=fake.date_between(start_date='-2y', end_date='today'),
                    harvest_date=fake.date_between(start_date='today', end_date='+6m'),
                    center=f"SRID=4326;POINT({lon} {lat})",
                    radius_m=radius,
                    color=random_color()
                )
                all_pivots.append(pivot)
                pivot_counter += 1

        # Crop Rotations for pivots
        for pivot in all_pivots:
            for _ in range(2):  # 2 years
                year = random.randint(2021, 2023)
                rotation = CropRotation.objects.create(pivot=pivot, field=None, year=year)
                for _ in range(random.randint(0, 2)):
                    crop = random.choice(all_crops)
                    CropRotationEntry.objects.get_or_create(
                        rotation=rotation,
                        crop=crop,
                        defaults={
                            "seeding_date": date(year, random.randint(2, 4), random.randint(1, 28)),
                            "harvest_date": date(year, random.randint(8, 10), random.randint(1, 28)),
                            "actual_yield_tons": round(random.uniform(5.0, 15.0), 2),
                            "expected_yield_tons": round(random.uniform(10.0, 20.0), 2),
                        }
                    )

        # Sector 6 with Fields
        sector_6_shape = "SRID=4326;POLYGON((47.518513629751226 39.82674122118996, 47.52187957929533 39.82959053457296, 47.519469865417335 39.83100046037433, 47.515836169886114 39.82779871211255, 47.518513629751226 39.82674122118996))"
        sector_6 = WaterwaySector.objects.create(region=region, name="Sector 6", area_ha=0, total_water_requirement=0, shape=sector_6_shape, color=random_color())

        sector_6_field_shapes = [
            polygon_to_wkt([
                (47.51608174170167, 39.82785785171902),
                (47.517336544271586, 39.82727965718843),
                (47.51923667387666, 39.82893162864971),
                (47.51787431680066, 39.829537341565924),
                (47.51608174170167, 39.82785785171902),
            ]),
            polygon_to_wkt([
                (47.52016881292744, 39.82813318073701),
                (47.519129119370604, 39.828683835463494),
                (47.51751580178126, 39.82727965718843),
                (47.51877060435021, 39.826784058004336),
                (47.52016881292744, 39.82813318073701),
            ]),
            polygon_to_wkt([
                (47.520219748157984, 39.8282511556765),
                (47.52184601566805, 39.82971369244166),
                (47.52071190806291, 39.83033813685603),
                (47.519064242296594, 39.828744149076044),
                (47.520219748157984, 39.8282511556765),
            ]),
            polygon_to_wkt([
                (47.51797293120535, 39.829615095436225),
                (47.519192631836916, 39.829007077442554),
                (47.52060491677895, 39.83027240613211),
                (47.519513605687706, 39.83102830565761),
                (47.51797293120535, 39.829615095436225),
            ]),
        ]

        for i, shape in enumerate(sector_6_field_shapes):
            field = CropField.objects.create(
                sector=sector_6,
                logical_name=f"Field {i+1}",
                shape=shape,
                area=123,
                seeding_date=fake.date_between(start_date='-2y', end_date='today'),
                harvest_date=fake.date_between(start_date='today', end_date='+6m'),
                color=random_color()
            )

            for _ in range(2):  # Two years
                year = random.randint(2021, 2023)
                rotation = CropRotation.objects.create(pivot=None, field=field, year=year)
                for _ in range(random.randint(0, 2)):
                    crop = random.choice(all_crops)
                    CropRotationEntry.objects.get_or_create(
                        rotation=rotation,
                        crop=crop,
                        defaults={
                            "seeding_date": date(year, random.randint(2, 4), random.randint(1, 28)),
                            "harvest_date": date(year, random.randint(8, 10), random.randint(1, 28)),
                            "actual_yield_tons": round(random.uniform(5.0, 15.0), 2),
                            "expected_yield_tons": round(random.uniform(10.0, 20.0), 2),
                        }
                    )

        self.stdout.write(self.style.SUCCESS("✅ Seeder completed successfully with all data."))
