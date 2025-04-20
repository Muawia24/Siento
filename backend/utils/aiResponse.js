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
                        1. sentimentScore (-1.0 to 1.0)
                        2. supportResponse (validation + reflection + actionable suggestion)
                        
                        SCORING GUIDE:
                        -1.0 to -0.6: Severe distress (crisis, despair, trauma)
                        -0.5 to -0.3: Moderate negativity (frustration, disappointment)
                        -0.2 to 0.2: Neutral/mixed (mundane, ambivalent, tired)
                        0.3 to 0.6: Mild positivity (hopeful, content, accomplished)
                        0.7 to 1.0: Strong positivity (joy, excitement, pride)

                        NEGATIVE CUES: "hate", "failure", "exhausted", "anxious", "regret"
                        NEUTRAL CUES: "okay", "meh", "whatever", "tired", "normal"
                        POSITIVE CUES: "happy", "proud", "excited", "grateful", "relieved"
                        
                        EXAMPLES:
                        {
                            "sentimentScore": -0.8,
                            "supportResponse": "This sounds incredibly painful. It makes sense you'd feel this way. Would taking a small step like [concrete action] help you feel slightly more in control?"
                        }
                        {
                            "sentimentScore": -0.4,
                            "supportResponse": "That frustration is completely valid. When I feel stuck like this, I sometimes find [specific strategy] helpful. Would that resonate with you?"
                        }
                        {
                            "sentimentScore": 0.1,
                            "supportResponse": "It sounds like you're feeling somewhat neutral about this. Sometimes just noticing that is valuable. Maybe check in again after [timeframe]?"
                        }`
                    },
                    { 
                        role: 'user', 
                        content: text 
                    }
                ],
                response_format: { type: "json_object" },
                max_tokens: 200,
                temperature: 0.2
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Parse and validate JSON
        console.log(response.data.choices[0].message.content);
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