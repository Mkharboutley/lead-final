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
    <div className="min-h-[100dvh] relative bg-[#1a1f2e] flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 to-purple-500/10 animate-pulse" />
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <div className="absolute w-[200%] h-[100px] top-[10%] left-[-50%] transform rotate-[-5deg] animate-[wave_12s_linear_infinite] bg-blue-500/20" />
            <div className="absolute w-[200%] h-[100px] top-[20%] left-[-50%] transform rotate-[2deg] animate-[wave_14s_linear_infinite] bg-purple-500/20" />
            <div className="absolute w-[200%] h-[100px] top-[30%] left-[-50%] transform rotate-[-3deg] animate-[wave_16s_linear_infinite] bg-indigo-500/20" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-7xl font-light tracking-wider text-white mb-4 animate-fade-in">
            iVALET
          </h1>
        </div>

        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 transition-all duration-500 hover:bg-white/10">
          <form onSubmit={handleLogin} className="space-y-6" dir="rtl">
            <div className="space-y-4">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 text-right h-16 text-lg rounded-2xl transition-all duration-300 focus:bg-black/30 focus:border-white/20"
                required
              />

              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="كلمة المرور"
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-400 text-right h-16 text-lg rounded-2xl transition-all duration-300 focus:bg-black/30 focus:border-white/20"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className={`w-full h-16 text-xl rounded-2xl transition-all duration-500 transform
                ${isLoading 
                  ? 'bg-gray-600/50 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600/80 to-purple-600/80 hover:from-blue-500/90 hover:to-purple-500/90 hover:scale-[1.02]'
                }
                backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(59,130,246,0.5)]
                text-white font-medium`}
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