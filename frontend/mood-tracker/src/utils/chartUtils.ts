import { JournalEntry } from '../types/journal';

export const getMoodChartData = (entries: JournalEntry[]) => ({
  labels: entries.map(entry => 
    new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  ),
  datasets: [
    {
      label: 'Mood Trend',
      data: entries.map(entry => entry.moodScore),
      borderColor: 'rgb(147, 51, 234)',
      backgroundColor: 'rgba(147, 51, 234, 0.5)',
      tension: 0.4,
      pointBackgroundColor: entries.map(entry => 
        entry.moodScore > 0 ? '#4ade80' : 
        entry.moodScore < 0 ? '#f87171' : '#60a5fa'
      )
    }
  ]
});

export const getSentimentChartData = (entries: JournalEntry[]) => ({
  labels: ['Positive', 'Neutral', 'Negative'],
  datasets: [
    {
      label: 'Sentiment Distribution',
      data: [
        entries.filter(e => e.moodScore > 0).length,
        entries.filter(e => e.moodScore === 0).length,
        entries.filter(e => e.moodScore < 0).length
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.7)',
        'rgba(59, 130, 246, 0.7)',
        'rgba(239, 68, 68, 0.7)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(59, 130, 246, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 1
    }
  ]
});

export const moodChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      callbacks: {
        label: (context: any) => {
          const value = context.raw as number;
          return value === 1 ? 'Happy' : value === 0 ? 'Neutral' : 'Sad';
        }
      }
    }
  },
  scales: {
    y: {
      min: -1,
      max: 1,
      ticks: {
        callback: (value: any) => {
          if (value === 1) return '😊 Happy';
          if (value === 0) return '😐 Neutral';
          if (value === -1) return '😞 Sad';
          return '';
        },
      },
    },
  },
};

export const sentimentChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
  },
};