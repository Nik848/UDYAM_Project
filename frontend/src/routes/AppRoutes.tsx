import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Step1 } from '../pages/Step1';
import { Step2 } from '../pages/Step2';
import { FormProvider } from '../context/FormContext';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { ProgressBar } from '../components/ProgressBar';
import { Dashboard } from '../pages/Dashboard';

export const AppRoutes: React.FC = () => {
  return (
    <FormProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        
        {/* Banner Section */}
        <div className="w-full bg-gradient-to-r from-[#2B3C5A] to-[#4A6793] text-white py-12 flex justify-center items-center shadow-inner relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://udyamregistration.gov.in/images/pattern.png')] bg-repeat"></div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-wide relative z-10">Udyam Registration</h2>
        </div>

        <main className="flex-grow bg-[#EAF2EC] bg-opacity-30 relative py-12">
          {/* subtle background pattern could be added here */}
          <div className="absolute inset-0 opacity-5 bg-[url('https://udyamregistration.gov.in/images/pattern.png')] bg-repeat"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <Routes>
              <Route path="/" element={<Navigate to="/step1" replace />} />
              <Route path="/step1" element={<Step1 />} />
              <Route path="/step2" element={<Step2 />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </main>
        
        <Footer />
      </div>
    </FormProvider>
  );
};
