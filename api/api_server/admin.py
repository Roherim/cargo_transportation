from django.contrib import admin

from .models import TransportModel, PackagingType, Service, DeliveryStatus, CargoType, Delivery, CustomToken
# Register your models here.
admin.site.register(TransportModel)
admin.site.register(PackagingType)
admin.site.register(Service)
admin.site.register(DeliveryStatus)
admin.site.register(CargoType)
admin.site.register(Delivery)
admin.site.register(CustomToken)