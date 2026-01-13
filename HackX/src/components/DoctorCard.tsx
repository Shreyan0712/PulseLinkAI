import { Star, MapPin, Award, Languages, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface DoctorCardProps {
  doctor: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    specialization: string;
    description: string;
    fee: number;
    experience: number;
    languages: string[];
    address: string;
    city: string;
    availability: string;
  };
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  const navigate = useNavigate();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="medical-card p-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
            {getInitials(doctor.name)}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-xl font-semibold mb-1">{doctor.name}</h3>
            <p className="text-sm text-muted-foreground">{doctor.specialization}</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="fill-current" size={16} />
              <span className="font-medium">{doctor.rating}</span>
            </div>
            <span className="text-sm text-muted-foreground">({doctor.reviews} reviews)</span>
          </div>

          <p className="text-sm text-muted-foreground">{doctor.description}</p>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="gap-1">
              <Award size={14} />
              {doctor.experience} years exp.
            </Badge>
            <Badge variant="secondary" className="gap-1">
              <Languages size={14} />
              {doctor.languages.join(', ')}
            </Badge>
            <Badge variant="outline" className="gap-1">
              <Calendar size={14} />
              {doctor.availability}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />
            <span>{doctor.address}, {doctor.city}</span>
          </div>
        </div>

        {/* Action */}
        <div className="shrink-0 flex flex-col justify-between items-end">
          <div className="text-right mb-4">
            <p className="text-2xl font-bold">₹{doctor.fee}</p>
            <p className="text-xs text-muted-foreground">Consultation fee</p>
          </div>

          <Button
            onClick={() => navigate(`/doctor/${doctor.id}`)}
            className="btn-primary w-full md:w-auto"
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DoctorCard;
