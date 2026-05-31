# jobsnapshot/management/commands/fetch_jobs.py
from django.core.management.base import BaseCommand
from django.conf import settings
from jobsnapshot.models import Job
import requests
import time


class Command(BaseCommand):
    help = "Fetch jobs from Adzuna API and enrich with BigDataCloud"

    def handle(self, *args, **options):
        self.stdout.write("📸 Starting job fetch...")
        self.fetch_all_jobs()
        self.stdout.write(
            self.style.SUCCESS(f"Complete! {Job.objects.count()} jobs saved")
        )

    def fetch_all_jobs(self):
        countries = ["gb", "us", "de", "fr", "ca"]

        app_id = settings.ADZUNA_APP_ID
        app_key = settings.ADZUNA_APP_KEY

        for country_code in countries:
            self.stdout.write(f"  → Fetching jobs for {country_code.upper()}...")

            response = requests.get(
                f"https://api.adzuna.com/v1/api/jobs/{country_code}/search/1",
                params={
                    "app_id": app_id,
                    "app_key": app_key,
                    "results_per_page": 50,
                },
            )

            if response.status_code != 200:
                self.stdout.write(f"API error: {response.status_code}")
                continue

            data = response.json()
            jobs = data.get("results", [])

            for idx, job in enumerate(jobs):
                lat = job.get("latitude")
                lon = job.get("longitude")

                # Reverse geocode to get city and country
                geo_data = self.reverse_geocode(lat, lon)

                # Extract nested data safely
                company = job.get("company", {})
                location = job.get("location", {})
                category = job.get("category", {})

                # Create or update job with ALL fields
                Job.objects.update_or_create(
                    adzuna_id=job.get("id"),
                    defaults={
                        # Core fields
                        "title": job.get("title", "")[:255],
                        "description": job.get("description", ""),
                        "redirect_url": job.get("redirect_url", ""),
                        "adref": job.get("adref", ""),
                        "created": job.get("created"),
                        # Company
                        "company_display_name": company.get("display_name", "")[:255],
                        "company_raw": company,
                        # Location
                        "location_display_name": location.get("display_name", "")[:255],
                        "location_area": location.get("area", []),
                        "latitude": lat,
                        "longitude": lon,
                        # Salary
                        "salary_min": (
                            job.get("salary_min")
                            if job.get("salary_min") != 0
                            else None
                        ),
                        "salary_max": (
                            job.get("salary_max")
                            if job.get("salary_max") != 0
                            else None
                        ),
                        "salary_is_predicted": job.get("salary_is_predicted", ""),
                        # Contract
                        "contract_type": job.get("contract_type", ""),
                        "contract_time": job.get("contract_time", ""),
                        # Category
                        "category_tag": category.get("tag", ""),
                        "category_label": category.get("label", ""),
                        # Enriched data from BigDataCloud
                        "enriched_city": geo_data.get("city", ""),
                        "enriched_country_name": geo_data.get("country_name", ""),
                        "enriched_locality": geo_data.get("locality", ""),
                        "enriched_principal_subdivision": geo_data.get(
                            "principal_subdivision", ""
                        ),
                        "enriched_country_code": geo_data.get("country_code", ""),
                    },
                )

                if (idx + 1) % 10 == 0:
                    self.stdout.write(f"      Processed {idx+1}/{len(jobs)} jobs...")

            time.sleep(1)  # Rate limit protection

    def reverse_geocode(self, lat, lon):
        """Get city, country, and other location data from lat/lon"""
        if not lat or not lon:
            return {}

        try:
            response = requests.get(
                "https://api.bigdatacloud.net/data/reverse-geocode-client",
                params={"latitude": lat, "longitude": lon, "localityLanguage": "en"},
                timeout=5,
            )

            if response.status_code == 200:
                data = response.json()
                return {
                    "city": data.get("city")
                    or data.get("locality")
                    or data.get("principalSubdivision"),
                    "locality": data.get("locality", ""),
                    "principal_subdivision": data.get("principalSubdivision", ""),
                    "country_name": data.get("countryName", ""),
                    "country_code": data.get("countryCode", ""),
                }
            else:
                return {}

        except Exception as e:
            self.stdout.write(f"Geocoding failed: {e}")
            return {}
