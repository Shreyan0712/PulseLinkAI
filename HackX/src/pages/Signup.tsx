import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import OTPVerification from '@/components/OTPVerification';
import brandLogo from '@/assets/brand-logo.png';

const Signup = () => {
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dob: undefined as Date | undefined,
    username: '',
    password: '',
    retypePassword: '',
    email: '',
    phone: '+91',
    address: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRetypePassword, setShowRetypePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSymbol,
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      hasSymbol,
    };
  };

  const passwordValidation = validatePassword(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordValidation.isValid) {
      toast.error('Password does not meet requirements');
      return;
    }

    if (formData.password !== formData.retypePassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (!formData.dob) {
      toast.error('Please select your date of birth');
      return;
    }

    setStep('otp');
  };

  const handleOTPVerified = async () => {
    setIsLoading(true);
    try {
      const success = await signup({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        username: formData.username,
        phone: formData.phone,
        dob: formData.dob ? format(formData.dob, 'dd/MM/yyyy') : '',
        address: formData.address,
        password: formData.password,
      });

      if (success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        toast.error('Username or email already exists');
        setStep('form');
      }
    } catch (error) {
      toast.error('An error occurred during signup');
      setStep('form');
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 'otp') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md medical-card p-6">
          <OTPVerification
            phone={formData.phone}
            email={formData.email}
            onVerified={handleOTPVerified}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-60 h-25 mx-auto overflow-hidden flex items-center justify-center">
           <img
           src={brandLogo}
          alt="PulseLink AI Logo"
          className="w-full h-full object-contain"
         />
  </div>

          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Join PulseLink AI for better healthcare</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="medical-card p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth (dd/mm/yyyy) *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full h-11 justify-start text-left font-normal',
                    !formData.dob && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.dob ? format(formData.dob, 'dd/MM/yyyy') : 'Select date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.dob}
                  onSelect={(date) => setFormData({ ...formData, dob: date })}
                  disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                  initialFocus
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date().getFullYear()}
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username *</Label>
            <Input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.password && (
              <div className="text-xs space-y-1">
                <div className={passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'}>
                  ✓ At least 8 characters
                </div>
                <div className={passwordValidation.hasUpperCase ? 'text-green-600' : 'text-muted-foreground'}>
                  ✓ One uppercase letter
                </div>
                <div className={passwordValidation.hasLowerCase ? 'text-green-600' : 'text-muted-foreground'}>
                  ✓ One lowercase letter
                </div>
                <div className={passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'}>
                  ✓ One number
                </div>
                <div className={passwordValidation.hasSymbol ? 'text-green-600' : 'text-muted-foreground'}>
                  ✓ One special character
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="retypePassword">Retype Password *</Label>
            <div className="relative">
              <Input
                id="retypePassword"
                type={showRetypePassword ? 'text' : 'password'}
                value={formData.retypePassword}
                onChange={(e) => setFormData({ ...formData, retypePassword: e.target.value })}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowRetypePassword(!showRetypePassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showRetypePassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.retypePassword && formData.password !== formData.retypePassword && (
              <p className="text-xs text-destructive">Passwords do not match</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="h-11"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 btn-primary rounded-lg"
            disabled={isLoading}
          >
            Continue to Verification
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-foreground hover:underline font-medium">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
