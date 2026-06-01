from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.contrib.auth import get_user_model
from django.conf import settings


class Command(BaseCommand):
    help = "Bootstrap database safely (idempotent)"

    def handle(self, *args, **kwargs):
        self.create_superuser()
        self.run_fetch_jobs()

    def create_superuser(self):
        User = get_user_model()

        username = settings.SUPERUSER_USERNAME
        email = settings.SUPERUSER_EMAIL
        password = settings.SUPERUSER_PASSWORD

        if not all([username, email, password]):
            self.stdout.write("Missing superuser env vars")
            return

        if User.objects.filter(username=username).exists():
            self.stdout.write("Superuser already exists → skipping")
            return

        User.objects.create_superuser(username=username, email=email, password=password)

        self.stdout.write("Superuser created")

    def run_fetch_jobs(self):
        self.stdout.write("Starting job fetch...")

        call_command("fetch_jobs")

        self.stdout.write("Job fetch complete")
