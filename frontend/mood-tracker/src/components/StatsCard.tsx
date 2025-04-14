// components/StatsCard.tsx
import React from 'react';
import { BookOpen, Smile, Frown, Calendar, Activity } from 'lucide-react';
import { Insights } from '../types/journal';

type CardColor = 'purple' | 'green' | 'blue' | 'amber' | 'red' | 'gray';

interface StatsCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  value: string | number;
  color: CardColor;
}

const colorClasses = {
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
    border: 'border-purple-100',
    icon: 'text-purple-600',
    title: 'text-purple-700',
    value: 'text-purple-900'
  },
  green: {
    bg: 'bg-gradient-to-br from-green-50 to-green-100',
    border: 'border-green-100',
    icon: 'text-green-600',
    title: 'text-green-700',
    value: 'text-green-900'
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-blue-100',
    icon: 'text-blue-600',
    title: 'text-blue-700',
    value: 'text-blue-900'
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
    border: 'border-amber-100',
    icon: 'text-amber-600',
    title: 'text-amber-700',
    value: 'text-amber-900'
  },
  red: {
    bg: 'bg-gradient-to-br from-red-50 to-red-100',
    border: 'border-red-100',
    icon: 'text-red-600',
    title: 'text-red-700',
    value: 'text-red-900'
  },
  gray: {
    bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
    border: 'border-gray-100',
    icon: 'text-gray-600',
    title: 'text-gray-700',
    value: 'text-gray-900'
  }
};

export const StatsCard: React.FC<StatsCardProps> = ({ 
  icon: Icon, 
  title, 
  value, 
  color 
}) => {
  const classes = colorClasses[color];
  
  return (
    <div className={`${classes.bg} rounded-xl p-4 border ${classes.border}`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${classes.icon}`} />
        <h4 className={`text-sm font-semibold ${classes.title}`}>{title}</h4>
      </div>
      <p className={`text-2xl font-bold ${classes.value}`}>{value}</p>
    </div>
  );
};

export const StatsGrid: React.FC<{ insights: Insights }> = ({ insights }) => {
  // Determine mood color and icon based on most common mood
  const mostCommonMood = (Object.entries(insights.moodCounts) as [string, number][])
    .sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';
  
  const getMoodConfig = () : { color: CardColor; icon: React.ComponentType<{ className?: string }> }=> {
    if (!mostCommonMood) return { color: 'gray', icon: Smile };
    
    const mood = mostCommonMood.toLowerCase();
    
    if (mood.includes('sad') || mood.includes('angry') || mood.includes('depressed')) {
      return { color: 'red', icon: Frown };
    }
    if (mood.includes('happy') || mood.includes('joy') || mood.includes('excited')) {
      return { color: 'green', icon: Smile };
    }
    if (mood.includes('neutral') || mood.includes('normal') || mood.includes('ok')) {
      return { color: 'blue', icon: Smile };
    }
    return { color: 'gray', icon: Smile }; // default
  };

  const moodConfig = getMoodConfig();

  // Determine sentiment color
  const sentimentColor = insights.avgSentiment > 0 ? 'green' : 
                        insights.avgSentiment < 0 ? 'red' : 'blue';

  return (
    <div className="grid grid-cols-2 gap-4">
      <StatsCard 
        icon={BookOpen}
        title="Total Entries"
        value={insights.totalEntries}
        color="purple"
      />
      <StatsCard 
        icon={moodConfig.icon}
        title="Most Common Mood"
        value={mostCommonMood}
        color={moodConfig.color}
      />
      <StatsCard 
        icon={Calendar}
        title="Active Streak"
        value={`${insights.currentStreak} days`}
        color="blue"
      />
      <StatsCard 
        icon={Activity}
        title="Avg. Sentiment"
        value={insights.avgSentiment > 0 ? 'Positive' : insights.avgSentiment < 0 ? 'Negative' : 'Neutral'}
        color={sentimentColor}
      />
    </div>
  );
};