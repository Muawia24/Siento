import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { generateInsights } from './journalUtils.js';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (to, subject, text) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        text
    });
};

export const sendWeeklyEmails = async () => {
    const users = await User.find({});
    const weekStart = startOfWeek(new Date());
    const weekEnd = endOfWeek(new Date());
  
    for (const user of users) {
      const entries = await Entry.find({
        userId: user._id,
        date: { $gte: weekStart, $lte: weekEnd },
      });

        const insights = generateInsights(entries);
  
        const moodDistribution = Object.entries(insights.moodCounts)
        .map(([mood, count]) => `${mood}: ${count} entries`)
        .join('\n');

        const htmlContent = `
            <h1>Your Weekly Mood Summary</h1>
            <p>Here's how you felt this week (${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d')}):</p>
            
            <h2>📊 Stats</h2>
            <ul>
            <li>Total entries: ${insights.totalEntries}</li>
            <li>Current streak: ${insights.currentStreak} days</li>
            <li>Average sentiment: ${insights.avgSentiment > 0 ? 'Positive' : insights.avgSentiment < 0 ? 'Negative' : 'Neutral'}</li>
            </ul>
            
            <h2>😊 Mood Distribution</h2>
            <pre>${moodDistribution}</pre>
            
            <h2>📝 Recent Entries</h2>
            ${entries.slice(0, 3).map(entry => `
            <div style="margin-bottom: 15px; border-left: 3px solid #7c3aed; padding-left: 10px;">
                <p><strong>${format(new Date(entry.date), 'MMM d, h:mm a')}</strong></p>
                <p>${entry.content}</p>
                <p>Mood: ${entry.moodScore > 0 ? '😊 Happy' : entry.moodScore === 0 ? '😐 Neutral' : '😞 Sad'}</p>
            </div>
            `).join('')}
            
            <p>Keep up the good work! Reflecting on your feelings is an important step toward mindfulness.</p>
        `;

        await transporter.sendMail({
            from: '"MoodMind Team" <noreply@moodmind.com>',
            to: email,
            subject: `Your Weekly Mood Summary - ${format(new Date(), 'MMMM d, yyyy')}`,
            html: htmlContent,
        });
    }
};