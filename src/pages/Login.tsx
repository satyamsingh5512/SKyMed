import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader, Shield, LogIn, X, ArrowRight, Zap, Globe, Heart, Cpu, Wifi, Plus, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import AeroVitaLogo from '../components/AeroVitaLogo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentVideo, setCurrentVideo] = useState(0);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  // Video URLs - replace these with your actual video URLs
  const videoUrls = [
    'mediafiles/SkyMed_Autonomous_Medical_Delivery.mp4', // First video
    'mediafiles/Video_Clarity_and_Generation.mp4'  // Second video
  ];

  useEffect(() => {
    setIsVisible(true);
    
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (!video1 || !video2) return;

    const handleVideoEnd = () => {
      setCurrentVideo(prev => (prev === 0 ? 1 : 0));
    };

    const handleVideoError = (e: Event) => {
      console.log('Video failed to load, continuing without video');
      // Continue with the page even if videos fail
    };

    // Set up event listeners for both videos
    video1.addEventListener('ended', handleVideoEnd);
    video2.addEventListener('ended', handleVideoEnd);
    video1.addEventListener('error', handleVideoError);
    video2.addEventListener('error', handleVideoError);

    // Start with the first video
    video1.style.opacity = '1';
    video2.style.opacity = '0';
    
    // Try to play video, but don't block if it fails
    video1.play().catch(() => {
      console.log('Video autoplay failed, continuing without video');
    });

    return () => {
      video1.removeEventListener('ended', handleVideoEnd);
      video2.removeEventListener('ended', handleVideoEnd);
      video1.removeEventListener('error', handleVideoError);
      video2.removeEventListener('error', handleVideoError);
    };
  }, []);

  useEffect(() => {
    const video1 = video1Ref.current;
    const video2 = video2Ref.current;

    if (!video1 || !video2) return;

    if (currentVideo === 0) {
      video1.style.opacity = '1';
      video2.style.opacity = '0';
      video1.play().catch(() => console.log('Video 1 play failed'));
      video2.pause();
    } else {
      video1.style.opacity = '0';
      video2.style.opacity = '1';
      video2.play().catch(() => console.log('Video 2 play failed'));
      video1.pause();
    }
  }, [currentVideo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data, error } = await signIn(email, password);

    if (error) {
      setError(error.message);
    } else {
      navigate('/');
    }

    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        if (error.message.includes('missing OAuth secret') || error.message.includes('validation_failed')) {
          setError('Google login is enabled but not fully configured. Please use email login for now.');
        } else {
          setError(error.message);
        }
      }
    } catch (err) {
      setError('Google login is not available. Please use email login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with Gradient Fallback */}
      <div className="absolute inset-0 z-0">
        {/* Gradient Background as fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-800"></div>
        
        {/* First Video - Only load if videos exist */}
        <video
          ref={video1Ref}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ display: 'none' }}
          onLoadedData={() => {
            if (video1Ref.current) {
              video1Ref.current.style.display = 'block';
            }
          }}
        >
          <source src={videoUrls[0]} type="video/mp4" />
        </video>

        {/* Second Video - Only load if videos exist */}
        <video
          ref={video2Ref}
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
          style={{ display: 'none' }}
          onLoadedData={() => {
            if (video2Ref.current) {
              video2Ref.current.style.display = 'block';
            }
          }}
        >
          <source src={videoUrls[1]} type="video/mp4" />
        </video>

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50 z-10"></div>
      </div>

      {/* Floating Login Button */}
      <button
        onClick={() => setShowLoginForm(true)}
        className="fixed top-6 right-6 z-50 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 hover:scale-110 shadow-2xl"
      >
        <LogIn className="w-6 h-6" />
      </button>

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-6xl mx-auto">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <AeroVitaLogo size="xl" />
            </div>

            {/* Hero Content */}
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              <span className="block animate-pulse">AeroVita</span>
              <span className="block text-3xl md:text-4xl font-light text-blue-300 mt-2">
                Autonomous Emergency Response Network
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-200 mb-12 font-light">
              Delivering Life When Every Second Counts
            </p>

            {/* Key Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-white mb-3">75%</div>
                <div className="text-blue-300 font-medium text-lg">Faster Than Ambulances</div>
                <div className="text-gray-300 text-sm mt-2">10 km in under 15 minutes</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-white mb-3">94%</div>
                <div className="text-green-300 font-medium text-lg">Success Rate</div>
                <div className="text-gray-300 text-sm mt-2">Reliable & Resilient Network</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold text-white mb-3">24/7</div>
                <div className="text-purple-300 font-medium text-lg">Always Active</div>
                <div className="text-gray-300 text-sm mt-2">Overcoming all barriers</div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="bg-red-500/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Life-Saving Innovation</h3>
                <p className="text-gray-300 text-sm">Cutting-edge drones & ground robots delivering critical medical supplies</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="bg-blue-500/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Safe & Secure</h3>
                <p className="text-gray-300 text-sm">Temperature-controlled, GPS-tracked, tamper-proof smart containers</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="bg-purple-500/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Cpu className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">AI-Powered Logistics</h3>
                <p className="text-gray-300 text-sm">Dynamic route optimization, predictive demand analysis, real-time monitoring</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="bg-green-500/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Hybrid Network</h3>
                <p className="text-gray-300 text-sm">Aerial drones + ground robots for seamless multi-modal delivery</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="bg-yellow-500/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Wifi className="w-6 h-6 text-yellow-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Hospital Integration</h3>
                <p className="text-gray-300 text-sm">API-based connection with hospital & emergency response systems</p>
              </div>

              <div className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group">
                <div className="bg-pink-500/20 p-3 rounded-full w-12 h-12 mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-6 h-6 text-pink-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">Humanitarian Impact</h3>
                <p className="text-gray-300 text-sm">Equal and equitable access to urgent healthcare across all geographies</p>
              </div>
            </div>


          </div>
        </div>
      </div>

      {/* Login Modal */}
      {showLoginForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowLoginForm(false)}></div>
          
          <div className="relative bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-700/50 shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowLoginForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-8">
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <AeroVitaLogo size="lg" />
                </div>
                <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-gray-300">Sign in to your AeroVita account</p>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                      Email address
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800/80 text-white placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full pl-10 pr-10 py-2 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-800/80 text-white placeholder-gray-400"
                        placeholder="Enter your password"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        ) : (
                          <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-800/50">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-800"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link
                      to="/forgot-password"
                      className="font-medium text-blue-400 hover:text-blue-300"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? (
                      <Loader className="h-4 w-4 animate-spin" />
                    ) : (
                      'Sign in with Email'
                    )}
                  </button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-600" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-gray-900/95 text-gray-400">Or continue with</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full flex justify-center items-center py-3 px-4 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 bg-gray-800/80 hover:bg-gray-700/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <Link
                    to="/medical-login"
                    className="w-full flex justify-center items-center py-3 px-4 border border-blue-600 rounded-lg text-sm font-medium text-blue-300 bg-blue-900/20 hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Medical Professional Login
                  </Link>
                </div>

                <div className="text-center">
                  <span className="text-sm text-gray-400">
                    Don't have an account?{' '}
                    <Link
                      to="/signup"
                      className="font-medium text-blue-400 hover:text-blue-300"
                    >
                      Sign up
                    </Link>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;