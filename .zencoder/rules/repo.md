# Repository Overview

## Tech Stack
- **Backend**: Django (Python)
- **Frontend**: React (JavaScript) with Tailwind CSS

## Structure
- **backend/**: Django project `e_kalolsavam` with apps:
  - **certificates**, **events**, **feedback**, **notifications**, **scores**, **users**, **volunteers**
  - **manage.py**, **requirements.txt**, **media/**, **static/**
- **frontend/**: React app
  - **src/** (components, pages, services, utils), **public/**, **tailwind.config.js**
- **.zencoder/**: Assistant configuration and rules

## Environment
- Backend env: `backend/.env`
- Frontend env: `frontend/.env`

## Run (Local Dev)
1) Backend
   - Create/activate a Python venv
   - Install deps: `pip install -r backend/requirements.txt`
   - Migrate: `python backend/manage.py migrate`
   - Run: `python backend/manage.py runserver`
2) Frontend
   - Install deps: `npm install --prefix frontend`
   - Run: `npm start --prefix frontend`

## Conventions & Notes
- Keep authentication and registration flows untouched (normal login + Google Sign-In preserved).
- Isolate new features to dedicated components/pages (e.g., dashboard) to avoid regressions.
- Media directories exist for uploads: `backend/media/`.

## Useful Paths
- Django settings: `backend/e_kalolsavam/settings.py`
- App URLs: under each app (e.g., `backend/events/urls.py`, `backend/users/urls.py`, etc.)
- Serializers, views, models follow standard Django app layout.

## Current Task Context (Dashboard)
- Implement a dashboard UI in the frontend with:
  - Header/footer consistent with landing page
  - Animated shadow art below header
  - Center marquee for recent results
  - Floating corner box with icon menu (Registered Events, QR ID Card, Feedback, Results, Schedule) opening in modal/drawer
- Do not modify existing auth/registration logic.