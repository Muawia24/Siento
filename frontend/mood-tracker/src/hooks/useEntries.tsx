import { useState, useEffect } from "react";
import API from "../utils/api";
import axios from "axios";

interface JournalEntry {
    _id: string,
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

    async function deleteEntry(entryId: string) {
        try {
          // Make API call to delete entry
          await API.delete(`/entries/delete/${entryId}`);
          // Refetch entries or update local state
          // ... implementation depends on your API setup ...
        } catch (error) {
          // Handle error
          console.log(error);
        }
      };

    // Fetch entries when component mounts

    useEffect(() => {
        fetchentries();
    }, [userId]);
    
    return { entries, loading, error, addEntry, deleteEntry, fetchentries };
}