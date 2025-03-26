import { useEffect, useState } from "react";
import { ImageOverlay, useMap } from "react-leaflet";
import L from "leaflet";

type Props = {
	location: { latitude: number, longitude: number } | null;
	imageUrl: string;
	ratio?: number;
}

function ImageWithPreservedAspect({ location, imageUrl, ratio = 1 }: Props) {
	const map = useMap();
	const [imageDimensions, setImageDimensions] =
		useState<{ width: number, height: number }>({ width: 0, height: 0 });
	const [imageBounds, setImageBounds] = useState<L.LatLngBounds | null>(null);

	useEffect(() => {
		if (!location || imageDimensions.width === 0 || imageDimensions.height === 0) {
			return;
		}

		const center = L.latLng(location.latitude, location.longitude);

		const latOffset = imageDimensions.height / 2 / 111319.9;
		const lngOffset = imageDimensions.width / 2 / (111319.9 * Math.cos(center.lat * Math.PI / 180));

		setImageBounds(new L.LatLngBounds(
			[center.lat - latOffset, center.lng - lngOffset],
			[center.lat + latOffset, center.lng + lngOffset]
		));

	}, [location, map, imageDimensions]);

	useEffect(() => {
		const calculateImageDimensions = async () => {
			const image = new Image();

			await new Promise<void>((resolve, reject) => {
				image.onload = () => {
					console.log('succesfully loaded');
					setImageDimensions({
						width: image.width * ratio,
						height: image.height * ratio,
					});

					resolve();
				};

				image.onerror = reject;
				image.src = imageUrl;
			});
		}

		calculateImageDimensions();
	}, [imageUrl]);

	return imageBounds ? (
		<ImageOverlay bounds={imageBounds} url={imageUrl} />
	) : null;
}

export default ImageWithPreservedAspect;