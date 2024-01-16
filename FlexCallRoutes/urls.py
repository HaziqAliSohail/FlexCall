from django.urls import path
from . import views

urlpatterns = [
    path('', views.lobby, name="Home"),
    path('room/',views.room, name="Room"),
    path('get_Token/', views.getToken)
]
