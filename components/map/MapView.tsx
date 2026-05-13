'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapItem {
  id: string;
  type: string;
  title: string;
  description: string;
  category: string;
  latitude: number;
  longitude: number;
  locationName: string | null;
  date: string;
  resolved: boolean;
  createdAt: string;
  userName: string;
}

interface MapViewProps {
  items: MapItem[];
  onMapClick?: (lat: number, lng: number) => void;
  onMarkerClick?: (item: MapItem) => void;
  selectedPosition?: { lat: number; lng: number } | null;
}

// Custom marker icons
const lostIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;border-radius:50%;background:#C0392B;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(192,57,43,0.5);border:2px solid #fff;">🔴</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const foundIcon = L.divIcon({
  className: '',
  html: `<div style="width:32px;height:32px;border-radius:50%;background:#27ae60;display:flex;align-items:center;justify-content:center;font-size:16px;box-shadow:0 2px 8px rgba(39,174,96,0.5);border:2px solid #fff;">🟢</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const pinIcon = L.divIcon({
  className: '',
  html: `<div style="width:36px;height:36px;border-radius:50%;background:var(--accent, #C0392B);display:flex;align-items:center;justify-content:center;font-size:20px;box-shadow:0 2px 12px rgba(192,57,43,0.6);border:3px solid #fff;animation:pulse 1.5s infinite;">📍</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
});

export default function MapView({ items, onMapClick, onMarkerClick, selectedPosition }: MapViewProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const pinMarkerRef = useRef<L.Marker | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [27.7172, 85.3240], // Kathmandu default
      zoom: 13,
      zoomControl: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    // Try to get user location
    map.locate({ setView: true, maxZoom: 15 });

    if (onMapClick) {
      map.on('click', (e: L.LeafletMouseEvent) => {
        onMapClick(e.latlng.lat, e.latlng.lng);
      });
    }

    mapRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update item markers
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;
    const map = mapRef.current;

    // Clear existing item markers (not pin)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== pinMarkerRef.current) {
        // Check if it's a tile layer
        if (!(layer as unknown as L.TileLayer).getTileUrl) {
          map.removeLayer(layer);
        }
      }
    });

    items.forEach((item) => {
      const icon = item.type === 'LOST' ? lostIcon : foundIcon;
      const marker = L.marker([item.latitude, item.longitude], { icon }).addTo(map);
      
      marker.bindPopup(`
        <div style="font-family:Inter,sans-serif;min-width:180px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:12px;background:${item.type === 'LOST' ? '#fde8e8' : '#e8fde8'};color:${item.type === 'LOST' ? '#c0392b' : '#27ae60'};">
              ${item.type}
            </span>
            <span style="font-size:11px;color:#999;">${item.category}</span>
          </div>
          <strong style="font-size:13px;">${item.title}</strong>
          ${item.locationName ? `<p style="font-size:11px;color:#777;margin:4px 0 0;">📍 ${item.locationName}</p>` : ''}
        </div>
      `, { closeButton: false, className: 'neu-popup' });

      marker.on('click', () => onMarkerClick?.(item));
    });
  }, [items, mapReady, onMarkerClick]);

  // Selected position pin
  useEffect(() => {
    if (!mapRef.current || !mapReady) return;

    if (pinMarkerRef.current) {
      mapRef.current.removeLayer(pinMarkerRef.current);
      pinMarkerRef.current = null;
    }

    if (selectedPosition) {
      pinMarkerRef.current = L.marker(
        [selectedPosition.lat, selectedPosition.lng],
        { icon: pinIcon }
      ).addTo(mapRef.current);
    }
  }, [selectedPosition, mapReady]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        inset: 0,
      }}
    />
  );
}
