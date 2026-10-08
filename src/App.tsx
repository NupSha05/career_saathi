import React, { useState } from 'react';
import { CareerSaathiProvider } from './context/CareerSaathiContext';
import { Header } from './components/Header';
import { Navigation, TabType } from './components/Navigation';
import { CommandCenter } from './components/pillars/CommandCenter';
import { Pillar1Profile } from './components/pillars/Pillar1Profile';
import { Pillar2Academics } from './components/pillars/Pillar2Academics';
import { Pillar3CareerIntelligence } from './components/pillars/Pillar3CareerIntelligence';
import { Pillar4OpportunityJD } from './components/pillars/Pillar4OpportunityJD';
import { Pillar5CVIntelligence } from './components/pillars/Pillar5CVIntelligence';
import { Pillar6LinkedInIntelligence } from './components/pillars/Pillar6LinkedInIntelligence';
import { Pillar7Applications } from './components/pillars/Pillar7Applications';
import { Pillar8PracticeCoach } from './components/pillars/Pillar8PracticeCoach';
import { Pillar9Readiness } from './components/pillars/Pillar9Readiness';
import { ActionCenterView } from './components/crossproduct/ActionCenterView';
import { ReportCenterView } from './components/crossproduct/ReportCenterView';
import { AskCareerSaathiDrawer } from './components/crossproduct/AskCareerSaathiDrawer';
import { RAGKnowledgeBaseView } from './components/crossproduct/RAGKnowledgeBaseView';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('command-center');
  const [isAskSaathiOpen, setIsAskSaathiOpen] = useState(false);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'command-center':
        return <CommandCenter setActiveTab={setActiveTab} onOpenAskSaathi={() => setIsAskSaathiOpen(true)} />;
      case 'pillar-1-profile':
        return <Pillar1Profile />;
      case 'pillar-2-academics':
        return <Pillar2Academics />;
      case 'pillar-3-career':
        return <Pillar3CareerIntelligence />;
      case 'pillar-4-opportunity':
        return <Pillar4OpportunityJD />;
      case 'pillar-5-cv':
        return <Pillar5CVIntelligence />;
      case 'pillar-6-linkedin':
        return <Pillar6LinkedInIntelligence />;
      case 'pillar-7-applications':
        return <Pillar7Applications />;
      case 'pillar-8-practice':
        return <Pillar8PracticeCoach />;
      case 'pillar-9-readiness':
        return <Pillar9Readiness />;
      case 'action-center':
        return <ActionCenterView setActiveTab={setActiveTab} />;
      case 'report-center':
        return <ReportCenterView />;
      case 'rag-knowledge-base':
        return <RAGKnowledgeBaseView />;
      default:
        return <CommandCenter setActiveTab={setActiveTab} onOpenAskSaathi={() => setIsAskSaathiOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <Header
        onOpenAskSaathi={() => setIsAskSaathiOpen(true)}
      />

      {/* 9 Pillars & Cross-Product Navigation Bar */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main View Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderActiveTab()}
      </main>

      {/* Grounded AI Assistant Drawer */}
      <AskCareerSaathiDrawer
        isOpen={isAskSaathiOpen}
        onClose={() => setIsAskSaathiOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-[11px] text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>Career Saathi AI • Persistent Personal Career Intelligence Platform</span>
          <span>9 Functional Pillars • Deterministic Engine • Explainable Reasoning</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <CareerSaathiProvider>
      <MainApp />
    </CareerSaathiProvider>
  );
}
