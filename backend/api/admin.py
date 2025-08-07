from django.contrib import admin
from .models import *


class AutoDisplayAdmin(admin.ModelAdmin):
    def __init__(self, model, admin_site):
        self.list_display = [field.name for field in model._meta.fields]
        super().__init__(model, admin_site)


admin.site.register(Company, AutoDisplayAdmin)
admin.site.register(Region, AutoDisplayAdmin)
admin.site.register(WaterwaySector, AutoDisplayAdmin)
admin.site.register(CropPivot, AutoDisplayAdmin)
admin.site.register(CropField, AutoDisplayAdmin)
admin.site.register(CropRotation, AutoDisplayAdmin)
admin.site.register(CropRotationEntry, AutoDisplayAdmin)
