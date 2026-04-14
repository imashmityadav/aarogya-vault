🏥 Aarogya-vault
A smart healthcare ecosystem integrating patients, doctors, insurance provider, AI-based disease prediction, medication reminders, and secure medical record management.

📌 Abstract
AAROGYA VAULT is a comprehensive digital healthcare ecosystem designed to provide secure, scalable, and efficient management of medical data and to integrate patients, doctors, and insurance services into a unified platform. The system addresses the limitations of traditional paper-based healthcare record systems by introducing a centralized digital platform for storing, accessing, and managing medical information.

The platform integrates advanced functionalities such as AI-based disease prediction, smart medication reminders, and role-based access for healthcare professionals and insurance providers. Built on a three-tier architecture, the system ensures modularity, scalability, and security using modern web technologies including Node.js, Express.js, and MySQL. Authentication is implemented using JWT, while bcrypt ensures secure password storage.

The proposed system demonstrates improved accessibility, data security, and healthcare efficiency, establishing AAROGYA VAULT as a complete digital healthcare ecosystem.


🚀 Key Features:
📂 Digital Medical Record Management (Core System)
Secure storage and management of medical records
Centralized access to patient health history
Structured and organized data storage
Efficient retrieval and sharing of reports

👤 Patient Module
Secure registration and authentication
Upload and manage medical reports
Personalized healthcare dashboard

👨‍⚕️ Doctor Dashboard (Role-Based Access Control)
Separate authentication for doctors
Secure access to patient records
Controlled and authorized data visibility



🧠 AI-Based Disease Prediction
Predicts diseases based on user symptoms
Supports early diagnosis and medical assistance
Enhances decision-making in healthcare

📅 Appointment Booking System
Schedule appointments with doctors
View available time slots
Manage and track upcoming appointments
Improves doctor-patient coordination

⏰ Smart Medication Reminder
Automated alerts for medication schedules
Improves patient adherence to treatment
Reduces risk of missed doses

🔐 Security Framework
JWT-based authentication system
Password hashing using bcrypt
Secure API communication
Data integrity and protection mechanisms


🏗 System Architecture:
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


🗄 Database Design (ER Diagram):
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


🛠 Technology Stack:
-Frontend
  HTML5
  CSS3
  JavaScript
-Backend
  Node.js
  Express.js
-Database
  MySQL
-Security
  JSON Web Token (JWT)
  bcrypt
-Middleware
  Multer (File Upload)
  CORS


🔮 Future Enhancements:
-Insurance Integration System
-Cloud Deployment (AWS / Render)
-Mobile Application Development


