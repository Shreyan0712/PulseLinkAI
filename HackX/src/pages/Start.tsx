import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MessageSquare, UserPlus, LogIn } from 'lucide-react';
import brandLogo from '../assets/brand-logo.png';
import '../styles/animated-bg.css'; // 👈 add this line (we’ll create this file next)


const Start = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 animated-gradient">
      <div className="w-full max-w-md text-center space-y-8">
        
        {/* Logo */}
        <div className="mx-auto flex items-center justify-center">
          <img
            src={brandLogo}
            alt="PulseLink AI Logo"
            className="w-64 h-auto object-contain shadow-lg hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 mt-6">
          <Link to="/signup" className="block">
            <Button className="w-full h-14 text-lg btn-primary rounded-xl shadow-md">
              <UserPlus className="mr-2 h-5 w-5" />
              Sign Up
            </Button>
          </Link>

          <Link to="/login" className="block">
            <Button 
              variant="outline" 
              className="w-full h-14 text-lg rounded-xl border-2 hover:bg-primary/10 shadow-sm"
            >
              <LogIn className="mr-2 h-5 w-5" />
              Login
            </Button>
          </Link>

          <Link to="/quick-chat" className="block">
            <Button 
              variant="ghost" 
              className="w-full h-14 text-lg rounded-xl hover:bg-secondary/50"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Quick Chat (Guest)
            </Button>
          </Link>
        </div>

        <p className="text-sm text-muted-foreground">
          AI-powered voice & chat assistant for seamless healthcare
        </p>
      </div>
    </div>
  );
};

export default Start;
