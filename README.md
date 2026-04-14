🏥 AAROGYA VAULT
A Smart Digital Healthcare Ecosystem for Secure Medical Record Management and to integrate patients, doctors, and insurance services into a unified platform.



📌 Abstract
AAROGYA VAULT is a comprehensive digital healthcare ecosystem designed to provide secure, scalable, and efficient management of medical data and to integrate patients, doctors, and insurance services into a unified platform. The system addresses the limitations of traditional paper-based healthcare record systems by introducing a centralized digital platform for storing, accessing, and managing medical information.

The platform integrates advanced functionalities such as AI-based disease prediction, smart medication reminders, and role-based access for healthcare professionals and insurance providers. Built on a three-tier architecture, the system ensures modularity, scalability, and security using modern web technologies including Node.js, Express.js, and MySQL. Authentication is implemented using JWT, while bcrypt ensures secure password storage.

The proposed system demonstrates improved accessibility, data security, and healthcare efficiency, establishing AAROGYA VAULT as a complete digital healthcare ecosystem.



🚀 Key Features:
👤 Patient Module
Secure user registration and login
Upload and manage medical reports
Access health records anytime
Personalized dashboard

👨‍⚕️ Doctor Dashboard (Role-Based Access)
Separate login for doctors
Secure access to patient medical records
Role-based authorization system

📂 Digital Medical Record Management
Secure storage of medical records and reports
Centralized access to complete health history
Organized and structured data management
Easy retrieval and sharing of reports
Eliminates dependency on paper-based records

🧠 AI-Based Disease Prediction
Predicts possible diseases based on symptoms
Supports early diagnosis and decision-making
Enhances healthcare accessibility

📅 Appointment Booking System
Schedule appointments with doctors
View available time slots
Manage and track upcoming appointments
Improves doctor-patient coordination

⏰ Smart Medication Reminder
Automated reminders for medication schedules
Improves treatment adherence
Reduces chances of missed doses

🔐 Security Features
JWT (JSON Web Token) Authentication
Password hashing using bcrypt
Protected API routes
Secure data handling

📂 Data Management
File upload using Multer
Structured MySQL database
Efficient data retrieval system



🏗 System Architecture
AAROGYA VAULT follows a Three-Tier Client–Server Architecture:

Presentation Layer:
User Interface (HTML, CSS, JavaScript)
Handles user interaction and data visualization

Application Layer:
Backend server (Node.js + Express.js)
Handles business logic and API processing

Data Layer:
MySQL Database
File storage system for medical records



🗄 Database Design:
The database follows a relational model with structured entity relationships:

Entities:
Users
Reports
Doctors
Insurance (future scope)

Relationships:
One user can have multiple reports
Doctors can access multiple patient records
Reports are linked to specific users



🔄 System Workflow:
-User authentication using JWT
-Password validation using bcrypt
-Medical records uploaded and stored
-AI module processes health inputs
-Doctor accesses reports (authorized access)
-Reminder system notifies users



🛠 Technology Stack
Frontend:
HTML5
CSS3
JavaScript

Backend:
Node.js
Express.js

Database:
MySQL

Security:
JSON Web Token (JWT)
bcrypt

Middleware:
Multer (File Upload)
CORS



📊 Key Highlights
- Core Medical Record Management System
- AI-Integrated Healthcare Platform
- Role-Based Access Control
- Secure Authentication System
- Scalable Architecture



🔮 Future Enhancements
Insurance Integration System
Cloud Deployment (AWS / Render)
Mobile Application Development


