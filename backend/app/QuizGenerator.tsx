import React, { useState } from 'react';
import axios from 'axios';

interface QuizQuestion {
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

const QuizGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const [questionCount, setQuestionCount] = useState(5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});

  const generateQuiz = async () => {
    if (!topic.trim()) {
      alert('Please enter a topic');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/api/quiz/generate', {
        topic,
        difficulty,
        question_count: questionCount
      }, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      setQuestions(response.data);
      setSelectedAnswers({});
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('Failed to generate quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionIndex: number, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">📝 Quiz Generator</h2>
      
      {/* Quiz Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Machine Learning, Calculus, History"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Difficulty
          </label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Number of Questions
          </label>
          <input
            type="number"
            min="1"
            max="20"
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      
      <button
        onClick={generateQuiz}
        disabled={loading}
        className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 disabled:bg-blue-300 mb-8"
      >
        {loading ? 'Generating Quiz...' : 'Generate Quiz with AI'}
      </button>
      
      {/* Quiz Questions */}
      {questions.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Your Quiz</h3>
            <div className="text-lg font-bold text-blue-600">
              Score: {calculateScore()}%
            </div>
          </div>
          
          {questions.map((question, index) => (
            <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">
                Q{index + 1}: {question.question}
              </h4>
              
              <div className="space-y-2 mb-4">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={optionIndex}
                    onClick={() => handleAnswerSelect(index, option)}
                    className={`w-full p-3 text-left rounded-lg border ${selectedAnswers[index] === option
                      ? question.correct_answer === option
                        ? 'bg-green-100 border-green-500'
                        : 'bg-red-100 border-red-500'
                      : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {selectedAnswers[index] && (
                <div className="text-sm text-gray-600">
                  <strong>Explanation:</strong> {question.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizGenerator;
