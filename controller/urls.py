from django.urls import path

from . import views

urlpatterns = [
    path("", views.user_login, name="login"),
    path("controller", views.controller_main, name="controller-main"),
    path('toggle/', views.toggle, name='toggle'),
]