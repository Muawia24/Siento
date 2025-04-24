import { startOfWeek, endOfWeek, differenceInDays, isSameDay } from 'date-fns';

export function generateInsights(entries) {
  if (!entries || entries.length === 0) {
    return {
      moodCounts: { Happy: 0, Neutral: 0, Sad: 0 },
      totalEntries: 0,
      currentStreak: 0,
      avgSentiment: 0,
      moodTrend: []
    };
  }

  // Calculate mood distribution
  const moodCounts = entries.reduce((acc, entry) => {
    const mood = 
      entry.moodScore > 0 ? 'Happy' :
      entry.moodScore === 0 ? 'Neutral' : 'Sad';
    acc[mood] = (acc[mood] || 0) + 1;
    return acc;
  }, {});

  // Calculate average sentiment (-1 to 1)
  const avgSentiment = entries.reduce((sum, entry) => sum + entry.moodScore, 0) / entries.length;

  // Calculate current streak
  const sortedEntries = [...entries]
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  
  let currentStreak = 0;
  let prevDate = null;
  
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    
    if (!prevDate || isSameDay(entryDate, prevDate)) {
      continue;
    }
    
    if (!prevDate || differenceInDays(prevDate, entryDate) === 1) {
      currentStreak++;
      prevDate = entryDate;
    } else {
      break;
    }
  }

  // Calculate weekly mood trend
  const moodTrend = entries.reduce((acc, entry) => {
    const dateStr = new Date(entry.date).toISOString().split('T')[0];
    const existingDay = acc.find(item => item.day === dateStr);
    
    if (existingDay) {
      existingDay.score = (existingDay.score + entry.moodScore) / 2;
    } else {
      acc.push({
        day: dateStr,
        score: entry.moodScore
      });
    }
    
    return acc;
  }, []).sort((a, b) => new Date(a.day) - new Date(b.day));

  return {
    moodCounts,
    totalEntries: entries.length,
    currentStreak: currentStreak > 0 ? currentStreak + 1 : currentStreak,
    avgSentiment: parseFloat(avgSentiment.toFixed(2)),
    moodTrend
  };
}