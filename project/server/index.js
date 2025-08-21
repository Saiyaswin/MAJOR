import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'your-secret-key-change-in-production';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (replace with real database in production)
const users = [
  {
    id: '1',
    name: 'Demo Patient',
    email: 'patient@demo.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 'patient'
  },
  {
    id: '2',
    name: 'Dr. Demo Doctor',
    email: 'doctor@demo.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 'doctor',
    specialization: 'Internal Medicine'
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@demo.com',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password123
    role: 'admin'
  }
];

const appointments = [];
const consultations = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, specialization } = req.body;

    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      ...(specialization && { specialization })
    };

    users.push(newUser);

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        ...(newUser.specialization && { specialization: newUser.specialization })
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        ...(user.specialization && { specialization: user.specialization })
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.specialization && { specialization: user.specialization })
    }
  });
});

// Symptom checker routes
app.post('/api/symptom-checker', authenticateToken, (req, res) => {
  try {
    const { symptoms, severity, duration } = req.body;
    
    // Simulate AI analysis
    const analysis = {
      conditions: [
        {
          name: 'Common Cold',
          probability: 75,
          severity: 'low',
          description: 'Viral upper respiratory infection'
        },
        {
          name: 'Flu',
          probability: 45,
          severity: 'medium',
          description: 'Influenza viral infection'
        }
      ],
      recommendations: [
        'Rest and stay hydrated',
        'Consider over-the-counter remedies',
        'Consult a doctor if symptoms worsen'
      ],
      urgency: 'low'
    };

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
});

// Appointment routes
app.get('/api/appointments', authenticateToken, (req, res) => {
  const userAppointments = appointments.filter(apt => 
    req.user.role === 'patient' ? apt.patientId === req.user.id :
    req.user.role === 'doctor' ? apt.doctorId === req.user.id :
    true // Admin sees all
  );
  
  res.json(userAppointments);
});

app.post('/api/appointments', authenticateToken, (req, res) => {
  try {
    const { doctorId, date, time, type, symptoms } = req.body;
    
    const newAppointment = {
      id: uuidv4(),
      patientId: req.user.id,
      doctorId,
      date,
      time,
      type,
      symptoms,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    appointments.push(newAppointment);
    res.status(201).json(newAppointment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to book appointment' });
  }
});

// Doctor routes
app.get('/api/doctors', (req, res) => {
  const doctors = users.filter(u => u.role === 'doctor').map(doctor => ({
    id: doctor.id,
    name: doctor.name,
    specialization: doctor.specialization,
    rating: Math.random() * 0.5 + 4.5, // Random rating between 4.5-5.0
    experience: Math.floor(Math.random() * 15 + 5) + '+ years'
  }));
  
  res.json(doctors);
});

// Admin routes
app.get('/api/admin/stats', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const stats = {
    totalUsers: users.length,
    totalDoctors: users.filter(u => u.role === 'doctor').length,
    totalPatients: users.filter(u => u.role === 'patient').length,
    totalAppointments: appointments.length,
    completedAppointments: appointments.filter(a => a.status === 'completed').length
  };

  res.json(stats);
});

app.get('/api/admin/users', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  const sanitizedUsers = users.map(user => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    specialization: user.specialization,
    createdAt: user.createdAt || new Date().toISOString()
  }));

  res.json(sanitizedUsers);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'TeleMedCart API is running' });
});

app.listen(PORT, () => {
  console.log(`TeleMedCart API server running on http://localhost:${PORT}`);
  console.log('Demo credentials:');
  console.log('Patient: patient@demo.com / password123');
  console.log('Doctor: doctor@demo.com / password123');
  console.log('Admin: admin@demo.com / password123');
});