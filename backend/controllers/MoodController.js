import MoodEntry from "../models/MoodEntery.js";
import analyzeMood from "../utils/moodAnalysis.js";
import generateResponse from "../utils/aiResponse.js";
import { encryptData, decryptData } from "../utils/encryption.js";

export default class MoodController {

    static async addNew(req, res) {
        try {
            const { moodText } = req.body;
            console.log(`mood text: ${moodText}`);
            const moodScore = analyzeMood(moodText); // AI analysis
            const encryptedText = encryptData(moodText);
            const aiResponse = await generateResponse(moodText); // Hugging Chat AI response
            const aiCiphertext = encryptData(aiResponse);
            const newMoodEntry = new MoodEntry({ userId: req.user.id, entryCiphertext: encryptedText, moodScore, aiCiphertext });
            await newMoodEntry.save();

            res.status(201).json({
                _id: newMoodEntry._id,
                userId: req.user.id,
                date: newMoodEntry.date,
                moodText,
                moodScore,
                aiResponse,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        }
    }

    static async deleteEntry(req, res) {
        try {
            const journalEntry = await MoodEntry.findById(req.params.id);
        
            if (!journalEntry) {
              return res.status(404).json({ error: "Journal entry not found" });
            }
        
            // Ensure the logged-in user owns the journal entry
            if (journalEntry.userId.toString() !== req.user.id) {
              return res.status(401).json({ error: "Not authorized to delete this entry" });
            }
        
            await journalEntry.deleteOne();
        
            res.json({ message: "Journal entry deleted successfully" });
          } catch (error) {
            console.error("Error deleting journal entry:", error);
            res.status(500).json({ error: "Server error" });
          }
    }

    static async userHistory(req, res) {
        try {
            const { startDate, endDate } = req.query;
            const moodEntries = await MoodEntry.find({ 
                userId: req.user.id,
                date: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                  }
             }).sort({ date: -1 });
            const decryptedEntries = moodEntries.map(entry => ({
                ...entry._doc,
                moodText: decryptData(entry.entryCiphertext),
                aiResponse: decryptData(entry.aiCiphertext),
            }))
            console.log(decryptedEntries);
            res.json(decryptedEntries);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
        }
    }
}