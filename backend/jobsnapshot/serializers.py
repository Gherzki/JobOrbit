# jobsnapshot/serializers.py
from rest_framework import serializers
from .models import Job


class JobListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for list views"""

    class Meta:
        model = Job
        fields = [
            "id",
            "adzuna_id",
            "title",
            "company_display_name",
            "location_display_name",
            "location_area",
            "enriched_city",
            "enriched_country_name",
            "enriched_country_code",
            "salary_min",
            "salary_max",
            "contract_type",
            "category_label",
            "description",
            "redirect_url",
            "created",
        ]
