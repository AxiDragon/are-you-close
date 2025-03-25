import { useEffect, useRef, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import './mapStyleCopy.css';
import L from 'leaflet';

import icon from './assets/placeholder-marker.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const randomLocationCount = 3;

function App() {
  const previousLocation = useRef<{ latitude: number, longitude: number } | null>(null);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [randomLocations, setRandomLocations] = useState<{ latitude: number, longitude: number }[]>([]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(null);
      console.log('Geolocation is not supported by your browser');
    }

    const locateInterval = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      }, (err) => {
        setLocation(null);
        console.log('Unable to retrieve your location', err);
      });
    }, 1000);

    return () => {
      clearInterval(locateInterval);
    };
  }, []);

  useEffect(() => {
    if (!location) {
      return;
    }

    if (previousLocation.current &&
      previousLocation.current.latitude === location.latitude &&
      previousLocation.current.longitude === location.longitude
    ) {
      return;
    }

    previousLocation.current = location;

    const newRandomLocations = [];

    for (let i = 0; i < randomLocationCount; i++) {
      newRandomLocations.push({
        latitude: location.latitude + (Math.random() * 0.1) - 0.05,
        longitude: location.longitude + (Math.random() * 0.1) - 0.05,
      });
    }

    setRandomLocations(newRandomLocations);
  }, [location]);

  return (
    <div>
      <h1>Geolocation</h1>
      {location ? (
        <>
          <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>

          <div>
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={13}
              style={{ height: '80vh', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {randomLocations.map((location, i) => (
                <Marker key={i} position={[location.latitude, location.longitude]} >
                  <Popup>
                    whatsup gamer, this is location {i}
                  </Popup>
                </Marker>
              ))}
              <Marker position={[location.latitude, location.longitude]} >
                <Popup>
                  whatsup gamer
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </>
      ) : (
        <p>Loading
          <span>...</span>
        </p>
      )}
    </div>
  )
}

export default App
