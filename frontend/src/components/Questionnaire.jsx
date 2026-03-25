import React, { useState, useEffect, useCallback, useRef } from 'react';
import { makeUnauthenticatedRequest, makeAuthenticatedRequest } from '../utils/csrf';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../QuestionnaireStyles.css';
import { useLanguage } from '../context/LanguageContext';

const PROGRESS_KEY = 'assessmentProgress';

function Questionnaire() {
  const { t, language, qdict, odict, qtx, qtipx, otx } = useLanguage();
  const [question, setQuestion] = useState(null);
  const [count, setCount] = useState(0);
  const [responses, setResponses] = useState([]);
  const [answeredIds, setAnsweredIds] = useState([]);
  const [vulnerabilityTopics, setVulnerabilityTopics] = useState([]);
  const [probedCategories, setProbedCategories] = useState({ PHISH: false, SCAM: false, PASS: false, MAL: false, DATA: false, SOC: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [transitioning, setTransitioning] = useState(false);
  const [currentSelection, setCurrentSelection] = useState(null);
  const [questionHistory, setQuestionHistory] = useState([]);
  const [selections, setSelections] = useState({});
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [optionOrderMap, setOptionOrderMap] = useState({});
  const [currentState, setCurrentState] = useState(null);
  const [resumed, setResumed] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const initializedRef = useRef(false);

  // --- Progress Persistence Helpers ---
  const saveProgress = useCallback((overrides = {}) => {
    try {
      const data = {
        responses: overrides.responses ?? responses,
        answeredIds: overrides.answeredIds ?? answeredIds,
        count: overrides.count ?? count,
        currentState: overrides.currentState ?? currentState,
        question: overrides.question ?? question,
        questionHistory: overrides.questionHistory ?? questionHistory,
        optionOrderMap: overrides.optionOrderMap ?? optionOrderMap,
        selections: overrides.selections ?? selections,
        probedCategories: overrides.probedCategories ?? probedCategories,
        vulnerabilityTopics: overrides.vulnerabilityTopics ?? vulnerabilityTopics,
        savedAt: Date.now(),
      };
      sessionStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    } catch { /* quota exceeded — non-critical */ }
  }, [responses, answeredIds, count, currentState, question, questionHistory, optionOrderMap, selections, probedCategories, vulnerabilityTopics]);

  const clearProgress = useCallback(() => {
    try {
      sessionStorage.removeItem(PROGRESS_KEY);
      sessionStorage.removeItem('assessmentSelections');
    } catch {}
  }, []);

  const loadSavedProgress = useCallback(() => {
    try {
      const raw = sessionStorage.getItem(PROGRESS_KEY);
      if (!raw) return null;
      const saved = JSON.parse(raw);
      // Only restore if there is meaningful progress (at least 1 answer) and not too stale (2 hours)
      if (saved && saved.count > 0 && saved.question && (Date.now() - saved.savedAt) < 2 * 60 * 60 * 1000) {
        return saved;
      }
      // Stale progress — clear it
      sessionStorage.removeItem(PROGRESS_KEY);
      return null;
    } catch {
      return null;
    }
  }, []);

  // --- Core Handlers ---
  const handleAnswer = async (answer) => {
    const newResponses = [...responses, { questionId: question.id, category: question.category, answer }];
    setResponses(newResponses);
    const newAnswered = [...answeredIds, question.codeId];
    setAnsweredIds(newAnswered);
    const newCount = count + 1;
    setCount(newCount);
    
    // Legacy client-side tracking (kept for compatibility if needed, but logic moved to backend)
    const opt = question.options.find((o) => o.value === answer);
    const riskScore = opt?.riskScore ?? 0;
    const catShort = question.category.startsWith('Phishing') ? 'PHISH'
      : question.category.startsWith('Scams') ? 'SCAM'
      : question.category.startsWith('Passwords') ? 'PASS'
      : question.category.startsWith('Malware') ? 'MAL'
      : question.category.startsWith('Data') ? 'DATA'
      : question.category.startsWith('Social') ? 'SOC'
      : '';
    if (catShort && probedCategories[catShort] === false) {
      setProbedCategories({ ...probedCategories, [catShort]: true });
    }
    if (riskScore > 1) {
      const vt = [...vulnerabilityTopics];
      if (!vt.includes(catShort)) {
        vt.push(catShort);
      }
      setVulnerabilityTopics(vt);
    }

    if (newCount >= 30) {
      try {
        if (isAuthenticated) {
          const res = await makeAuthenticatedRequest('post', '/api/assessment/submit', { responses: newResponses, profile: profile || {}, state: currentState });
          clearProgress();
          navigate('/assessment-results', { state: { result: res.data } });
        } else {
          const res = await makeUnauthenticatedRequest('post', '/api/assessment/submit-guest', { responses: newResponses, profile: profile || {}, state: currentState });
          clearProgress();
          navigate('/assessment-results', { state: { result: res.data } });
        }
        return;
      } catch (e) {
        // Save progress so user can retry submission
        saveProgress({ responses: newResponses, answeredIds: newAnswered, count: newCount });
        navigate('/assessment-results', { state: { result: null } });
        return;
      }
    }
    try {
      setTransitioning(true);
      
      const res = await makeUnauthenticatedRequest('post', '/api/assessment/next', {
        profile: profile || {},
        previous: { questionCodeId: question.codeId, answerValue: answer },
        answeredCodeIds: newAnswered,
        count: newCount,
        state: currentState,
        // Legacy params
        probedCategories,
        vulnerabilityTopics,
      });
      
      const nextQ = res.data.question;
      const nextState = res.data.state;

      const newHistory = [...questionHistory];
      newHistory[newCount] = nextQ;

      setQuestion(nextQ);
      setCurrentState(nextState);
      setCurrentSelection(null);
      setQuestionHistory(newHistory);
      setTransitioning(false);

      // Persist progress after each answer
      saveProgress({
        responses: newResponses,
        answeredIds: newAnswered,
        count: newCount,
        currentState: nextState,
        question: nextQ,
        questionHistory: newHistory,
      });
    } catch (e) {
      // Save what we have so far even on fetch failure
      saveProgress({ responses: newResponses, answeredIds: newAnswered, count: newCount });
      setError(t('failed_fetch_next'));
      setTransitioning(false);
    }
  };

  const recomputeFromResponses = (list) => {
    const probed = { PHISH: false, SCAM: false, PASS: false, MAL: false, DATA: false, SOC: false };
    const vuln = [];
    list.forEach((r) => {
      const catShort = r.category.startsWith('Phishing') ? 'PHISH'
        : r.category.startsWith('Scams') ? 'SCAM'
        : r.category.startsWith('Passwords') ? 'PASS'
        : r.category.startsWith('Malware') ? 'MAL'
        : r.category.startsWith('Data') ? 'DATA'
        : r.category.startsWith('Social') ? 'SOC' : '';
      if (catShort && probed[catShort] === false) probed[catShort] = true;
    });
    setProbedCategories(probed);
    setVulnerabilityTopics(vuln);
  };

  const handleBack = () => {
    if (transitioning) return;
    if (count === 0) return;
    const newCount = count - 1;
    const newResponses = responses.slice(0, newCount);
    const newAnswered = answeredIds.slice(0, newCount);
    setResponses(newResponses);
    setAnsweredIds(newAnswered);
    setCount(newCount);
    recomputeFromResponses(newResponses);
    const prevQ = questionHistory[newCount] || questionHistory[newCount - 1];
    if (prevQ) {
      setQuestion(prevQ);
      const prevSel = newResponses[newCount - 1]?.answer || null;
      setCurrentSelection(prevSel);
    }
    // Save progress after going back
    saveProgress({ responses: newResponses, answeredIds: newAnswered, count: newCount, question: prevQ });
  };

  const handleNextClick = () => {
    if (transitioning) return;
    if (!currentSelection) return;
    handleAnswer(currentSelection);
  };

  // --- Initialization: restore saved progress or start fresh ---
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    let loadedProfile = null;
    try {
      const raw = sessionStorage.getItem('assessmentData');
      if (raw) {
        loadedProfile = JSON.parse(raw);
        setProfile(loadedProfile);
      }
      const sel = sessionStorage.getItem('assessmentSelections');
      if (sel) {
        setSelections(JSON.parse(sel));
      }
    } catch {}

    // Try to restore saved progress
    const saved = loadSavedProgress();
    if (saved) {
      setResponses(saved.responses || []);
      setAnsweredIds(saved.answeredIds || []);
      setCount(saved.count || 0);
      setCurrentState(saved.currentState || null);
      setQuestion(saved.question || null);
      setQuestionHistory(saved.questionHistory || []);
      setOptionOrderMap(saved.optionOrderMap || {});
      setSelections(prev => ({ ...prev, ...(saved.selections || {}) }));
      setProbedCategories(saved.probedCategories || { PHISH: false, SCAM: false, PASS: false, MAL: false, DATA: false, SOC: false });
      setVulnerabilityTopics(saved.vulnerabilityTopics || []);
      setCurrentSelection(null);
      setResumed(true);
      setLoading(false);
      // Clear the resumed indicator after a short delay
      setTimeout(() => setResumed(false), 3000);
      return;
    }

    // No saved progress — start fresh
    const loadFirst = async () => {
      try {
        const res = await makeUnauthenticatedRequest('post', '/api/assessment/next', {
          profile: loadedProfile || {},
          previous: null,
          answeredCodeIds: [],
          count: 0,
          probedCategories: { PHISH: false, SCAM: false, PASS: false, MAL: false, DATA: false, SOC: false },
          vulnerabilityTopics: [],
        });
        
        const nextQ = res.data.question;
        const nextState = res.data.state;

        setQuestion(nextQ);
        setCurrentState(nextState);
        setQuestionHistory([nextQ]);
        setLoading(false);
      } catch (e) {
        setError(t('failed_start_assessment'));
        setLoading(false);
      }
    };
    loadFirst();
  }, [loadSavedProgress, t]);

  useEffect(() => {
    if (question?.codeId) {
      setCurrentSelection(selections[question.codeId] || null);
    }
  }, [question, selections]);

  useEffect(() => {
    try {
      sessionStorage.setItem('assessmentSelections', JSON.stringify(selections));
    } catch {}
  }, [selections]);

  const shuffleArray = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };

  useEffect(() => {
    if (!question?.codeId || !Array.isArray(question.options)) {
      setShuffledOptions([]);
      return;
    }
    const cid = question.codeId;
    const values = question.options.map((o) => o.value);
    let order = optionOrderMap[cid];
    if (!order) {
      order = shuffleArray(values);
      setOptionOrderMap((prev) => ({ ...prev, [cid]: order }));
    }
    const orderedOpts = order
      .map((v) => question.options.find((o) => o.value === v))
      .filter(Boolean);
    setShuffledOptions(orderedOpts);
  }, [question, optionOrderMap]);

  if (loading) return (
    <div className="questionnaire-container">
      <div className="loading">{t('loading_questions')}</div>
    </div>
  );
  if (error) return (
    <div className="questionnaire-container">
      <div className="loading">{error}</div>
    </div>
  );
  if (!question) return (
    <div className="questionnaire-container">
      <div className="loading">{t('no_question_available')}</div>
    </div>
  );

  const progress = ((count) / 30) * 100;
  const displayNum = Math.min(count + 1, 30);

  return (
    <div className="questionnaire-container">
      {resumed && (
        <div className="resume-banner">
          {t('progress_restored') || 'Your progress has been restored.'}
        </div>
      )}
      <div className="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <h2>{t('question_label')} {displayNum} {t('of_30')}</h2>
      <div className="question-card">
        <h3>{(qdict?.[language]?.[question.codeId]?.text) || qtx(language, question.text)}</h3>
        
        <div className="tip-box">
          <p><strong>{t('tip')}</strong> {(qdict?.[language]?.[question.codeId]?.tip) || qtipx(language, question.tip)}</p>
        </div>
        
        <div className="options">
          {(shuffledOptions.length ? shuffledOptions : question.options).map((option, index) => (
            <button 
              key={index}
              className={`option-button${transitioning ? ' disabled' : ''}${currentSelection === option.value ? ' selected' : ''}`}
              disabled={transitioning}
              onClick={() => {
                setCurrentSelection(option.value);
                if (question?.codeId) {
                  setSelections((prev) => ({ ...prev, [question.codeId]: option.value }));
                }
              }}
            >
              {(qdict?.[language]?.[question.codeId]?.options?.[option.value]) || (odict?.[language]?.[option.value]) || (otx(language, option.text))}
            </button>
          ))}
        </div>
        <div className="nav-buttons">
          <button className="option-button" onClick={handleBack} disabled={transitioning || count === 0}>{t('back')}</button>
          <button className="option-button" onClick={handleNextClick} disabled={transitioning || !currentSelection}>{t('next')}</button>
        </div>
        {transitioning && (
          <div className="card-overlay">
            <div className="overlay-spinner" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;
