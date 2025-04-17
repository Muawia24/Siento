import axios from 'axios';

const generateResponse = async (text) => {
    try {
        const response = await axios.post(
            'https://api.together.xyz/v1/chat/completions',
            {
                model: 'mistralai/Mistral-7B-Instruct-v0.1',
                messages: [
                    {
                        role: 'system', 
                        content: `You are an emotional analyst. Return JSON with:
                        1. sentimentScore (-1.0 to 1.0 where -1.0 is extremely negative, 0 is neutral, 1.0 is extremely positive)
                        2. supportResponse (single paragraph combining validation, reflection and action)
                        
                        Score negative for: sadness, anger, frustration, disappointment
                        Score positive for: joy, pride, satisfaction, hope
                        
                        Example outputs:
                        {
                            "sentimentScore": -0.8,
                            "supportResponse": "I hear this is really difficult..."
                        }
                        {
                            "sentimentScore": 0.9,
                            "supportResponse": "That's wonderful! Maybe you could..."
                        }`
                    },
                    { 
                        role: 'user', 
                        content: text 
                    }
                ],
                response_format: { type: "json_object" },
                max_tokens: 200,
                temperature: 0.3
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Parse and validate JSON
        const result = JSON.parse(response.data.choices[0].message.content);
        
        return {
            sentimentScore: result.sentimentScore ?? 0, // Default to neutral
            supportResponse: result.supportResponse || 
                "I hear you're struggling. What would help right now? Try journaling for 5 minutes."
        };

    } catch (error) {
        console.error("API Error:", error);
        return {
            sentimentScore: 0,
            supportResponse: "I'm here to listen. Could you tell me more?"
        };
    }
};

export default generateResponse;