import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import QuestionCard from './QuestionCard';
import { Heart, Timer, Award, RotateCcw, Home, Trophy } from 'lucide-react';

const QuizPlay = ({ quiz, currentHighScore, onQuizFinish, onBackToMenu }) => {
  const [step, setStep] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(15);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  const currentQuestion = quiz.questions[step] || null;

  const timerPercentage = (timeLeft / 15) * 100;
  const handleWrongAnswer = () => {
    const nextLives = lives - 1;
    setLives(nextLives);
    if (nextLives <= 0 || step + 1 >= quiz.questions.length) {
      setIsGameOver(true);
      onQuizFinish(score);
    } else {
      goToNextStep();
    }
  };
  
  const goToNextStep = () => {
    setTimeLeft(15);
    setStep(prev => prev + 1);
  };
  useEffect(() => {
    if (isGameOver) return;
    if (timeLeft === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleWrongAnswer();
      return;
    }
    const timerId = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timerId);
  }, [timeLeft, isGameOver]);

  useEffect(() => {
    if (lives <= 0 || step >= quiz.questions.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsGameOver(true);
      onQuizFinish(score);
    }
  }, [lives, step, quiz.questions.length, score]);


    const handleAnswerSubmit = (userAnswer) => {
    let isCorrect = false;
    
    if (currentQuestion) {
      const normalizedUserAnswer = userAnswer
        .toLowerCase()
        .replace(/ё/g, 'е');

      const normalizedCorrectAnswer = currentQuestion.answer
        .toLowerCase()
        .replace(/ё/g, 'е');

      isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
    }

    const nextScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(nextScore);
    else setLives(prev => prev - 1);

    const nextStep = step + 1;
    const nextLives = isCorrect ? lives : lives - 1;

    if (nextLives <= 0 || nextStep >= quiz.questions.length) {
      setIsGameOver(true);
      onQuizFinish(nextScore);
    } else {
      setTimeLeft(15);
      setStep(nextStep);
    }
  };



  const restartQuiz = () => {
    setStep(0);
    setLives(3);
    setTimeLeft(15);
    setScore(0);
    setIsGameOver(false);
  };

const themeClass = 
  quiz.theme === 'cyberpunk' ? 'theme-cyberpunk' : 
  quiz.theme === 'space' ? 'theme-space' : 
  quiz.theme === 'nature' ? 'theme-nature' : 
  quiz.theme === 'retro' ? 'theme-retro' : 
  quiz.theme === 'grammo' ? 'theme-grammo' : '';

  if (isGameOver || !currentQuestion) {
    const isNewRecord = score > currentHighScore;

    return (
      <div className={`card ${themeClass}`} style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <Award size={64} style={{ display: 'block', margin: '0 auto 16px auto' }} />
        <h2>Тест завершен!</h2>
        
        {isNewRecord && (
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', color: 'var(--success)', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
            <Trophy size={16} /> Новый рекорд! 🎉
          </div>
        )}

        <p>{lives <= 0 ? '❌ Закончились все жизни!' : '🎉 Вы дошли до конца!'}</p>
        <p style={{ fontSize: '24px', fontWeight: 'bold', margin: '15px 0' }}>
          Результат: {score} из {quiz.questions.length}
        </p>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '20px' }}>
          Предыдущий лучший результат: {currentHighScore}
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '24px' }}>
          <button className="btn" onClick={restartQuiz}><RotateCcw size={16} /> Повторить</button>
          <button className="btn btn-secondary" onClick={onBackToMenu}><Home size={16} /> В меню</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2 style={{ marginBottom: '10px' }}>{quiz.title}</h2>
      
      <div className="game-status">
        <div className="hearts">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} fill={i < lives ? 'var(--error)' : 'none'} size={24} style={{ marginRight: '4px' }} />
          ))}
        </div>
        <div>Вопрос {step + 1} из {quiz.questions.length}</div>
        <div className="timer" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Timer size={18} />
          {timeLeft} сек.
        </div>
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar-fill" style={{ width: `${timerPercentage}%` }}></div>
      </div>
      <br />

      <QuestionCard 
        questionData={currentQuestion} 
        themeClass={themeClass} 
        onAnswerSubmit={handleAnswerSubmit} 
      />
    </div>
  );
};

QuizPlay.propTypes = {
  quiz: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    theme: PropTypes.string,
    questions: PropTypes.array.isRequired
  }).isRequired,
  currentHighScore: PropTypes.number.isRequired,
  onQuizFinish: PropTypes.func.isRequired,
  onBackToMenu: PropTypes.func.isRequired
};

export default QuizPlay;
