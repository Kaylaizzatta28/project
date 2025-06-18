
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login:', { username: formData.username, password: formData.password });
      alert('Login functionality will be implemented with Supabase');
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Password tidak cocok!');
        return;
      }
      console.log('Register:', formData);
      alert('Register functionality will be implemented with Supabase');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-blue-800 relative overflow-hidden">
      {/* Decorative waves */}
      <div className="absolute inset-0">
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
          <path 
            fill="#8B5CF6" 
            fillOpacity="0.3" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
        <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-full">
          <path 
            fill="#A855F7" 
            fillOpacity="0.4" 
            d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,213.3C672,224,768,224,864,208C960,192,1056,160,1152,138.7C1248,117,1344,107,1392,101.3L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Form */}
          <div className="order-2 lg:order-1">
            <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-2 pt-8">
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                  {isLogin ? 'Hello!' : 'Create Account'}
                </CardTitle>
                <p className="text-gray-500 text-sm">
                  {isLogin ? 'Sign in to your account' : 'Join us and start your journey'}
                </p>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="E-mail"
                        className="pl-12 h-14 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-purple-500 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Password"
                        className="pl-12 pr-12 h-14 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-purple-500 text-lg"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-2">
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          placeholder="Confirm Password"
                          className="pl-12 h-14 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:ring-purple-500 text-lg"
                          required
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center space-x-2 text-gray-600">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span>Remember me</span>
                    </label>
                    {isLogin && (
                      <button type="button" className="text-purple-600 hover:text-purple-700">
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold rounded-2xl text-lg shadow-lg transform transition-all duration-200 hover:scale-[1.02]"
                  >
                    {isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                  </Button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-gray-600">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setFormData({ username: '', email: '', password: '', confirmPassword: '' });
                      }}
                      className="text-purple-600 hover:text-purple-700 font-semibold"
                    >
                      {isLogin ? 'Create' : 'Sign in'}
                    </button>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right side - Welcome message */}
          <div className="order-1 lg:order-2 text-center lg:text-left">
            <div className="text-white">
              <h1 className="text-5xl lg:text-6xl font-bold mb-4">
                {isLogin ? 'Welcome Back!' : 'Hello!'}
              </h1>
              <p className="text-xl lg:text-2xl text-white/90 leading-relaxed max-w-lg mx-auto lg:mx-0">
                {isLogin 
                  ? 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
                  : 'Join our community and start managing your business with our powerful tools and features.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
