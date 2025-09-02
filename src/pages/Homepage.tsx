import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, MapPin, Heart, Users, Clock } from 'lucide-react';
import SkyMedLogo from '../components/SkyMedLogo';
import { useTheme } from '../contexts/ThemeContext';

const Homepage: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-600" />,
      title: "Lightning Fast Delivery",
      description: "Emergency medical supplies delivered in under 15 minutes via autonomous drones."
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Secure & Reliable",
      description: "End-to-end encrypted tracking with 99.9% delivery success rate."
    },
    {
      icon: <MapPin className="w-8 h-8 text-purple-600" />,
      title: "Real-time Tracking",
      description: "Live GPS tracking of your medical deliveries with precise ETA updates."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Life-Saving Mission",
      description: "Connecting hospitals, clinics, and patients with critical medical supplies."
    },
    {
      icon: <Users className="w-8 h-8 text-indigo-600" />,
      title: "24/7 Support",
      description: "Round-the-clock emergency response team ready to assist."
    },
    {
      icon: <Clock className="w-8 h-8 text-orange-600" />,
      title: "Emergency Priority",
      description: "Critical deliveries get highest priority with dedicated emergency protocols."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Lives Saved" },
    { number: "50,000+", label: "Deliveries Completed" },
    { number: "98.9%", label: "Success Rate" },
    { number: "12 min", label: "Average Delivery Time" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 sticky top-0 z-50 dark:bg-gray-800/80 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <SkyMedLogo size="md" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">SkyMed</h1>
                <p className="text-xs text-gray-600 dark:text-gray-300">Delivering Life, Anytime, Anywhere</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTheme}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                aria-label="Toggle theme"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </button>
              
              <Link
                to="/login"
                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium dark:text-blue-400"
              >
                Sign In
              </Link>
              
              <Link
                to="/signup"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Emergency Medical
              <span className="text-blue-600 block">Drone Delivery</span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Revolutionizing emergency healthcare with autonomous drone delivery. 
              Get critical medical supplies delivered in minutes, not hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
              >
                Start Emergency Delivery
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              
              <Link
                to="/login"
                className="inline-flex items-center px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-semibold text-lg dark:hover:bg-blue-900/20"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose SkyMed?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Advanced drone technology meets emergency healthcare to save lives when every second counts.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Save Lives?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of healthcare professionals using SkyMed for emergency medical deliveries.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Create Account
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link
              to="/medical-login"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-white/10 transition-colors font-semibold text-lg"
            >
              Medical Professional Login
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <SkyMedLogo size="sm" />
                <span className="text-xl font-bold">SkyMed</span>
              </div>
              <p className="text-gray-400">
                Emergency medical drone delivery service saving lives across the globe.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Services</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Emergency Delivery</li>
                <li>Medical Supplies</li>
                <li>Blood Transport</li>
                <li>Organ Delivery</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>24/7 Emergency Line</li>
                <li>Technical Support</li>
                <li>Training Programs</li>
                <li>Documentation</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Emergency Contact</h3>
              <div className="text-gray-400">
                <p className="text-red-400 font-semibold text-lg">Emergency: 911</p>
                <p>Support: 1-800-SKYMED</p>
                <p>Email: emergency@skymed.com</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SkyMed Emergency Delivery Network. All rights reserved.</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>by</span>
              <span className="font-semibold text-blue-400">Team Helidx</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;