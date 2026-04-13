import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { t } = useLanguage();
  return (
    <div className="home-container" style={{ textAlign: 'center', padding: '50px 20px' }}>
      <h1 style={{ color: 'var(--primary-yellow)' }}>{t('notfound_title')}</h1>
      <p>{t('notfound_desc')}</p>
      <a href="/" className="start-btn" style={{ marginTop: '20px' }}>{t('notfound_return')}</a>
    </div>
  );
};

export default NotFound;
