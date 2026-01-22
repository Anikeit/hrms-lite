# HRMS Lite - Human Resource Management System

A lightweight full-stack web application for managing employees and tracking attendance.

## Project Overview

HRMS Lite is a simple yet professional Human Resource Management System that allows administrators to:
- Manage employee records (add, view, delete)
- Track daily attendance (mark attendance, view records)

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Vite** - Build tool and dev server
- **CSS3** - Styling

### Backend
- **Django 4.2** - Web framework
- **Django REST Framework** - REST API framework
- **SQLite** - Development database (PostgreSQL for production)
- **django-cors-headers** - CORS handling

### Deployment
- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway / Heroku

## Project Structure

```
hrms-lite/
├── backend/
│   ├── hrms/           # Django project settings
│   ├── employees/      # Employee and Attendance app
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API service layer
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## Features

### Employee Management
- ✅ Add new employees with unique Employee ID, Name, Email, and Department
- ✅ View list of all employees
- ✅ Delete employees
- ✅ Form validation (required fields, email format, duplicate handling)

### Attendance Management
- ✅ Mark attendance for employees (Date, Status: Present/Absent)
- ✅ View all attendance records
- ✅ Filter attendance by employee
- ✅ Prevent duplicate attendance entries for same employee and date

### UI Features
- ✅ Clean, professional interface
- ✅ Loading states
- ✅ Error handling and display
- ✅ Empty states
- ✅ Responsive design

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create a superuser (optional, for admin panel):
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file (optional, defaults to localhost):
```bash
cp .env.example .env
```

4. Update `.env` with your backend URL:
```
VITE_API_BASE_URL=http://localhost:8000/api
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Employees
- `GET /api/employees/` - List all employees
- `POST /api/employees/` - Create a new employee
- `DELETE /api/employees/{id}/` - Delete an employee

### Attendance
- `GET /api/attendance/` - List all attendance records
- `POST /api/attendance/` - Mark attendance
- `GET /api/attendance/employee/{employee_id}/` - Get attendance for a specific employee

## Deployment

### Backend Deployment (Render/Railway)

1. Add `gunicorn` to requirements.txt:
```
gunicorn==21.2.0
```

2. Set environment variables:
- `DEBUG=False`
- `SECRET_KEY=<your-secret-key>`
- `DATABASE_URL=<postgresql-url>` (if using PostgreSQL)

3. Deploy using the platform's instructions

### Frontend Deployment (Vercel/Netlify)

1. Build the project:
```bash
npm run build
```

2. Set environment variable:
- `VITE_API_BASE_URL=<your-backend-api-url>`

3. Deploy the `dist` folder

## Assumptions & Limitations

1. **Single Admin User**: No authentication system implemented (as per requirements)
2. **No User Roles**: All users have admin access
3. **Basic Features Only**: Advanced HR features (payroll, leave management) are out of scope
4. **Development Database**: Uses SQLite by default (switch to PostgreSQL for production)

## Future Enhancements (Bonus Features)

- [ ] Filter attendance records by date range
- [ ] Display total present days per employee
- [ ] Basic dashboard with summary statistics
- [ ] Export attendance data to CSV
- [ ] Employee profile pages

## License

This project is created for educational/assignment purposes.

## Contact

For questions or issues, please refer to the project repository.
