# jobsnapshot/urls.py
from django.urls import path
from . import views

urlpatterns = [
    path("browse/", views.job_list_html, name="job_list_html"),
    path("", views.all_jobs, name="all_jobs"),  # GET /api/jobs/
    path(
        "<str:country>/", views.jobs_by_country, name="jobs_by_country"
    ),  # GET /api/jobs/gb/
    # path("accommodations/<str:city>/", views.accommodations_by_city, name="accommodations_by_city"),
]
