import { useCallback, useMemo } from 'react';
import type { Plan, Session, UserProfile } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { generatePlan } from '../utils/generatePlan';

const PLAN_KEY = 'hyroxfit_plan';
const PROFILE_KEY = 'hyroxfit_profile';
const START_DATE_KEY = 'hyroxfit_startDate';

export function usePlan() {
  const [plan, setPlan] = useLocalStorage<Plan | null>(PLAN_KEY, null);
  const [profile, setProfile] = useLocalStorage<UserProfile | null>(PROFILE_KEY, null);

  const initPlan = useCallback(
    (userProfile: UserProfile) => {
      const newPlan = generatePlan(userProfile);
      setPlan(newPlan);
      setProfile(userProfile);
      window.localStorage.setItem(START_DATE_KEY, new Date().toISOString());
      return newPlan;
    },
    [setPlan, setProfile],
  );

  const resetPlan = useCallback(() => {
    setPlan(null);
    setProfile(null);
    window.localStorage.removeItem(START_DATE_KEY);
  }, [setPlan, setProfile]);

  const updateSession = useCallback(
    (sessionId: string, updates: Partial<Session>) => {
      setPlan((prev) => {
        if (!prev) return prev;
        return prev.map((week) => ({
          ...week,
          sessions: week.sessions.map((s) =>
            s.id === sessionId ? { ...s, ...updates } : s,
          ),
        }));
      });
    },
    [setPlan],
  );

  const completeSession = useCallback(
    (sessionId: string, postNotes?: string) => {
      updateSession(sessionId, {
        status: 'done',
        completedAt: new Date().toISOString(),
        postNotes: postNotes || '',
      });
    },
    [updateSession],
  );

  const skipSession = useCallback(
    (sessionId: string) => {
      updateSession(sessionId, { status: 'skipped' });
    },
    [updateSession],
  );

  const allSessions = useMemo(() => {
    if (!plan) return [];
    return plan.flatMap((w) => w.sessions);
  }, [plan]);

  const startDate = useMemo(() => {
    const stored = window.localStorage.getItem(START_DATE_KEY);
    return stored ? new Date(stored) : null;
  }, []);

  return {
    plan,
    profile,
    initPlan,
    resetPlan,
    updateSession,
    completeSession,
    skipSession,
    allSessions,
    startDate,
  };
}
