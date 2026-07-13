import { useState, useEffect } from 'react';
import { initialQuizzes } from './mockData';
import QuizPlay from './components/QuizPlay';
import QuizForm from './components/QuizForm';
import { Play, Sparkles, Trophy, Palette, Trash2 } from 'lucide-react';

function App() {
  const [quizzes, setQuizzes] = useState(() => {
    const savedQuizzes = localStorage.getItem('wayquiz_quizzes');
    return savedQuizzes ? JSON.parse(savedQuizzes) : initialQuizzes;
  });

  const [highScores, setHighScores] = useState(() => {
    const savedScores = localStorage.getItem('wayquiz_scores');
    return savedScores ? JSON.parse(savedScores) : {};
  });

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    localStorage.setItem('wayquiz_quizzes', JSON.stringify(quizzes));
  }, [quizzes]);

  useEffect(() => {
    localStorage.setItem('wayquiz_scores', JSON.stringify(highScores));
  }, [highScores]);

  const handleSaveQuiz = (newQuiz) => {
    setQuizzes([newQuiz, ...quizzes]);
    setIsCreating(false);
  };

  const handleUpdateHighScore = (quizId, score) => {
    setHighScores(prev => {
      const currentRecord = prev[quizId] || 0;
      if (score > currentRecord) {
        return { ...prev, [quizId]: score };
      }
      return prev;
    });
  };

  const handleDeleteQuiz = (quizId, quizTitle) => {
    const confirmDelete = window.confirm(`Вы действительно хотите безвозвратно удалить тест "${quizTitle}"?`);
    
    if (confirmDelete) {
      setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.id !== quizId));
      setHighScores(prevScores => {
        const updatedScores = { ...prevScores };
        delete updatedScores[quizId];
        return updatedScores;
      });
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1 style={{ fontSize: '3rem', color: 'var(--accent)', textShadow: '0 0 15px rgba(139, 92, 246, 0.4)', margin: '10px 0' }}>
          👾 WayQuiz
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Создавайте кастомные тесты и соревнуйтесь на выживание!</p>
      </header>

      {currentQuiz && (
        <QuizPlay 
          quiz={currentQuiz} 
          currentHighScore={highScores[currentQuiz.id] || 0}
          onQuizFinish={(score) => handleUpdateHighScore(currentQuiz.id, score)}
          onBackToMenu={() => setCurrentQuiz(null)} 
        />
      )}

      {isCreating && (
        <QuizForm onSave={handleSaveQuiz} onCancel={() => setIsCreating(false)} />
      )}

      {!currentQuiz && !isCreating && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h2>🎯 Выберите испытание</h2>
            <button className="btn" onClick={() => setIsCreating(true)}>
              <Sparkles size={16} /> Создать свой тест
            </button>
          </div>

          <div className="grid">
            {quizzes.map((quiz) => {
              const record = highScores[quiz.id];
              const themeClass = 
                quiz.theme === 'cyberpunk' ? 'theme-cyberpunk' : 
                quiz.theme === 'space' ? 'theme-space' : 
                quiz.theme === 'nature' ? 'theme-nature' : 
                quiz.theme === 'retro' ? 'theme-retro' : 
                quiz.theme === 'grammo' ? 'theme-grammo' : '';
              const isBaseQuiz = quiz.id === 'quiz-1' || quiz.id === 'quiz-2';

              return (
                <div 
                  key={quiz.id} 
                  className={`card ${themeClass}`} 
                  style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative' }}
                >
                  {!isBaseQuiz && (
                    <button 
                      onClick={() => handleDeleteQuiz(quiz.id, quiz.title)}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        color: 'var(--error)',
                        transition: 'background 0.2s, transform 0.2s'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                      title="Удалить этот тест"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}

                  <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '20px', paddingRight: !isBaseQuiz ? '30px' : '0' }}>
                      {quiz.title}
                    </h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '14px', minHeight: '40px' }}>{quiz.description}</p>
                    
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '10px' }}>
                      <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px' }}>
                        Вопросов: {quiz.questions.length}
                      </span>
                      {quiz.theme && quiz.theme !== 'default' && (
                        <span style={{ fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Palette size={12} /> {quiz.theme}
                        </span>
                      )}
                      {record !== undefined && (
                        <span style={{ fontSize: '12px', background: '#1e3a8a', color: '#93c5fd', padding: '4px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Trophy size={12} /> Рекорд: {record}/{quiz.questions.length}
                        </span>
                      )}
                    </div>
                  </div>
                  <button className="btn" style={{ marginTop: '20px', width: '100%' }} onClick={() => setCurrentQuiz(quiz)}>
                    <Play size={16} /> Начать игру
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
