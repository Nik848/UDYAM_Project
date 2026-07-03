import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

const ENTERPRISE_TYPES = ['Micro', 'Small', 'Medium'];
const ORG_TYPES = [
  'Proprietorship', 'Hindu Undivided Family (HUF)', 'Partnership',
  'Limited Liability Partnership (LLP)', 'Private Limited Company',
  'Public Limited Company', 'Cooperative Society', 'Society', 'Trust',
];

export const Step2: React.FC = () => {
  const { setCurrentStepIndex, formState } = useFormContext();
  const navigate = useNavigate();

  useEffect(() => {
    setCurrentStepIndex(1);
    // Check that Step 1 was completed (registrationId exists)
    if (!formState.values['registrationId']) {
      navigate('/step1');
    }
  }, [setCurrentStepIndex, formState.values, navigate]);

  const [form, setForm] = useState({
    username: '', panNumber: '', typeOfEnterprise: '', typeOfOrganization: '',
    businessName: '', dateOfIncorporation: '', mobileNumber: '', email: '',
    addressLine1: '', addressLine2: '', state: '', district: '', pinCode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors(prev => { const n = { ...prev }; delete n[field]; return n; });
    }
  };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.username || form.username.length < 3) e.username = 'Username must be at least 3 characters';
    if (!/^[a-zA-Z0-9_]+$/.test(form.username)) e.username = 'Username can only contain letters, numbers, underscores';
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(form.panNumber)) e.panNumber = 'Invalid PAN format (e.g. ABCDE1234F)';
    if (!form.typeOfEnterprise) e.typeOfEnterprise = 'Required';
    if (!form.typeOfOrganization) e.typeOfOrganization = 'Required';
    if (!form.businessName) e.businessName = 'Required';
    if (!form.mobileNumber || form.mobileNumber.length !== 10) e.mobileNumber = 'Must be 10 digits';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.addressLine1) e.addressLine1 = 'Required';
    if (!form.state) e.state = 'Required';
    if (!form.district) e.district = 'Required';
    if (!form.pinCode || form.pinCode.length !== 6) e.pinCode = 'Must be 6 digits';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    if (!validate()) {
      setStatusMessage({ type: 'error', text: 'Please fix the errors highlighted below.' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/register/step2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationId: formState.values['registrationId'],
          ...form,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setStatusMessage({ type: 'success', text: '🎉 Registration completed successfully! You can now login using your username.' });
      } else {
        setStatusMessage({ type: 'error', text: data.message || 'Submission failed.' });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'Cannot connect to server.' });
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;
  const selectClass = (field: string) =>
    `w-full px-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white ${errors[field] ? 'border-red-500' : 'border-gray-300'}`;
  const labelClass = 'block text-sm font-bold text-gray-700 mb-1';
  const errorClass = 'text-xs text-red-600 mt-1';

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-t-[3px] border-[#3B82F6] px-8 py-6">
          <h2 className="text-2xl font-bold text-[#2B3C5A] text-center mb-2">
            Enterprise Registration — Step 2
          </h2>
          <p className="text-center text-sm text-gray-500 mb-6">Fill in your business and PAN details to complete registration.</p>
          <hr className="border-[#3B82F6] mb-8" />

          {statusMessage && (
            <div className={`mb-6 p-3 rounded-md text-sm font-medium ${
              statusMessage.type === 'success' ? 'bg-green-50 border border-green-300 text-green-800' :
              'bg-red-50 border border-red-300 text-red-800'
            }`}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Section 1: Account */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#2B3C5A] mb-4 pb-2 border-b border-gray-200">👤 Account Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Username *</label>
                  <input type="text" className={inputClass('username')} placeholder="Choose a username (e.g. john_doe)" value={form.username} onChange={e => handleChange('username', e.target.value)} />
                  {errors.username && <p className={errorClass}>{errors.username}</p>}
                </div>
              </div>
            </div>

            {/* Section 2: PAN Verification */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#2B3C5A] mb-4 pb-2 border-b border-gray-200">🏦 PAN & Enterprise Type</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>PAN Number *</label>
                  <input type="text" className={inputClass('panNumber')} placeholder="e.g. ABCDE1234F" maxLength={10} value={form.panNumber} onChange={e => handleChange('panNumber', e.target.value.toUpperCase())} />
                  {errors.panNumber && <p className={errorClass}>{errors.panNumber}</p>}
                </div>
                <div>
                  <label className={labelClass}>Type of Enterprise *</label>
                  <select className={selectClass('typeOfEnterprise')} value={form.typeOfEnterprise} onChange={e => handleChange('typeOfEnterprise', e.target.value)}>
                    <option value="">-- Select --</option>
                    {ENTERPRISE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.typeOfEnterprise && <p className={errorClass}>{errors.typeOfEnterprise}</p>}
                </div>
              </div>
            </div>

            {/* Section 3: Organization */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#2B3C5A] mb-4 pb-2 border-b border-gray-200">🏢 Organization Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Type of Organization *</label>
                  <select className={selectClass('typeOfOrganization')} value={form.typeOfOrganization} onChange={e => handleChange('typeOfOrganization', e.target.value)}>
                    <option value="">-- Select --</option>
                    {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  {errors.typeOfOrganization && <p className={errorClass}>{errors.typeOfOrganization}</p>}
                </div>
                <div>
                  <label className={labelClass}>Business / Enterprise Name *</label>
                  <input type="text" className={inputClass('businessName')} placeholder="Enter your business name" value={form.businessName} onChange={e => handleChange('businessName', e.target.value)} />
                  {errors.businessName && <p className={errorClass}>{errors.businessName}</p>}
                </div>
                <div>
                  <label className={labelClass}>Date of Incorporation</label>
                  <input type="date" className={inputClass('dateOfIncorporation')} value={form.dateOfIncorporation} onChange={e => handleChange('dateOfIncorporation', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Section 4: Contact */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#2B3C5A] mb-4 pb-2 border-b border-gray-200">📞 Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Mobile Number *</label>
                  <input type="text" className={inputClass('mobileNumber')} placeholder="10-digit mobile number" maxLength={10} value={form.mobileNumber} onChange={e => handleChange('mobileNumber', e.target.value.replace(/\D/g, ''))} />
                  {errors.mobileNumber && <p className={errorClass}>{errors.mobileNumber}</p>}
                </div>
                <div>
                  <label className={labelClass}>Email *</label>
                  <input type="email" className={inputClass('email')} placeholder="you@example.com" value={form.email} onChange={e => handleChange('email', e.target.value)} />
                  {errors.email && <p className={errorClass}>{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Section 5: Address */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-[#2B3C5A] mb-4 pb-2 border-b border-gray-200">📍 Address</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className={labelClass}>Address Line 1 *</label>
                  <input type="text" className={inputClass('addressLine1')} placeholder="Building, Street, Area" value={form.addressLine1} onChange={e => handleChange('addressLine1', e.target.value)} />
                  {errors.addressLine1 && <p className={errorClass}>{errors.addressLine1}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Address Line 2</label>
                  <input type="text" className={inputClass('addressLine2')} placeholder="Landmark (optional)" value={form.addressLine2} onChange={e => handleChange('addressLine2', e.target.value)} />
                </div>
                <div>
                  <label className={labelClass}>State *</label>
                  <select className={selectClass('state')} value={form.state} onChange={e => handleChange('state', e.target.value)}>
                    <option value="">-- Select State --</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className={errorClass}>{errors.state}</p>}
                </div>
                <div>
                  <label className={labelClass}>District *</label>
                  <input type="text" className={inputClass('district')} placeholder="Enter district" value={form.district} onChange={e => handleChange('district', e.target.value)} />
                  {errors.district && <p className={errorClass}>{errors.district}</p>}
                </div>
                <div>
                  <label className={labelClass}>PIN Code *</label>
                  <input type="text" className={inputClass('pinCode')} placeholder="6-digit PIN code" maxLength={6} value={form.pinCode} onChange={e => handleChange('pinCode', e.target.value.replace(/\D/g, ''))} />
                  {errors.pinCode && <p className={errorClass}>{errors.pinCode}</p>}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end mt-6">
              <button
                type="submit"
                disabled={isLoading}
                className={`px-8 py-3 rounded-md shadow-md text-white font-semibold text-sm transition-all ${
                  isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading ? 'Submitting...' : 'Complete Registration'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
