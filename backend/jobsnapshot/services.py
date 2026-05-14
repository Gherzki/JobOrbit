# jobsnapshot/services.py
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

        # Check cache
        cache = AirbnbCache.objects.filter(city__iexact=city).first()
        if cache and cache.is_fresh():
            logger.info(f"Cache hit for {city}")
            return {
                "source": "cache",
                "city": city,
                "listings": cache.listings,
                "cached_at": cache.fetched_at,
            }

        # Fetch from SearchAPI.io
        logger.info(f"Fetching from API for {city}")
        listings = cls.fetch_from_api(city, country_code)

        # Save to cache
        AirbnbCache.objects.update_or_create(
            city=city,
            defaults={"country_code": country_code or "", "listings": listings},
        )

        return {"source": "api", "city": city, "listings": listings}

    @classmethod
    def fetch_from_api(cls, city, country_code=None):
        """Call SearchAPI.io Airbnb endpoint - EXACTLY like Postman"""

        api_key = getattr(settings, "SEARCHAPI_API_KEY", None)

        if not api_key:
            logger.error("SearchAPI key not configured")
            return {"error": "SearchAPI key not configured", "results": []}

        # Build location string exactly like Postman
        location = city
        if country_code:
            location = f"{city}, {country_code}"

        # Parameters exactly matching Postman
        params = {
            "api_key": api_key,
            "engine": "airbnb",
            "q": location,
        }

        logger.info(f"Request URL: {cls.BASE_URL}")
        logger.info(f"Request params: {params}")

        try:
            response = requests.get(
                cls.BASE_URL,
                params=params,
                timeout=15,
            )

            logger.info(f"Response status: {response.status_code}")

            if response.status_code == 200:
                data = response.json()

                # Check if we got properties
                properties = data.get("properties", [])
                logger.info(f"Found {len(properties)} properties")

                if not properties:
                    return {
                        "results": [],
                        "total": 0,
                        "message": f"No Airbnb listings found for {location}",
                        "searched_location": location,
                    }

                # Format the listings exactly from the Postman response structure
                formatted_listings = []
                for prop in properties[:10]:
                    price_info = prop.get("price", {})
                    # Get the price string
                    price = (
                        price_info.get("price_string")
                        or price_info.get("total_price")
                        or "Price not available"
                    )

                    formatted_listings.append(
                        {
                            "id": prop.get("id"),
                            "name": prop.get("title", "Property"),
                            "description": prop.get("description", "")[:200],
                            "url": prop.get("link", "#"),
                            "price": price,
                            "rating": prop.get("rating"),
                            "review_count": prop.get("reviews", 0),
                            "guest_capacity": prop.get("guest_capacity"),
                            "accommodations": prop.get("accommodations", []),
                            "image": (
                                prop.get("images", [""])[0]
                                if prop.get("images")
                                else ""
                            ),
                            "is_guest_favorite": prop.get("is_guest_favorite", False),
                            "position": prop.get("position"),  # From Postman response
                        }
                    )

                return {
                    "results": formatted_listings,
                    "total": len(formatted_listings),
                    "searched_location": location,
                    "search_parameters": data.get("search_parameters", {}),
                }
            else:
                logger.error(f"API error: {response.status_code}")
                logger.error(f"Response text: {response.text[:200]}")
                return {
                    "error": f"API error: {response.status_code}",
                    "results": [],
                }

        except Exception as e:
            logger.error(f"Exception: {str(e)}")
            return {"error": str(e), "results": []}
