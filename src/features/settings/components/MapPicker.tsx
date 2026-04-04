import { useEffect, useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { divIcon } from "leaflet";
import { FaRegFutbol } from "react-icons/fa6";
import "leaflet/dist/leaflet.css";
import type { VenueLocation } from "../types/settings";

const ballIcon = renderToStaticMarkup(
  <FaRegFutbol
    style={{ transform: "rotate(45deg)", fontSize: 24, color: "white" }}
  />,
);

const MARKER_HTML = `
<div style="
  width: 38px;
  height: 38px;
  background: #4aab3d;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  border: 2.5px solid white;
  box-shadow: 0 3px 10px rgba(0,0,0,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
">
  ${ballIcon}
</div>
`;

const soccerMarkerIcon = divIcon({
  html: MARKER_HTML,
  className: "",
  iconSize: [38, 46],
  iconAnchor: [19, 46],
  popupAnchor: [0, -46],
});

function ClickHandler({
  onChange,
}: {
  onChange: (loc: VenueLocation) => void;
}) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function MapRecenter({ location }: { location: VenueLocation }) {
  const map = useMapEvents({});
  const prevRef = useRef<VenueLocation | null>(null);

  useEffect(() => {
    if (
      prevRef.current?.lat !== location.lat ||
      prevRef.current?.lng !== location.lng
    ) {
      map.setView([location.lat, location.lng], map.getZoom());
      prevRef.current = location;
    }
  }, [location, map]);

  return null;
}

interface MapPickerProps {
  value?: VenueLocation;
  onChange: (loc: VenueLocation) => void;
}

const DEFAULT_CENTER: VenueLocation = { lat: -12.0464, lng: -77.0428 }; // Lima centro

export function MapPicker({ value, onChange }: MapPickerProps) {
  const center = value ?? DEFAULT_CENTER;

  return (
    <div
      className="rounded-xl overflow-hidden border border-border"
      style={{ height: 280 }}
    >
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        {value && <MapRecenter location={value} />}
        <ClickHandler onChange={onChange} />
        {value && (
          <Marker position={[value.lat, value.lng]} icon={soccerMarkerIcon} />
        )}
      </MapContainer>
      <p className="text-xs text-muted-foreground text-center py-2 bg-muted/50 border-t border-border">
        Haz clic en el mapa para colocar tu sede
      </p>
    </div>
  );
}
