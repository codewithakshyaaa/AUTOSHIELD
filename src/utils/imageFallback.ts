// Reliable, high-definition image assets with SVG fallbacks for civil infrastructure issues and repairs
import React from 'react';

export const SAFE_INFRASTRUCTURE_IMAGES: Record<string, { before: string; after: string; label: string }> = {
  POTHOLE: {
    before: 'https://images.unsplash.com/photo-1578885136359-16c8bd4d3a8e?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    label: 'Road Pothole',
  },
  WATER_LEAK: {
    before: 'https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    label: 'Water Pipe Leak',
  },
  GUARDRAIL: {
    before: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    label: 'Highway Barrier',
  },
  STREETLIGHT: {
    before: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
    label: 'Street Light',
  },
  ELECTRICAL: {
    before: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    label: 'Power Cable',
  },
  OTHER: {
    before: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80',
    after: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    label: 'City Infrastructure',
  },
};

// Generates an inline SVG data URI as an unbreakable fallback if network fails
export function getSvgFallback(title: string, category: string = 'POTHOLE', isRepair: boolean = false): string {
  const catKey = (category || 'POTHOLE').toUpperCase();
  const isPothole = catKey.includes('POTHOLE');
  const isWater = catKey.includes('WATER') || catKey.includes('LEAK');
  const isBarrier = catKey.includes('GUARD') || catKey.includes('BARRIER') || catKey.includes('ROAD');

  const bgColor = isRepair ? '#064e3b' : isWater ? '#0c2d48' : isBarrier ? '#451a03' : '#3b0764';
  const accentColor = isRepair ? '#34d399' : isWater ? '#38bdf8' : isBarrier ? '#fb923c' : '#c084fc';
  const badgeText = isRepair ? 'VERIFIED COMPLETED REPAIR' : 'DETECTED CIVIC HAZARD';

  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="800" height="450" viewBox="0 0 800 450">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${bgColor}" />
        <stop offset="100%" stop-color="#090b10" />
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="800" height="450" fill="url(#bgGrad)" />
    <rect width="800" height="450" fill="url(#grid)" />
    
    <circle cx="400" cy="200" r="90" fill="none" stroke="${accentColor}" stroke-width="2" opacity="0.4" />
    <circle cx="400" cy="200" r="60" fill="${accentColor}" opacity="0.15" />
    
    <!-- Visual hazard graphic -->
    ${isWater ? `
      <path d="M400 150 C380 180, 360 210, 360 230 A40 40 0 0 0 440 230 C440 210, 420 180, 400 150 Z" fill="${accentColor}" opacity="0.8" />
    ` : isBarrier ? `
      <rect x="340" y="190" width="120" height="20" rx="4" fill="${accentColor}" />
      <rect x="350" y="170" width="15" height="60" fill="#cbd5e1" />
      <rect x="435" y="170" width="15" height="60" fill="#cbd5e1" />
    ` : `
      <ellipse cx="400" cy="205" rx="55" ry="30" fill="#0f172a" stroke="${accentColor}" stroke-width="3" />
      <path d="M370 200 L430 210 M380 215 L420 195" stroke="${accentColor}" stroke-width="2" stroke-linecap="round" />
    `}
    
    <!-- Badge -->
    <rect x="250" y="60" width="300" height="34" rx="17" fill="rgba(0,0,0,0.7)" stroke="${accentColor}" stroke-width="1.5" />
    <text x="400" y="82" fill="${accentColor}" font-family="system-ui, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="2">
      ${badgeText}
    </text>

    <!-- Title -->
    <text x="400" y="325" fill="#ffffff" font-family="system-ui, sans-serif" font-size="22" font-weight="bold" text-anchor="middle">
      ${escapeXml(title || category)}
    </text>
    <text x="400" y="355" fill="#94a3b8" font-family="system-ui, sans-serif" font-size="14" text-anchor="middle">
      AutoShield 1-Click Civic Safety Network
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, title: string, category: string = 'POTHOLE', isRepair: boolean = false) {
  const target = e.currentTarget;
  target.onerror = null; // Prevent infinite loop
  target.src = getSvgFallback(title, category, isRepair);
}
