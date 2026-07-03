import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormContext } from '../context/FormContext';

export const Dashboard: React.FC = () => {
  const { loggedInUser } = useFormContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/step1');
    }
  }, [loggedInUser, navigate]);

  if (!loggedInUser) {
    return null;
  }

  const DataRow = ({ label, value }: { label: string, value: string | undefined | null }) => (
    <div className="flex flex-col sm:flex-row py-3 border-b border-gray-100 last:border-0">
      <div className="sm:w-1/3 text-sm font-semibold text-gray-500">{label}</div>
      <div className="sm:w-2/3 text-sm font-medium text-gray-900">{value || '-'}</div>
    </div>
  );

  return (
    <div className="max-w-[900px] mx-auto py-8">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        
        {/* Header */}
        <div className="bg-[#2B3C5A] px-8 py-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold mb-1">Udyam Registration Certificate</h2>
            <p className="text-blue-200 text-sm">Dashboard for {loggedInUser.username}</p>
          </div>
          <div className="hidden sm:block">
            <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Active
            </span>
          </div>
        </div>

        <div className="p-8">
          
          <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-md text-center">
            <p className="text-green-800 font-semibold mb-1">Udyam Registration Number</p>
            <p className="text-xl md:text-3xl font-bold tracking-widest text-green-900">
              UDYAM-REG-{loggedInUser.id.substring(0, 8).toUpperCase()}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            
            {/* Business Details */}
            <div>
              <h3 className="text-lg font-bold text-[#2B3C5A] border-b-2 border-gray-100 pb-2 mb-4">Enterprise Details</h3>
              <DataRow label="Name of Enterprise" value={loggedInUser.businessName} />
              <DataRow label="Type of Enterprise" value={loggedInUser.typeOfEnterprise} />
              <DataRow label="Type of Organization" value={loggedInUser.typeOfOrganization} />
              <DataRow label="Date of Incorporation" value={loggedInUser.dateOfIncorporation} />
            </div>

            {/* Entrepreneur Details */}
            <div>
              <h3 className="text-lg font-bold text-[#2B3C5A] border-b-2 border-gray-100 pb-2 mb-4">Entrepreneur Details</h3>
              <DataRow label="Name of Entrepreneur" value={loggedInUser.entrepreneurName} />
              <DataRow label="Aadhaar Number" value={"********" + loggedInUser.aadhaarNumber.slice(-4)} />
              <DataRow label="PAN Number" value={loggedInUser.panNumber} />
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-bold text-[#2B3C5A] border-b-2 border-gray-100 pb-2 mb-4">Contact Information</h3>
              <DataRow label="Mobile Number" value={loggedInUser.mobileNumber} />
              <DataRow label="Email" value={loggedInUser.email} />
            </div>

            {/* Address Details */}
            <div>
              <h3 className="text-lg font-bold text-[#2B3C5A] border-b-2 border-gray-100 pb-2 mb-4">Address Details</h3>
              <DataRow label="Address Line 1" value={loggedInUser.addressLine1} />
              <DataRow label="Address Line 2" value={loggedInUser.addressLine2} />
              <DataRow label="State" value={loggedInUser.state} />
              <DataRow label="District" value={loggedInUser.district} />
              <DataRow label="PIN Code" value={loggedInUser.pinCode} />
            </div>

          </div>

          <div className="mt-12 text-center text-xs text-gray-400">
            <p>This is a computer generated certificate and does not require signature.</p>
            <p>Ministry of Micro, Small & Medium Enterprises, Government of India</p>
          </div>
          
        </div>
      </div>
    </div>
  );
};
