import React, { useState } from 'react';
import { Calendar, Clock, User, Stethoscope, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  availability: string[];
  image: string;
}

export default function BookAppointment() {
  const { user } = useAuth();
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState<'video' | 'in-person'>('video');
  const [symptoms, setSymptoms] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [loading, setLoading] = useState(false);

  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialization: 'Internal Medicine',
      experience: '10+ years',
      rating: 4.9,
      availability: ['2024-01-15', '2024-01-16', '2024-01-17'],
      image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg'
    },
    {
      id: '2',
      name: 'Dr. Michael Brown',
      specialization: 'Cardiology',
      experience: '15+ years',
      rating: 4.8,
      availability: ['2024-01-15', '2024-01-18', '2024-01-19'],
      image: 'https://images.pexels.com/photos/6749777/pexels-photo-6749777.jpeg'
    },
    {
      id: '3',
      name: 'Dr. Emily Davis',
      specialization: 'Dermatology',
      experience: '8+ years',
      rating: 4.9,
      availability: ['2024-01-16', '2024-01-17', '2024-01-20'],
      image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg'
    }
  ];

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  const handleBookAppointment = async () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsBooked(true);
      setLoading(false);
    }, 2000);
  };

  if (isBooked) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Appointment Booked!
            </h2>
            <p className="text-gray-600 mb-6">
              Your appointment with {selectedDoctor?.name} has been confirmed for {selectedDate} at {selectedTime}.
            </p>
            <div className="space-y-3 text-left bg-gray-50 p-4 rounded-lg mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{appointmentType}</span>
              </div>
            </div>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Book an Appointment</h1>
          <p className="text-gray-600">Choose a doctor and schedule your consultation</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Doctor Selection */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Available Doctors</h2>
            <div className="space-y-4">
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  onClick={() => setSelectedDoctor(doctor)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedDoctor?.id === doctor.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-800">{doctor.name}</h3>
                        <div className="flex items-center space-x-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-gray-600">{doctor.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-1">
                          <Stethoscope className="h-4 w-4" />
                          <span>{doctor.specialization}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{doctor.experience}</span>
                        </div>
                      </div>
                      <div className="text-sm text-green-600">
                        Available: {doctor.availability.join(', ')}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Booking Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-fit">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Book Appointment</h3>
            
            {!selectedDoctor ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Select a doctor to continue</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-800">{selectedDoctor.name}</div>
                      <div className="text-sm text-gray-600">{selectedDoctor.specialization}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Appointment Type
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setAppointmentType('video')}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                        appointmentType === 'video'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Video Call
                    </button>
                    <button
                      onClick={() => setAppointmentType('in-person')}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-colors ${
                        appointmentType === 'in-person'
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      In Person
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a date</option>
                    {selectedDoctor.availability.map((date) => (
                      <option key={date} value={date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
                            selectedTime === time
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Symptoms/Reason for Visit
                  </label>
                  <textarea
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Describe your symptoms or reason for the appointment..."
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  onClick={handleBookAppointment}
                  disabled={!selectedDate || !selectedTime || loading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Booking...</span>
                    </div>
                  ) : (
                    'Book Appointment'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}