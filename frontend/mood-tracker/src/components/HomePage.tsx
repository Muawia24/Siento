import { Brain, Sparkles, Calendar, MessageCircle, LineChart, Lock } from 'lucide-react';
import { FeatureCard } from './FeatureCard';

interface HomePageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function HomePage({ onLogin, onSignup }: HomePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <nav className="flex justify-between items-center mb-16">
          <div className="flex items-center space-x-2">
            <Brain className="w-8 h-8 text-purple-600" />
            <span className="text-xl font-bold text-gray-800">MoodMind</span>
          </div>
          <div className="space-x-4">
            <button onClick={onLogin} className="px-4 py-2 text-gray-600 hover:text-gray-800">
              Login
            </button>
            <button
              onClick={onSignup}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Get Started
            </button>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Track Your Mood, Transform Your Life</h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover patterns in your emotional well-being with AI-powered insights. Journal your thoughts and let our
              intelligent system help you understand yourself better.
            </p>
            <button
              onClick={onSignup}
              className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Your Journey</span>
            </button>
          </div>
          <div className="lg:w-1/2">
            <img
              src='https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80'
              alt="Person journaling"
              className="rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose MoodMind?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-6 h-6 text-purple-600" />}
              title="AI-Powered Insights"
              description="Our advanced AI analyzes your journal entries to identify patterns and provide personalized insights."
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6 text-purple-600" />}
              title="Daily Mood Tracking"
              description="Track your emotional journey with easy-to-use mood logging and visualization tools."
            />
            <FeatureCard
              icon={<MessageCircle className="w-6 h-6 text-purple-600" />}
              title="Guided Journaling"
              description="Get AI-generated prompts tailored to your emotional state and goals."
            />
            <FeatureCard
              icon={<LineChart className="w-6 h-6 text-purple-600" />}
              title="Progress Analytics"
              description="View detailed charts and trends of your emotional well-being over time."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-purple-600" />}
              title="Private & Secure"
              description="Your journal entries are encrypted and completely private, visible only to you."
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-purple-600" />}
              title="Smart Recommendations"
              description="Receive personalized suggestions for activities and exercises based on your mood."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-purple-50 py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of others who are discovering new insights about themselves through AI-powered journaling.
          </p>
          <button
            onClick={onSignup}
            className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Get Started Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-purple-600" />
            <span className="text-lg font-bold text-gray-800">MoodMind</span>
          </div>
          <p className="text-center text-gray-600">© 2024 MoodMind. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}