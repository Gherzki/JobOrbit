from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

from jobsnapshot.models import Job
from .services import AirbnbService


# Create your views here.
@api_view(["GET"])
@permission_classes([AllowAny])
def accommodations_by_city(request, city):
    """Get Airbnb listings for a city (cached)"""

    # Try to find a job in that city to get country code
    job = Job.objects.filter(enriched_city__iexact=city).first()
    country_code = job.enriched_country_code if job else None

    # Get accommodations from service (handles caching)
    result = AirbnbService.get_accommodations_for_city(city, country_code)

    return Response(result, status=status.HTTP_200_OK)
