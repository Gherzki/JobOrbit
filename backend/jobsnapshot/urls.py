# jobsnapshot/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("", views.all_jobs, name="all_jobs"),  # GET /api/jobs/
    path(
        "<str:country>/", views.jobs_by_country, name="jobs_by_country"
    ),  # GET /api/jobs/gb/
]
