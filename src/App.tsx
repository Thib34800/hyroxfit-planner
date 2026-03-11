import { useState, useCallback } from 'react';
import type { View, Session, UserProfile } from './types';
import { usePlan } from './hooks/usePlan';
import Layout from './components/Layout';
import WelcomeScreen from './views/WelcomeScreen';
import PlanView from './views/PlanView';
import TodayView from './views/TodayView';
import DashboardView from './views/DashboardView';
import HistoryView from './views/HistoryView';
import WodRouletteView from './views/WodRouletteView';
import TimerView from './views/TimerView';
import SessionModal from './components/SessionModal';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('today');
  const [historySession, setHistorySession] = useState<Session | null>(null);

  const {
    plan,
    profile,
    initPlan,
    resetPlan,
    updateSession,
    completeSession,
    skipSession,
    allSessions,
  } = usePlan();

  const handleComplete = useCallback(
    (id: string, postNotes?: string) => {
      completeSession(id, postNotes);
    },
    [completeSession],
  );

  const handleReset = useCallback(() => {
    if (window.confirm('Régénérer un nouveau plan ? Les données actuelles seront perdues.')) {
      resetPlan();
    }
  }, [resetPlan]);

  const handleStart = useCallback(
    (userProfile: UserProfile) => {
      initPlan(userProfile);
    },
    [initPlan],
  );

  // No plan yet — show welcome questionnaire
  if (!plan) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <Layout currentView={currentView} onNavigate={setCurrentView}>
      {currentView === 'plan' && (
        <PlanView
          plan={plan}
          onComplete={handleComplete}
          onSkip={skipSession}
          onUpdate={updateSession}
          onReset={handleReset}
        />
      )}
      {currentView === 'today' && (
        <TodayView
          plan={plan}
          onComplete={handleComplete}
          onSkip={skipSession}
          onUpdate={updateSession}
        />
      )}
      {currentView === 'dashboard' && (
        <DashboardView sessions={allSessions} />
      )}
      {currentView === 'history' && (
        <>
          <HistoryView sessions={allSessions} onClick={setHistorySession} />
          {historySession && (
            <SessionModal
              session={historySession}
              onClose={() => setHistorySession(null)}
              onComplete={(id, notes) => {
                handleComplete(id, notes);
                setHistorySession(null);
              }}
              onSkip={(id) => {
                skipSession(id);
                setHistorySession(null);
              }}
              onUpdate={updateSession}
            />
          )}
        </>
      )}
      {currentView === 'wod' && (
        <WodRouletteView level={profile?.globalLevel || 2} />
      )}
      {currentView === 'timer' && (
        <TimerView />
      )}
    </Layout>
  );
}
