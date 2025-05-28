from django.db import migrations

def add_initial_data(apps, schema_editor):
    # Получаем модели через apps.get_model (не импортируем напрямую)
    TransportModel = apps.get_model('api_server', 'TransportModel')
    PackagingType = apps.get_model('api_server', 'PackagingType')
    Service = apps.get_model('api_server', 'Service')
    DeliveryStatus = apps.get_model('api_server', 'DeliveryStatus')
    CargoType = apps.get_model('api_server', 'CargoType')

    # Транспортные модели
    transport_models = [
        {'name': 'Газель', 'description': 'Небольшой грузовик для перевозки малых грузов'},
        {'name': 'Камаз', 'description': 'Грузовик для перевозки крупных и тяжелых грузов'},
        {'name': 'Фура', 'description': 'Большой грузовик для международных перевозок'},
    ]
    for data in transport_models:
        TransportModel.objects.get_or_create(**data)

    # Типы упаковки
    packaging_types = [
        {'name': 'Коробка', 'description': 'Стандартная картонная коробка'},
        {'name': 'Паллет', 'description': 'Деревянный паллет для крупных грузов'},
        {'name': 'Контейнер', 'description': 'Металлический контейнер для морских перевозок'},
        {'name': 'Мешок', 'description': 'Тканевый или полиэтиленовый мешок'},
    ]
    for data in packaging_types:
        PackagingType.objects.get_or_create(**data)

    # Услуги
    services = [
        {'name': 'Страховка', 'description': 'Страхование груза на время перевозки', 'price': 1000.00},
        {'name': 'Упаковка', 'description': 'Профессиональная упаковка груза', 'price': 500.00},
        {'name': 'Погрузка', 'description': 'Услуги грузчиков', 'price': 800.00},
        {'name': 'Доставка до двери', 'description': 'Доставка не до терминала, а до указанного адреса', 'price': 1500.00},
    ]
    for data in services:
        Service.objects.get_or_create(**data)

    # Статусы доставки
    statuses = [
        {'name': 'В ожидании', 'description': ''},
        {'name': 'Проведено', 'description': ''}
       
    ]
    for data in statuses:
        DeliveryStatus.objects.get_or_create(**data)

    # Типы груза
    cargo_types = [
        {'name': 'Хрупкий', 'description': 'Груз требует особо бережной перевозки'},
        {'name': 'Скоропортящийся', 'description': 'Груз с ограниченным сроком хранения'},
        {'name': 'Опасный', 'description': 'Опасные грузы, требующие специальных условий'},
        {'name': 'Обычный', 'description': 'Стандартный груз без особых требований'},
    ]
    for data in cargo_types:
        CargoType.objects.get_or_create(**data)

def reverse_add_initial_data(apps, schema_editor):
    """Функция для отката миграции (необязательно, но рекомендуется)"""
    models = [
        apps.get_model('api_server', 'TransportModel'),
        apps.get_model('api_server', 'PackagingType'),
        apps.get_model('api_server', 'Service'),
        apps.get_model('api_server', 'DeliveryStatus'),
        apps.get_model('api_server', 'CargoType'),
    ]
    for model in models:
        model.objects.all().delete()

class Migration(migrations.Migration):

    dependencies = [
        ('api_server', '0001_initial'),  # Замените 'api_server' на имя вашего приложения
    ]

    operations = [
        migrations.RunPython(
            add_initial_data,
            reverse_code=reverse_add_initial_data
        ),
    ]