from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.serializers import serialize
from rest_framework.authentication import TokenAuthentication
from .models import CustomToken
from rest_framework import mixins
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status, permissions, viewsets
import json
import random
from .models import (
    TransportModel, PackagingType, Service, DeliveryStatus,
    CargoType, Delivery
)
from datetime import datetime, timedelta
from rest_framework.response import Response
from functools import wraps
from .authentication import login_user
from .serializers import (
    LoginSerializer, UserSerializer,
    TransportModelSerializer, PackagingTypeSerializer, ServiceSerializer,
    DeliveryStatusSerializer, CargoTypeSerializer, DeliverySerializer
)
import uuid
import os
from django.conf import settings

def token_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if request.method == 'OPTIONS':
            response = HttpResponse()
            response['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
            response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
            response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            response['Access-Control-Allow-Credentials'] = 'true'
            response['Access-Control-Max-Age'] = '86400'  # 24 hours
            return response

        auth_header = request.headers.get('Authorization')
        print(f"Authorization header: {auth_header}")
        if not auth_header:
            print("No authorization header provided")
            return JsonResponse({'error': 'No authorization header'}, status=401)
        
        try:
            # Get token from header
            auth_parts = auth_header.strip().split(' ')
            print(f"Authorization parts: {auth_parts}")
            print(f"Request path: {request.path}")
            
            if len(auth_parts) != 2 or auth_parts[0].lower() != 'token':
                return JsonResponse({'error': 'Invalid token format'}, status=401)
                
            token_key = auth_parts[1]
            print(f"Token key: {token_key}")
            # Validate token and get associated user
            print(f"Checking token in database: {token_key}")
            try:
                print(f"Searching for token in database: {token_key}")
                token = CustomToken.objects.get(key=token_key)
                print(f"Token found for user: {token.user.username}")
                print(f"Token details: key={token.key}, user_id={token.user.id}, created={token.created}")
                request.user = token.user
                response = view_func(request, *args, **kwargs)
                
                # Add CORS headers to response
                if isinstance(response, (JsonResponse, HttpResponse)):
                    response['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
                    response['Access-Control-Allow-Credentials'] = 'true'
                    response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
                    response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
                return response
            except CustomToken.DoesNotExist:
                print(f"Token not found in database: {token_key}")
                print(f"All tokens in database: {list(CustomToken.objects.all().values_list('key', flat=True))}")
                return JsonResponse({'error': 'Invalid or expired token'}, status=401)
            
            # Add CORS headers to response
            if isinstance(response, (JsonResponse, HttpResponse)):
                response['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
                response['Access-Control-Allow-Credentials'] = 'true'
                response['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
                response['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
            return response
        except CustomToken.DoesNotExist:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)
        except (IndexError, Token.DoesNotExist, Exception) as e:
            return JsonResponse({'error': str(e)}, status=401)
    return _wrapped_view

def delivery(request):
    return HttpResponse("Hello, world. You're at the polls index.")

@csrf_exempt
@require_http_methods(["GET"])
@token_required
def get_all_options(request):
    """Получение всех опций для форм"""
    try:
        # Получаем все активные записи
        statuses = [{
            'id': status.id,
            'name': status.name,
            'description': status.description
        } for status in DeliveryStatus.objects.filter(is_active=True)]

        cargo_types = [{
            'id': type.id,
            'name': type.name,
            'description': type.description
        } for type in CargoType.objects.filter(is_active=True)]

        transport_models = [{
            'id': model.id,
            'name': model.name,
            'description': model.description
        } for model in TransportModel.objects.filter(is_active=True)]

        packaging_types = [{
            'id': type.id,
            'name': type.name,
            'description': type.description
        } for type in PackagingType.objects.filter(is_active=True)]

        services = [{
            'id': service.id,
            'name': service.name,
            'description': service.description,
            'price': float(service.price)
        } for service in Service.objects.filter(is_active=True)]

        return JsonResponse({
            'statuses': statuses,
            'cargo_types': cargo_types,
            'transport_models': transport_models,
            'packaging_types': packaging_types,
            'services': services
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
@token_required
def delivery_list(request):
    try:
        # Получаем параметры фильтрации
        delivery_id = request.GET.get('id')
        status = request.GET.get('status')
        cargo_type = request.GET.get('cargo_type')
        transport_model = request.GET.get('transport_model')
        search = request.GET.get('search')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Базовый запрос
        deliveries = Delivery.objects.all()

        # Если указан id, возвращаем только одну доставку
        if delivery_id:
            deliveries = deliveries.filter(id=delivery_id)

        # Применяем остальные фильтры
        if status:
            deliveries = deliveries.filter(status_id=status)
        if cargo_type:
            deliveries = deliveries.filter(cargo_type_id=cargo_type)
        if transport_model:
            deliveries = deliveries.filter(transport_model_id=transport_model)
        if search:
            deliveries = deliveries.filter(
                delivery_address__icontains=search
            ) | deliveries.filter(
                number__icontains=search
            )
        if start_date:
            deliveries = deliveries.filter(departure_date__gte=start_date)
        if end_date:
            deliveries = deliveries.filter(departure_date__lte=end_date)

        # Сериализуем данные
        deliveries_data = []
        for delivery in deliveries:
            delivery_data = {
                'id': delivery.id,
                'number': delivery.number,
                'departure_date': delivery.departure_date.strftime('%Y-%m-%d'),
                'departure_time': delivery.departure_time.strftime('%H:%M') if delivery.departure_time else None,
                'arrival_date': delivery.arrival_date.strftime('%Y-%m-%d'),
                'arrival_time': delivery.arrival_time.strftime('%H:%M') if delivery.arrival_time else None,
                'status': {
                    'id': delivery.status.id,
                    'name': delivery.status.name
                },
                'cargo_type': {
                    'id': delivery.cargo_type.id,
                    'name': delivery.cargo_type.name
                },
                'transport_model': {
                    'id': delivery.transport_model.id,
                    'name': delivery.transport_model.name
                },
                'transport_number': delivery.transport_number,
                'delivery_address': delivery.delivery_address,
                'pickup_address': delivery.pickup_address,
                'travel_time': float(delivery.travel_time),
                'packaging_type': {
                    'id': delivery.packaging_type.id,
                    'name': delivery.packaging_type.name
                },
                'services': [{
                    'id': service.id,
                    'name': service.name
                } for service in delivery.services.all()],
                'created_at': delivery.created_at.strftime('%Y-%m-%d %H:%M:%S') if delivery.created_at else None,
                'updated_at': delivery.updated_at.strftime('%Y-%m-%d %H:%M:%S') if delivery.updated_at else None
            }
            deliveries_data.append(delivery_data)

        return JsonResponse(deliveries_data, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
@token_required
def get_filter_options(request):
    """Получение опций для фильтров"""
    try:
        statuses = [{'id': status.id, 'name': status.name} 
                   for status in DeliveryStatus.objects.filter(is_active=True)]
        cargo_types = [{'id': type.id, 'name': type.name} 
                      for type in CargoType.objects.filter(is_active=True)]
        transport_models = [{'id': model.id, 'name': model.name} 
                          for model in TransportModel.objects.filter(is_active=True)]

        return JsonResponse({
            'statuses': statuses,
            'cargo_types': cargo_types,
            'transport_models': transport_models
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
@token_required
def new_delivery(request):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    try:
        # Парсим данные из multipart-запроса
        data = json.loads(request.POST.get('data', '{}'))
        uploaded_file = request.FILES.get('file')

        # Проверяем обязательные поля
        required_fields = [
            'transport_model', 'transport_number', 'pickup_address',
            'delivery_address', 'packaging_type', 'services',
            'departure_date', 'departure_time', 'arrival_date',
            'arrival_time', 'travel_time', 'cargo_type', 'distance'
        ]
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return JsonResponse({
                'error': f'Отсутствуют обязательные поля: {", ".join(missing_fields)}'
            }, status=400)

        # Получаем активный статус доставки
        default_status = DeliveryStatus.objects.filter(is_active=True).first()
        if not default_status:
            return JsonResponse({'error': 'Нет активных статусов доставки'}, status=400)

        # Генерируем уникальный номер доставки
        today = datetime.now().strftime('%Y%m%d')
        random_number = random.randint(1000, 9999)
        number = f'DEL-{today}-{random_number}'

        # Сохраняем файл, если он передан
        file_path = None
        if uploaded_file:
            files_dir = os.path.join(settings.MEDIA_ROOT, 'files')
            os.makedirs(files_dir, exist_ok=True)
            file_extension = os.path.splitext(uploaded_file.name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join('files', unique_filename)
            with open(os.path.join(settings.MEDIA_ROOT, file_path), 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
            print(f"Файл сохранен по пути: {file_path}")

        # Создаем объект доставки
        delivery = Delivery.objects.create(
            number=number,
            transport_model_id=data['transport_model'],
            transport_number=data['transport_number'],
            pickup_address=data['pickup_address'],
            delivery_address=data['delivery_address'],
            packaging_type_id=data['packaging_type'],
            cargo_type_id=data['cargo_type'],
            status=default_status,
            departure_date=data['departure_date'],
            departure_time=data['departure_time'],
            arrival_date=data['arrival_date'],
            arrival_time=data['arrival_time'],
            travel_time=float(data['travel_time']),
            distance=float(data['distance']),
            notes=data.get('notes', ''),
            created_by=request.user,
            file_path=file_path
        )

        # Устанавливаем услуги
        delivery.services.set(data['services'])

        print(f"Доставка успешно создана: {delivery}")
        return JsonResponse({
            'id': delivery.id,
            'number': delivery.number,
            'file_path': delivery.file_path if delivery.file_path else "0",
            'distance': float(delivery.distance),
            'message': 'Доставка успешно создана'
        })

    except json.JSONDecodeError as e:
        print(f"Ошибка декодирования JSON: {e}")
        return JsonResponse({'error': f'Неверный формат JSON: {e}'}, status=400)
    except (ValueError, TypeError) as e:
        print(f"Ошибка данных: {e}")
        return JsonResponse({'error': 'Неверный формат числовых данных'}, status=400)
    except Exception as e:
        print(f"Неизвестная ошибка: {e}")
        return JsonResponse({'error': f'Неизвестная ошибка: {e}'}, status=400)
 
@csrf_exempt
@require_http_methods(["PUT", "OPTIONS"])
@token_required
def register_delivery(request, delivery_id):
    """Обновление доставки"""
    try:
       
        delivery = Delivery.objects.get(id=delivery_id)
        print("Found delivery:", delivery)  # Логируем найденную доставку
        
        delivery.status = DeliveryStatus.objects.get(id=2)
            
        try:
            delivery.save()
            print("Delivery updated successfully:", delivery)  # Логируем успешное обновление
            
            return JsonResponse({
                'id': delivery.id,
                'message': 'Delivery updated successfully'
            })
        except Exception as e:
            print("Error saving delivery:", str(e))  # Логируем ошибку сохранения
            return JsonResponse({
                'error': f'Error saving delivery: {str(e)}'
            }, status=400)
            
   
    except json.JSONDecodeError as e:
        print("Invalid JSON:", str(e))  # Логируем ошибку JSON
        return JsonResponse({
            'error': f'Invalid JSON: {str(e)}'
        }, status=400)
    except Exception as e:
        print("Unexpected error:", str(e))  # Логируем неожиданную ошибку
        return JsonResponse({
            'error': str(e)
        }, status=400)
        
@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
@token_required
@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
@token_required
def get_delivery(request):
    """Получение информации о доставке по ID через POST"""
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    try:
        data = json.loads(request.body)
        print("Received data for get_delivery:", data)

        delivery_id = data.get('id')
        if not delivery_id:
            print("No delivery ID provided")
            return JsonResponse({'error': 'Delivery ID is required'}, status=400)

        print(f"Fetching delivery with ID: {delivery_id}")
        delivery = Delivery.objects.get(id=delivery_id)
        print("Found delivery:", delivery)

        delivery_data = {
            'id': delivery.id,
            'number': delivery.number,
            'date': delivery.departure_date.strftime('%Y-%m-%d'),
            'time': delivery.departure_time.strftime('%H:%M') if delivery.departure_time else '',
            'arrival_date': delivery.arrival_date.strftime('%Y-%m-%d'),
            'arrival_time': delivery.arrival_time.strftime('%H:%M') if delivery.arrival_time else '',
            'transport_model': {
                'id': delivery.transport_model.id,
                'name': delivery.transport_model.name
            },
            'transport_number': delivery.transport_number,
            'cargo_type': {
                'id': delivery.cargo_type.id,
                'name': delivery.cargo_type.name
            },
            'status': {
                'id': delivery.status.id,
                'name': delivery.status.name
            },
            'distance': float(delivery.distance) if delivery.distance else 0.0,  # Добавляем расстояние
            'delivery_address': delivery.delivery_address,
            'pickup_address': delivery.pickup_address,
            'notes': delivery.notes or '',
            'packaging_type': {
                'id': delivery.packaging_type.id,
                'name': delivery.packaging_type.name
            },
            'services': [service.id for service in delivery.services.all()],
            'travel_time': float(delivery.travel_time),
            'file_path': delivery.file_path  # Путь к файлу
        }

        print("Returning delivery data:", delivery_data)
        return JsonResponse(delivery_data, safe=False)

    except Delivery.DoesNotExist:
        print(f"Delivery not found for ID: {delivery_id}")
        return JsonResponse({'error': 'Delivery not found'}, status=404)
    except json.JSONDecodeError as e:
        print("JSON decode error:", str(e))
        return JsonResponse({'error': f'Invalid JSON: {str(e)}'}, status=400)
    except Exception as e:
        print("Unexpected error in get_delivery:", str(e))
        return JsonResponse({'error': f'Unexpected error: {str(e)}'}, status=400)

@csrf_exempt
@require_http_methods(["POST", "OPTIONS"])
@token_required
def update_delivery(request, delivery_id):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    try:
        # Парсим данные из multipart-запроса
        data = json.loads(request.POST.get('data', '{}'))
        uploaded_file = request.FILES.get('file')

        # Находим доставку
        delivery = Delivery.objects.get(id=delivery_id)

        # Обновляем поля, если они переданы
        if 'transport_model' in data:
            delivery.transport_model_id = data['transport_model']
        if 'transport_number' in data:
            delivery.transport_number = data['transport_number']
        if 'pickup_address' in data:
            delivery.pickup_address = data['pickup_address']
        if 'delivery_address' in data:
            delivery.delivery_address = data['delivery_address']
        if 'packaging_type' in data:
            delivery.packaging_type_id = data['packaging_type']
        if 'services' in data:
            if isinstance(data['services'], list):
                delivery.services.set(data['services'])
            else:
                return JsonResponse({'error': 'Поле services должно быть списком'}, status=400)
        if 'departure_date' in data:
            delivery.departure_date = data['departure_date']
        if 'departure_time' in data:
            time_str = data['departure_time']
            if time_str:
                hours, minutes = map(int, time_str.split(':'))
                if not (0 <= hours <= 23 and 0 <= minutes <= 59):
                    return JsonResponse({'error': 'Неверный формат departure_time (ожидается HH:MM)'}, status=400)
            delivery.departure_time = time_str
        if 'arrival_date' in data:
            delivery.arrival_date = data['arrival_date']
        if 'arrival_time' in data:
            time_str = data['arrival_time']
            if time_str:
                hours, minutes = map(int, time_str.split(':'))
                if not (0 <= hours <= 23 and 0 <= minutes <= 59):
                    return JsonResponse({'error': 'Неверный формат arrival_time (ожидается HH:MM)'}, status=400)
            delivery.arrival_time = time_str
        if 'travel_time' in data:
            delivery.travel_time = float(data['travel_time'])
        if 'notes' in data:
            delivery.notes = data['notes']
        if 'distance' in data:
            delivery.distance = float(data['distance'])

        # Обрабатываем файл, если он передан
        if uploaded_file:
            files_dir = os.path.join(settings.MEDIA_ROOT, 'files')
            os.makedirs(files_dir, exist_ok=True)
            if delivery.file_path and os.path.exists(os.path.join(settings.MEDIA_ROOT, delivery.file_path)):
                os.remove(os.path.join(settings.MEDIA_ROOT, delivery.file_path))
                print(f"Старый файл удален: {delivery.file_path}")
            file_extension = os.path.splitext(uploaded_file.name)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join('files', unique_filename)
            with open(os.path.join(settings.MEDIA_ROOT, file_path), 'wb+') as destination:
                for chunk in uploaded_file.chunks():
                    destination.write(chunk)
            print(f"Новый файл сохранен по пути: {file_path}")
            delivery.file_path = file_path
        else:
            print(f"Файл не передан, сохранен текущий путь: {delivery.file_path}")

        # Сохраняем изменения
        delivery.save()
        print(f"Доставка успешно обновлена: {delivery}")
        return JsonResponse({
            'id': delivery.id,
            'file_path': delivery.file_path if delivery.file_path else "0",
            'distance': float(delivery.distance) if delivery.distance else 0.0,
            'message': 'Доставка успешно обновлена'
        })

    except Delivery.DoesNotExist:
        print(f"Доставка с ID {delivery_id} не найдена")
        return JsonResponse({'error': 'Доставка не найдена'}, status=404)
    except json.JSONDecodeError as e:
        print(f"Ошибка декодирования JSON: {e}")
        return JsonResponse({'error': f'Неверный формат JSON: {e}'}, status=400)
    except (ValueError, TypeError) as e:
        print(f"Ошибка данных: {e}")
        return JsonResponse({'error': 'Неверный формат числовых или временных данных'}, status=400)
    except Exception as e:
        print(f"Неизвестная ошибка: {e}")
        return JsonResponse({'error': f'Неизвестная ошибка: {e}'}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
@token_required
def get_delivery_report(request):
    """Получение отчета по доставкам"""
    try:
        # Получаем параметры фильтрации
        status = request.GET.get('status')
        cargo_type = request.GET.get('cargo_type')
        transport_model = request.GET.get('transport_model')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')

        # Базовый queryset
        deliveries = Delivery.objects.all()

        # Применяем фильтры
        if status:
            deliveries = deliveries.filter(status_id=status)
        if cargo_type:
            deliveries = deliveries.filter(cargo_type_id=cargo_type)
        if transport_model:
            deliveries = deliveries.filter(transport_model_id=transport_model)
        if start_date:
            deliveries = deliveries.filter(date__gte=start_date)
        if end_date:
            deliveries = deliveries.filter(date__lte=end_date)

        # Группируем по статусам
        status_stats = {}
        for status in DeliveryStatus.objects.filter(is_active=True):
            count = deliveries.filter(status=status).count()
            status_stats[status.name] = count

        # Сериализуем данные
        data = {
            'deliveries': [{
            'id': delivery.id,
            'number': delivery.number,
            'date': delivery.departure_date.strftime('%Y-%m-%d'),  # Соответствует departure_date
            'time': delivery.departure_time.strftime('%H:%M') if delivery.departure_time else '',  # Соответствует departure_time
            'arrival_date': delivery.arrival_date.strftime('%Y-%m-%d'),  # Добавлено для полноты
            'arrival_time': delivery.arrival_time.strftime('%H:%M') if delivery.arrival_time else '',  # Второй time, скорее всего, arrival_time
            'transport_model': {
                'id': delivery.transport_model.id,
                'name': delivery.transport_model.name
            },
            'transport_number': delivery.transport_number,
            'cargo_type': {
                'id': delivery.cargo_type.id,
                'name': delivery.cargo_type.name
            },
            'status': {
                'id': delivery.status.id,
                'name': delivery.status.name
            },
            'distance': float(delivery.travel_time),  # Соответствует travel_time
            'delivery_address': delivery.delivery_address,
            'pickup_address': delivery.pickup_address,
            'notes': delivery.notes or '',
            # Дополнительные поля из модели Delivery
            'packaging_type': {
                'id': delivery.packaging_type.id,
                'name': delivery.packaging_type.name
            },
            'services': [service.id for service in delivery.services.all()],
            'travel_time': float(delivery.travel_time)  # Для совместимости с другими частями
        } for delivery in deliveries],
            'statistics': [{'name': status, 'count': count} 
                         for status, count in status_stats.items()]
        }

        return JsonResponse(data)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
@require_http_methods(["DELETE", "OPTIONS"])
@token_required
def delete_delivery(request, delivery_id):
    """Удаление доставки по ID"""
    try:
        # Ищем доставку по ID
        delivery = Delivery.objects.get(id=delivery_id)
        print(f"Found delivery to delete: {delivery}")  # Логируем найденную доставку

        # Удаляем доставку
        delivery.delete()
        print(f"Delivery {delivery_id} deleted successfully")  # Логируем успешное удаление

        # Возвращаем статус 204 (No Content) для успешного удаления
        return HttpResponse(status=204)

    except Delivery.DoesNotExist:
        print(f"Delivery not found: {delivery_id}")  # Логируем отсутствие доставки
        return JsonResponse({
            'error': 'Delivery not found'
        }, status=404)
    except Exception as e:
        print(f"Unexpected error during deletion: {str(e)}")  # Логируем неожиданную ошибку
        return JsonResponse({
            'error': f'Unexpected error: {str(e)}'
        }, status=400)

    
@csrf_exempt
@require_http_methods(["GET"])
@token_required
def export_data(request):
    """Экспорт данных"""
    try:
        export_type = request.GET.get('type', 'deliveries')
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        format = request.GET.get('format', 'excel')

        deliveries = Delivery.objects.all()
        
        if start_date:
            deliveries = deliveries.filter(date__gte=start_date)
        if end_date:
            deliveries = deliveries.filter(date__lte=end_date)

        # Здесь будет логика экспорта данных в выбранный формат
        # Пока возвращаем пустой ответ
        return JsonResponse({
            'message': 'Экспорт данных успешно выполнен'
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

# Простая модель для хранения токенов
class AuthToken:
    def __init__(self, user):
        self.key = str(uuid.uuid4())
        self.user = user
        self.created = datetime.now()
        self.expires = self.created + timedelta(days=1)

    @classmethod
    def create(cls, user):
        return cls(user)

@api_view(['POST', 'OPTIONS'])
@permission_classes([permissions.AllowAny])
@csrf_exempt
def login_view(request):
    if request.method == "OPTIONS":
        response = HttpResponse()
        response["Access-Control-Allow-Origin"] = request.headers.get("Origin", "*")
        response["Access-Control-Allow-Methods"] = "POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response["Access-Control-Allow-Credentials"] = "true"
        return response

    print("Login request received:", request.data)
    serializer = LoginSerializer(data=request.data)
    if not serializer.is_valid():
        print("Serializer validation errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    username = serializer.validated_data['username']
    password = serializer.validated_data['password']
    
    try:
        user = authenticate(username=username, password=password)
        if user is not None:
            # Создаем токен
            token = CustomToken.objects.create(user=user)
            print(f"Created new token for user {username}")
            
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data
            })
        else:
            print(f"Authentication failed for user {username}")
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    except Exception as e:
        print(f"Login error: {str(e)}")
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

class TransportModelViewSet(viewsets.ModelViewSet):
    queryset = TransportModel.objects.filter(is_active=True)
    serializer_class = TransportModelSerializer
    permission_classes = [permissions.IsAuthenticated]

class PackagingTypeViewSet(viewsets.ModelViewSet):
    queryset = PackagingType.objects.filter(is_active=True)
    serializer_class = PackagingTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.filter(is_active=True)
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeliveryStatusViewSet(viewsets.ModelViewSet):
    queryset = DeliveryStatus.objects.filter(is_active=True)
    serializer_class = DeliveryStatusSerializer
    permission_classes = [permissions.IsAuthenticated]

class CargoTypeViewSet(viewsets.ModelViewSet):
    queryset = CargoType.objects.filter(is_active=True)
    serializer_class = CargoTypeSerializer
    permission_classes = [permissions.IsAuthenticated]

class DeliveryViewSet(viewsets.ModelViewSet):
    queryset = Delivery.objects.all()
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
class GetDeliverySet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Delivery.objects.all()  
    serializer_class = DeliverySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            instance = super().get_object()
            print(f"GetDeliverySet: Retrieved delivery with ID {instance.id} for user {self.request.user.username}")
            return instance
        except Delivery.DoesNotExist:
            print(f"GetDeliverySet: Delivery with ID {self.kwargs.get('pk')} not found")
            raise

@csrf_exempt
@require_http_methods(["POST"])
def register_view(request):
    """Регистрация нового пользователя"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        email = data.get('email')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)

        if User.objects.filter(username=username).exists():
            return JsonResponse({'error': 'Username already exists'}, status=400)

        user = User.objects.create_user(username=username, password=password, email=email)
        token = Token.objects.create(user=user)

        return JsonResponse({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["POST"])
@token_required
def logout_view(request):
    """Выход из системы"""
    try:
        auth_header = request.headers.get('Authorization')
        if auth_header:
            token_key = auth_header.split(' ')[1]
            CustomToken.objects.filter(key=token_key).delete()
        return JsonResponse({'message': 'Successfully logged out'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)

@csrf_exempt
@require_http_methods(["GET"])
@token_required
def get_user_info(request):
    """Получение информации о пользователе"""
    try:
        user = request.user
        return JsonResponse({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
