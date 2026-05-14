'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  onMapClick: (lat: number, lng: number) => void;
  selectedPosition: { lat: number; lng: number } | null;
}

export default function LocationPicker({ onMapClick, selectedPosition }: LocationPickerProps) {
  const mapRef       = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef       = useRef<L.Marker | null>(null);
  // Always-current callback ref so the map click handler never goes stale
  const onClickRef   = useRef(onMapClick);
  useEffect(() => { onClickRef.current = onMapClick; }, [onMapClick]);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [27.7172, 85.324],
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    map.locate({ setView: true, maxZoom: 15 });

    map.on('click', (e: L.LeafletMouseEvent) => {
      onClickRef.current(e.latlng.lat, e.latlng.lng);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Sync pin marker
  useEffect(() => {
    if (!mapRef.current) return;

    if (pinRef.current) {
      mapRef.current.removeLayer(pinRef.current);
      pinRef.current = null;
    }

    if (selectedPosition) {
      const icon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;border-radius:50%;background:#C0392B;display:flex;align-items:center;justify-content:center;border:3px solid #fff;box-shadow:0 2px 10px rgba(192,57,43,0.45);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6.5-7-12a7 7 0 1 1 14 0c0 5.5-7 12-7 12Z" stroke="#fff" stroke-width="2"/><circle cx="12" cy="9" r="2.5" fill="#fff"/></svg></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      pinRef.current = L.marker(
        [selectedPosition.lat, selectedPosition.lng],
        { icon }
      ).addTo(mapRef.current);

      mapRef.current.setView(
        [selectedPosition.lat, selectedPosition.lng],
        mapRef.current.getZoom(),
        { animate: true }
      );
    }
  }, [selectedPosition]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  );
}
