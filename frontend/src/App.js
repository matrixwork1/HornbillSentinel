import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';

// Layout components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Pages
import HomePage from './pages/HomePage';
import NotFound from './pages/NotFound';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AccountSettings from './pages/auth/AccountSettings';
import ForgotPassword from './pages/auth/ForgotPassword';

// Assessment pages
import Questionnaire from './pages/assessment/Questionnaire';
import AssessmentStart from './pages/assessment/AssessmentStart';
import PersonalInfo from './pages/assessment/PersonalInfo';
import AssessmentResults from './pages/assessment/AssessmentResults';
import Dashboard from './pages/assessment/Dashboard';

function App() {
  useEffect(() => {
    const navbar = document.querySelector('.navbar');
    const backToTopBtn = document.querySelector('.back-to-top');

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > 50) {
        navbar?.classList.add('scrolled');
        navbar?.classList.remove('at-top');
      } else {
        navbar?.classList.remove('scrolled');
        navbar?.classList.add('at-top');
      }
      if (scrollTop > 300) {
        backToTopBtn?.classList.add('visible');
      } else {
        backToTopBtn?.classList.remove('visible');
      }
    };

    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('scroll', handleScroll);
    backToTopBtn?.addEventListener('click', scrollToTop);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      backToTopBtn?.removeEventListener('click', scrollToTop);
    };
  }, []);

  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="app-container">
            <div className="noise-overlay"></div>
            <Navbar />
            <div className="main-content">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/assessment-start" element={<AssessmentStart />} />
                <Route path="/personal-info" element={<PersonalInfo />} />
                <Route path="/questionnaire" element={<Questionnaire />} />
                <Route path="/assessment-results" element={<AssessmentResults />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/account-settings" element={<AccountSettings />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
            <Footer />
            <button className="back-to-top" aria-label="Back to top">
            </button>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
