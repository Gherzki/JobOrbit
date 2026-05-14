from django.db import models


# Create your models here.
class Job(models.Model):
    # ========== Adzuna Core Fields ==========
    adzuna_id = models.CharField(max_length=50, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)

    # URL and redirect
    redirect_url = models.URLField(max_length=500, blank=True)
    adref = models.CharField(max_length=500, blank=True)

    # Timestamps
    created = models.DateTimeField(null=True, blank=True)

    # ========== Company ==========
    company_display_name = models.CharField(max_length=255, blank=True)
    # Optional: store full company JSON if needed
    company_raw = models.JSONField(default=dict, blank=True)

    # ========== Location ==========
    location_display_name = models.CharField(max_length=255, blank=True)
    location_area = models.JSONField(default=list, blank=True)  # Stores the area array
    latitude = models.DecimalField(
        max_digits=10, decimal_places=7, null=True, blank=True
    )
    longitude = models.DecimalField(
        max_digits=10, decimal_places=7, null=True, blank=True
    )

    # ========== Salary ==========
    salary_min = models.IntegerField(null=True, blank=True)
    salary_max = models.IntegerField(null=True, blank=True)
    salary_is_predicted = models.CharField(max_length=10, blank=True)

    # ========== Contract ==========
    contract_type = models.CharField(
        max_length=50, blank=True
    )  # permanent, contract, etc.
    contract_time = models.CharField(max_length=50, blank=True)  # full_time, part_time

    # ========== Category ==========
    category_tag = models.CharField(max_length=100, blank=True)
    category_label = models.CharField(max_length=100, blank=True)

    # ========== BigDataCloud Enriched Fields ==========
    enriched_city = models.CharField(max_length=100, blank=True, db_index=True)
    enriched_country_name = models.CharField(max_length=100, blank=True)
    enriched_locality = models.CharField(max_length=100, blank=True)
    enriched_principal_subdivision = models.CharField(
        max_length=100, blank=True
    )  # State/Region
    enriched_country_code = models.CharField(max_length=5, blank=True)

    # ========== Metadata ==========
    saved_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["enriched_city", "enriched_country_name"]),
            models.Index(fields=["enriched_country_code"]),
            models.Index(fields=["contract_type"]),
            models.Index(fields=["category_tag"]),
        ]

    def __str__(self):
        return f"{self.title} - {self.company_display_name}"
