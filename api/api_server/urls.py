from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'transport-models', views.TransportModelViewSet)
router.register(r'packaging-types', views.PackagingTypeViewSet)
router.register(r'services', views.ServiceViewSet)
router.register(r'delivery-statuses', views.DeliveryStatusViewSet)
router.register(r'cargo-types', views.CargoTypeViewSet)
router.register(r'deliveries', views.DeliveryViewSet)
router.register(r'get-delivery', views.GetDeliverySet, basename='get-delivery')

urlpatterns = [
    # Эндпоинты аутентификации
    path('auth/login/', views.login_view, name='login'),
    path('auth/register/', views.register_view, name='register'),
    path('auth/logout/', views.logout_view, name='logout'),
    path('user/', views.get_user_info, name='user-info'),
    path('delivery/get/', views.get_delivery, name='get_delivery'),  # Исправили точку на запятую
    
    # Эндпоинты для опций
    path('options/', views.get_all_options, name='get_all_options'),
    
    # Эндпоинты для доставок
    path('delivery/list/', views.delivery_list, name='delivery_list'),
    path('delivery/new/', views.new_delivery, name='new_delivery'),
    
    path('delivery/<int:delivery_id>/delete/', views.delete_delivery, name='delete_delivery'),
    
    # Эндпоинты для фильтров
    path('filter-options/', views.get_filter_options, name='filter-options'),
    
    # Эндпоинты для отчетов
    path('delivery/report/', views.get_delivery_report, name='delivery-report'),
    path('export/', views.export_data, name='export-data'),
    path('', include(router.urls)),
]