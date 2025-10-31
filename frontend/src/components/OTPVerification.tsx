import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface OTPVerificationProps {
  phone: string;
  email: string;
  onVerified: () => void;
}

const OTPVerification = ({ phone, email, onVerified }: OTPVerificationProps) => {
  const [phoneOTP, setPhoneOTP] = useState('');
  const [emailOTP, setEmailOTP] = useState('');
  const [phoneOTPSent, setPhoneOTPSent] = useState(false);
  const [emailOTPSent, setEmailOTPSent] = useState(false);
  const [phoneResendCooldown, setPhoneResendCooldown] = useState(0);
  const [emailResendCooldown, setEmailResendCooldown] = useState(0);
  const [generatedPhoneOTP, setGeneratedPhoneOTP] = useState('');
  const [generatedEmailOTP, setGeneratedEmailOTP] = useState('');

  useEffect(() => {
    // Auto-send OTPs on mount
    sendPhoneOTP();
    sendEmailOTP();
  }, []);

  useEffect(() => {
    if (phoneResendCooldown > 0) {
      const timer = setTimeout(() => setPhoneResendCooldown(phoneResendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [phoneResendCooldown]);

  useEffect(() => {
    if (emailResendCooldown > 0) {
      const timer = setTimeout(() => setEmailResendCooldown(emailResendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [emailResendCooldown]);

  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const sendPhoneOTP = () => {
    const otp = generateOTP();
    setGeneratedPhoneOTP(otp);
    setPhoneOTPSent(true);
    setPhoneResendCooldown(30);
    // In UI-only mode, show the OTP in console for testing
    console.log(`Phone OTP for ${phone}: ${otp}`);
    toast.success(`OTP sent to ${phone}`);
  };

  const sendEmailOTP = () => {
    const otp = generateOTP();
    setGeneratedEmailOTP(otp);
    setEmailOTPSent(true);
    setEmailResendCooldown(30);
    // In UI-only mode, show the OTP in console for testing
    console.log(`Email OTP for ${email}: ${otp}`);
    toast.success(`OTP sent to ${email}`);
  };

  const validateOTP = (otp: string) => {
    return /^\d{6}$/.test(otp);
  };

  const handleVerify = () => {
    if (!validateOTP(phoneOTP)) {
      toast.error('Phone OTP must be 6 digits');
      return;
    }

    if (!validateOTP(emailOTP)) {
      toast.error('Email OTP must be 6 digits');
      return;
    }

    if (phoneOTP !== generatedPhoneOTP) {
      toast.error('Invalid phone OTP');
      return;
    }

    if (emailOTP !== generatedEmailOTP) {
      toast.error('Invalid email OTP');
      return;
    }

    toast.success('Verification successful!');
    onVerified();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Verify Your Account</h2>
        <p className="text-sm text-muted-foreground">
          We've sent verification codes to your phone and email
        </p>
      </div>

      {/* Phone OTP */}
      <div className="space-y-3">
        <Label htmlFor="phoneOTP">Phone OTP</Label>
        <div className="flex gap-2">
          <Input
            id="phoneOTP"
            type="text"
            maxLength={6}
            value={phoneOTP}
            onChange={(e) => setPhoneOTP(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit OTP"
            className="h-12 text-center text-lg tracking-widest"
          />
        </div>
        {phoneOTPSent && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Sent to {phone}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={sendPhoneOTP}
              disabled={phoneResendCooldown > 0}
              className="h-8"
            >
              {phoneResendCooldown > 0 ? `Resend in ${phoneResendCooldown}s` : 'Resend OTP'}
            </Button>
          </div>
        )}
      </div>

      {/* Email OTP */}
      <div className="space-y-3">
        <Label htmlFor="emailOTP">Email OTP</Label>
        <div className="flex gap-2">
          <Input
            id="emailOTP"
            type="text"
            maxLength={6}
            value={emailOTP}
            onChange={(e) => setEmailOTP(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit OTP"
            className="h-12 text-center text-lg tracking-widest"
          />
        </div>
        {emailOTPSent && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Sent to {email}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={sendEmailOTP}
              disabled={emailResendCooldown > 0}
              className="h-8"
            >
              {emailResendCooldown > 0 ? `Resend in ${emailResendCooldown}s` : 'Resend OTP'}
            </Button>
          </div>
        )}
      </div>

      <Button
        type="button"
        onClick={handleVerify}
        className="w-full h-12 btn-primary rounded-lg"
        disabled={!phoneOTP || !emailOTP}
      >
        Verify & Continue
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Testing mode: Check browser console for OTP codes
      </p>
    </div>
  );
};

export default OTPVerification;
