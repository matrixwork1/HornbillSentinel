import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './QuestionnaireStyles.css';
import { useLanguage } from '../../context/LanguageContext';

const ageOptions = [
  'Under 18',
  '18 - 24',
  '25 - 34',
  '35 - 44',
  '45 - 54',
  '55 - 64',
  '65 or above',
];

const genderOptions = ['Male', 'Female', 'Prefer not to say'];

const educationOptions = [
  'No formal education',
  'Primary/Secondary School',
  'Diploma/Certificate',
  "Bachelor's Degree",
  "Master's Degree",
  'Doctorate (Ph.D.) or higher',
  'Other',
];

const occupationOptions = [
  'Agriculture/Farming/Fisheries',
  'Banking/Finance/Insurance',
  'Biotechnology/Life Sciences/Healthcare',
  'Building/Construction/Engineering',
  'Business/Management/Consulting',
  'Creative/Design/Media',
  'Customer Service/Sales/Retail',
  'Education/Academia',
  'Government/Public Safety/Legal',
  'IT/Computers/Electronics',
  'Manufacturing/Operations/Logistics',
  'Hospitality/Food Services',
  'Student',
  'Retired',
  'Other (please specify)',
  'Unemployed',
];

const OPTION_KEY_MAP = {
  ageGroup: {
    'Under 18': 'opt_age_under_18',
    '18 - 24': 'opt_age_18_24',
    '25 - 34': 'opt_age_25_34',
    '35 - 44': 'opt_age_35_44',
    '45 - 54': 'opt_age_45_54',
    '55 - 64': 'opt_age_55_64',
    '65 or above': 'opt_age_65_plus',
  },
  gender: {
    'Male': 'opt_gender_male',
    'Female': 'opt_gender_female',
    'Prefer not to say': 'opt_gender_na',
  },
  education: {
    'No formal education': 'opt_edu_none',
    'Primary/Secondary School': 'opt_edu_school',
    'Diploma/Certificate': 'opt_edu_diploma',
    "Bachelor's Degree": 'opt_edu_bachelor',
    "Master's Degree": 'opt_edu_master',
    'Doctorate (Ph.D.) or higher': 'opt_edu_phd',
    'Other': 'opt_other',
  },
  occupation: {
    'Agriculture/Farming/Fisheries': 'opt_occ_agriculture',
    'Banking/Finance/Insurance': 'opt_occ_banking',
    'Biotechnology/Life Sciences/Healthcare': 'opt_occ_biotech',
    'Building/Construction/Engineering': 'opt_occ_construction',
    'Business/Management/Consulting': 'opt_occ_business',
    'Creative/Design/Media': 'opt_occ_creative',
    'Customer Service/Sales/Retail': 'opt_occ_customer',
    'Education/Academia': 'opt_occ_education',
    'Government/Public Safety/Legal': 'opt_occ_gov',
    'IT/Computers/Electronics': 'opt_occ_it',
    'Manufacturing/Operations/Logistics': 'opt_occ_manufacturing',
    'Hospitality/Food Services': 'opt_occ_hospitality',
    'Student': 'opt_occ_student',
    'Retired': 'opt_occ_retired',
    'Other (please specify)': 'opt_occ_other',
    'Unemployed': 'opt_occ_unemployed',
  },
};

function PersonalInfo() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ ageGroup: '', gender: '', education: '', occupation: '' });

  const optionSets = [
    { label: t('personal_age_label'), key: 'ageGroup', options: ageOptions },
    { label: t('personal_gender_label'), key: 'gender', options: genderOptions },
    { label: t('personal_education_label'), key: 'education', options: educationOptions },
    { label: t('personal_occupation_label'), key: 'occupation', options: occupationOptions },
  ];

  const current = optionSets[step];

  const handleSelect = (value) => {
    setForm({ ...form, [current.key]: value });
  };

  const handleNext = () => {
    if (!form[current.key]) return;
    if (step < optionSets.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const existing = sessionStorage.getItem('assessmentData');
        const base = existing ? JSON.parse(existing) : {};
        const data = { ...base, ...form, usedBefore: true };
        sessionStorage.setItem('assessmentData', JSON.stringify(data));
      } catch {}
      navigate('/questionnaire');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="questionnaire-container">
      <div className="question-card">
        <h2>{current.label}</h2>
        <div className="options">
          {current.options.map((opt) => {
            const i18nKey = OPTION_KEY_MAP[current.key]?.[opt];
            const label = i18nKey ? t(i18nKey) : opt;
            return (
              <button
                key={opt}
                className={`option-button${form[current.key] === opt ? ' selected' : ''}`}
                onClick={() => handleSelect(opt)}
              >
                {label}
              </button>
            );
          })}
        </div>
        <div className="navigation-buttons" style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button className="option-button" onClick={handleBack} disabled={step === 0}>{t('back')}</button>
          <button className="option-button" onClick={handleNext}>{t('next')}</button>
        </div>
        <div className="progress-bar" style={{ marginTop: '24px' }}>
          <div className="progress" style={{ width: `${((step + 1) / optionSets.length) * 100}%` }}></div>
        </div>
      </div>
    </div>
  );
}

export default PersonalInfo;
