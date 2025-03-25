import { useEffect, useRef, useState } from "react"
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import './mapStyleCopy.css';
import L from 'leaflet';

import icon from './assets/placeholder-marker.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { getRandomLocationInRange } from "./utility";

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
const randomLocationDistance = 275; //in meters
const randomLocationRange = 25; //in meters

function App() {
  const previousLocation = useRef<{ latitude: number, longitude: number } | null>(null);
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
  const [randomLocations, setRandomLocations] = useState<{ latitude: number, longitude: number }[]>([]);
  const [refreshLocations, setRefreshLocations] = useState(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(null);
      console.log('Geolocation is not supported by your browser');
    }

    const calculatePosition = () => {
      return new Promise<void>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          resolve();
        }, (err) => {
          setLocation(null);
          console.log('Unable to retrieve your location', err);
          reject(err);
        });
      });
    }

    const locateInterval = setInterval(() => {
      calculatePosition();
    }, 1000);

    calculatePosition().then(() => {
      setRefreshLocations(true);
    });

    return () => {
      clearInterval(locateInterval);
    };
  }, []);

  useEffect(() => {
    if (!location || !refreshLocations) {
      return;
    }

    previousLocation.current = location;
    setRefreshLocations(false);

    const newRandomLocations = [];

    for (let i = 0; i < randomLocationCount; i++) {
      newRandomLocations.push(
        getRandomLocationInRange(location.latitude, location.longitude,
          randomLocationDistance - randomLocationRange, randomLocationDistance + randomLocationRange)
      );
    }

    setRandomLocations(newRandomLocations);
  }, [refreshLocations]);

  return (
    <div>
      <h1>Geolocation</h1>
      {location ? (
        <>
          <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>
          <button onClick={() => setRefreshLocations(true)}>Get new locations</button>
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
      )
      }
    </div >
  )
}

export default App
