# BOOKLY

Web Application project

Course: **CSC13002**

Author: **Ngô Nguyễn Thanh Thanh**

## Setup and run the project

### Prerequisites

- python >= 3.8
- nodejs

### Backend

```bash
# setup
cd backend
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
# run the backend server
python manage.py runserver
```

### Frontend

```bash
# setup
cd frontend
npm install 
# run the frontend server
npm run dev
```