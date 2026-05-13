'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  onMapClick: (lat: number, lng: number) => void;
  selectedPosition: { lat: number; lng: number } | null;
}

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="width:36px;height:36px;border-radius:50%;background:#C0392B;display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 2px 12px rgba(192,57,43,0.6);border:3px solid #fff;animation:pulse 1.5s infinite;">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

export default function LocationPicker({ onMapClick, selectedPosition }: LocationPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [27.7172, 85.3240],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Try user location
    map.locate({ setView: true, maxZoom: 15 });

    map.on('click', (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update pin when selectedPosition changes
  useEffect(() => {
    if (!mapRef.current) return;

    if (pinRef.current) {
      mapRef.current.removeLayer(pinRef.current);
      pinRef.current = null;
    }

    if (selectedPosition) {
      pinRef.current = L.marker(
        [selectedPosition.lat, selectedPosition.lng],
        { icon: pinIcon }
      ).addTo(mapRef.current);

      mapRef.current.setView([selectedPosition.lat, selectedPosition.lng], mapRef.current.getZoom(), { animate: true });
    }
  }, [selectedPosition]);

  return (
    <div
      ref={containerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
    />
  );
}
