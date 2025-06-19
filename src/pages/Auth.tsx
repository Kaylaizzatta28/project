import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    agreeTerms: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      console.log('Login:', { email: formData.email, password: formData.password });
      // Simulasi login berhasil - navigasi ke dashboard
      navigate('/dashboard');
    } else {
      console.log('Register:', formData);
      // Simulasi register berhasil - navigasi ke dashboard
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 min-h-[600px]">
            {/* Left side - Blue section with branding */}
            <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 p-12 flex flex-col justify-center relative overflow-hidden">
              {/* Wave decoration */}
              <div className="absolute right-0 top-0 bottom-0 w-32">
                <svg 
                  viewBox="0 0 100 400" 
                  className="h-full w-full text-white/10"
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M0,0 Q50,100 0,200 T0,400 L100,400 L100,0 Z" 
                    fill="currentColor"
                  />
                </svg>
              </div>
              
              {/* Logo and branding */}
              <div className="relative z-10">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-white rounded-sm transform rotate-45"></div>
                    </div>
                  </div>
                  <h1 className="text-3xl font-bold text-white mb-2">Welcome to</h1>
                  <h2 className="text-4xl font-bold text-white">Spacer</h2>
                </div>
                
                <p className="text-blue-100 text-lg leading-relaxed max-w-sm">
                  Lorem ipsum dolor sit amet, consectetur 
                  adipiscing elit, sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua.
                </p>
              </div>
            </div>

            {/* Right side - Form section */}
            <div className="p-12 flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {isLogin ? 'Sign In' : 'Create your account'}
                  </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <Input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        placeholder="Enter your name"
                        className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                        required={!isLogin}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail Address
                    </label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter your email"
                      className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Enter your password"
                      className="h-12 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>

                  {!isLogin && (
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="terms"
                        checked={formData.agreeTerms}
                        onCheckedChange={(checked) => handleInputChange('agreeTerms', checked as boolean)}
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600">
                        I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms & Conditions</span>
                      </label>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button 
                      type="submit" 
                      className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
                    >
                      {isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                    
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsLogin(!isLogin);
                        setFormData({ name: '', email: '', password: '', agreeTerms: false });
                      }}
                      className="flex-1 h-12 border-gray-300 text-gray-600 font-semibold rounded-lg hover:bg-gray-50"
                    >
                      {isLogin ? 'Sign Up' : 'Sign In'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
