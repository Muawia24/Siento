import { Brain, Sparkles, Calendar, LineChart, Lock, Mail, ChevronRight } from 'lucide-react';
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
            backgroundImage: 'url("https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2400&q=80")',
          }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-[1px]" />
        
        <div className="relative z-10 container mx-auto px-4 py-16">
          <nav className="flex justify-between items-center mb-16">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-white" />
              <span className="text-xl font-bold text-white">Siento</span>
            </div>
            <div className="space-x-4">
              <button 
                onClick={onLogin} 
                className="px-6 py-2.5 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all 
                          font-medium shadow-md hover:shadow-white/20 active:scale-95"
                aria-label="Login"
              >
                Login
              </button>
              <button 
                onClick={onSignup} 
                className="px-6 py-2.5 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all 
                          font-medium shadow-lg hover:shadow-purple-200/50 active:scale-95"
                aria-label="Get Started"
              >
                Get Started
              </button>
            </div>
          </nav>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 py-12 lg:py-20">
            <div className="lg:w-1/2">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Track Your Mood, <span className="text-purple-200">Transform Your Life</span>
              </h1>
              <p className="text-lg sm:text-xl text-purple-50 mb-8 max-w-lg">
                Discover patterns in your emotional well-being with AI-powered insights. Journal your thoughts and let our intelligent system help you understand yourself better.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onSignup} 
                  className="px-8 py-3.5 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all 
                            flex items-center justify-center space-x-2 font-medium shadow-xl hover:shadow-purple-200/50 active:scale-95"
                  aria-label="Start Your Journey"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Start Your Journey</span>
                </button>
                <button 
                  className="px-8 py-3.5 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10 transition-all 
                            flex items-center justify-center space-x-2 font-medium shadow-lg hover:shadow-white/20 active:scale-95"
                  aria-label="See How It Works"
                >
                  <span>See How It Works</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative rounded-2xl shadow-2xl overflow-hidden border-8 border-white">
                <img
                  src="/appScreen.png"
                  alt="Siento app dashboard showing mood tracking features"
                  className="w-full h-auto"
                  loading="lazy"
                  width={800}
                  height={600}
                />
                <div className="absolute inset-0 bg-purple-900/20 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Why Choose Siento?</h2>
            <p className="text-lg text-gray-600">
              We combine cutting-edge AI with proven psychological techniques to help you understand and improve your emotional wellbeing.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Brain className="w-6 h-6 text-purple-600" />}
              title="AI-Powered Insights"
              description="Our advanced AI analyzes your journal entries to identify patterns and provide personalized insights."
              gradient="from-purple-500 to-purple-600"
            />
            <FeatureCard
              icon={<Calendar className="w-6 h-6 text-blue-600" />}
              title="Daily Mood Tracking"
              description="Track your emotional journey with easy-to-use mood logging and visualization tools."
              gradient="from-blue-500 to-blue-600"
            />
            <FeatureCard
              icon={<Mail className="w-6 h-6 text-teal-600" />}
              title="Weekly Emails"
              description="Get weekly notifications of how you've been feeling with actionable suggestions."
              gradient="from-teal-500 to-teal-600"
            />
            <FeatureCard
              icon={<LineChart className="w-6 h-6 text-green-600" />}
              title="Progress Analytics"
              description="View detailed charts and trends of your emotional well-being over time."
              gradient="from-green-500 to-green-600"
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-indigo-600" />}
              title="Private & Secure"
              description="Your journal entries are encrypted and completely private, visible only to you."
              gradient="from-indigo-500 to-indigo-600"
            />
            <FeatureCard
              icon={<Sparkles className="w-6 h-6 text-pink-600" />}
              title="Smart Recommendations"
              description="Receive personalized suggestions for activities and exercises based on your mood."
              gradient="from-pink-500 to-pink-600"
            />
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "Siento helped me identify patterns in my mood swings I never noticed before. The AI insights are surprisingly accurate!",
                name: "Sarah J.",
                role: "Teacher"
              },
              {
                quote: "As someone who's struggled with journaling consistency, the weekly email reminders and prompts have been game-changing.",
                name: "Michael T.",
                role: "Software Engineer"
              },
              {
                quote: "The privacy-first approach gave me confidence to be completely honest in my entries, which made all the difference.",
                name: "Priya K.",
                role: "Therapist"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center mb-4 space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <img 
                    src={`https://randomuser.me/api/portraits/${testimonial.name.includes('Priya') ? 'women' : testimonial.name.includes('Sarah') ? 'women' : 'men'}/${index+30}.jpg`} 
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Video */}
      <div className="bg-white py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">See Siento in Action</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how Siento helps you gain insights into your emotional patterns in just 2 minutes.
            </p>
          </div>
          <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-lg relative max-w-4xl mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center hover:bg-purple-700 
                               transition-all shadow-lg hover:shadow-purple-400/50 active:scale-95">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                </svg>
              </button>
            </div>
            <img 
              src="/video-placeholder.webp" 
              alt="Video placeholder" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600">
        <div className="container mx-auto px-4 text-center py-16 sm:py-24">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-white">Ready to Understand Yourself Better?</h2>
          <p className="text-xl text-purple-50 mb-8 max-w-2xl mx-auto">
            Join users who've discovered new insights about their emotional patterns.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={onSignup} 
              className="px-8 py-3.5 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-all 
                        font-medium flex items-center justify-center space-x-2 shadow-xl hover:shadow-purple-200/50 active:scale-95"
            >
              <Sparkles className="w-5 h-5" />
              <span>Start Free Trial</span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Brain className="w-6 h-6 text-purple-400" />
                <span className="text-lg font-bold">Siento</span>
              </div>
              <p className="text-gray-400 mb-4">
                AI-powered mood tracking and journaling for better mental wellbeing.
              </p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Product</h3>
              <ul className="space-y-2">
                {['Features', 'Pricing', 'Testimonials', 'FAQ'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-2">
                {['About', 'Blog', 'Careers', 'Press'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">Legal</h3>
              <ul className="space-y-2">
                {['Privacy', 'Terms', 'Cookie Policy', 'Contact'].map((item) => (
                  <li key={item}>
                    <a href="#" className="text-gray-400 hover:text-white transition">{item}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-gray-400">
              © {new Date().getFullYear()} Siento. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}