from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.conf import settings
import redis
import json
# Create your views here.

from django.http import HttpResponse


def index(request):
    return render(request, 'login.html')

def user_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('controller-main')
        else:
            return render(request, 'login.html', {'error_message': 'Invalid credentials'})
    else:
        return render(request, 'login.html')

@login_required
def controller_main(request):
    redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, password=settings.REDIS_PASSWORD)

    toggle_status = int(redis_client.get('SWITCH'))
    check_status = True if toggle_status else False

    toggle_state = 'On' if toggle_status else 'Off'

    return render(request, 'controllerHome.html', {'toggle_state': toggle_state, 'toggle_flag': check_status})



@login_required
def toggle(request):
    if request.method == 'POST':
        status = json.loads(request.body.decode('utf-8'))["status"]
        try:
            redis_client = redis.StrictRedis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, password=settings.REDIS_PASSWORD)
            redis_client.set('SWITCH', '1' if status else '0')
            return JsonResponse({'status': 'success'})
        except Exception as e:
            return JsonResponse({'status': 'error', 'message': str(e)})
    else:
        return JsonResponse({'status': 'error', 'message': 'Invalid request method'})