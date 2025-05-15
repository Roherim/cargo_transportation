from django.db import models
from django.contrib.auth.models import User

class TransportModel(models.Model):
    """Модель транспорта"""
    name = models.CharField(max_length=100, verbose_name="Название модели")
    description = models.TextField(blank=True, verbose_name="Описание")
    is_active = models.BooleanField(default=True, verbose_name="Активна")

    class Meta:
        verbose_name = "Модель транспорта"
        verbose_name_plural = "Модели транспорта"
        ordering = ['name']

    def __str__(self):
        return self.name

class PackagingType(models.Model):
    """Тип упаковки"""
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")
    is_active = models.BooleanField(default=True, verbose_name="Активна")

    class Meta:
        verbose_name = "Тип упаковки"
        verbose_name_plural = "Типы упаковки"
        ordering = ['name']

    def __str__(self):
        return self.name

class Service(models.Model):
    """Услуга"""
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Цена")
    is_active = models.BooleanField(default=True, verbose_name="Активна")

    class Meta:
        verbose_name = "Услуга"
        verbose_name_plural = "Услуги"
        ordering = ['name']

    def __str__(self):
        return self.name

class DeliveryStatus(models.Model):
    """Статус доставки"""
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")
    is_active = models.BooleanField(default=True, verbose_name="Активен")

    class Meta:
        verbose_name = "Статус доставки"
        verbose_name_plural = "Статусы доставки"
        ordering = ['name']

    def __str__(self):
        return self.name

class CargoType(models.Model):
    """Тип груза"""
    name = models.CharField(max_length=100, verbose_name="Название")
    description = models.TextField(blank=True, verbose_name="Описание")
    is_active = models.BooleanField(default=True, verbose_name="Активен")

    class Meta:
        verbose_name = "Тип груза"
        verbose_name_plural = "Типы груза"
        ordering = ['name']

    def __str__(self):
        return self.name


class CustomToken(models.Model):
    """Модель для хранения токенов аутентификации"""
    key = models.CharField(max_length=40, primary_key=True, verbose_name="Ключ")
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Пользователь")
    created = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")

    def save(self, *args, **kwargs):
        if not self.key:
            self.key = self.generate_key()
        return super().save(*args, **kwargs)

    @classmethod
    def generate_key(cls):
        from django.utils.crypto import get_random_string
        return get_random_string(40)

    class Meta:
        verbose_name = "Токен"
        verbose_name_plural = "Токены"

    def __str__(self):
        return self.key

class Delivery(models.Model):
    """Доставка"""
    number = models.CharField(max_length=50, unique=True, verbose_name="Номер доставки")
    transport_model = models.ForeignKey(TransportModel, on_delete=models.PROTECT, verbose_name="Модель транспорта")
    transport_number = models.CharField(max_length=50, verbose_name="Номер транспорта")
    pickup_address = models.TextField(verbose_name="Адрес отправления")
    delivery_address = models.TextField(verbose_name="Адрес доставки")
    packaging_type = models.ForeignKey(PackagingType, on_delete=models.PROTECT, verbose_name="Тип упаковки")
    cargo_type = models.ForeignKey(CargoType, on_delete=models.PROTECT, verbose_name="Тип груза")
    services = models.ManyToManyField(Service, verbose_name="Услуги")
    status = models.ForeignKey(DeliveryStatus, on_delete=models.PROTECT, verbose_name="Статус")
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, verbose_name="Создал")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Дата создания")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Дата обновления")
    departure_date = models.DateField(verbose_name="Дата отправки", default='2024-03-19')
    departure_time = models.TimeField(verbose_name="Время отправки", default='12:00')
    arrival_date = models.DateField(verbose_name="Дата прибытия", default='2024-03-19')
    arrival_time = models.TimeField(verbose_name="Время прибытия", default='12:00')
    travel_time = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Время в пути (часы)", default=0)
    notes = models.TextField(blank=True, verbose_name="Примечания")
    file_path = models.CharField(max_length=255, blank=True, null=True, verbose_name="Путь к файлу", default=0)
    distance = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Расстояние", default=0)

    class Meta:
        verbose_name = "Доставка"
        verbose_name_plural = "Доставки"
        ordering = ['-created_at']

    def __str__(self):
        return f"Доставка {self.number}"