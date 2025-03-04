const mongoose = require('mongoose');

const MoodEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    moodText: { type: String, required: true },
    analyzedMood: { type: String },  // AI-generated mood category
    sentimentScore: { type: Number } // AI-generated sentiment score
});

const MoodEntry = mongoose.model('MoodEntry', MoodEntrySchema);

export default MoodEntry;