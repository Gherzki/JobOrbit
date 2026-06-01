# accommodations/urls.py
from django.urls import path
from .views import accommodations_by_city

urlpatterns = [
    path("<str:city>/", accommodations_by_city, name="accommodations_by_city"),
]
