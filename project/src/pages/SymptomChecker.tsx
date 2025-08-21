import React, { useState } from 'react';
import { Brain, MessageSquare, Send, User, Bot, AlertCircle, CheckCircle, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface SymptomAnalysis {
  conditions: Array<{
    name: string;
    probability: number;
    severity: 'low' | 'medium' | 'high';
    description: string;
  }>;
  recommendations: string[];
  urgency: 'low' | 'medium' | 'high';
}

export default function SymptomChecker() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI health assistant. I can help analyze your symptoms and provide medical guidance. Please describe what symptoms you\'re experiencing.',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<SymptomAnalysis | null>(null);

  const symptomDatabase = {
    'fever': ['common cold', 'flu', 'covid-19', 'bacterial infection'],
    'headache': ['tension headache', 'migraine', 'sinusitis', 'dehydration'],
    'cough': ['common cold', 'flu', 'covid-19', 'bronchitis', 'allergies'],
    'sore throat': ['common cold', 'flu', 'strep throat', 'allergies'],
    'fatigue': ['flu', 'covid-19', 'anemia', 'depression', 'thyroid issues'],
    'nausea': ['food poisoning', 'gastroenteritis', 'pregnancy', 'migraine'],
    'chest pain': ['heart attack', 'angina', 'panic attack', 'muscle strain'],
    'shortness of breath': ['asthma', 'covid-19', 'heart condition', 'anxiety'],
    'dizziness': ['dehydration', 'low blood pressure', 'inner ear infection'],
    'abdominal pain': ['gastroenteritis', 'appendicitis', 'food poisoning']
  };

  const analyzeSymptoms = (symptomText: string): SymptomAnalysis => {
    const text = symptomText.toLowerCase();
    const foundSymptoms = Object.keys(symptomDatabase).filter(symptom => 
      text.includes(symptom)
    );

    const conditionCounts: { [key: string]: number } = {};
    
    foundSymptoms.forEach(symptom => {
      symptomDatabase[symptom].forEach(condition => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
    });

    const conditions = Object.entries(conditionCounts)
      .map(([name, count]) => ({
        name,
        probability: Math.min(count * 25, 85),
        severity: count >= 3 ? 'high' : count >= 2 ? 'medium' : 'low' as 'low' | 'medium' | 'high',
        description: getConditionDescription(name)
      }))
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 4);

    const hasHighRiskSymptoms = text.includes('chest pain') || text.includes('shortness of breath') || text.includes('severe');
    const urgency = hasHighRiskSymptoms ? 'high' : conditions.length > 2 ? 'medium' : 'low' as 'low' | 'medium' | 'high';

    const recommendations = generateRecommendations(foundSymptoms, urgency);

    return { conditions, recommendations, urgency };
  };

  const getConditionDescription = (condition: string): string => {
    const descriptions: { [key: string]: string } = {
      'common cold': 'A viral infection affecting the nose and throat',
      'flu': 'Influenza - a respiratory illness caused by flu viruses',
      'covid-19': 'Coronavirus disease caused by SARS-CoV-2',
      'bacterial infection': 'Infection caused by harmful bacteria',
      'tension headache': 'Most common type of headache, often stress-related',
      'migraine': 'Severe headache often accompanied by nausea and sensitivity to light',
      'sinusitis': 'Inflammation of the sinuses',
      'dehydration': 'Inadequate fluid intake or excessive fluid loss',
      'bronchitis': 'Inflammation of the bronchial tubes',
      'allergies': 'Immune system reaction to allergens',
      'strep throat': 'Bacterial infection of the throat',
      'anemia': 'Low red blood cell count or hemoglobin',
      'depression': 'Mental health condition affecting mood and energy',
      'thyroid issues': 'Problems with thyroid gland function',
      'food poisoning': 'Illness from contaminated food',
      'gastroenteritis': 'Inflammation of stomach and intestines',
      'pregnancy': 'Pregnancy-related symptoms',
      'heart attack': 'Medical emergency requiring immediate attention',
      'angina': 'Chest pain due to reduced blood flow to heart',
      'panic attack': 'Sudden episode of intense anxiety',
      'muscle strain': 'Injury to muscle or tendon',
      'asthma': 'Respiratory condition causing breathing difficulties',
      'heart condition': 'Various heart-related medical conditions',
      'anxiety': 'Mental health condition causing excessive worry',
      'low blood pressure': 'Blood pressure below normal range',
      'inner ear infection': 'Infection affecting balance and hearing',
      'appendicitis': 'Inflammation of the appendix - requires medical attention'
    };
    return descriptions[condition] || 'Condition requiring medical evaluation';
  };

  const generateRecommendations = (symptoms: string[], urgency: 'low' | 'medium' | 'high'): string[] => {
    const recommendations: string[] = [];
    
    if (urgency === 'high') {
      recommendations.push('🚨 Seek immediate medical attention or call emergency services');
      recommendations.push('Do not delay - visit the emergency room if symptoms worsen');
    } else if (urgency === 'medium') {
      recommendations.push('📞 Contact your healthcare provider within 24 hours');
      recommendations.push('Consider scheduling an appointment with a doctor');
    } else {
      recommendations.push('💊 Monitor symptoms and consider over-the-counter remedies');
      recommendations.push('Contact a healthcare provider if symptoms persist or worsen');
    }

    if (symptoms.includes('fever')) {
      recommendations.push('🌡️ Rest and stay hydrated, monitor temperature regularly');
    }
    
    if (symptoms.includes('cough')) {
      recommendations.push('💧 Stay hydrated and consider using a humidifier');
    }

    recommendations.push('📋 Keep a symptom diary to track changes');
    recommendations.push('🏥 Book a video consultation for professional medical advice');

    return recommendations;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: currentMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setLoading(true);

    // Simulate AI processing time
    setTimeout(() => {
      const newAnalysis = analyzeSymptoms(currentMessage);
      setAnalysis(newAnalysis);

      let botResponse = '';
      
      if (newAnalysis.conditions.length > 0) {
        botResponse = `Based on your symptoms, here are some possible conditions I've identified:\n\n`;
        
        newAnalysis.conditions.forEach((condition, index) => {
          botResponse += `${index + 1}. **${condition.name}** (${condition.probability}% match)\n   ${condition.description}\n\n`;
        });

        botResponse += `**Urgency Level:** ${newAnalysis.urgency.toUpperCase()}\n\n`;
        botResponse += `**Recommendations:**\n`;
        newAnalysis.recommendations.forEach(rec => {
          botResponse += `• ${rec}\n`;
        });
      } else {
        botResponse = 'I need more specific information about your symptoms. Could you describe what you\'re feeling in more detail? For example, mention specific symptoms like fever, headache, cough, etc.';
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
      setLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getUrgencyColor = (urgency: 'low' | 'medium' | 'high') => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-2 mb-4">
            <Brain className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">AI Symptom Checker</h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Describe your symptoms and get AI-powered medical insights. Our system analyzes your input 
            against a comprehensive medical knowledge base to provide preliminary guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 h-96 lg:h-[600px] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Brain className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Medical AI Assistant</h3>
                    <p className="text-sm text-green-600 flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      Online
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`flex max-w-xs lg:max-w-md ${
                        message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                      } space-x-2`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.sender === 'user' ? 'bg-blue-600' : 'bg-green-100'
                      }`}>
                        {message.sender === 'user' ? (
                          <User className="h-5 w-5 text-white" />
                        ) : (
                          <Bot className="h-5 w-5 text-green-600" />
                        )}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <div className="whitespace-pre-line text-sm">
                          {message.content}
                        </div>
                        <div className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <Bot className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 p-4">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe your symptoms..."
                    className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || loading}
                    className="bg-blue-600 text-white rounded-xl px-6 py-3 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {analysis && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Analysis Summary</h3>
                
                <div className={`p-4 rounded-xl border ${getUrgencyColor(analysis.urgency)} mb-4`}>
                  <div className="flex items-center space-x-2">
                    {analysis.urgency === 'high' ? (
                      <AlertCircle className="h-5 w-5" />
                    ) : (
                      <CheckCircle className="h-5 w-5" />
                    )}
                    <span className="font-medium">
                      Urgency: {analysis.urgency.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-700">Possible Conditions:</h4>
                  {analysis.conditions.map((condition, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium text-sm">{condition.name}</span>
                        <span className="text-sm text-blue-600">{condition.probability}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${condition.probability}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Next Steps</h3>
              <p className="text-gray-600 mb-4">
                For a professional medical consultation and personalized treatment plan:
              </p>
              <Link
                to="/book-appointment"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Book Video Consultation
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Disclaimer</h3>
              <p className="text-sm text-gray-600">
                This AI tool is for informational purposes only and should not replace professional medical advice. 
                Always consult with a healthcare provider for accurate diagnosis and treatment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}