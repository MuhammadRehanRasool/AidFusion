# AidFusion

AidFusion is a web app that connects people who want to help (donors) with people who need help (acceptors) in their area. It was built for the Google Developer Student Clubs (GDSC) Solution Challenge.

Users register as either a donor or an acceptor and enter their address using Google Places autocomplete. After logging in, the home page shows a Google Map centred on the user's own address, with a marker for every registered acceptor, so donors can see who nearby needs help.

## Features

- Registration and login with a role: donor or acceptor
- Address entry with Google Places autocomplete
- Map view (Google Maps) with the user's home marker and markers for acceptors, geocoded from their addresses
- Django admin for managing users, linked from the client at `/admin`
- REST API for users and reviews (Django REST Framework)

## Tech stack

| Layer    | Technology |
|----------|------------|
| Backend  | Python, Django 4.1, Django REST Framework, django-cors-headers, WhiteNoise, SQLite |
| Frontend | React 18, Vite 4, React Router 6, Tailwind CSS, Axios |
| Maps     | Google Maps JavaScript API with the Places library, `@react-google-maps/api`, `use-places-autocomplete` |

## Project structure

```
.
├── manage.py
├── project/          Django project (settings, root URLs, WSGI/ASGI)
├── api/              Django app: Users and Review models, serializers, views, URLs
└── client/           React + Vite frontend
    ├── index.html
    ├── public/       Static images (logo, map marker icons)
    └── src/
        ├── CONSTANT.jsx    API URLs, Maps key, shared helpers
        ├── auth/           Login and Register pages
        ├── views/Home.jsx  Map view
        ├── components/     Navbar, admin redirect
        ├── layout/
        └── contexts/
```

## API endpoints

All routes are under `/api/`.

| Method          | Route              | Description |
|-----------------|--------------------|-------------|
| POST            | `validate`         | Log in with username and password |
| POST            | `user`             | Register a user |
| GET             | `user/<id>`        | List all other users (excluding the admin) |
| PUT             | `user/<id>`        | Update a user |
| GET/POST/PUT/DELETE | `review`, `review/<id>` | Reviews (work in progress, see Known issues) |

## Getting started

### Prerequisites

- Python 3.11
- Node.js and npm
- A Google Maps JavaScript API key with the Places API enabled

### Backend

```bash
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install django==4.1 djangorestframework django-cors-headers whitenoise google-api-python-client
cp .env.example .env            # then edit the values
python manage.py migrate
python manage.py runserver
```

Django does not read `.env` files by itself. Export the variables in your shell, or load them with a tool such as `python-dotenv` or your hosting platform's settings.

The API runs at `http://127.0.0.1:8000/api/` and the admin at `http://127.0.0.1:8000/admin/`.

### Frontend

```bash
cd client
npm install
cp .env.example .env            # then set your Maps API key
npm run dev
```

The backend URLs used by the client are set in `client/src/CONSTANT.jsx`. Change them if your backend is not on `http://127.0.0.1:8000`.

## Environment variables

| Variable | Location | Description | Default |
|----------|----------|-------------|---------|
| `DJANGO_SECRET_KEY` | root `.env` | Django secret key. Set a long random value in any real deployment. | `django-insecure-change-me` |
| `DJANGO_DEBUG` | root `.env` | `True` to enable debug mode | `False` |
| `DJANGO_ALLOWED_HOSTS` | root `.env` | Comma-separated list of allowed hosts | `localhost,127.0.0.1` |
| `VITE_GOOGLE_MAPS_API_KEY` | `client/.env` | Google Maps JavaScript API key (Places library) | none |

## Known issues

- The review endpoints reference `Comments` and `Replies` models that do not exist yet, so they fail at runtime. Only the `Review` model is defined.
- The marker info windows on the map show placeholder text.
- On startup, `api/views.py` tries to create a superuser `admin` with the password `admin` (it looks the user up by `admin@gmail.com`, an email it never sets, so the lookup always misses). Change this password or remove that code before deploying.
- CORS is open to all origins (`CORS_ALLOW_ALL_ORIGINS = True`).
