import { useMemo } from 'react';
import type { Session, SessionCategory, Block } from '../types';
import { getBlockForWeek } from '../types';

export function useStats(sessions: Session[]) {
  const completedSessions = useMemo(
    () => sessions.filter((s) => s.status === 'done'),
    [sessions],
  );

  const totalKm = useMemo(
    () =>
      completedSessions
        .filter((s) => s.category === 'run' && s.distance)
        .reduce((sum, s) => sum + (s.distance || 0), 0),
    [completedSessions],
  );

  const completionPercent = useMemo(() => {
    const actionable = sessions.filter((s) => s.category !== 'recovery');
    if (actionable.length === 0) return 0;
    const done = actionable.filter((s) => s.status === 'done').length;
    return Math.round((done / actionable.length) * 100);
  }, [sessions]);

  const categoryBreakdown = useMemo(() => {
    const counts: Record<SessionCategory, number> = { run: 0, crossfit: 0, hyrox: 0, recovery: 0 };
    completedSessions.forEach((s) => counts[s.category]++);
    return [
      { name: 'Course', value: counts.run, fill: '#3B82F6' },
      { name: 'CrossFit', value: counts.crossfit, fill: '#F97316' },
      { name: 'Hyrox', value: counts.hyrox, fill: '#A855F7' },
      { name: 'Récup', value: counts.recovery, fill: '#22C55E' },
    ];
  }, [completedSessions]);

  const weeklyLoad = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const week = i + 1;
      const weekSessions = sessions.filter((s) => s.week === week);
      const done = weekSessions.filter((s) => s.status === 'done');
      const planned = weekSessions.length;
      const intensity = done.length > 0
        ? Math.round(done.reduce((sum, s) => sum + s.intensity, 0) / done.length * 10) / 10
        : 0;
      return {
        week: `S${week}`,
        block: getBlockForWeek(week),
        planned,
        done: done.length,
        intensity,
      };
    });
  }, [sessions]);

  const weekRunCheck = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => {
      const week = i + 1;
      const runs = sessions.filter(
        (s) => s.week === week && s.category === 'run' && s.status === 'done',
      );
      return { week, runs: runs.length, achieved: runs.length >= 2 };
    });
  }, [sessions]);

  const streak = useMemo(() => {
    const sortedDone = completedSessions
      .filter((s) => s.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    if (sortedDone.length === 0) return 0;

    const uniqueDays = new Set(
      sortedDone.map((s) => s.completedAt!.split('T')[0]),
    );
    const days = Array.from(uniqueDays).sort().reverse();

    let count = 0;
    const today = new Date();
    const check = new Date(today);

    for (let i = 0; i < 365; i++) {
      const dateStr = check.toISOString().split('T')[0];
      if (days.includes(dateStr)) {
        count++;
      } else if (i > 0) {
        break;
      }
      check.setDate(check.getDate() - 1);
    }
    return count;
  }, [completedSessions]);

  const blockStats = useMemo(() => {
    const blocks: Block[] = ['base', 'build', 'peak', 'deload'];
    return blocks.map((block) => {
      const blockSessions = sessions.filter(
        (s) => getBlockForWeek(s.week) === block,
      );
      const done = blockSessions.filter((s) => s.status === 'done').length;
      const total = blockSessions.length;
      return { block, done, total, percent: total > 0 ? Math.round((done / total) * 100) : 0 };
    });
  }, [sessions]);

  return {
    completedSessions,
    totalKm,
    completionPercent,
    categoryBreakdown,
    weeklyLoad,
    weekRunCheck,
    streak,
    blockStats,
  };
}
