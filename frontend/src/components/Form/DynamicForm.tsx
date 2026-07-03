import React from 'react';
import { useFormContext } from '../../context/FormContext';
import { FieldRenderer } from './FieldRenderer';
import { ButtonField } from '../fields/ButtonField';
import { useNavigate } from 'react-router-dom';

export const DynamicForm: React.FC = () => {
  const { schema, currentStepIndex, formState, rules, setFieldTouched, setFieldError, setFieldValue } = useFormContext();
  const navigate = useNavigate();
  
  // OTP flow state
  const [showOtp, setShowOtp] = React.useState(false);
  const [otpValue, setOtpValue] = React.useState('');
  const [generatedOtp, setGeneratedOtp] = React.useState('');
  const [statusMessage, setStatusMessage] = React.useState<{ type: 'success' | 'error' | 'info'; text: React.ReactNode } | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  if (!schema || !schema.steps || schema.steps.length === 0) {
    return <div className="p-4 text-red-500">Error: Schema could not be loaded.</div>;
  }

  const currentStep = schema.steps[currentStepIndex];

  const validateAll = (): boolean => {
    let isValid = true;
    currentStep.fields.forEach(field => {
      setFieldTouched(field.id, true);
      const fieldRules = rules[field.id] || [];
      const value = formState.values[field.id] !== undefined ? formState.values[field.id] : '';
      
      for (const rule of fieldRules) {
        const error = rule.validate(value);
        if (error) {
          setFieldError(field.id, error);
          isValid = false;
          break;
        }
      }
    });
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Only validate form fields when generating OTP (not when verifying)
    if (!showOtp) {
      const isValid = validateAll();
      if (!isValid) {
        setStatusMessage({ type: 'error', text: 'Please fill all required fields correctly. Aadhaar must be a valid 12-digit number.' });
        return;
      }
    }
    
    setIsLoading(true);

    try {
      if (currentStepIndex === 0) {
        if (!showOtp) {
          // ---- STEP 1A: Generate OTP ----
          const response = await fetch('http://localhost:5000/api/register/step1', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              aadhaarNumber: formState.values['ctl00_ContentPlaceHolder1_txtadharno'],
              entrepreneurName: formState.values['ctl00_ContentPlaceHolder1_txtownername']
            })
          });
          const data = await response.json();
          if (data.success) {
            setFieldValue('registrationId', data.data.registrationId);
            setGeneratedOtp(data.data.otp); // For demo: show OTP on screen
            setShowOtp(true);
            setStatusMessage({
              type: 'success',
              text: `OTP sent successfully! (Demo OTP: ${data.data.otp})`
            });
          } else {
            if (response.status === 409 && data.message.includes('already registered')) {
              setStatusMessage({
                type: 'error',
                text: (
                  <span>
                    This Aadhaar is already registered. Please use the <strong>Login</strong> option from the top-right menu to access your account.
                  </span>
                )
              });
            } else {
              setStatusMessage({ type: 'error', text: data.message || 'Failed to generate OTP. Try again.' });
            }
          }
        } else {
          // ---- STEP 1B: Verify OTP ----
          if (!otpValue || otpValue.length < 6) {
            setStatusMessage({ type: 'error', text: 'Please enter a valid 6-digit OTP.' });
            setIsLoading(false);
            return;
          }
          const response = await fetch('http://localhost:5000/api/register/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              registrationId: formState.values['registrationId'],
              otp: otpValue
            })
          });
          const data = await response.json();
          if (data.success) {
            setStatusMessage({ type: 'success', text: 'OTP verified! Redirecting to Step 2...' });
            setTimeout(() => navigate('/step2'), 1000);
          } else {
            setStatusMessage({ type: 'error', text: data.message || 'Invalid OTP. Please try again.' });
          }
        }
      } else {
        // ---- STEP 2: Submit PAN ----
        const response = await fetch('http://localhost:5000/api/register/step2', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            registrationId: formState.values['registrationId'],
            panNumber: formState.values['ctl00_ContentPlaceHolder1_txtpanNo'],
            panType: formState.values['ctl00_ContentPlaceHolder1_ddlTypeofOrganization']
          })
        });
        const data = await response.json();
        if (data.success) {
          setStatusMessage({ type: 'success', text: 'Registration completed successfully! Udyam ID: ' + data.data.registration.id });
        } else {
          setStatusMessage({ type: 'error', text: data.message || 'Submission failed.' });
        }
      }
    } catch (err) {
      console.error('API Error', err);
      setStatusMessage({ type: 'error', text: 'Cannot connect to backend server. Make sure it is running on port 5000.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Status Message Banner */}
      {statusMessage && (
        <div className={`mb-4 p-3 rounded-md text-sm font-medium ${
          statusMessage.type === 'success' ? 'bg-green-50 border border-green-300 text-green-800' :
          statusMessage.type === 'error' ? 'bg-red-50 border border-red-300 text-red-800' :
          'bg-blue-50 border border-blue-300 text-blue-800'
        }`}>
          {statusMessage.text}
        </div>
      )}

      {currentStepIndex === 0 ? (
        <div className="flex flex-col md:flex-row border border-gray-300 rounded-md overflow-hidden">
          {/* Left Column: Form Fields */}
          <div className="w-full md:w-3/5 p-6 bg-white">
            {currentStep.fields.map(field => (
              <FieldRenderer key={field.id} field={field} />
            ))}

            {/* OTP Section - appears after Generate OTP */}
            {showOtp && (
              <div className="mt-6 p-4 border-2 border-green-300 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-green-600 text-lg">✅</span>
                  <span className="font-bold text-green-800">OTP Generated Successfully</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  An OTP has been sent to the mobile number linked with your Aadhaar.
                  <br />
                  <span className="text-blue-700 font-semibold">(Demo Mode: Your OTP is <code className="bg-white px-2 py-1 rounded border text-lg font-bold text-blue-900">{generatedOtp}</code>)</span>
                </p>
                <label className="block text-sm font-bold text-gray-700 mb-2">Enter OTP *</label>
                <input
                  type="text"
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-blue-400 rounded-md shadow-sm text-lg tracking-widest text-center font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="_ _ _ _ _ _"
                  value={otpValue}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  autoFocus
                />
              </div>
            )}
          </div>
          
          {/* Right Column: Instructions */}
          <div className="w-full md:w-2/5 bg-[#2B5B9E] text-white p-6 text-sm flex flex-col gap-4">
            <p className="flex items-start">
              <span className="mr-2">✓</span>
              <span>Aadhaar number shall be required for Udyam Registration.</span>
            </p>
            <p className="flex items-start">
              <span className="mr-2">✓</span>
              <span>The Aadhaar number shall be of the proprietor in the case of a proprietorship firm, of the managing partner in the case of a partnership firm and of a karta in the case of a Hindu Undivided Family (HUF).</span>
            </p>
            <p className="flex items-start">
              <span className="mr-2">✓</span>
              <span>In case of a Company or a Limited Liability Partnership or a Cooperative Society or a Society or a Trust, the organisation or its authorised signatory shall provide its GSTIN and PAN along with its Aadhaar number.</span>
            </p>
            {showOtp && (
              <div className="mt-4 p-3 bg-white/10 rounded-md">
                <p className="flex items-start">
                  <span className="mr-2">📱</span>
                  <span>Please enter the OTP received on your Aadhaar-linked mobile number. The OTP is valid for 5 minutes.</span>
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white p-6 border border-gray-300 rounded-md">
          {currentStep.fields.map(field => (
            <FieldRenderer key={field.id} field={field} />
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className={`px-8 py-3 rounded-md shadow-md text-white font-semibold text-sm transition-all ${
            isLoading
              ? 'bg-gray-400 cursor-not-allowed'
              : showOtp
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Processing...' :
            currentStepIndex === 0
              ? (showOtp ? '✓ Validate OTP' : 'Validate & Generate OTP')
              : 'Submit'
          }
        </button>
      </div>
    </form>
  );
};
