'use client';

import { useState, useEffect } from 'react';
import GapEulBridge from './bridge';
import OnboardingPage from './onboarding';
import DashboardPage from './dashboard'; 

type AppStep = 'ONBOARDING' | 'BRIDGE' | 'DASHBOARD';

export default function Home() {
  const [currentStep, setCurrentStep] = useState<AppStep>('ONBOARDING');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [contractText, setContractText] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [fileName, setFileName] = useState<string>('');  // ⭐ 추가

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    const html = document.documentElement;
    if (isDarkMode) html.classList.add('dark');
    else html.classList.remove('dark');
  }, [isDarkMode]);

  const goToBridge = () => setCurrentStep('BRIDGE');
  
  // ⭐ 추가: 뒤로가기 함수 (완전 초기화)
  const goBackToBridge = () => {
    setContractText('');
    setAnalysisResult(null);
    setFileName('');
    setCurrentStep('BRIDGE');
  };

  if (currentStep === 'ONBOARDING') {
    return (
      <OnboardingPage 
        onEnterClick={goToBridge} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
      />
    );
  }

  if (currentStep === 'BRIDGE') {
    return (
      <GapEulBridge 
        onAnalyzeComplete={(text, result, filename) => {  // ⭐ filename 추가
          setContractText(text);
          setAnalysisResult(result);
          setFileName(filename);  // ⭐ 추가
          setCurrentStep('DASHBOARD');
        }} 
      />
    );
  }

  // ⭐ Dashboard - 모든 props 전달
  return (
    <DashboardPage 
      contractText={contractText}
      analysisResult={analysisResult}
      fileName={fileName}  // ⭐ 추가
      onBack={goBackToBridge}  // ⭐ 추가
      isDarkMode={isDarkMode}  // ⭐ 추가
      toggleTheme={toggleTheme}  // ⭐ 추가
    />
  );
}