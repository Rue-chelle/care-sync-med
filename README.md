
# 🏥 AloraMed — Smart Clinic Management System

AloraMed is a modern, web-based clinic booking and health records system designed to streamline patient care, reduce missed follow-ups, and digitize clinic workflows for doctors, patients, and administrators.

Built using **Lovable** (React-based UI builder) and **Supabase** (backend-as-a-service), the system provides secure authentication, real-time scheduling, role-based access, and a fully functional Super Admin control panel.

---

## 🔗 Live Demo

Explore the full app here:  
**[care-sync-med.lovable.app](https://care-sync-med.lovable.app)**

---

## 📌 Key Features

> Features designed in collaboration with ChatGPT's recommendations for real-world clinic efficiency:

### 👥 Multi-Role Access  
- **Patient**: Book appointments, view prescriptions, access medical history  
- **Doctor**: Manage schedule, write e-prescriptions, view patient records  
- **Admin**: Manage users, view appointments, broadcast announcements  
- **Super Admin**: Global access to all clinics, subscriptions, and system analytics  

### 📅 Smart Appointment Scheduling  
- Book, reschedule, cancel appointments  
- Doctor availability controls  
- Prevent overlapping bookings

### 💬 Automated Notifications *(integration-ready)*  
- SMS, WhatsApp, or Email reminders for appointments  
- Alerts for follow-ups or missed visits  
- Admin announcements to staff or patients

### 🧾 Digital Health Records  
- E-prescriptions linked to appointments  
- Secure patient visit history  
- File upload support for lab results or documents

### 🛡️ Super Admin Panel  
- View/manage all clinics  
- Monitor system usage  
- Reset or impersonate accounts  
- Subscription management (Stripe-ready)

### 📊 System Analytics *(for Admin & Super Admin)*  
- Active users, booking trends  
- Clinic usage stats  
- Doctor performance insights

### 🔒 Secure Auth & Access  
- JWT-based authentication via Supabase  
- Password resets  
- Role-restricted access to sensitive data

---

## 🧪 Demo Login Credentials

Test the platform using demo roles:

- **Patient**: `patient@aloramedapp.com` / `password123`  
- **Doctor**:  
`doctor@aloramedapp.com` / `password123`  
- **Admin**:
`admin@aloramedapp.com` / `password123`  
- **Super Admin**: `superadmin@aloramedapp.com` / `password123`

---

## 🛠 Tech Stack

- **Frontend**: [Lovable](https://lovable.so) (React-based UI builder)  
- **Backend**: [Supabase](https://supabase.io) (PostgreSQL + Auth + Storage)  
- **Auth**: Supabase JWT Authentication  
- **Database**: PostgreSQL (via Supabase)  
- **Deployment**: Lovable 

---

## ⚙️ How to Set Up Locally

1. **Clone this repository**
```bash
# Step 1: Clone the repository using the project's Git URL.
git clone https://github.com/Rue-chelle/aloramedapp.git

# Step 2: Navigate to the project directory.
cd aloramedapp

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

##🚀 Future Roadmap

- Mobile app version (Flutter)

- Teleconsultation integration (Zoom, Jitsi)

- Google Calendar sync for doctors

- Secure doctor-patient chat

- Language & accessibility options

- AI-assisted diagnosis suggestions (experimental)



---

## 👩‍💻 Project Author

**Michelle Rufaro Samuriwo (aka Alora)**
**Software Developer | Innovator**

- **GitHub**: @Rue-chelle

- **Email**: misshie21@gmail.com 



---
