import React, { useState } from 'react';
import axios from 'axios';
import StudyDashboard from './components/StudyDashboard';
import QuizGenerator from './components/QuizGenerator';
import Recommendations from './components/Recommendations';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'quiz' | 'recommendations'>('dashboard');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              🧠 AI Study Assistant
            </h1>
            <nav className="flex space-x-4">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-100'}`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'quiz' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-100'}`}
              >
                Quiz Generator
              </button>
              <button
                onClick={() => setActiveTab('recommendations')}
                className={`px-4 py-2 rounded-lg ${activeTab === 'recommendations' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-blue-100'}`}
              >
                Recommendations
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && <StudyDashboard />}
        {activeTab === 'quiz' && <QuizGenerator />}
        {activeTab === 'recommendations' && <Recommendations />}
      </main>
    </div>
  );
}

export default App;
