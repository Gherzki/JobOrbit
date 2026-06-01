from django.db import models
from django.utils import timezone
from datetime import timedelta


# Create your models here.
class AirbnbCache(models.Model):
    city = models.CharField(max_length=100, unique=True, db_index=True)
    country_code = models.CharField(max_length=5, blank=True, db_index=True)
    listings = models.JSONField(default=dict)  # Full Airbnb response
    fetched_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("city", "country_code")
        indexes = [
            models.Index(fields=["city", "country_code"]),
        ]

    def is_fresh(self):
        """Cache is fresh for 7 days"""
        return timezone.now() - self.fetched_at < timedelta(days=7)

    def __str__(self):
        return f"Airbnb cache for {self.city}, {self.country_code}"
