import { useState, useMemo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import DoctorCard from '@/components/DoctorCard';
import doctorsData from '@/mocks/doctors.json';

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
}

const specializations = ['Cardiology', 'Dermatology', 'Pediatrics', 'General Physician', 'Psychiatry'];

const Appointments = () => {
  const [pincode, setPincode] = useState('');
  const [appliedPincode, setAppliedPincode] = useState('');
  const [selectedSpecializations, setSelectedSpecializations] = useState<string[]>([]);
  const [showPincodeModal, setShowPincodeModal] = useState(false);
  const [modalPincode, setModalPincode] = useState('');
  const [modalCity, setModalCity] = useState('');
  const [pincodeError, setPincodeError] = useState('');

  const doctors = doctorsData as Doctor[];

  const validatePincode = (pin: string) => {
    if (pin.length === 0) {
      setPincodeError('');
      return true;
    }
    if (!/^\d{6}$/.test(pin)) {
      setPincodeError('Pincode must be exactly 6 digits');
      return false;
    }
    setPincodeError('');
    return true;
  };

  useEffect(() => {
    validatePincode(pincode);
  }, [pincode]);

  const handlePincodeChange = (value: string) => {
    const digitsOnly = value.replace(/\D/g, '').slice(0, 6);
    setPincode(digitsOnly);
  };

  const handleApplyPincode = () => {
    if (validatePincode(pincode) && pincode.length === 6) {
      const exactMatches = doctors.filter((d) => d.pincode === pincode);
      
      if (exactMatches.length === 0) {
        // No exact matches, show fallback modal
        const cityPrefix = pincode.slice(0, 3);
        const cityDoctors = doctors.filter((d) => d.pincode.startsWith(cityPrefix));
        const fallbackCity = cityDoctors[0]?.city || 'Mumbai';
        
        setModalPincode(pincode);
        setModalCity(fallbackCity);
        setShowPincodeModal(true);
      } else {
        setAppliedPincode(pincode);
      }
    }
  };

  const handleContinueWithCity = () => {
    setAppliedPincode(''); // Clear to show city results
    setShowPincodeModal(false);
  };

  const handleChangePIN = () => {
    setPincode('');
    setAppliedPincode('');
    setShowPincodeModal(false);
  };

  const handleSpecializationToggle = (spec: string) => {
    setSelectedSpecializations((prev) =>
      prev.includes(spec) ? prev.filter((s) => s !== spec) : [...prev, spec]
    );
  };

  const filteredDoctors = useMemo(() => {
    let filtered = doctors;

    if (appliedPincode) {
      filtered = filtered.filter((d) => d.pincode === appliedPincode);
    }

    if (selectedSpecializations.length > 0) {
      filtered = filtered.filter((d) => selectedSpecializations.includes(d.specialization));
    }

    return filtered;
  }, [appliedPincode, selectedSpecializations, doctors]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Find a Doctor</h1>
        <p className="text-muted-foreground">Search for doctors by location and specialization</p>
      </div>

      {/* Filters */}
      <div className="medical-card p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pincode Filter */}
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="pincode"
                  type="text"
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  placeholder="Enter 6-digit pincode"
                  maxLength={6}
                  className={`h-11 ${pincodeError ? 'border-destructive' : ''}`}
                />
                {pincodeError && (
                  <p className="text-xs text-destructive mt-1">{pincodeError}</p>
                )}
              </div>
              <Button
                onClick={handleApplyPincode}
                disabled={pincode.length !== 6 || !!pincodeError}
                className="btn-primary"
              >
                Apply
              </Button>
            </div>
            {appliedPincode && (
              <p className="text-xs text-muted-foreground">
                Showing results for PIN: {appliedPincode}
              </p>
            )}
          </div>

          {/* Specialization Filter */}
          <div className="space-y-3">
            <Label>Specialization</Label>
            <div className="grid grid-cols-2 gap-3">
              {specializations.map((spec) => (
                <div key={spec} className="flex items-center space-x-2">
                  <Checkbox
                    id={spec}
                    checked={selectedSpecializations.includes(spec)}
                    onCheckedChange={() => handleSpecializationToggle(spec)}
                  />
                  <label
                    htmlFor={spec}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {spec}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {(appliedPincode || selectedSpecializations.length > 0) && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPincode('');
                setAppliedPincode('');
                setSelectedSpecializations([]);
              }}
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="space-y-4">
        {filteredDoctors.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No doctors found matching your criteria</p>
          </div>
        ) : (
          filteredDoctors.map((doctor) => <DoctorCard key={doctor.id} doctor={doctor} />)
        )}
      </div>

      {/* Pincode Fallback Modal */}
      <Dialog open={showPincodeModal} onOpenChange={setShowPincodeModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>No Doctors Found</DialogTitle>
            <DialogDescription asChild>
              <div className="space-y-4 pt-4">
                <p>
                  No doctors found in PIN <strong>{modalPincode}</strong>.
                </p>
                <p>
                  Showing results for <strong>{modalCity}</strong> instead.
                </p>
                <div className="flex gap-3">
                  <Button onClick={handleContinueWithCity} className="flex-1 btn-primary">
                    Continue
                  </Button>
                  <Button onClick={handleChangePIN} variant="outline" className="flex-1">
                    Change PIN
                  </Button>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Appointments;
