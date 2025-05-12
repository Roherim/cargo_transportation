from django.utils import timezone
import random
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import (
    TransportModel, PackagingType, Service, DeliveryStatus,
    CargoType, Delivery
)

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

class TransportModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransportModel
        fields = ('id', 'name', 'description')

class PackagingTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PackagingType
        fields = ('id', 'name', 'description')

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ('id', 'name', 'description', 'price')

class DeliveryStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = DeliveryStatus
        fields = ('id', 'name', 'description')

class CargoTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CargoType
        fields = ('id', 'name', 'description')

class DeliverySerializer(serializers.ModelSerializer):
    transport_model = TransportModelSerializer(read_only=True)
    transport_model_id = serializers.PrimaryKeyRelatedField(
        queryset=TransportModel.objects.filter(is_active=True),
        source='transport_model',
        write_only=True,
        required=True
    )
    packaging_type = PackagingTypeSerializer(read_only=True)
    packaging_type_id = serializers.PrimaryKeyRelatedField(
        queryset=PackagingType.objects.filter(is_active=True),
        source='packaging_type',
        write_only=True,
        required=True
    )
    cargo_type = CargoTypeSerializer(read_only=True)
    cargo_type_id = serializers.PrimaryKeyRelatedField(
        queryset=CargoType.objects.filter(is_active=True),
        source='cargo_type',
        write_only=True,
        required=True
    )
    services = ServiceSerializer(many=True, read_only=True)
    service_ids = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.filter(is_active=True),
        source='services',
        write_only=True,
        many=True,
        required=True
    )
    status = DeliveryStatusSerializer(read_only=True)
    status_id = serializers.PrimaryKeyRelatedField(
        queryset=DeliveryStatus.objects.filter(is_active=True),
        source='status',
        write_only=True,
        required=False,
        allow_null=True
    )
    created_by = UserSerializer(read_only=True)
    departure_date = serializers.DateField(required=True)
    departure_time = serializers.TimeField(required=True)
    arrival_date = serializers.DateField(required=True)
    arrival_time = serializers.TimeField(required=True)
    travel_time = serializers.DecimalField(max_digits=5, decimal_places=2, required=True)
    transport_number = serializers.CharField(max_length=50, required=True)
    pickup_address = serializers.CharField(required=True)
    delivery_address = serializers.CharField(required=True)
    notes = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = Delivery
        fields = [
            'id', 'number', 'transport_model', 'transport_model_id',
            'transport_number', 'pickup_address', 'delivery_address',
            'packaging_type', 'packaging_type_id', 'cargo_type', 'cargo_type_id',
            'services', 'service_ids', 'status', 'status_id', 'created_by',
            'created_at', 'updated_at', 'departure_date', 'departure_time',
            'arrival_date', 'arrival_time', 'travel_time', 'notes'
        ]
        read_only_fields = ['id', 'number', 'created_at', 'updated_at', 'created_by']

    def create(self, validated_data):
        print("Creating delivery with data:", validated_data)
        try:
            # Генерируем номер доставки
            today = timezone.now().strftime('%Y%m%d')
            random_number = random.randint(1000, 9999)
            number = f'DEL-{today}-{random_number}'
            
            # Добавляем номер в validated_data
            validated_data['number'] = number
            
            # Возвращаем validated_data для дальнейшей обработки в perform_create
            return validated_data
        except Exception as e:
            print("Error in create:", str(e))
            raise 