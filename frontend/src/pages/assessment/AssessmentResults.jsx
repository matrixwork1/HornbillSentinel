import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './DashboardStyles.css';
import { Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { useLanguage } from '../../context/LanguageContext';
import { makeUnauthenticatedRequest } from '../../utils/csrf';
ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const AssessmentResults = () => {
  const { t, language, tx } = useLanguage();
  const location = useLocation();
  const [definitionOpen, setDefinitionOpen] = useState(false);
  let result = location.state?.result;
  try {
    if (!result) {
      const raw = sessionStorage.getItem('assessmentResultDetail');
      if (raw) {
        result = JSON.parse(raw);
      }
    }
  } catch {}

  const mapRiskLabel = (k) => {
    const key = String(k || '');
    const base = {
      paymentFraud: 'Payment Fraud',
      deviceCompromise: 'Device Compromise',
      highValueTarget: 'High-Value Target',
      authorityExploitation: 'Authority Exploitation',
      infrastructureGatekeeper: 'Infrastructure Gatekeeper',
      intellectualPropertyTheft: 'Intellectual Property Theft',
      socialEngineeringEntryPoint: 'Social Engineering Entry Point',
      accountTakeover: 'Account Takeover',
      predatoryScams: 'Predatory Scams',
      lifestyleAttacks: 'Lifestyle Attacks'
    };
    const pretty = base[key] || key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return tx(language, pretty);
  };

  const [correctCountLocal, setCorrectCountLocal] = useState(typeof result?.correctCount === 'number' ? result.correctCount : 0);

  useEffect(() => {
    const computeFallback = async () => {
      if (typeof result?.correctCount === 'number' && result.correctCount > 0) {
        setCorrectCountLocal(result.correctCount);
        return;
      }
      try {
        const selRaw = sessionStorage.getItem('assessmentSelections');
        const selections = selRaw ? JSON.parse(selRaw) : {};
        const res = await makeUnauthenticatedRequest('get', '/api/assessment/questions');
        const qs = Array.isArray(res.data) ? res.data : (Array.isArray(res.data?.questions) ? res.data.questions : []);
        const byCode = new Map(qs.map(q => [q.codeId, q]));
        const count = Object.entries(selections).reduce((acc, [codeId, answer]) => {
          const q = byCode.get(codeId);
          const userOpt = q?.options?.find(o => o.value === answer) || null;
          return acc + ((userOpt && typeof userOpt.riskScore === 'number' && userOpt.riskScore === 0) ? 1 : 0);
        }, 0);
        setCorrectCountLocal(count);
      } catch {
        setCorrectCountLocal(typeof result?.correctCount === 'number' ? result.correctCount : 0);
      }
    };
    computeFallback();
  }, [result]);

  if (!result) {
    return (
      <div className="dashboard-container">
        <div className="loading">{t('no_results')}</div>
        <div className="dashboard-actions" style={{ marginTop: '16px' }}>
          <Link to="/assessment-start" className="dashboard-button">{t('btn_start_assessment')}</Link>
        </div>
      </div>
    );
  }

  const labels = result.categoryScores ? Object.keys(result.categoryScores) : [];
  const values = result.categoryScores ? Object.values(result.categoryScores) : [];
  const avgScore = values.length ? Math.round(values.reduce((a,b)=>a+b,0)/values.length) : 0;
  const totalRisk = typeof result.totalRiskScore === 'number' ? result.totalRiskScore : 0;
  const riskPercent = Math.max(0, Math.min(100, Math.round((totalRisk/150)*100)));
  const finalScore = typeof result.finalScore === 'number' ? Math.round(result.finalScore) : null;
  const responsesCount = typeof result.debug?.responsesCount === 'number' ? result.debug.responsesCount : 30;

  const mapCategory = (c) => {
    if (!c) return c;
    if (c.startsWith('Phishing')) return t('cat_phishing');
    if (c.startsWith('Scams')) return t('cat_scams');
    if (c.startsWith('Passwords')) return t('cat_passwords');
    if (c.startsWith('Malware')) return t('cat_malware');
    if (c.startsWith('Data')) return t('cat_data');
    if (c.startsWith('Social')) return t('cat_social');
    return c;
  };
  const labelsLocalized = labels.map(mapCategory);

  const mapTypeName = (s) => {
    const n = String(s || '');
    if (n.includes('Strategic Custodian')) return t('type_strategic_custodian');
    if (n.includes('Technical Architect')) return t('type_technical_architect');
    if (n.includes('Network Liaison')) return t('type_network_liaison');
    if (n.includes('Operational Analyst')) return t('type_operational_analyst');
    if (n.includes('Digital Consumer')) return t('type_digital_consumer');
    if (n.includes('Security Savvy')) return t('type_security_savvy');
    if (n.includes('Careless Clicker')) return t('type_careless_clicker');
    if (n.includes('Password Reuser')) return t('type_password_reuser');
    if (n.includes('Update Avoider')) return t('type_update_avoider');
    if (n.includes('Oversharer')) return t('type_oversharer');
    if (n.includes('New to Digital')) return t('type_new_to_digital');
    return n;
  };

  return (
    <div className="dashboard-container results-container">
      <div className="dashboard-card">
        <h2>{t('assessment_results')}</h2>
        <div className="results-summary">
          <div className="summary-item">
            <div className="summary-label">{t('digital_type')}</div>
            <div 
              className={`type-badge type-${String(result.digitalType || '').replace(/\s+/g,'-').toLowerCase()}`}
              onClick={() => setDefinitionOpen(true)}
              style={{ cursor: 'pointer' }}
            >
              {mapTypeName(result.digitalType)}
            </div>
          </div>
          
          <div className="summary-item">
            <div className="summary-label">{t('confidence')}</div>
            <div className="summary-value">{typeof result.digitalTypeConfidence==='number' ? result.digitalTypeConfidence : '-'}</div>
          </div>
          <div className="summary-item">
            <div className="summary-label">{t('average_category_score')}</div>
            <div className="summary-value">{avgScore}</div>
          </div>
        </div>

        {definitionOpen && result.digitalTypeDefinition && (
          <div className="modal-overlay" onClick={() => setDefinitionOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div className="modal-title">{t('digital_type')}</div>
                <button className="modal-close" onClick={() => setDefinitionOpen(false)} aria-label="Close">×</button>
              </div>
              <div className="modal-body">
                <div className="modal-type-badge">
                  <span className={`type-badge type-${String(result.digitalType || '').replace(/\s+/g,'-').toLowerCase()}`}>{mapTypeName(result.digitalType)}</span>
                </div>
                <div className="modal-section">
                  <div className="modal-section-title">{t('definition') || 'Definition'}</div>
                  <div className="modal-text">{tx(language, result.digitalTypeDefinition)}</div>
                </div>
                {result.digitalTypeRiskProfile && (
                  <div className="modal-section">
                    <div className="modal-section-title">{t('primary_risk_profile') || 'Primary Risk Profile'}</div>
                    <ul className="modal-list">
                      {Object.entries(result.digitalTypeRiskProfile).map(([key, value], i) => (
                        <li key={i}>
                          <strong>{mapRiskLabel(key)}:</strong> {tx(language, value)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="risk-section">
          <div className="risk-header">
            <span>{t('total_risk')}</span>
            <span className="risk-number">{totalRisk}</span>
          </div>
          <div className="risk-bar">
            <div className="risk-fill" style={{ width: `${riskPercent}%` }} />
          </div>
        </div>

        {result.digitalTypeRiskProfile && (
          <div className="recommendations" style={{ marginBottom: '24px' }}>
            <h4>{t('primary_risk_profile') || 'Primary Risk Profile (Sarawak Context)'}</h4>
            <ul>
              {Object.entries(result.digitalTypeRiskProfile).map(([key, value], i) => (
                <li key={i}>
                  <strong>{mapRiskLabel(key)}:</strong> {tx(language, value)}
                </li>
              ))}
            </ul>
          </div>
        )}

        {result.categoryScores && (
          <div className="charts-grid">
            <div className="chart-item chart-fixed">
              <Radar
                data={{
                  labels: labelsLocalized,
                  datasets: [{
                    label: t('category_scores_label'),
                    data: values,
                    backgroundColor: 'rgba(59,130,246,0.2)',
                    borderColor: 'rgba(59,130,246,1)',
                    pointBackgroundColor: 'rgba(59,130,246,1)',
                    borderWidth: 2,
                    pointRadius: 3,
                    tension: 0.3
                  }]
                }}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: { r: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    ticks: { display: false, showLabelBackdrop: false },
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    angleLines: { color: 'rgba(255,255,255,0.08)' },
                    pointLabels: { color: 'rgba(255,255,255,0.85)', font: { size: 12 } }
                  } },
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
            <div className="chart-item chart-fixed">
              <Bar
                data={{
                  labels: labelsLocalized,
                  datasets: [{
                    label: t('category_scores_label'),
                    data: values,
                    backgroundColor: values.map(v=>v>=80 ? 'rgba(16,185,129,0.6)' : v>=60 ? 'rgba(245,158,11,0.6)' : 'rgba(239,68,68,0.6)')
                  }]
                }}
                options={{
                  indexAxis: 'y',
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      beginAtZero: true,
                      suggestedMax: 100,
                      ticks: { stepSize: 20, color: 'rgba(255,255,255,0.7)' },
                      grid: { color: 'rgba(255,255,255,0.08)' }
                    },
                    y: {
                      ticks: { color: 'rgba(255,255,255,0.7)' },
                      grid: { display: false }
                    }
                  },
                  plugins: { legend: { display: false } }
                }}
              />
            </div>
          </div>
        )}

        {Array.isArray(result.strengths) && result.strengths.length > 0 && (
          <div className="chip-section">
            <div className="chip-title">{t('strengths')}</div>
            <div className="chip-list">
              {result.strengths.map((s, i) => (
                <span className="chip chip-strong" key={i}>{mapCategory(s)}</span>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(result.weaknesses) && result.weaknesses.length > 0 && (
          <div className="chip-section">
            <div className="chip-title">{t('weaknesses')}</div>
            <div className="chip-list">
              {result.weaknesses.map((w, i) => (
                <span className="chip chip-weak" key={i}>{mapCategory(w)}</span>
              ))}
            </div>
          </div>
        )}

        {Array.isArray(result.keyMistakes) && result.keyMistakes.length > 0 && (
          <div className="recommendations">
            <h4>{t('key_mistakes')}</h4>
            <ul>
              {result.keyMistakes.map((m, i) => {
                const mapKM = (s) => {
                  if (s === 'Clicking on suspicious links without verification') return t('km_clicking_suspicious_links');
                  if (s === 'Reusing passwords across multiple accounts') return t('km_password_reuse');
                  if (s === 'Sharing or reusing passwords') return t('km_sharing_reusing_passwords');
                  if (s === 'Falling for common scam tactics') return t('km_common_scams');
                  return s;
                };
                return <li key={i}>{mapKM(m)}</li>;
              })}
            </ul>
          </div>
        )}

        {Array.isArray(result.recommendations) && result.recommendations.length > 0 && (
          <div className="recommendations">
            <h4>{t('recommendations')}</h4>
            <ul>
              {result.recommendations.map((r, i) => {
                const mapRec = (s) => {
                  if (s === 'Verify sender and hover links before clicking') return t('rec_phishing_verify_sender');
                  if (s === 'Log in via official app or website instead of email links') return t('rec_phishing_login_official');
                  if (s === 'Inspect domain carefully; beware lookalikes and shortened URLs') return t('rec_phishing_inspect_domain');
                  if (s === 'Disable remote image loading to reduce tracking in emails') return t('rec_phishing_disable_remote_images');
                  if (s === 'Avoid payments via links or calls; verify via official channels') return t('rec_scams_avoid_pay_links');
                  if (s === 'Never share OTP/TAC codes; banks will not ask for them') return t('rec_scams_never_share_otp');
                  if (s === 'Confirm claims using trusted numbers, not those in messages') return t('rec_scams_confirm_trusted_numbers');
                  if (s === 'Research sellers and check reviews before transacting online') return t('rec_scams_research_sellers');
                  if (s === 'Use a password manager and enable 2FA') return t('rec_passwords_use_manager_2fa');
                  if (s === 'Create unique passphrases per account to stop credential stuffing') return t('rec_passwords_unique_passphrases');
                  if (s === 'Prefer authenticator apps or hardware keys over SMS 2FA') return t('rec_passwords_prefer_app_hardware');
                  if (s === 'Rotate old passwords and revoke sessions after breaches') return t('rec_passwords_rotate_revoke');
                  if (s === 'Keep software updated and avoid cracked downloads') return t('rec_malware_keep_updated_avoid_cracked');
                  if (s === 'Install apps only from official stores; block unknown APKs') return t('rec_malware_install_official_stores');
                  if (s === 'Back up data offline to mitigate ransomware impact') return t('rec_malware_backup_offline');
                  if (s === 'Run antivirus/EDR and remove unused browser extensions') return t('rec_malware_run_av_remove_ext');
                  if (s === 'Use VPN or mobile data on public Wi‑Fi and protect PII') return t('rec_data_use_vpn_mobile');
                  if (s === 'Avoid accessing banking on open Wi‑Fi; use cellular or VPN') return t('rec_data_avoid_banking_on_open_wifi');
                  if (s === 'Limit data sharing; remove sensitive metadata from files/photos') return t('rec_data_limit_data_sharing');
                  if (s === 'Set device auto-lock and use screen privacy filters in public') return t('rec_data_set_auto_lock_privacy');
                  if (s === 'Challenge unexpected requests and validate identities') return t('rec_social_validate_identities');
                  if (s === 'Use dual-channel verification for urgent requests (call back via known numbers)') return t('rec_social_dual_channel_verification');
                  if (s === 'Establish no‑secrets policy: never share passwords or 2FA codes') return t('rec_social_no_secrets_policy');
                  if (s === 'Train yourself to slow down when messages impose artificial urgency') return t('rec_social_slow_down_urgency');
                  return s;
                };
                return <li key={i}>{mapRec(r)}</li>;
              })}
            </ul>
          </div>
        )}

        {Array.isArray(result.vulnerabilityTopics) && result.vulnerabilityTopics.length > 0 && (
          <div className="chip-section">
            <div className="chip-title">{t('vulnerability_topics')}</div>
            <div className="chip-list">
              {result.vulnerabilityTopics.map((topic, i) => (
                <span className="chip" key={i}>{mapCategory(topic)}</span>
              ))}
            </div>
          </div>
        )}

        {result.typeScores && (
          <div className="chip-section">
            <div className="chip-title">{t('type_drivers') || 'Risk Profile Contributors'}</div>
            <div className="chip-subtitle">{t('type_drivers_subtitle')}</div>
            <div className="chip-list">
              {Object.entries(result.typeScores).map(([k, v]) => (
                <span className="chip chip-metric" key={k}>{mapTypeName(k)}: {Math.round(v)}</span>
              ))}
            </div>
          </div>
        )}

        {result.debug && (
          <div className="chip-section">
            <div className="chip-title">{t('type_debug') || 'Assessment Analysis'}</div>
            <div className="chip-subtitle">{t('type_debug_subtitle')}</div>
            <div className="chip-list">
              <span className="chip chip-type">{t('debug_profile_type_label')}: {mapTypeName(result.occupationType || '-')}</span>
              <span className="chip chip-type">{t('debug_behavioral_type_label')}: {mapTypeName(result.behavioralType || '-')}</span>
              <span className="chip chip-metric">{t('debug_distinctiveness_label')}: {typeof result.debug.distinctiveness==='number' ? result.debug.distinctiveness.toFixed(2) : '-'}</span>
              <span className="chip chip-metric">{t('debug_risk_density_label')}: {typeof result.debug.riskDensity==='number' ? result.debug.riskDensity.toFixed(2) : '-'}</span>
              <span className="chip chip-metric">{t('debug_responses_label')}: {typeof result.debug.responsesCount==='number' ? result.debug.responsesCount : '-'}</span>
              <span className="chip chip-metric">{t('actual_score_label')}: {finalScore !== null ? `${finalScore}%` : '-'}</span>
              <span className="chip chip-metric">{t('correct_answers_label')}: {correctCountLocal} / {responsesCount}</span>
            </div>
          </div>
        )}

        <div className="dashboard-actions" style={{ marginTop: '16px' }}>
          <Link to="/assessment-start" className="dashboard-button">{t('retake_assessment')}</Link>
          <Link to="/dashboard" className="dashboard-button">{t('go_dashboard')}</Link>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResults;
