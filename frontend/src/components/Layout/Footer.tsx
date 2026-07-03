import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full">
      {/* Top Footer Section */}
      <div className="bg-[#f0f4f8] border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-gray-700">
          <div>
            <p className="mb-2">Office of DCMSME</p>
            <p className="mb-2">Ministry of MSME</p>
            <p>Kartavya Bhawan 3 - New Delhi</p>
            <div className="mt-4 flex items-center space-x-2">
              <span className="font-bold text-xl">136</span>
              <div className="flex space-x-1">
                <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">𝕏</span>
                <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">f</span>
                <span className="bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">in</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="font-bold text-gray-800 mb-2">Visitor Count</h3>
            <p className="text-gray-500">4463519</p>
          </div>
          <div>
            <h3 className="font-bold text-[#2B3C5A] text-base mb-2 border-b-2 border-blue-400 pb-1 inline-block">Get In Touch</h3>
            <div className="mt-4">
              <p className="font-bold text-[#2B3C5A] mb-1">Email: champions@gov.in</p>
              <p className="font-bold text-blue-600">For Grievances</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Footer Section */}
      <div className="bg-[#f8fafc] py-6 text-xs text-gray-500 text-center border-t border-gray-200">
        <div className="container mx-auto px-4">
          <p className="mb-4">
            Disclaimer: The language translation service available on this portal/website is enabled by AI-based solutions to enhance accessibility and is under continuous improvement. The content is machine-generated and may contain errors.
          </p>
          <p>
            Website Content Managed by Ministry of Micro Small and Medium Enterprises, Government of India<br/>
            Website hosted & managed by <span className="font-semibold text-blue-600">National Informatics Centre, Ministry of Electronics and IT, Government of India</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
