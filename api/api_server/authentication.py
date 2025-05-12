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
            print(f"Creating token for user: {user.username}")
            try:
                # Удаляем старый токен, если он существует
                CustomToken.objects.filter(user=user).delete()
                
                # Создаем новый токен
                token = CustomToken.objects.create(user=user)
                token.save()  # Явное сохранение
                print(f"Created new token for user {user.username}: {token.key}")
                
                # Проверяем сохранение в базе данных
                try:
                    db_token = CustomToken.objects.get(key=token.key)
                    print(f"Token successfully saved in database: key={db_token.key}, user={db_token.user.username}")
                except CustomToken.DoesNotExist:
                    print(f"ERROR: Token {token.key} not found in database after creation")
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
