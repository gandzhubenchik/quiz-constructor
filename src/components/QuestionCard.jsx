import { useState } from 'react';

import PropTypes from 'prop-types';
import { Send } from 'lucide-react';

const QuestionCard = ({ questionData, themeClass, onAnswerSubmit }) => {
  const [textAnswer, setTextAnswer] = useState('');

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textAnswer.trim()) return;
    onAnswerSubmit(textAnswer.trim());
    setTextAnswer('');
  };

  return (
    <div className={`card ${themeClass}`} style={!themeClass ? { borderColor: 'var(--accent)', borderWidth: '3px' } : {}}>
      <h3 style={{ fontSize: '22px', marginBottom: '20px' }}>{questionData.question}</h3>

      {questionData.type === 'select' && (
        <div className="options-grid">
          {questionData.options.map((option, idx) => (
            <button key={idx} className="option-btn" onClick={() => onAnswerSubmit(option)}>
              {option}
            </button>
          ))}
        </div>
      )}

      {questionData.type === 'boolean' && (
        <div className="options-grid">
          <button className="option-btn" style={{ textAlign: 'center' }} onClick={() => onAnswerSubmit('Правда')}>
            👍 Правда
          </button>
          <button className="option-btn" style={{ textAlign: 'center' }} onClick={() => onAnswerSubmit('Ложь')}>
            👎 Ложь
          </button>
        </div>
      )}

      {questionData.type === 'input' && (
        <form onSubmit={handleTextSubmit} style={{ marginTop: '20px' }}>
          <input 
            type="text" 
            className="input-field"
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Введите ваш ответ сюда..."
            autoFocus
          />
          <button type="submit" className="btn" style={{ marginTop: '12px', width: '100%' }}>
            <Send size={16} /> Отправить ответ
          </button>
        </form>
      )}
    </div>
  );
};

QuestionCard.propTypes = {
  questionData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['select', 'boolean', 'input']).isRequired,
    question: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string),
    answer: PropTypes.string.isRequired
  }).isRequired,
  themeClass: PropTypes.string,
  onAnswerSubmit: PropTypes.func.isRequired
};

export default QuestionCard;
