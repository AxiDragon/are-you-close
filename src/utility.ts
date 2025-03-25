// don't ask me about this, like, I kinda understand it, but not entirely
const R = 6378137; // Earth's radius in meters

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
	const dLat = (lat2 - lat1) * Math.PI / 180;
	const dLon = (lon2 - lon1) * Math.PI / 180;
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c; // Distance in meters
}

export function getRandomLocationAtDistance(lat: number, lon: number, distance: number): { latitude: number, longitude: number } {
	const distanceRadians = distance / R;

	const bearing = Math.random() * 2 * Math.PI;
	const lat1 = lat * Math.PI / 180;
	const lon1 = lon * Math.PI / 180;

	const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distanceRadians) +
		Math.cos(lat1) * Math.sin(distanceRadians) * Math.cos(bearing));
	const lon2 = lon1 + Math.atan2(Math.sin(bearing) * Math.sin(distanceRadians) * Math.cos(lat1),
		Math.cos(distanceRadians) - Math.sin(lat1) * Math.sin(lat2));

	return {
		latitude: lat2 * 180 / Math.PI,
		longitude: lon2 * 180 / Math.PI,
	};
}

export function getRandomLocationInRange(lat: number, lon: number, minDistance: number, maxDistance: number): { latitude: number, longitude: number } {
	const distance = Math.random() * (maxDistance - minDistance) + minDistance;
	return getRandomLocationAtDistance(lat, lon, distance);
}
