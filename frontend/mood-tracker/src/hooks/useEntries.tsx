import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

interface JournalEntry {
    userId: string,
    date: Date,
    moodText: string,
    moodScore: number, // AI-analyzed mood score (-1 to 1)
    aiResponse: string, // AI-generated feedback
}
export function useEntries() {

    const [entries, setEntries] = useState<JournalEntry[]>([]); // Stores journal entries
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchentries() {
        setLoading(true);
        setError("");

        try{
            const response = await axios.get(`${API_BASE_URL}/entries`, {
                withCredentials: true
            });

            setEntries(response.data);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to fetch entries");
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    async function addEntry(entryText: string) {
        setLoading(true);
        setError("");

        try {
            const response = await axios.post(`${API_BASE_URL}/entries/new`,
                { moodText: entryText },
                { withCredentials: true }
            );

            setEntries((prevEntries) => [response.data, ...prevEntries]);

        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(err.response?.data?.message || "Failed to fetch entries");
            } else {
                setError("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    // Fetch entries when component mounts

    useEffect(() => {
        fetchentries();
    }, []);
    
    return { entries, loading, error, addEntry, fetchentries };
}