import { useEffect, useRef, useState } from "react";

export function useGeolocation() {
	const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);

	useEffect(() => {
		if (!navigator.geolocation) {
			console.log('Geolocation is not supported by your browser');
			return;
		}

		const watchId = navigator.geolocation.watchPosition((position) => {
			const location = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};
			console.log('Location updated:', location);

			setLocation(location);
		},
			(err) => {
				console.log('Unable to retrieve your location', err);
			},
			{ enableHighAccuracy: true, }
		);

		return () => { navigator.geolocation.clearWatch(watchId); };
	}, []);

	return location;
}

export function useControlledLocation(speed: number) {
	const [location, setLocation] = useState<{ latitude: number, longitude: number } | null>(null);
	const keysPressedRef = useRef<{ [key: string]: boolean }>({});

	useEffect(() => {
		if (!navigator.geolocation) {
			console.log('Geolocation is not supported by your browser');
			return;
		}

		navigator.geolocation.getCurrentPosition((position) => {
			const location = {
				latitude: position.coords.latitude,
				longitude: position.coords.longitude,
			};
			console.log('Location updated:', location);

			setLocation(location);
		});
	}, []);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(event.key)) {
				event.preventDefault();
			}
			keysPressedRef.current[event.key] = true;
		}

		const handleKeyUp = (event: KeyboardEvent) => {
			keysPressedRef.current[event.key] = false;
		}

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		let animationFrameId: number;
		let lastTimestamp: number;

		const moveLocation = (timestamp: number) => {
			if (!location) return;

			if (!lastTimestamp) {
				lastTimestamp = timestamp;
				animationFrameId = requestAnimationFrame(moveLocation);
				return;
			}

			const deltaTime = (timestamp - lastTimestamp) / 1000; // Convert to seconds

			let lat = location.latitude;
			let lng = location.longitude;
			const distance = speed * deltaTime / 1000;

			if (keysPressedRef.current['ArrowUp'] || keysPressedRef.current['w']) {
				lat += distance;
			}
			if (keysPressedRef.current['ArrowDown'] || keysPressedRef.current['s']) {
				lat -= distance;
			}
			if (keysPressedRef.current['ArrowLeft'] || keysPressedRef.current['a']) {
				lng -= distance;
			}
			if (keysPressedRef.current['ArrowRight'] || keysPressedRef.current['d']) {
				lng += distance;
			}

			if (lat !== location.latitude || lng !== location.longitude) {
				setLocation({ latitude: lat, longitude: lng });
			}

			lastTimestamp = timestamp;
			animationFrameId = requestAnimationFrame(moveLocation);
		}

		animationFrameId = requestAnimationFrame(moveLocation);


		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
			cancelAnimationFrame(animationFrameId);
		};
	}, [location]);

	return location;
}