import { startOfWeek, endOfWeek } from 'date-fns';
import { useState, useEffect } from "react";
import API from "../utils/api";
import axios from "axios";

interface JournalEntry {
    _id: string,
    userId: string,
    date: Date,
    moodText: string,
    moodScore: number,
    aiResponse: string,
}
export function useEntries(userId: string | undefined) {

    const [entries, setEntries] = useState<JournalEntry[]>([]); // Stores journal entries
    const [currentWeek] = useState(new Date());
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const weekStart = startOfWeek(currentWeek);
     const weekEnd = endOfWeek(currentWeek);

    async function fetchentries(weekStart: Date, weekEnd: Date) {
        setLoading(true);
        setError("");

        try{
            const { data } = await API.get(`/entries/${userId}`, {
                params: {
                  startDate:weekStart.toISOString(),
                  endDate: weekEnd.toISOString()
                }
                });
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
            return response.data;

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

        return null;
    }

    async function deleteEntry(entryId: string) {
        try {
          await API.delete(`/entries/delete/${entryId}`);

        } catch (error) {
          console.log(error);
        }
      };

    // Fetch entries when component mounts
    useEffect(() => {
        fetchentries(weekStart, weekEnd);
    }, [userId]);

    
    return { entries, loading, error, addEntry, deleteEntry, fetchentries };
}