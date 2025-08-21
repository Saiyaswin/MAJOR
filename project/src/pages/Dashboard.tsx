import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  MessageSquare, 
  FileText, 
  Users, 
  Activity,
  Clock,
  TrendingUp,
  Bell
} from 'lucide-react';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  type: 'video' | 'in-person';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    completedConsultations: 0,
    pendingReviews: 0,
    upcomingAppointments: 0
  });

  useEffect(() => {
    // Mock data - in real app, fetch from API
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        patientName: 'John Smith',
        doctorName: 'Dr. Sarah Johnson',
        date: '2024-01-15',
        time: '10:00 AM',
        status: 'upcoming',
        type: 'video'
      },
      {
        id: '2',
        patientName: 'Emily Davis',
        doctorName: 'Dr. Michael Brown',
        date: '2024-01-12',
        time: '2:30 PM',
        status: 'completed',
        type: 'video'
      }
    ];

    setAppointments(mockAppointments);
    setStats({
      totalAppointments: 25,
      completedConsultations: 18,
      pendingReviews: 3,
      upcomingAppointments: 4
    });
  }, []);

  const quickActions = [
    {
      title: 'Symptom Checker',
      description: 'Check your symptoms with AI',
      icon: Activity,
      link: '/symptom-checker',
      color: 'bg-blue-500'
    },
    {
      title: 'Book Appointment',
      description: 'Schedule a consultation',
      icon: Calendar,
      link: '/book-appointment',
      color: 'bg-green-500'
    },
    {
      title: 'Medical History',
      description: 'View your medical records',
      icon: FileText,
      link: '/medical-history',
      color: 'bg-purple-500'
    },
    {
      title: 'Messages',
      description: 'Chat with your doctors',
      icon: MessageSquare,
      link: '/messages',
      color: 'bg-orange-500'
    }
  ];

  const doctorActions = [
    {
      title: 'Patient Queue',
      description: 'View waiting patients',
      icon: Users,
      link: '/patient-queue',
      color: 'bg-blue-500'
    },
    {
      title: 'Schedule',
      description: 'Manage your appointments',
      icon: Calendar,
      link: '/doctor-schedule',
      color: 'bg-green-500'
    },
    {
      title: 'Patient Records',
      description: 'Access medical records',
      icon: FileText,
      link: '/patient-records',
      color: 'bg-purple-500'
    },
    {
      title: 'Consultations',
      description: 'Active consultations',
      icon: MessageSquare,
      link: '/consultations',
      color: 'bg-orange-500'
    }
  ];

  const actions = user?.role === 'doctor' ? doctorActions : quickActions;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'doctor' ? 
              'Manage your patients and consultations' : 
              'Your health journey starts here'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Appointments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completedConsultations}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">{stats.upcomingAppointments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Bell className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {actions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1"
                >
                  <div className="flex items-center">
                    <div className={`p-3 ${action.color} rounded-lg`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{action.title}</h3>
                      <p className="text-sm text-gray-600">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent Appointments */}
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Appointments</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-6">
                {appointments.length > 0 ? (
                  <div className="space-y-4">
                    {appointments.slice(0, 3).map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            {user?.role === 'doctor' ? appointment.patientName : appointment.doctorName}
                          </p>
                          <p className="text-sm text-gray-600">
                            {appointment.date} at {appointment.time}
                          </p>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              appointment.status === 'upcoming'
                                ? 'bg-blue-100 text-blue-800'
                                : appointment.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </div>
                        {appointment.status === 'upcoming' && (
                          <Link
                            to={`/video-consult/${appointment.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Join Call
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No appointments yet</p>
                    <Link
                      to="/book-appointment"
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Book your first appointment
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}