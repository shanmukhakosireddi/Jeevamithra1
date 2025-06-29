import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Users, 
  Lock, 
  Eye, 
  EyeOff,
  Loader2,
  Heart,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useLocalAuth } from '../../hooks/useLocalAuth';

interface LocalAuthScreenProps {
  teluguMode: boolean;
}

interface RegisterForm {
  fullName: string;
  email: string;
  phone: string;
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  password: string;
  confirmPassword: string;
}

interface LoginForm {
  email: string;
  password: string;
}

export const LocalAuthScreen: React.FC<LocalAuthScreenProps> = ({ teluguMode }) => {
  const { login, register } = useLocalAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });

  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    fullName: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await login(loginForm.email, loginForm.password);
      
      if (!result.success) {
        let errorMessage = result.error || (teluguMode ? 'లాగిన్ విఫలమైంది' : 'Login failed');
        
        // Translate common errors
        if (result.error?.includes('Invalid email or password')) {
          errorMessage = teluguMode ? 'తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్' : 'Invalid email or password';
        } else if (result.error?.includes('required')) {
          errorMessage = teluguMode ? 'ఇమెయిల్ మరియు పాస్‌వర్డ్ అవసరం' : 'Email and password are required';
        }
        
        setError(errorMessage);
      } else {
        setSuccess(teluguMode ? 'విజయవంతంగా లాగిన్ అయ్యారు!' : 'Successfully logged in!');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(teluguMode ? 'లాగిన్ విఫలమైంది' : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError(teluguMode ? 'పాస్‌వర్డ్‌లు సరిపోలలేదు' : 'Passwords do not match');
      setLoading(false);
      return;
    }

    if (registerForm.password.length < 6) {
      setError(teluguMode ? 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి' : 'Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    if (!registerForm.fullName || !registerForm.phone || !registerForm.age || !registerForm.gender) {
      setError(teluguMode ? 'దయచేసి అన్ని ఫీల్డ్‌లను పూరించండి' : 'Please fill all fields');
      setLoading(false);
      return;
    }

    try {
      const result = await register(
        registerForm.email,
        registerForm.password,
        registerForm.fullName,
        registerForm.phone,
        parseInt(registerForm.age),
        registerForm.gender as 'male' | 'female' | 'other'
      );

      if (!result.success) {
        let errorMessage = result.error || (teluguMode ? 'రిజిస్ట్రేషన్ విఫలమైంది' : 'Registration failed');
        
        // Translate common errors
        if (result.error?.includes('Email already in use')) {
          errorMessage = teluguMode ? 'ఈ ఇమెయిల్ ఇప్పటికే వాడుకలో ఉంది' : 'Email already in use';
        } else if (result.error?.includes('Invalid email')) {
          errorMessage = teluguMode ? 'చెల్లని ఇమెయిల్' : 'Invalid email format';
        } else if (result.error?.includes('All fields are required')) {
          errorMessage = teluguMode ? 'అన్ని ఫీల్డ్‌లు అవసరం' : 'All fields are required';
        }
        
        setError(errorMessage);
      } else {
        setSuccess(teluguMode ? 'విజయవంతంగా రిజిస్టర్ అయ్యారు!' : 'Successfully registered!');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(teluguMode ? 'రిజిస్ట్రేషన్ విఫలమైంది' : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Demo accounts for testing
  const demoAccounts = [
    { email: 'demo@jeevamithra.com', password: 'demo123', name: 'Demo User' },
    { email: 'farmer@village.com', password: 'farmer123', name: 'Village Farmer' },
    { email: 'student@school.com', password: 'student123', name: 'Student User' }
  ];

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setLoginForm({
      email: account.email,
      password: account.password
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {teluguMode ? 'జీవమిత్ర' : 'Jeevamithra'}
          </h1>
          <p className="text-gray-600">
            {teluguMode ? 'మీ గ్రామ సహాయకుడు' : 'Your Village Assistant'}
          </p>
          <div className="mt-2 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
            {teluguMode ? '🔒 స్థానిక డేటాబేస్' : '🔒 Local Database'}
          </div>
        </div>

        {/* Auth Form */}
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Toggle Buttons */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                isLogin 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {teluguMode ? 'లాగిన్' : 'Login'}
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError(null);
                setSuccess(null);
              }}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                !isLogin 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {teluguMode ? 'రిజిస్టర్' : 'Register'}
            </button>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Demo Accounts (only for login) */}
          {isLogin && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <h4 className="text-sm font-medium text-blue-800 mb-3">
                {teluguMode ? '🧪 డెమో ఖాతాలు:' : '🧪 Demo Accounts:'}
              </h4>
              <div className="space-y-2">
                {demoAccounts.map((account, index) => (
                  <button
                    key={index}
                    onClick={() => fillDemoAccount(account)}
                    className="w-full text-left p-2 bg-white rounded-lg hover:bg-blue-50 transition-colors text-xs"
                  >
                    <div className="font-medium text-blue-800">{account.name}</div>
                    <div className="text-blue-600">{account.email}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Login Form */}
          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder={teluguMode ? 'ఇమెయిల్' : 'Email'}
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={teluguMode ? 'పాస్‌వర్డ్' : 'Password'}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{teluguMode ? 'లాగిన్ అవుతున్నాము...' : 'Logging in...'}</span>
                  </>
                ) : (
                  <span>{teluguMode ? 'లాగిన్' : 'Login'}</span>
                )}
              </button>
            </form>
          ) : (
            /* Register Form */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={teluguMode ? 'పూర్తి పేరు' : 'Full Name'}
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({...registerForm, fullName: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  placeholder={teluguMode ? 'ఇమెయిల్' : 'Email'}
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    placeholder={teluguMode ? 'ఫోన్' : 'Phone'}
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div className="relative">
                  <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    placeholder={teluguMode ? 'వయస్సు' : 'Age'}
                    value={registerForm.age}
                    onChange={(e) => setRegisterForm({...registerForm, age: e.target.value})}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="120"
                    required
                  />
                </div>
              </div>

              <div className="relative">
                <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <select
                  value={registerForm.gender}
                  onChange={(e) => setRegisterForm({...registerForm, gender: e.target.value as any})}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">{teluguMode ? 'లింగం ఎంచుకోండి' : 'Select Gender'}</option>
                  <option value="male">{teluguMode ? 'పురుషుడు' : 'Male'}</option>
                  <option value="female">{teluguMode ? 'స్త్రీ' : 'Female'}</option>
                  <option value="other">{teluguMode ? 'ఇతర' : 'Other'}</option>
                </select>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder={teluguMode ? 'పాస్‌వర్డ్' : 'Password'}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder={teluguMode ? 'పాస్‌వర్డ్ నిర్ధారించండి' : 'Confirm Password'}
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{teluguMode ? 'రిజిస్టర్ అవుతున్నాము...' : 'Registering...'}</span>
                  </>
                ) : (
                  <span>{teluguMode ? 'రిజిస్టర్' : 'Register'}</span>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            {teluguMode 
              ? '🔒 మీ డేటా స్థానికంగా మీ బ్రౌజర్‌లో సురక్షితంగా నిల్వ చేయబడుతుంది'
              : '🔒 Your data is securely stored locally in your browser'
            }
          </p>
        </div>
      </div>
    </div>
  );
};