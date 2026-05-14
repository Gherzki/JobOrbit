# jobsnapshot/admin.py
from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    # Fields to display in the list view
    list_display = [
        "id",
        "title",
        "company_display_name",
        "enriched_city",
        "enriched_country_code",
        "salary_min",
        "salary_max",
        "created",
    ]

    # Fields to filter by (sidebar)
    list_filter = [
        "enriched_country_code",
        "enriched_city",
        "contract_type",
        "category_label",
    ]

    # Fields to search
    search_fields = [
        "title",
        "company_display_name",
        "enriched_city",
        "description",
    ]

    # Default ordering
    ordering = ["-created"]

    # Number of items per page
    list_per_page = 50

    # Fields to show in detail view (when you click a job)
    fieldsets = (
        (
            "Core Information",
            {"fields": ("adzuna_id", "title", "description", "redirect_url")},
        ),
        ("Company", {"fields": ("company_display_name", "company_raw")}),
        (
            "Location",
            {
                "fields": (
                    "location_display_name",
                    "location_area",
                    "latitude",
                    "longitude",
                )
            },
        ),
        ("Salary", {"fields": ("salary_min", "salary_max", "salary_is_predicted")}),
        ("Contract", {"fields": ("contract_type", "contract_time")}),
        ("Category", {"fields": ("category_tag", "category_label")}),
        (
            "Enriched Data (BigDataCloud)",
            {
                "fields": (
                    "enriched_city",
                    "enriched_country_name",
                    "enriched_country_code",
                    "enriched_locality",
                    "enriched_principal_subdivision",
                )
            },
        ),
        (
            "Metadata",
            {
                "fields": ("saved_at", "last_updated"),
                "classes": ("collapse",),  # Collapsible section
            },
        ),
    )

    # Make some fields read-only
    readonly_fields = ["saved_at", "last_updated"]
