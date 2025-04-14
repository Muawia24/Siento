import { Brain, Sparkles, Calendar, MessageCircle, LineChart, Lock } from 'lucide-react';
import { FeatureCard } from '../components/FeatureCard';

interface HomePageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function HomePage({ onLogin, onSignup }: HomePageProps) {
  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80")'
          }}
        />
        <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-[1px]" />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">MoodMind</span>
            </div>
            <div className="space-x-4">
              <button onClick={onLogin} className="px-4 py-2 text-white hover:text-purple-200">Login</button>
              <button onClick={onSignup} className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition">
                Get Started
              </button>
            </div>
          </nav>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-20">
            <div className="lg:w-1/2">
              <h1 className="text-5xl font-bold text-white mb-6">
                Track Your Mood, Transform Your Life
              </h1>
              <p className="text-xl text-purple-50 mb-8">
                Discover patterns in your emotional well-being with AI-powered insights. Journal your thoughts and let our intelligent system help you understand yourself better.
              </p>
              <button onClick={onSignup} className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition flex items-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span>Start Your Journey</span>
              </button>
            </div>
            <div className="lg:w-1/2">
              <img
                src="https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=800&q=80"
                alt="Person journaling"
                className="rounded-2xl shadow-2xl"
              />
            </div>
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
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1493723843671-1d655e66ac1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80")'
          }}
        />
        <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-[1px]" />
        
        <div className="relative z-10 container mx-auto px-4 text-center py-24">
          <h2 className="text-3xl font-bold mb-6 text-white">Ready to Start Your Journey?</h2>
          <p className="text-xl text-purple-50 mb-8 max-w-2xl mx-auto">
            Join thousands of others who are discovering new insights about themselves through AI-powered journaling.
          </p>
          <button onClick={onSignup} className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition">
            Get Started Free
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="w-6 h-6 text-purple-400" />
            <span className="text-lg font-bold text-white">MoodMind</span>
          </div>
          <p className="text-center text-gray-400">
            © 2024 MoodMind. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}