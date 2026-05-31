import requests
import logging
from django.conf import settings
from .models import AirbnbCache

logger = logging.getLogger(__name__)


class AirbnbService:
    BASE_URL = "https://www.searchapi.io/api/v1/search"

    @classmethod
    def get_accommodations_for_city(cls, city, country_code=None):
        """Get Airbnb listings for a city (with caching)"""

        if not city:
            return {"error": "No city provided", "listings": [], "source": "error"}

        # -----------------------------
        # Normalize keys
        # -----------------------------
        city_key = city.strip().lower()
        country_key = (country_code or "").strip().upper()

        # -----------------------------
        # Cache lookup
        # -----------------------------
        cache = AirbnbCache.objects.filter(
            city=city_key,
            country_code=country_key,
        ).first()

        if cache and cache.is_fresh():
            logger.info(f"Cache hit for {city_key}")
            return {
                "source": "cache",
                "city": city,
                "listings": cache.listings,
                "cached_at": cache.fetched_at,
            }

        # -----------------------------
        # API fetch
        # -----------------------------
        logger.info(f"Fetching from API for {city_key}")
        listings = cls.fetch_from_api(city_key, country_key)

        # -----------------------------
        # Cache save
        # -----------------------------
        AirbnbCache.objects.update_or_create(
            city=city_key,
            country_code=country_key,
            defaults={"listings": listings},
        )

        return {
            "source": "api",
            "city": city,
            "listings": listings,
        }

    @classmethod
    def fetch_from_api(cls, city, country_code=None):
        """Call SearchAPI.io Airbnb endpoint"""

        api_key = getattr(settings, "SEARCHAPI_API_KEY", None)

        if not api_key:
            logger.error("SearchAPI key not configured")
            return {"error": "SearchAPI key not configured", "results": []}

        location = city
        if country_code:
            location = f"{city}, {country_code}"

        params = {
            "api_key": api_key,
            "engine": "airbnb",
            "q": location,
        }

        try:
            response = requests.get(
                cls.BASE_URL,
                params=params,
                timeout=15,
            )

            if response.status_code != 200:
                return {
                    "error": f"API error: {response.status_code}",
                    "results": [],
                }

            data = response.json()
            properties = data.get("properties", [])

            if not properties:
                return {
                    "results": [],
                    "total": 0,
                    "message": f"No Airbnb listings found for {location}",
                    "searched_location": location,
                }

            formatted = []

            for prop in properties[:10]:
                price_info = prop.get("price", {})

                price = (
                    price_info.get("price_string")
                    or price_info.get("total_price")
                    or "Price not available"
                )

                formatted.append(
                    {
                        "id": prop.get("id"),
                        "name": prop.get("title", "Property"),
                        "description": (prop.get("description") or "")[:200],
                        "url": prop.get("link", "#"),
                        "price": price,
                        "rating": prop.get("rating"),
                        "review_count": prop.get("reviews", 0),
                        "guest_capacity": prop.get("guest_capacity"),
                        "accommodations": prop.get("accommodations", []),
                        "image": (
                            prop.get("images", [""])[0] if prop.get("images") else ""
                        ),
                        "is_guest_favorite": prop.get("is_guest_favorite", False),
                        "position": prop.get("position"),
                    }
                )

            return {
                "results": formatted,
                "total": len(formatted),
                "searched_location": location,
                "search_parameters": data.get("search_parameters", {}),
            }

        except Exception as e:
            logger.error(str(e))
            return {"error": str(e), "results": []}
