import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Profile</h1>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-primary-foreground">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <User size={16} />
                First Name
              </Label>
              <p className="text-lg">{user.firstName}</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <User size={16} />
                Last Name
              </Label>
              <p className="text-lg">{user.lastName}</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <User size={16} />
                Username
              </Label>
              <p className="text-lg">{user.username}</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Calendar size={16} />
                Date of Birth
              </Label>
              <p className="text-lg">{user.dob}</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Mail size={16} />
                Email
              </Label>
              <p className="text-lg break-all">{user.email}</p>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Phone size={16} />
                Phone
              </Label>
              <p className="text-lg">{user.phone}</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={16} />
                Address
              </Label>
              <p className="text-lg">{user.address}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
