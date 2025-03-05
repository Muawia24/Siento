import MoodEntry from "../models/MoodEntery";
import analyzeMood from "../utils/moodAnalysis";
import generateResponse from "../utils/aiResponse";

export default class MoodController {

    static async addNew(req, res) {
        try {
            const { text } = req.body;
            const moodScore = analyzeMood(text); // AI analysis
            const aiResponse = await generateResponse(text); // Hugging Chat AI response
            const newMoodEntry = new MoodEntry({ userId: req.user.id, text, moodScore, aiResponse });
            await newMoodEntry.save();
            res.status(201).json(newMoodEntry);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async userHistory(req, res) {
        try {
            const moodEntries = await MoodEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
            res.json(moodEntries);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
}