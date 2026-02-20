import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChefHat, Search, Flame, Lightbulb, Bookmark, Plus, ArrowRight, Star } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function Landing() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const navigate = useNavigate();

  const features = [
    {
      id: 1,
      icon: Search,
      title: 'Smart Search by Ingredient',
      description: 'Find delicious recipes using ingredients you have at home. Our AI-powered search makes cooking easier than ever.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      icon: Flame,
      title: 'Taste-Based Filtering',
      description: 'Filter meals by taste profile - spicy, mild, sweet, savory, and more. Customize your culinary experience.',
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 3,
      icon: Lightbulb,
      title: 'AI-Powered Meal Q&A',
      description: 'Ask our intelligent AI assistant about calories, cooking methods, substitutions, and nutrition facts.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 4,
      icon: Bookmark,
      title: 'Save & Manage Meals',
      description: 'Create personalized collections of your favorite recipes and meals for quick access anytime.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      id: 5,
      icon: Plus,
      title: 'Add Custom Recipes',
      description: 'Share your own culinary creations with the community and build your personal recipe library.',
      color: 'from-yellow-500 to-orange-400'
    },
    {
      id: 6,
      icon: Star,
      title: 'Premium Experience',
      description: 'Enjoy ad-free browsing, advanced filters, and exclusive recipes with our premium membership.',
      color: 'from-indigo-500 to-purple-500'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Search or Add a Meal',
      description: 'Browse our extensive meal database or add your own recipes to get started.'
    },
    {
      number: '02',
      title: 'Explore Details',
      description: 'View comprehensive information about ingredients, nutritional values, and cooking instructions.'
    },
    {
      number: '03',
      title: 'Ask AI for Insights',
      description: 'Get personalized recommendations and answers about your meals from our smart AI.'
    }
  ];

  return (
    <div className="bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white overflow-hidden">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center px-4 pt-20 pb-10">
        <div className="max-w-6xl mx-auto text-center z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8 border border-white/20 hover:border-white/40 transition">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium">Welcome to the Future of Cooking</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Discover <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Smart Recipes</span> with AI
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Find the perfect meal by ingredients, taste, and nutrition. Get AI-powered insights and build your personal recipe collection in one beautiful app.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button onClick={() => navigate('/signup')} className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg font-semibold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition transform hover:scale-105 flex items-center gap-2 justify-center">
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>
            <button onClick={() => navigate('/login')} className="px-8 py-4 border-2 border-white/30 rounded-lg font-semibold text-lg hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition transform hover:scale-105">
              Login
            </button>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features Built for Food Lovers
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Everything you need to discover, create, and share amazing meals
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="group relative p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 transition duration-300 cursor-pointer overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition duration-300 -z-10`}></div>

                  {/* Icon */}
                  <div className={`mb-4 w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center group-hover:scale-110 transition transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 group-hover:bg-clip-text transition">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 group-hover:text-gray-100 transition">
                    {feature.description}
                  </p>

                  {/* Arrow */}
                  <div className="mt-4 flex items-center gap-2 text-sm font-semibold opacity-0 group-hover:opacity-100 transition transform group-hover:translate-x-1">
                    Learn More
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                {/* Step Card */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 hover:border-white/40 transition h-full">
                  <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-gray-300">{step.description}</p>
                </div>

                {/* Arrow */}
                {index < steps.length - 1 && (
                  <div className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-purple-500" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 opacity-80"></div>
            <div className="absolute inset-0 bg-black opacity-30"></div>

            {/* Content */}
            <div className="relative px-8 py-20 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Cooking?
              </h2>
              <p className="text-lg text-gray-100 mb-10 max-w-2xl mx-auto">
                Join thousands of food enthusiasts discovering new recipes and getting AI-powered meal insights every day.
              </p>
              <button onClick={() => navigate('/signup')} className="px-10 py-4 bg-white text-purple-600 font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-white/50 transition transform hover:scale-105">
                Get Started Now
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
