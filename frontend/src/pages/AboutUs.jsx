import React from 'react';
import '../AboutContactStyles.css';
import { useLanguage } from '../context/LanguageContext';

const AboutUs = () => {
  const { t } = useLanguage();
  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <h1>{t('about_title')}</h1>
        <p>{t('about_subtitle')}</p>
      </div>

      {/* Mission Section */}
      <section className="content-section">
        <h2>{t('about_mission_title')}</h2>
        <p>{t('about_mission_body')}</p>
      </section>

      {/* Story Section */}
      <section className="content-section">
        <h2>{t('about_story_title')}</h2>
        <p>{t('about_story_body')}</p>
      </section>

      {/* Approach Section */}
      <section className="content-section">
        <h2>{t('about_approach_title')}</h2>
        <p>{t('about_approach_body1')}</p>
        <p>{t('about_approach_body2')}</p>
      </section>

      {/* Team Section */}
      <section className="content-section">
        <h2>{t('about_team_title')}</h2>
        <div className="team-grid">
          {/* Founder & Lead Researcher */}
          <div className="team-member">
            <div className="team-member-image image-tristan"></div>
            <h3>Mr. Tristan Lo</h3>
            <p className="team-title">{t('role_founder')}</p>
            <p>
              BSc (Hons) Computer Science graduate from UTS, Mr. Tristan spearheads the research
              and full stack development of the platform architecture.
            </p>
          </div>

          {/* Supervisor & Advisor */}
          <div className="team-member">
            <div className="team-member-image image-gary"></div>
            <h3>Ts. Dr. Gary Loh Chee Wyai</h3>
            <p className="team-title">{t('role_supervisor')}</p>
            <p>
              An expert in cybersecurity, Dr. Loh ensures methodological rigour
              and academic integrity throughout the project.
            </p>
          </div>

          <div className="team-member">
            <div className="team-member-image image-dicky"></div>
            <h3>Mr. Dicky Teo</h3>
            <p className="team-title">{t('role_backend')}</p>
            <p>
              Mr. Dicky focuses on the constant remodelling of the questionnaire contents to
              keep up with the latest research evidence in human-centric cybersecurity.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
