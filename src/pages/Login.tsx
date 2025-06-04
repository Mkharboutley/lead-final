import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getAuthInstance } from '../services/firebase';
import { getUserRole } from '../services/userRoleUtils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const auth = getAuthInstance();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const role = await getUserRole();
      
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في نظام iVALET"
      });

      // Redirect based on role
      if (role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/entry', { replace: true });
      }
    } catch (err: any) {
      console.error('Login error:', err);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "يرجى التحقق من البريد الإلكتروني وكلمة المرور",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-light tracking-wider text-white mb-8">
            iVALET
          </h1>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          <form onSubmit={handleLogin} className="space-y-6" dir="rtl">
            {/* Email Input */}
            <div className="space-y-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-right h-14 text-lg rounded-xl"
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 text-right h-14 text-lg rounded-xl"
                required
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600/80 to-blue-400/80 hover:from-blue-600/90 hover:to-blue-400/90 text-white py-6 text-lg rounded-xl backdrop-blur-md border border-white/20"
            >
              {isLoading ? '...جاري تسجيل الدخول' : 'تسجيل الدخول'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;