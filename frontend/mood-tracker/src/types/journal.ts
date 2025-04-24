export type MoodCounts = Record<string, number>;
export type MoodScore = -1 | 0 | 1;

export interface JournalEntry {
  _id: string;
  date: Date;
  moodText: string;
  moodScore: number;
}

export interface Insights {
  moodCounts: MoodCounts;
  totalEntries: number;
  currentStreak: number;
  avgSentiment: number;
}

export interface JournalPageProps {
  onLogout: () => void;
  onProfile: () => void;
}