import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../../context/FormContext';

export const Header: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginStep, setLoginStep] = useState(1);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginAadhaar, setLoginAadhaar] = useState('');
  const [loginOtp, setLoginOtp] = useState('');
  const [loginRegistrationId, setLoginRegistrationId] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginSuccessMessage, setLoginSuccessMessage] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  
  const { loggedInUser, setLoggedInUser } = useFormContext();
  const navigate = useNavigate();

  const handleGenerateLoginOtp = async () => {
    if (!loginUsername.trim() || !loginAadhaar.trim()) {
      setLoginError('Please enter both username and Aadhaar number.');
      return;
    }
    if (!/^[2-9]\d{11}$/.test(loginAadhaar.trim())) {
      setLoginError('Invalid Aadhaar number format.');
      return;
    }
    setLoginLoading(true);
    setLoginError('');
    setLoginSuccessMessage('');
    try {
      const response = await fetch('http://localhost:5000/api/register/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: loginUsername.trim(),
          aadhaarNumber: loginAadhaar.trim()
        }),
      });
      const data = await response.json();
      if (data.success) {
        setLoginRegistrationId(data.data.registrationId);
        setLoginSuccessMessage(`OTP sent successfully! (Demo OTP: ${data.data.otp})`);
        setLoginStep(2);
      } else {
        setLoginError(data.message || 'Failed to generate OTP.');
      }
    } catch {
      setLoginError('Cannot connect to server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleVerifyLoginOtp = async () => {
    if (!loginOtp.trim() || loginOtp.length < 6) {
      setLoginError('Please enter a valid OTP.');
      return;
    }
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch('http://localhost:5000/api/register/verify-login-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          registrationId: loginRegistrationId,
          otp: loginOtp.trim()
        }),
      });
      const data = await response.json();
      if (data.success) {
        setLoggedInUser(data.data.registration);
        setShowLoginModal(false);
        resetLoginState();
        navigate('/dashboard');
      } else {
        setLoginError(data.message || 'Invalid OTP.');
      }
    } catch {
      setLoginError('Cannot connect to server.');
    } finally {
      setLoginLoading(false);
    }
  };

  const resetLoginState = () => {
    setLoginStep(1);
    setLoginUsername('');
    setLoginAadhaar('');
    setLoginOtp('');
    setLoginRegistrationId('');
    setLoginError('');
    setLoginSuccessMessage('');
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    navigate('/step1');
  };

  return (
    <>
      <header className="w-full">
        {/* Top tier */}
        <div className="bg-[#2B3C5A] text-white py-1">
          <div className="container mx-auto px-4 flex justify-between items-center text-xs">
            <div>Government of India</div>
            <div className="flex items-center space-x-1 cursor-pointer">
              <span>अ/A</span>
              <span>English</span>
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>
        
        {/* Navigation tier */}
        <div className="bg-white shadow-sm py-2">
          <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
            {/* Logo Section */}
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-12 h-16 flex items-center justify-center">
                <img src="https://udyamregistration.gov.in/images/emblem-dark.png" alt="Emblem" className="max-h-full" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <div>
                <div className="font-semibold text-gray-800 text-sm md:text-base leading-tight">सूक्ष्म, लघु और मध्यम उद्यम मंत्रालय</div>
                <div className="text-gray-600 text-xs md:text-sm">MINISTRY OF</div>
                <div className="font-bold text-black text-sm md:text-base">MICRO, SMALL & MEDIUM ENTERPRISES</div>
              </div>
            </div>
            
            {/* Nav Links */}
            <nav className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-700">
              <a href="/" className="text-blue-600 border-b-2 border-blue-600 pb-1">Home</a>
              <a href="#" className="hover:text-blue-600">NIC Code</a>
              <div className="flex items-center hover:text-blue-600 cursor-pointer">
                Useful Documents <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              <div className="flex items-center hover:text-blue-600 cursor-pointer">
                Print/Verify <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
              
              {loggedInUser ? (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-green-700 font-semibold hover:underline"
                  >
                    👤 {loggedInUser.username}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => { setShowLoginModal(true); resetLoginState(); }}
                  className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-blue-700 transition-colors flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  Login
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Login to Udyam</h3>
              <button onClick={() => { setShowLoginModal(false); resetLoginState(); }} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
            </div>
            
            <p className="text-sm text-gray-500 mb-4">Enter your details to access your registration dashboard.</p>
            
            {loginError && (
              <div className="bg-red-50 border border-red-300 text-red-700 text-sm p-3 rounded mb-4">{loginError}</div>
            )}
            {loginSuccessMessage && (
              <div className="bg-green-50 border border-green-300 text-green-700 text-sm p-3 rounded mb-4">{loginSuccessMessage}</div>
            )}
            
            {loginStep === 1 ? (
              <>
                <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your username"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                />
                
                <label className="block text-sm font-bold text-gray-700 mb-1">Aadhaar Number</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 tracking-widest"
                  placeholder="12-digit Aadhaar"
                  maxLength={12}
                  value={loginAadhaar}
                  onChange={(e) => setLoginAadhaar(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && handleGenerateLoginOtp()}
                />
                
                <button
                  onClick={handleGenerateLoginOtp}
                  disabled={loginLoading}
                  className={`w-full py-2.5 rounded-md text-white font-semibold ${loginLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  {loginLoading ? 'Generating OTP...' : 'Generate OTP'}
                </button>
              </>
            ) : (
              <>
                <label className="block text-sm font-bold text-gray-700 mb-1">Enter OTP</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-center tracking-[0.5em] text-lg font-mono"
                  placeholder="XXXXXX"
                  maxLength={6}
                  value={loginOtp}
                  onChange={(e) => setLoginOtp(e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerifyLoginOtp()}
                  autoFocus
                />
                
                <button
                  onClick={handleVerifyLoginOtp}
                  disabled={loginLoading}
                  className={`w-full py-2.5 rounded-md text-white font-semibold ${loginLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                >
                  {loginLoading ? 'Verifying...' : 'Verify OTP & Login'}
                </button>
              </>
            )}
            
            <p className="text-xs text-gray-400 mt-4 text-center">
              Don't have an account? <a href="/step1" className="text-blue-600 hover:underline">Register here</a>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
