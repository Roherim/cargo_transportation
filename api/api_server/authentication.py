from .models import CustomToken
from django.contrib.auth import authenticate
from django.http import JsonResponse
import json
from .models import CustomToken

def login_user(request):
    """Вход в систему"""
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)

        user = authenticate(username=username, password=password)
        if user is not None:
            # Создаем или получаем токен
          
            try:
              
                token = CustomToken.objects.filter(user=user)
                if token and token.exists():
                # Создаем новый токен
                    token = CustomToken.objects.create(user=user)
                    token.save()  # Явное сохранение
                    
                
                # Проверяем сохранение в базе данных
                try:
                    db_token = CustomToken.objects.get(key=token.key)
                   
                except CustomToken.DoesNotExist:
                   
                    return JsonResponse({'error': 'Token creation failed'}, status=500)
                
                return JsonResponse({
                    'token': token.key,
                    'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email,
                        'first_name': user.first_name,
                        'last_name': user.last_name
                    }
                })
            except Exception as e:
                print(f"Error during token creation/verification: {str(e)}")
                return JsonResponse({'error': 'Token creation failed'}, status=500)
        else:
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
    except Exception as e:
        print("Login error:", str(e))
        return JsonResponse({'error': str(e)}, status=400)
