import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Star, MapPin, Award, Languages, ArrowLeft } from 'lucide-react';
import doctorsData from '@/mocks/doctors.json';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Doctor {
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
  pincode: string;
  availability: string;
  slots: Record<string, Record<string, string[]>>;
}

const DoctorBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const doctor = (doctorsData as Doctor[]).find((d) => d.id === id);

  if (!doctor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Doctor not found</h2>
          <Button onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const availableDates = useMemo(() => {
    return Object.keys(doctor.slots).map((dateStr) => new Date(dateStr));
  }, [doctor.slots]);

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate) return null;
    const dateStr = format(selectedDate, 'yyyy-MM-dd');
    return doctor.slots[dateStr] || null;
  }, [selectedDate, doctor.slots]);

  const handleConfirmBooking = () => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select date and time slot');
      return;
    }
    setShowConfirmModal(true);
  };

  const handleFinalConfirm = () => {
    toast.success('Appointment booked successfully!');
    setShowConfirmModal(false);
    setTimeout(() => {
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6"
        >
          <ArrowLeft className="mr-2" size={18} />
          Back to Dashboard
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Doctor Info */}
          <div className="space-y-6">
            <div className="medical-card p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shrink-0">
                  {getInitials(doctor.name)}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">{doctor.name}</h1>
                  <p className="text-muted-foreground">{doctor.specialization}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="fill-current" size={16} />
                      <span className="font-medium">{doctor.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({doctor.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{doctor.description}</p>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Award size={16} className="text-muted-foreground" />
                  <span>{doctor.experience} years of experience</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Languages size={16} className="text-muted-foreground" />
                  <span>{doctor.languages.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin size={16} className="text-muted-foreground" />
                  <span>{doctor.address}, {doctor.city}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Consultation Fee</span>
                  <span className="text-2xl font-bold">₹{doctor.fee}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking */}
          <div className="space-y-6">
            {/* Date Picker */}
            <div className="medical-card p-6">
              <h2 className="text-xl font-semibold mb-4">Select Date</h2>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  setSelectedSlot('');
                }}
                disabled={(date) => {
                  const isAvailable = availableDates.some(
                    (d) => format(d, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                  );
                  return !isAvailable || date < new Date();
                }}
                className="pointer-events-auto rounded-md border"
                captionLayout="dropdown-buttons"
                fromYear={new Date().getFullYear()}
                toYear={new Date().getFullYear() + 1}
              />
            </div>

            {/* Time Slots */}
            {selectedDate && slotsForSelectedDate && (
              <div className="medical-card p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Available Slots - {format(selectedDate, 'dd MMM yyyy')}
                </h2>
                <div className="space-y-4">
                  {Object.entries(slotsForSelectedDate).map(([session, slots]) => (
                    <div key={session}>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2 capitalize">
                        {session}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {slots.map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedSlot === slot ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              selectedSlot === slot && 'btn-primary'
                            )}
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Confirm Button */}
            <Button
              onClick={handleConfirmBooking}
              disabled={!selectedDate || !selectedSlot}
              className="w-full h-12 btn-primary"
            >
              Confirm & Pay
            </Button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Appointment</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Doctor</p>
                  <p className="font-medium">{doctor.name}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">
                    {selectedDate && format(selectedDate, 'dd MMM yyyy')} at {selectedSlot}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Consultation Fee</p>
                  <p className="font-medium">₹{doctor.fee}</p>
                </div>
                <div className="pt-4 border-t">
                  <Button onClick={handleFinalConfirm} className="w-full btn-primary">
                    Confirm Booking
                  </Button>
                </div>
                <p className="text-xs text-center text-muted-foreground">
                  Mock payment - no actual transaction
                </p>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DoctorBooking;
