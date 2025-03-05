import axios from axios

require('dotenv').config();

const generateResponse = async (text) => {
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/openassistant/oasst-sft-4-pythia-12b-epoch-3.5',
            { inputs: `Analyze this mood entry and give a supportive response: ${text}` },
            { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
        );
        return response.data.generated_text || "I appreciate you sharing. Stay strong!";
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "I appreciate you sharing. Stay strong!";
    }
};

export default generateResponse;