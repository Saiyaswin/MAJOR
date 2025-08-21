import React, { useState } from 'react';
import { FileText, Calendar, User, Stethoscope, Download, Eye, Filter } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MedicalRecord {
  id: string;
  date: string;
  doctorName: string;
  type: 'consultation' | 'prescription' | 'test-result' | 'diagnosis';
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'follow-up';
}

export default function MedicalHistory() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'consultation' | 'prescription' | 'test-result' | 'diagnosis'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const medicalRecords: MedicalRecord[] = [
    {
      id: '1',
      date: '2024-01-12',
      doctorName: 'Dr. Sarah Johnson',
      type: 'consultation',
      title: 'General Health Checkup',
      description: 'Routine annual physical examination. Blood pressure: 120/80. Heart rate: 72 bpm. No immediate concerns noted.',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-10',
      doctorName: 'Dr. Michael Brown',
      type: 'prescription',
      title: 'Medication Prescription',
      description: 'Prescribed Lisinopril 10mg daily for blood pressure management. Follow-up in 4 weeks.',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-08',
      doctorName: 'Lab Services',
      type: 'test-result',
      title: 'Blood Test Results',
      description: 'Complete blood count, lipid panel, and glucose levels. All values within normal range.',
      status: 'completed'
    },
    {
      id: '4',
      date: '2024-01-05',
      doctorName: 'Dr. Emily Davis',
      type: 'diagnosis',
      title: 'Hypertension Diagnosis',
      description: 'Diagnosed with Stage 1 hypertension. Recommended lifestyle changes and medication management.',
      status: 'follow-up'
    },
    {
      id: '5',
      date: '2024-01-15',
      doctorName: 'Dr. Sarah Johnson',
      type: 'consultation',
      title: 'Follow-up Consultation',
      description: 'Scheduled follow-up to review blood pressure medication effectiveness.',
      status: 'pending'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <User className="h-5 w-5" />;
      case 'prescription': return <FileText className="h-5 w-5" />;
      case 'test-result': return <Stethoscope className="h-5 w-5" />;
      case 'diagnosis': return <Eye className="h-5 w-5" />;
      default: return <FileText className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'follow-up': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-500';
      case 'prescription': return 'bg-green-500';
      case 'test-result': return 'bg-purple-500';
      case 'diagnosis': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredRecords = medicalRecords.filter(record => {
    const matchesFilter = selectedFilter === 'all' || record.type === selectedFilter;
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Medical History</h1>
          <p className="text-gray-600">View and manage your complete medical records</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mb-8 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Records</option>
                  <option value="consultation">Consultations</option>
                  <option value="prescription">Prescriptions</option>
                  <option value="test-result">Test Results</option>
                  <option value="diagnosis">Diagnoses</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="h-4 w-4" />
              <span>Export Records</span>
            </button>
          </div>
        </div>

        {/* Records List */}
        <div className="space-y-4">
          {filteredRecords.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">No Records Found</h3>
              <p className="text-gray-600">No medical records match your current filter criteria.</p>
            </div>
          ) : (
            filteredRecords.map((record) => (
              <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 ${getTypeColor(record.type)} rounded-lg text-white`}>
                      {getTypeIcon(record.type)}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{record.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(record.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="h-4 w-4" />
                          <span>{record.doctorName}</span>
                        </div>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                        {record.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Eye className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 leading-relaxed">{record.description}</p>
              </div>
            ))
          )}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {['consultation', 'prescription', 'test-result', 'diagnosis'].map((type) => {
            const count = medicalRecords.filter(record => record.type === type).length;
            return (
              <div key={type} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 ${getTypeColor(type)} rounded-lg text-white`}>
                    {getTypeIcon(type)}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{type.replace('-', ' ')}s</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Health Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 mt-8 border border-blue-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Current Conditions</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Stage 1 Hypertension (Under treatment)</li>
                <li>• No known allergies</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Current Medications</h4>
              <ul className="space-y-1 text-sm text-gray-600">
                <li>• Lisinopril 10mg daily</li>
                <li>• Multivitamin daily</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}