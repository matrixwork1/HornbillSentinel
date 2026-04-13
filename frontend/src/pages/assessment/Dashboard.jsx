import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DashboardStyles.css';
import { useLanguage } from '../../context/LanguageContext';
import { makeAuthenticatedRequest } from '../../utils/csrf';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [history, setHistory] = useState([]);
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const { t, formatDate } = useLanguage();

  const typeLabel = (s) => {
    if (s === 'Security Savvy') return t('type_security_savvy');
    if (s === 'Careless Clicker') return t('type_careless_clicker');
    if (s === 'Password Reuser') return t('type_password_reuser');
    if (s === 'Update Avoider') return t('type_update_avoider');
    if (s === 'Oversharer') return t('type_oversharer');
    if (s === 'New to Digital') return t('type_new_to_digital');
    return s;
  };

  const recLabel = (s) => {
    if (s === 'Start with basic device safety tutorials') return t('dash_rec_start_tutorials');
    if (s === 'Learn about strong passwords and account security') return t('dash_rec_passwords_security');
    if (s === 'Seek guidance before clicking links or downloading apps') return t('dash_rec_guidance_links_apps');
    return s;
  };

  const skippedAssessment = location.state?.skippedAssessment;

  useEffect(() => {
    const loadData = async () => {
      if (skippedAssessment) {
        setUserData({
          digitalType: 'New to Digital',
          securityScore: 0,
          lastAssessment: new Date().toISOString(),
          recommendations: [
            'Start with basic device safety tutorials',
            'Learn about strong passwords and account security',
            'Seek guidance before clicking links or downloading apps',
          ],
        });
        setLoading(false);
        return;
      }
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      try {
        const [latestRes, historyRes] = await Promise.allSettled([
          makeAuthenticatedRequest('get', '/api/assessment/overview'),
          makeAuthenticatedRequest('get', '/api/assessment/history')
        ]);
        const recs = [
          'Start with basic device safety tutorials',
          'Learn about strong passwords and account security',
          'Seek guidance before clicking links or downloading apps',
        ];
        if (latestRes.status === 'fulfilled' && latestRes.value?.data) {
          const latest = latestRes.value.data;
          setUserData({
            digitalType: latest.digitalType || 'New to Digital',
            securityScore: typeof latest.securityIndex === 'number' ? latest.securityIndex : 0,
            lastAssessment: latest.lastAssessment || new Date().toISOString(),
            recommendations: recs,
          });
        } else {
          setUserData({
            digitalType: 'New to Digital',
            securityScore: 0,
            lastAssessment: null,
            recommendations: recs,
          });
        }
        if (historyRes.status === 'fulfilled' && Array.isArray(historyRes.value?.data)) {
          setHistory(historyRes.value.data);
        } else {
          setHistory([]);
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [isAuthenticated, skippedAssessment]);

  if (!isAuthenticated && !loading && !skippedAssessment) {
    return (
      <div className="dashboard-container">
        <div className="login-prompt">
          <div className="login-prompt-card">
            <div className="login-prompt-icon">
              <i className="fas fa-lock"></i>
            </div>
            <h2>{t('login_access_required')}</h2>
            <p>{t('login_prompt_message')}</p>
            <div className="login-prompt-actions">
              <Link to="/login" className="dashboard-button primary">
                <i className="fas fa-sign-in-alt"></i>
                {t('login_login_btn')}
              </Link>
              <Link to="/register" className="dashboard-button secondary">
                <i className="fas fa-user-plus"></i>
                {t('login_register_btn')}
              </Link>
            </div>
            <div className="login-prompt-info">
              <h4>{t('login_why_title')}</h4>
              <ul>
                <li><i className="fas fa-chart-line"></i> {t('login_track_progress')}</li>
                <li><i className="fas fa-shield-alt"></i> {t('login_personalized_security')}</li>
                <li><i className="fas fa-history"></i> {t('login_view_history')}</li>
                <li><i className="fas fa-bell"></i> {t('login_receive_alerts')}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">{t('loading_dashboard_data')}</div>
      </div>
    );
  }

  if (!userData && !loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h3>{t('dash_overview')}</h3>
          <p>{t('history_empty') || 'No assessment history found'}</p>
          <div className="dashboard-actions">
            <Link to="/assessment-start" className="dashboard-button">
              {t('dash_take_new')}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="welcome-section">
        <h1>{t('dash_hello')}, {user?.name}!</h1>
        <p className="welcome-subtitle">{t('dash_welcome_subtitle')}</p>
      </div>
      <h2>{t('dash_title')}</h2>
      
      <div className="dashboard-card">
        <h3>{t('dash_overview')}</h3>
        <p>{t('dash_digital_type')}: <strong>{typeLabel(userData.digitalType)}</strong></p>
        <p>{t('dash_security_score')}: <strong>{userData.securityScore}/100</strong></p>
        <p>{t('dash_last_assessment')}: {formatDate(userData.lastAssessment)}</p>
        
        <div className="recommendations">
          <h4>{t('dash_personalized_recs')}</h4>
          <ul>
              {userData.recommendations.map((rec, index) => (
                <li key={index}>{recLabel(rec)}</li>
              ))}
          </ul>
        </div>
        
        <div className="dashboard-actions">
          <Link to="/assessment-start" className="dashboard-button">
            {t('dash_take_new')}
          </Link>
        </div>
      </div>
      {isAuthenticated && Array.isArray(history) && history.length > 0 && (
        <div className="dashboard-card">
          <h3>{t('history_title') || 'Dashboard History'}</h3>
          <div style={{ textAlign: 'right', marginBottom: '0.75rem' }}>
            <button
              className="dashboard-button"
              onClick={async () => {
                const confirmed = window.confirm(t('history_confirm_delete_all') || 'Are you sure you want to delete all assessment history? This action cannot be undone.');
                if (!confirmed) return;
                try {
                  await makeAuthenticatedRequest('delete', '/api/assessment/history');
                  setHistory([]);
                  setUserData(null);
                } catch {}
              }}
            >
              {t('history_delete_all') || 'Delete All'}
            </button>
          </div>
          <ul className="history-list">
            {history.map((h, i) => (
              <li key={h._id || i} className="history-item">
                <div className="history-info">
                  <div className="history-title">{typeLabel(h.digitalType)}</div>
                  <div className="history-meta">{t('dash_last_assessment')}: {formatDate(h.completedAt)}</div>
                </div>
                <div className="history-actions">
                  <button
                    className="dashboard-button"
                    onClick={async () => {
                      try {
                        const res = await makeAuthenticatedRequest('get', `/api/assessment/${h._id}`);
                        sessionStorage.setItem('assessmentResultDetail', JSON.stringify(res.data));
                        window.location.href = '/assessment-results';
                      } catch {}
                    }}
                  >
                    {t('history_view') || 'View Details'}
                  </button>
                  <button
                    className="dashboard-button"
                    style={{ marginLeft: '8px' }}
                    onClick={async () => {
                      const ok = window.confirm(t('history_confirm_delete') || 'Delete this assessment?');
                      if (!ok) return;
                      try {
                        await makeAuthenticatedRequest('delete', `/api/assessment/${h._id}`);
                        setHistory((prev) => {
                          const next = prev.filter((x) => (x._id || '') !== (h._id || ''));
                          if (next.length === 0) {
                            setUserData(null);
                          }
                          return next;
                        });
                        try {
                          const ov = await makeAuthenticatedRequest('get', '/api/assessment/overview');
                          if (ov?.data) {
                            setUserData({
                              digitalType: ov.data.digitalType || 'New to Digital',
                              securityScore: typeof ov.data.securityIndex === 'number' ? ov.data.securityIndex : 0,
                              lastAssessment: ov.data.lastAssessment || null,
                              recommendations: [
                                'Start with basic device safety tutorials',
                                'Learn about strong passwords and account security',
                                'Seek guidance before clicking links or downloading apps',
                              ],
                            });
                          }
                        } catch {}
                      } catch {}
                    }}
                  >
                    {t('history_delete') || 'Delete'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
