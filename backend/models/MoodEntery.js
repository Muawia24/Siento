import mongoose from "mongoose";

const MoodEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, default: Date.now },
    entryCiphertext: { type: String, required: true },
    moodScore: { type: Number }, // AI-analyzed mood score (-1 to 1)
    aiCiphertext: { type: String }, // AI-generated feedback
});

const MoodEntry = mongoose.model('MoodEntry', MoodEntrySchema);

export default MoodEntry;