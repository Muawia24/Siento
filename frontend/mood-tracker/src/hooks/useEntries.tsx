import { useState, useEffect } from "react";
import API from "../utils/api";
import axios from "axios";


interface JournalEntry {
    userId: string,
    date: Date,
    moodText: string,
    moodScore: number, // AI-analyzed mood score (-1 to 1)
    aiResponse: string, // AI-generated feedback
}
export function useEntries(userId: string | undefined) {

    const [entries, setEntries] = useState<JournalEntry[]>([]); // Stores journal entries
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const encryptData = (text: string, publicKey: string) => {
      const key = CryptoJS.enc.Utf8.parse(publicKey.substring(0, 32));
      const encrypted = CryptoJS.AES.encrypt(text, key, { mode: CryptoJS.mode.ECB});
      return encrypted.toString();
    
    }

    const decryptData = (encryptedText: string) => {
        const privateKey = localStorage.getItem('privateKey');

        if (!privateKey) {
            console.error("Private key not found!");
            return "Error: Cannot decrypt";
          }
        
        const key = CryptoJS.enc.Utf8.parse(privateKey.substring(0, 32));
        const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { mode: CryptoJS.mode.ECB});

        return decrypted.toString();
    }

    async function fetchentries() {
        setLoading(true);
        setError("");

        try{
            const { data } = await API.get(`/entries/${userId}`);

            const decryptedEntries = data.map((entry: { moodText: string }) => ({
                ...entry,
                moodText: decryptData(entry.moodText)
            }))
    
            setEntries(decryptedEntries);

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
            const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");

            if (!userInfo || !userInfo.publicKey) {
                console.error("Public key not found");
                return;
              }
            const encryptedText = encryptData(entryText, userInfo.publicKey);
            console.log(entryText);
            const response = await API.post(`/entries/new`,
                { moodText: encryptedText }
            );

            setEntries((prevEntries) => [response.data, ...prevEntries]);

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