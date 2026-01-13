import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/authContext';
import brandLogo from '@/assets/brand-logo.png';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: logo + brand */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={brandLogo}
            alt="PulseLink AI Logo"
            className="w-80 h-25 object-contain"
          />
        </Link>

        {/* Right: welcome + logout */}
        <div className="flex items-center gap-4">
          {user && (
            <span className="text-sm text-muted-foreground">
              Welcome, {user.firstName}
            </span>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
