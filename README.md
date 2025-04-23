# BroncoHacks2025

A full‑stack hackathon project for sharing and discovering developer projects.  
Built with React, Vite & Tailwind on the frontend, and Django REST Framework on the backend.

![Static Badge](https://img.shields.io/badge/react-m?style=for-the-badge&logo=react&labelColor=black&color=%2361DAFB) ![Static Badge](https://img.shields.io/badge/python-m?style=for-the-badge&logo=python&labelColor=yellow&color=blue) ![Static Badge](https://img.shields.io/badge/django-m?style=for-the-badge&logo=django&labelColor=black&color=black) ![Static Badge](https://img.shields.io/badge/vite-m?style=for-the-badge&logo=vite&labelColor=black&color=%23646CFF) ![Static Badge](https://img.shields.io/badge/vercel-m?style=for-the-badge&logo=vercel&labelColor=black&color=%23000000) ![Static Badge](https://img.shields.io/badge/railway-r?style=for-the-badge&logo=railway&labelColor=black&color=%230B0D0E)
---

## 🚀 Features

- User authentication (signup, login, logout)  
- User profiles with avatar upload, bio, interests (tags)  
- Create, view, edit, delete posts with title, description, pitch, files, GitHub link, tech‑stack  
- Like and comment on posts  
- Full‑text search & filter by tags  
- Responsive UI with Tailwind, Radix UI primitives, Framer Motion, Lucide icons  
- Persistent toast notifications  

---

## 🧰 Tech Stack

**Frontend**  
- React 19, Vite  
- Tailwind CSS, Tailwind Animate  
- Radix UI (`@radix-ui/*`)  
- Framer Motion, Lucide‑React, Axios  

**Backend**  
- Python 3.11+, Django 4.2, Django REST Framework  
- Custom user model (`accounts.CustomUser`) with ImageField for avatars  
- SQLite (default) or MySQL  
- Django CORS / CSRF protection  

---

## 📁 Repository Structure

```
BroncoHacks2025/
├─ backend/
│  ├─ accounts/       # Custom user, auth views, serializers
│  ├─ posts/          # Post, Comment, Tag models & viewsets
│  ├─ backend/        # Django settings, urls, wsgi/asgi
│  └─ manage.py
│
├─ frontend/
│  ├─ public/         # Static assets (images/)
│  ├─ src/
│  │  ├─ components/  # Navbar, UI primitives, Toaster
│  │  ├─ pages/       # Landing, Home, Profile, Login, Signup, PostDetail…
│  │  ├─ App.jsx
│  │  ├─ main.jsx
│  │  └─ index.css
│  ├─ vite.config.js
│  └─ package.json
│
└─ README.md          # ← you are here
```

---

## ⚙️ Prerequisites

- Node.js 18+ and npm  
- Python 3.11+  
- (Optional) MySQL server if you choose MySQL over SQLite  

---

## 🔧 Setup

### 1. Clone the repository

```bash
git clone https://github.com/your-org/BroncoHacks2025.git
cd BroncoHacks2025
```

### 2. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # on Windows
# or: source .venv/bin/activate on macOS/Linux

pip install -r requirements.txt
```

#### Environment Variables

Create a `.env` in `backend/backend/` with:

```ini
DJANGO_SECRET_KEY=your-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
# For MySQL (optional):
# MYSQL_DATABASE=bronco_db
# MYSQL_USER=root
# MYSQL_PASSWORD=secret
# MYSQL_HOST=127.0.0.1
# MYSQL_PORT=3306
```

Django settings default to SQLite (`db.sqlite3`) if no MySQL vars provided.

#### Run migrations & server

```bash
python manage.py migrate
python manage.py runserver
```

Backend API is available at `http://127.0.0.1:8000/api/…`

---

### 3. Frontend

```bash
cd ../frontend
npm install
```

#### Dev server

```bash
npm run dev
```

Open `http://localhost:5173`

#### Production build

```bash
npm run build
```

The `dist/` folder can be served by Django or any static host.

---

## 🔗 Available Scripts & Endpoints

### Frontend Routes

- `/` → Landing  
- `/signup`, `/login` → Auth pages  
- `/home` → Feed & search  
- `/create-post`, `/post/:id`, `/post/:id/edit`  
- `/profile` → User profile  

### Backend API (examples)

- `POST /api/accounts/register/`  
- `POST /api/accounts/login/`  
- `POST /api/accounts/logout/`  
- `GET  /api/accounts/check_authentication/`  
- `GET  /api/userprofile/profile-data/`  
- `GET  /api/posts/fetch_posts/`  
- `POST /api/posts/like/`  
- `POST /api/posts/comment/`  

See each app’s `urls.py` for full routes.

---

## 🎨 Styling

All custom styles live in `src/index.css` via Tailwind’s `@tailwind` and `@layer`.  
Theme colors and animations configured in `tailwind.config.js`.

---

## 🛠️ Contributing

1. Fork the repo  
2. Create a feature branch (`git checkout -b feat/XYZ`)  
3. Commit & push  
4. Open a PR  

Please follow code style and lint rules (`npm run lint`).

---
