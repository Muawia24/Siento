import axios from 'axios';

const generateResponse = async (text) => {
    try {
        const response = await axios.post(
            'https://api-inference.huggingface.co/models/facebook/blenderbot-400M-distill',
            { inputs: `Analyze this mood entry and give a supportive response: ${text}` },
            { headers: { Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}` } }
        );
        console.log(response.data);
        return response.data[0]. generated_text //|| "I appreciate you sharing. Stay strong!";
    } catch (error) {
        console.error("Error generating AI response:", error);
        return "I appreciate you sharing. Stay strong!";
    }
};

export default generateResponse;