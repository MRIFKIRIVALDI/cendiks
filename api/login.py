import os
import django
from django.conf import settings
from django.http import JsonResponse
import json

# Configure Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cendiks_django.cendiks_django.settings')
django.setup()

from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User

def handler(request):
    if request.method != 'POST':
        return JsonResponse({'success': False, 'message': 'Method not allowed'})

    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'success': False, 'message': 'Username dan password diperlukan'})

        user = authenticate(username=username, password=password)
        if user is not None:
            # Note: Session handling in serverless might be limited
            return JsonResponse({'success': True, 'message': 'Login berhasil'})
        else:
            return JsonResponse({'success': False, 'message': 'Username atau password salah'})
    except json.JSONDecodeError:
        return JsonResponse({'success': False, 'message': 'Data tidak valid'})
