# jobsnapshot/views.py
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import render
from .models import Job
from .serializers import JobListSerializer


def job_list_html(request):
    return render(request, "jobs/job_list.html")


@api_view(["GET"])
@permission_classes([AllowAny])
def all_jobs(request):
    """Return all jobs (242 total)"""
    jobs = Job.objects.all().order_by("-created")
    serializer = JobListSerializer(jobs, many=True)

    # Truncate descriptions for list view
    data = serializer.data
    for job in data:
        if job.get("description"):
            job["description"] = (
                job["description"][:200] + "..."
                if len(job["description"]) > 200
                else job["description"]
            )

    return Response({"count": jobs.count(), "results": data}, status=status.HTTP_200_OK)


@api_view(["GET"])
@permission_classes([AllowAny])
def jobs_by_country(request, country):
    """Return jobs for a specific country (gb, us, de, fr, ca)"""

    # Map URL country code to database country code
    COUNTRY_MAP = {
        "gb": "GB",
        "us": "US",
        "de": "DE",
        "fr": "FR",
        "ca": "CA",
    }

    country_lower = country.lower()

    if country_lower not in COUNTRY_MAP:
        return Response(
            {"error": "Invalid country. Use: gb, us, de, fr, ca"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    country_code = COUNTRY_MAP[country_lower]
    jobs = Job.objects.filter(enriched_country_code=country_code).order_by("-created")
    serializer = JobListSerializer(jobs, many=True)

    # Truncate descriptions
    data = serializer.data
    for job in data:
        if job.get("description"):
            job["description"] = (
                job["description"][:200] + "..."
                if len(job["description"]) > 200
                else job["description"]
            )

    return Response(
        {"country": country.upper(), "count": jobs.count(), "results": data},
        status=status.HTTP_200_OK,
    )
