import MoodEntry from "../models/MoodEntery.js";
import analyzeMood from "../utils/moodAnalysis.js";
import generateResponse from "../utils/aiResponse.js";

export default class MoodController {

    static async addNew(req, res) {
        try {
            const { text } = req.body;
            const moodScore = analyzeMood(text); // AI analysis
            const aiResponse = await generateResponse(text); // Hugging Chat AI response
            const newMoodEntry = new MoodEntry({ userId: req.user.id, moodText: text, moodScore, aiResponse });
            await newMoodEntry.save();
            res.status(201).json(newMoodEntry);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async userHistory(req, res) {
        try {
            const moodEntries = await MoodEntry.find({ userId: req.user.id }).sort({ createdAt: -1 });
            res.json(moodEntries);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}