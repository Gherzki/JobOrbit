# backend/urls.py
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/jobs/", include("jobsnapshot.urls")),
    path("api/accommodations/", include("accommodations.urls")),
]
