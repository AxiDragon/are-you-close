import { useEffect, useState } from "react"

function App() {
  const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation(null);
      console.log('Geolocation is not supported by your browser');
    }

    const locateInterval = setInterval(() => {
      console.log('Locating…');
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

  return (
    <div>
      <h1>Geolocation</h1>
      {location ? (
        <p>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </p>
      ) : (
        <p>Loading
          <span>...</span>
        </p>
      )}
    </div>
  )
}

export default App
