import React from 'react';
import { useFormContext } from '../context/FormContext';

export const ProgressBar: React.FC = () => {
  const { schema, currentStepIndex } = useFormContext();
  const steps = schema?.steps || [];

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-center">
        {steps.map((step: any, index: number) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;

          return (
            <React.Fragment key={step.id}>
              {/* Step indicator */}
              <div className="flex flex-col items-center relative">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 transition-colors ${
                    isActive 
                      ? 'bg-primary text-white ring-4 ring-blue-100' 
                      : isCompleted 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <div className={`mt-2 text-xs font-medium ${isActive || isCompleted ? 'text-gray-900' : 'text-gray-500'}`}>
                  {step.title}
                </div>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-1 mx-2 mt-[-20px] transition-colors ${
                    isCompleted ? 'bg-green-500' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
