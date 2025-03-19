import { useState, useEffect } from 'react';
import { MapPin, Navigation, ChevronLeft, Plus, Minus } from 'lucide-react';
import "./app.css";

const DEFAULT_RIDE_SETTINGS = {
  passenger: {
    name: 'Julia',
    dropOffLocation: 'Red Fox Rd',
    dropOffLocationDetails: 'Near Trader Joe\'s, Shoreview, MN',
    estimatedTime: '5 min',
    distance: '3.2 mi'
  }
};

const DriverApp = () => {
  const [isThreeFingerMenuOpen, setIsThreeFingerMenuOpen] = useState(false);
  const [currentRide, setCurrentRide] = useState(() => {
    const savedRideSettings = localStorage.getItem('rideSettings');
    return savedRideSettings ? JSON.parse(savedRideSettings) : DEFAULT_RIDE_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem('rideSettings', JSON.stringify(currentRide));
  }, [currentRide]);

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length >= 2) {
      setIsThreeFingerMenuOpen(true);
      e.preventDefault();
    }
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
    };
  }, []);

  const closeSecretMenu = () => {
    setIsThreeFingerMenuOpen(false);
  };

  const [tempRideSettings, setTempRideSettings] = useState(currentRide);

  useEffect(() => {
    if (isThreeFingerMenuOpen) {
      setTempRideSettings({...currentRide});
    }
  }, [isThreeFingerMenuOpen, currentRide]);

  const handleInputChange = (field: string, value: string) => {
    setTempRideSettings((prev: any) => ({
      ...prev,
      passenger: {
        ...prev.passenger,
        [field]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    setCurrentRide(tempRideSettings);
    closeSecretMenu();
  };

  return (
    <div className="flex flex-col w-full overflow-hidden bg-white min-h-dvh">
      {/* Navigation Card */}
      <div className={"absolute top-0 w-full mx-auto z-10 flex items-center justify-between p-4"}>
        <div className="w-full p-4 text-white bg-black rounded-md">
          <div className="flex items-start">
            <ChevronLeft size={24} className="mt-1 mr-2" />
            <div>
              <div className="flex items-center">
                <span className="mr-2 text-xl font-bold">Country Dr</span>
                <span className="px-1 text-xs text-black bg-white rounded">40 ft</span>
              </div>
              <div className="flex items-center mt-2">
                <MapPin size={16} className="mr-2 text-white" />
                <div>
                  <p className="text-sm">Drop off at {currentRide.passenger.dropOffLocation}</p>
                  <p className="text-xs text-gray-300">{currentRide.passenger.dropOffLocationDetails}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map View with Google Maps iframe */}
      <div className="relative w-full" style={{ height: "calc(100vh - 81px)" }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11347.932237509326!2d-93.13940322066051!3d45.086891926250344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x52b32c9cdbc925e3%3A0x7ab9b4dca85b1e76!2sShoreview%2C%20MN!5e0!3m2!1sen!2sus!4v1710778712075!5m2!1sen!2sus"
          className="flex-1 w-full h-full border-none"
          title="Google Maps"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        {/* Map Controls Overlay */}
        <div className="absolute flex flex-col space-y-2 right-4 top-1/5">
          <button className="flex items-center justify-center w-12 h-12 transition-colors bg-white rounded-full shadow-lg hover:bg-gray-50 active:bg-gray-100">
            <span className="text-2xl font-bold text-gray-700"><Plus /></span>
          </button>
          <button className="flex items-center justify-center w-12 h-12 transition-colors bg-white rounded-full shadow-lg hover:bg-gray-50 active:bg-gray-100">
            <span className="text-2xl font-bold text-gray-700"><Minus /></span>
          </button>
        </div>

        {/* Navigation button */}
        <div className="absolute right-4 bottom-8">
          <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${currentRide.passenger.dropOffLocation},Shoreview,MN&travelmode=driving`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center px-5 py-3 text-white transition-colors bg-black rounded-full shadow-lg hover:bg-gray-800"
          >
            <Navigation size={18} className="mr-2" />
            <span className="font-medium">Navigate</span>
          </a>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-white border-t shadow-md">
        <div className="flex grid items-center justify-between grid-cols-3 px-4 py-4 justify-items-between">
          <div className="flex items-center">
            <div className="flex flex-col items-center mr-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <p className="text-xl font-bold text-black">{currentRide.passenger.estimatedTime}</p>
              <p className="text-sm text-gray-500">{currentRide.passenger.distance}</p>
            </div>
          </div>
          <div className="px-4 py-2 text-black bg-gray-100 rounded-full">
            <p className="text-xs font-medium text-center md:text-sm lg:text-md">Picking up {currentRide.passenger.name}</p>
          </div>
          <div className="flex justify-end">
            <button className="p-2 transition-colors bg-black rounded-full hover:bg-gray-100">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6"></line>
                <line x1="4" y1="12" x2="20" y2="12"></line>
                <line x1="4" y1="18" x2="20" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Three-finger Secret Menu */}
      {isThreeFingerMenuOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-4 text-black bg-black bg-opacity-70">
          <div className="w-full max-w-lg p-6 bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-bold">Admin Controls</h3>

            <div className="mb-6 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">Passenger Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={tempRideSettings.passenger.name}
                  onChange={(e: any) => handleInputChange('name', e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Drop off Location</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={tempRideSettings.passenger.dropOffLocation}
                  onChange={(e: any) => handleInputChange('dropOffLocation', e.target.value)}
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Drop off Location Details</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={tempRideSettings.passenger.dropOffLocationDetails}
                  onChange={(e: any) => handleInputChange('dropOffLocationDetails', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium">ETA</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={tempRideSettings.passenger.estimatedTime}
                    onChange={(e: any) => handleInputChange('estimatedTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 text-sm font-medium">Distance</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded"
                    value={tempRideSettings.passenger.distance}
                    onChange={(e: any) => handleInputChange('distance', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={closeSecretMenu}
                className="flex-1 py-3 bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 py-3 text-white bg-black rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverApp;