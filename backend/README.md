This project uses job and salary data provided by the Adzuna API. All vacancies and salary information are sourced from The Adzuna API and are used in accordance with their terms of service. Visit https://www.adzuna.co.uk/ for more information.

# JobOrbit Backend Setup

## First-Time Setup

1. Open a terminal/CLI.
2. Make a .env file with all relevant API keys:
    1. ADZUNA_APP_ID=<your api ID>
    2. ADZUNA_APP_KEY=<your api key>
    3. SEARCHAPI_API_KEY=<your api key>
3. Navigate to the backend directory.

```bash
> cd backend

## Install the project dependencies.
> pipenv install

## Activate the virtual environment.
>pipenv shell

##Fetch the initial job data with method already in the code.
>python manage.py fetch_jobs
###This command only needs to be run during the initial setup of the project (or whenever the job data needs to be refreshed).

###Implementation details can be found in:
(backend/jobsnapshot/management/commands/fetch_jobs.py)

## After the initial setup has been completed, start the Django development server:
>python manage.py runserver

##The backend will be available at: http://127.0.0.1:8000/


