// utils/journalUtils.ts
import { startOfWeek, endOfWeek } from 'date-fns';
import { JournalEntry, Insights, MoodCounts } from '../types/journal';

export const calculateStreak = (entries: JournalEntry[]): number => {
  // Implementation for calculating streak
  return entries.length > 0 ? 1 : 0;
};

export const calculateAverageSentiment = (entries: JournalEntry[]): number => {
  if (entries.length === 0) return 0;
  const sum = entries.reduce((total, entry) => total + entry.moodScore, 0);
  return sum / entries.length;
};

export const generateInsights = (entries: JournalEntry[]): Insights => {
  const moodCounts: MoodCounts = entries.reduce((acc, entry) => {
    const mood = entry.moodScore > 0 ? 'Happy' : entry.moodScore === 0 ? 'Neutral' : 'Sad';
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {} as MoodCounts);

  return {
    moodCounts,
    totalEntries: entries.length,
    currentStreak: calculateStreak(entries),
    avgSentiment: calculateAverageSentiment(entries)
  };
};

export const filterEntriesByWeek = (entries: JournalEntry[], week: Date): JournalEntry[] => {
  return entries.filter(entry => {
    const entryDate = new Date(entry.date);
    return entryDate >= startOfWeek(week) && entryDate <= endOfWeek(week);
  });
};