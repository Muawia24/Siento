import Sentiment from 'sentiment';
const sentiment = new Sentiment();

const analyzeMood = (text) => {
    const analysis = sentiment.analyze(text);
    console.log('score:',analysis.score);
    return analysis.score / 10; // Normalize to range (-1 to 1)
};

export default analyzeMood;