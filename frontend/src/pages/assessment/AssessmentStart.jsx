import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionnaireStyles.css';
import { useLanguage } from '../../context/LanguageContext';

function AssessmentStart() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleChoice = (usedBefore) => {
    const data = { usedBefore };
    try {
      sessionStorage.setItem('assessmentData', JSON.stringify(data));
    } catch {}
    if (usedBefore) {
      navigate('/personal-info');
    } else {
      navigate('/dashboard', { state: { skippedAssessment: true } });
    }
  };

  return (
    <div className="questionnaire-container">
      <div className="question-card">
        <h2>{t('assessment_start_title')}</h2>
        <div className="options">
          <button className="option-button" onClick={() => handleChoice(true)}>{t('yes')}</button>
          <button className="option-button" onClick={() => handleChoice(false)}>{t('no')}</button>
        </div>
      </div>
    </div>
  );
}

export default AssessmentStart;
