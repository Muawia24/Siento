import { useState, useEffect } from "react";
import API from "../utils/api";
import axios from "axios";

interface JournalEntry {
    userId: string,
    date: Date,
    moodText: string,
    moodScore: number, // AI-analyzed mood score (-1 to 1)
    aiCiphertext: string, // AI-generated feedback
}
export function useEntries(userId: string | undefined) {

    const [entries, setEntries] = useState<JournalEntry[]>([]); // Stores journal entries
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function fetchentries() {
        setLoading(true);
        setError("");

        try{
            const { data } = await API.get(`/entries/${userId}`);
            console.log(data);
    
            setEntries(data);

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

            console.log(entryText);
            const response = await API.post(`/entries/new`,
                { moodText: entryText }
            );
            console.log(response.data);
            setEntries((prevEntries = []) => [response.data, ...prevEntries]);

        } catch (err) {
            console.log(err)
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
    }, [userId]);
    
    return { entries, loading, error, addEntry, fetchentries };
}