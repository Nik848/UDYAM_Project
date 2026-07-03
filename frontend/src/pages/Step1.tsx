import React, { useEffect } from 'react';
import { DynamicForm } from '../components/Form/DynamicForm';
import { useFormContext } from '../context/FormContext';

export const Step1: React.FC = () => {
  const { setCurrentStepIndex } = useFormContext();

  useEffect(() => {
    setCurrentStepIndex(0);
  }, [setCurrentStepIndex]);

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
        <div className="border-t-[3px] border-[#3B82F6] px-8 py-6">
          <h2 className="text-2xl font-bold text-[#2B3C5A] text-center mb-6">
            Aadhaar Verification
          </h2>
          <hr className="border-[#3B82F6] mb-8" />
          
          <div className="px-2 md:px-6 pb-6">
            <DynamicForm />
          </div>
        </div>
      </div>
    </div>
  );
};
