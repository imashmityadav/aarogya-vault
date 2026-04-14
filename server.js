const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

const SECRET = process.env.JWT_SECRET || "aarogya_secret_key";

// DATABASE CONNECTION
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "Dishant@06",
  database: process.env.DB_NAME || "aarogya_vault",
});

db.connect(err => {
    if (err) throw err;
    console.log("MySQL Connected");
});

// JWT Auth Middleware
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Missing authorization header" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid authorization format" });
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}

// REGISTER
app.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }

  const normalizedRole = (role || "patient").toLowerCase();
  const allowedRoles = ["patient", "doctor", "insurance"];
  if (!allowedRoles.includes(normalizedRole)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const hash = await bcrypt.hash(password, 10);

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, hash, normalizedRole],
    (err) => {
      if (err) return res.status(500).json({ message: "Could not register user" });
      res.json({ message: "Registered Successfully" });
    }
  );
});

// LOGIN
app.post("/login", (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
    if (err) return res.status(500).json({ message: "Login failed" });
    if (!result || result.length === 0) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid password" });

    if (role && role !== user.role) {
      return res.status(403).json({ message: `Role mismatch. Your account is registered as '${user.role}'.` });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "12h" });
    const safeUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.json({ token, user: safeUser });
  });
});

// LIST DOCTORS
app.get("/doctors", verifyToken, authorizeRoles("patient"), (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE role = 'doctor'",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Could not load doctors" });
      res.json(results);
    }
  );
});

// LIST PATIENTS (for doctors)
app.get("/patients", verifyToken, authorizeRoles("doctor"), (req, res) => {
  db.query(
    "SELECT id, name, email FROM users WHERE role = 'patient'",
    (err, results) => {
      if (err) return res.status(500).json({ message: "Could not load patients" });
      
      // Add dummy data fields (in real app, fetch from separate patients table)
      const patientsWithData = results.map((p, idx) => ({
        ...p,
        age: [45, 32, 28][idx % 3] || 40,
        condition: ["Hypertension", "Diabetes", "Asthma"][idx % 3] || "General",
        lastVisit: new Date(Date.now() - (idx + 1) * 24 * 60 * 60 * 1000).toISOString()
      }));
      
      res.json(patientsWithData);
    }
  );
});

// FILE UPLOAD
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage });

app.post("/upload", verifyToken, upload.single("report"), (req, res) => {
  const userId = req.user.id;
  let targetUserId = userId;

  // Doctors can upload reports on behalf of a patient (patientId field)
  if (req.user.role === "doctor" && req.body.patientId) {
    targetUserId = Number(req.body.patientId);
  }

  if (!req.file) return res.status(400).json({ message: "Report file is required" });

  db.query(
    "INSERT INTO reports (user_id, filename, file_size) VALUES (?, ?, ?)",
    [targetUserId, req.file.filename, req.file.size],
    (err) => {
      if (err) return res.status(500).json({ message: "Could not save report" });
      res.json({ message: "File uploaded" });
    }
  );
});

// GET REPORTS
app.get("/reports", verifyToken, (req, res) => {
  const userId = req.user.id;

  // Doctors and insurance agents can request a specific patient's reports by query param
  const patientId = req.query.patientId ? Number(req.query.patientId) : null;
  let queryUserId = userId;

  if (patientId) {
    if (req.user.role === "doctor" || req.user.role === "insurance") {
      queryUserId = patientId;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }
  }

  db.query(
    "SELECT * FROM reports WHERE user_id = ? ORDER BY upload_date DESC",
    [queryUserId],
    (err, results) => {
      if (err) return res.status(500).json({ message: "Could not fetch reports" });
      res.json(results);
    }
  );
});

// DASHBOARD STATS
app.get("/dashboard-stats", verifyToken, (req, res) => {
  const userId = req.user.id;

  if (req.user.role === "patient") {
    db.query(
      "SELECT COUNT(*) as totalReports, MAX(upload_date) as recentActivity, SUM(file_size) as totalSize FROM reports WHERE user_id = ?",
      [userId],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Could not load stats" });
        res.json(result[0]);
      }
    );
    return;
  }

  // Simple doctor stats: appointments today / pending
  if (req.user.role === "doctor") {
    db.query(
      "SELECT COUNT(*) as totalAppointments, SUM(status='pending') as pendingAppointments FROM appointments WHERE doctor_id = ?",
      [userId],
      (err, result) => {
        if (err) return res.status(500).json({ message: "Could not load stats" });
        res.json(result[0]);
      }
    );
    return;
  }

  // Insurance stats: total claims and pending
  if (req.user.role === "insurance") {
    db.query(
      "SELECT COUNT(*) as totalClaims, SUM(status='Pending') as pendingClaims FROM insurance_claims",
      (err, result) => {
        if (err) return res.status(500).json({ message: "Could not load stats" });
        res.json(result[0]);
      }
    );
    return;
  }

  res.status(400).json({ message: "Unsupported role" });
});

// Appointments - patient books an appointment with a doctor
app.post("/appointment", verifyToken, authorizeRoles("patient"), (req, res) => {
  const patientId = req.user.id;
  const { doctorId, date } = req.body;

  if (!doctorId || !date) {
    return res.status(400).json({ message: "Doctor and date are required" });
  }

  db.query(
    "INSERT INTO appointments (patient_id, doctor_id, appointment_date) VALUES (?, ?, ?)",
    [patientId, doctorId, date],
    (err) => {
      if (err) return res.status(500).json({ message: "Could not book appointment" });
      res.json({ message: "Appointment booked" });
    }
  );
});

// Get appointments (patient or doctor)
app.get("/appointments", verifyToken, (req, res) => {
  const userId = req.user.id;

  if (req.user.role === "patient") {
    db.query(
      "SELECT a.id, a.appointment_date, a.status, u.name as doctorName FROM appointments a JOIN users u ON a.doctor_id = u.id WHERE a.patient_id = ? ORDER BY a.appointment_date DESC",
      [userId],
      (err, results) => {
        if (err) return res.status(500).json({ message: "Could not load appointments" });
        res.json(results);
      }
    );
    return;
  }

  if (req.user.role === "doctor") {
    db.query(
      "SELECT a.id, a.appointment_date, a.status, u.name as patientName FROM appointments a JOIN users u ON a.patient_id = u.id WHERE a.doctor_id = ? ORDER BY a.appointment_date DESC",
      [userId],
      (err, results) => {
        if (err) return res.status(500).json({ message: "Could not load appointments" });
        res.json(results);
      }
    );
    return;
  }

  res.status(403).json({ message: "Forbidden" });
});

// Update appointment status (doctor only)
app.put("/appointment/status", verifyToken, authorizeRoles("doctor"), (req, res) => {
  const { appointmentId, status } = req.body;
  const allowed = ["pending", "accepted", "rejected"];
  if (!appointmentId || !allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid appointment data" });
  }

  db.query(
    "UPDATE appointments SET status = ? WHERE id = ? AND doctor_id = ?",
    [status, appointmentId, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Could not update appointment" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Appointment not found" });
      res.json({ message: "Appointment updated" });
    }
  );
});

// Medicine Reminders
app.post("/reminder", verifyToken, authorizeRoles("patient"), (req, res) => {
  const userId = req.user.id;
  const { medicine, time } = req.body;
  if (!medicine || !time) {
    return res.status(400).json({ message: "Medicine and time are required" });
  }

  db.query(
    "INSERT INTO reminders (user_id, medicine, time) VALUES (?, ?, ?)",
    [userId, medicine, time],
    (err) => {
      if (err) return res.status(500).json({ message: "Could not add reminder" });
      res.json({ message: "Reminder added" });
    }
  );
});

app.get("/reminders", verifyToken, authorizeRoles("patient"), (req, res) => {
  const userId = req.user.id;
  db.query(
    "SELECT * FROM reminders WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Could not load reminders" });
      res.json(result);
    }
  );
});

// Insurance Claims
app.post("/insurance/claim", verifyToken, authorizeRoles("patient"), (req, res) => {
  const userId = req.user.id;
  const { policy, hospital } = req.body;
  if (!policy || !hospital) {
    return res.status(400).json({ message: "Policy number and hospital are required" });
  }

  db.query(
    "INSERT INTO insurance_claims (user_id, policy_number, hospital, status) VALUES (?, ?, ?, ?)",
    [userId, policy, hospital, "Pending"],
    (err) => {
      if (err) return res.status(500).json({ message: "Could not submit claim" });
      res.json({ message: "Claim submitted" });
    }
  );
});

app.get("/insurance/claims", verifyToken, (req, res) => {
  if (req.user.role === "patient") {
    db.query(
      "SELECT * FROM insurance_claims WHERE user_id = ? ORDER BY created_at DESC",
      [req.user.id],
      (err, results) => {
        if (err) return res.status(500).json({ message: "Could not load claims" });
        res.json(results);
      }
    );
    return;
  }

  if (req.user.role === "insurance") {
    db.query(
      "SELECT c.*, u.name as patientName, u.email as patientEmail FROM insurance_claims c JOIN users u ON c.user_id = u.id ORDER BY c.created_at DESC",
      (err, results) => {
        if (err) return res.status(500).json({ message: "Could not load claims" });
        res.json(results);
      }
    );
    return;
  }

  res.status(403).json({ message: "Forbidden" });
});

app.put("/insurance/claim/:id/status", verifyToken, authorizeRoles("insurance"), (req, res) => {
  const claimId = Number(req.params.id);
  const { status } = req.body;
  const allowed = ["Pending", "Approved", "Rejected"];
  if (!allowed.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    "UPDATE insurance_claims SET status = ? WHERE id = ?",
    [status, claimId],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Could not update claim" });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Claim not found" });
      res.json({ message: "Claim updated" });
    }
  );
});

//AI Prediction
app.post("/predict",(req,res)=>{

const {symptoms}=req.body;

let risk="Low";

if(symptoms.includes("fever"))
risk="Moderate";

if(symptoms.includes("chest pain"))
risk="High";

res.json({risk});

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));