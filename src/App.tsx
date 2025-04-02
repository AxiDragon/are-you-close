import { Fragment, useEffect, useState } from "react"
import { Circle, MapContainer, Marker, Polyline, Popup, TileLayer } from "react-leaflet";
import './mapStyleCopy.css';
import L from 'leaflet';

import ownMarker from './assets/own-marker.png';
import randomMarker from './assets/random-marker.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import placeholder from './assets/square-placeholder.jpg';

import { calculateDistance, getRandomLocationInRange } from "./utility";
import ImageWithPreservedAspect from "./ImageWithPreservedAspect";
import { useControlledLocation, useGeolocation } from "./Locater";

const DefaultIcon = L.icon({
  iconUrl: randomMarker,
  shadowUrl: iconShadow,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
  shadowSize: [32, 32],
  shadowAnchor: [8, 32]
});

const OwnIcon = L.icon({
  ...DefaultIcon.options,
  iconUrl: ownMarker,
});

L.Marker.prototype.options.icon = DefaultIcon;

const randomLocationCount = 3;
const randomLocationDistance = 275; //in meters
const randomLocationRange = 25; //in meters

const inRangeDistance = 75; //in meters

function App({ useControls = false }: { useControls?: boolean }) {
  const location = useControls ? useControlledLocation(5) : useGeolocation();
  const [randomLocations, setRandomLocations] = useState<{ latitude: number, longitude: number }[]>([]);
  const [refreshLocations, setRefreshLocations] = useState(false);

  useEffect(() => {
    if (!location || !refreshLocations) {
      return;
    }

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

  useEffect(() => {
    if (!location) {
      return;
    }

    randomLocations.forEach((randomLocation) => {
      const distance = calculateDistance(location.latitude, location.longitude,
        randomLocation.latitude, randomLocation.longitude);

      if (distance <= inRangeDistance) {
        setRefreshLocations(true);
      };
    });

  }, [location]);

  return (
    <div style={{
      fontFamily: 'Arial, sans-serif',
    }}>
      <h1>Are You Close?</h1>
      <p>
        Approach one of the random locations to get new locations, or press the button down below.
      </p>
      {location ? (
        <>
          <p>
            Latitude: {location.latitude}, Longitude: {location.longitude}
          </p>
          <button onClick={() => setRefreshLocations(true)}>Get new locations</button>
          <div>
            <MapContainer
              center={[location.latitude, location.longitude]}
              zoom={16}
              style={{ height: '80vh', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {/* <ImageWithPreservedAspect imageUrl={placeholder} location={location} ratio={0.3} /> */}
              {randomLocations.map((randomLocation, i) => (
                <Fragment key={i}>
                  <Polyline positions={[
                    [location.latitude, location.longitude],
                    [randomLocation.latitude, randomLocation.longitude]
                  ]}
                    color="orange" />
                  <Circle center={[randomLocation.latitude, randomLocation.longitude]} radius={inRangeDistance} color="orange" />
                  <Marker position={[randomLocation.latitude, randomLocation.longitude]} >
                    <Popup>
                      Location {i + 1}
                    </Popup>
                  </Marker>
                </Fragment>
              ))}
              <Marker position={[location.latitude, location.longitude]} icon={OwnIcon}>
                <Popup>
                  You're here!
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
