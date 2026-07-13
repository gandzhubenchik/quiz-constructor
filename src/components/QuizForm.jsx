import React, { Component } from 'react'; 
import PropTypes from 'prop-types';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';

class QuizForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      description: '',
      theme: 'default', 
      questions: [],
      currentQuestionText: '',
      currentType: 'select',
      currentOptions: ['', '', '', ''],
      currentAnswer: ''
    };
    this.questionInputRef = React.createRef();
  }


  handleMetaChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleOptionChange = (index, value) => {
    const updatedOptions = [...this.state.currentOptions];
    updatedOptions[index] = value;
    this.setState({ currentOptions: updatedOptions });
  };

  addQuestion = (e) => {
    e.preventDefault();
    const { currentQuestionText, currentType, currentOptions, currentAnswer } = this.state;

    if (!currentQuestionText || !currentAnswer) {
      alert('Заполните текст вопроса и правильный ответ!');
      return;
    }

    const newQuestion = {
      id: 'q-' + Date.now(),
      type: currentType,
      question: currentQuestionText,
      answer: currentAnswer.trim()
    };

    if (currentType === 'select') {
      newQuestion.options = currentOptions.filter(opt => opt.trim() !== '');
    } else if (currentType === 'boolean') {
      newQuestion.options = ['Правда', 'Ложь'];
    }

    this.setState((prevState) => ({
      questions: [...prevState.questions, newQuestion],
      currentQuestionText: '',
      currentOptions: ['', '', '', ''],
      currentAnswer: ''
    }));

    if (this.questionInputRef.current) {
      this.questionInputRef.current.focus();
    }
  };

  removeQuestion = (id) => {
    this.setState({
      questions: this.state.questions.filter(q => q.id !== id)
    });
  };

  handleSubmitQuiz = () => {
    const { title, description, theme, questions } = this.state;
    if (!title || questions.length === 0) {
      alert('Укажите название теста и добавьте хотя бы 1 вопрос!');
      return;
    }
    this.props.onSave({
      id: 'quiz-' + Date.now(),
      title,
      description,
      theme,
      questions
    });
  };

  render() {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <button className="btn btn-secondary" onClick={this.props.onCancel} style={{ marginBottom: '20px' }}>
          <ArrowLeft size={16} /> Назад
        </button>
        <h2>🛠 Конструктор теста</h2>

        <div className="form-group">
          <label>Название квиза</label>
          <input 
            type="text" 
            name="title" 
            className="input-field" 
            value={this.state.title} 
            onChange={this.handleMetaChange} 
            placeholder="Например: Знаток Кинематографа"
          />
        </div>

        <div className="form-group">
          <label>Описание</label>
          <textarea 
            name="description" 
            className="input-field" 
            value={this.state.description} 
            onChange={this.handleMetaChange} 
            placeholder="Краткое описание квиза"
          />
        </div>

        <div className="form-group">
          <label>Визуальная тема карточек</label>
          <select 
            name="theme" 
            className="input-field" 
            value={this.state.theme} 
            onChange={this.handleMetaChange}
          >
            <option value="default">Стандартная темная</option>
            <option value="cyberpunk">⚡ Неоновый Киберпанк</option>
            <option value="space">🚀 Космическая туманность</option>
          </select>
        </div>

        <div style={{ borderTop: '2px dashed #334155', margin: '20px 0', paddingTop: '20px' }}>
          <h3>➕ Добавить вопрос</h3>
          
          <div className="form-group">
            <label>Тип вопроса</label>
            <select 
              className="input-field" 
              value={this.state.currentType} 
              onChange={(e) => this.setState({ currentType: e.target.value, currentAnswer: '' })}
            >
              <option value="select">Выбор из вариантов</option>
              <option value="boolean">Правда / Ложь</option>
              <option value="input">Ввод текстового ответа</option>
            </select>
          </div>

          <div className="form-group">
            <label>Текст вопроса</label>
            <input 
              type="text" 
              ref={this.questionInputRef}
              className="input-field" 
              value={this.state.currentQuestionText} 
              onChange={(e) => this.setState({ currentQuestionText: e.target.value })}
              placeholder="Введите формулировку вопроса"
            />
          </div>

          {this.state.currentType === 'select' && (
            <div className="form-group">
              <label>Варианты ответов</label>
              {this.state.currentOptions.map((opt, idx) => (
                <input 
                  key={idx}
                  type="text"
                  className="input-field"
                  style={{ marginBottom: '8px' }}
                  value={opt}
                  onChange={(e) => this.handleOptionChange(idx, e.target.value)}
                  placeholder={`Вариант ${idx + 1}`}
                />
              ))}
            </div>
          )}

          <div className="form-group">
            <label>Правильный ответ</label>
            <input 
              type="text" 
              className="input-field" 
              value={this.state.currentAnswer} 
              onChange={(e) => this.setState({ currentAnswer: e.target.value })}
              placeholder="Должен в точности совпадать с верным вариантом"
            />
          </div>

          <button className="btn" onClick={this.addQuestion} style={{ width: '100%' }}>
            <Plus size={16} /> Добавить вопрос
          </button>
        </div>

        {this.state.questions.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h3>📋 Добавленные вопросы ({this.state.questions.length})</h3>
            {this.state.questions.map((q, index) => (
              <div key={q.id} style={{ display: 'flex', justifyContent: 'space-between', background: '#0f172a', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
                <span>{index + 1}. {q.question} ({q.answer})</span>
                <Trash2 size={16} color="#ef4444" style={{ cursor: 'pointer' }} onClick={() => this.removeQuestion(q.id)} />
              </div>
            ))}

            <button className="btn" onClick={this.handleSubmitQuiz} style={{ width: '100%', background: '#10b981', marginTop: '20px' }}>
              <Save size={16} /> Сохранить и опубликовать тест
            </button>
          </div>
        )}
      </div>
    );
  }
}

QuizForm.propTypes = {
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};

export default QuizForm;
