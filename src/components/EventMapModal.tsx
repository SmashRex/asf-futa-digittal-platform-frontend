/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MapPin, Navigation, ExternalLink, X, Compass, Bus } from 'lucide-react';
import { EventItem } from '../types';

interface EventMapModalProps {
  isOpen: boolean;
  event: EventItem | null;
  onClose: () => void;
}

export default function EventMapModal({ isOpen, event, onClose }: EventMapModalProps) {
  if (!isOpen || !event) return null;

  const mapQueryUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${event.venue}, ${event.address}`
  )}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 select-none" id="map-modal-overlay">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-[2px] transition-opacity animate-fade-in"
        onClick={onClose}
      ></div>

      {/* Modal Card */}
      <div 
        className="relative bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden z-10 animate-scale-up"
        id="map-modal-content"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[var(--color-background)] border-b border-[var(--color-border)] flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[var(--color-primary-tint)] text-[var(--color-primary)] rounded-xl">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base font-serif text-[var(--color-text-primary)] leading-tight">
                Venue & Directions
              </h3>
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                {event.venue}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-black/5 text-[var(--color-text-light)] hover:text-[var(--color-text-primary)] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          
          {/* Simulated Campus Map Display */}
          <div className="relative h-44 rounded-xl bg-slate-100 border border-[var(--color-border)] overflow-hidden flex flex-col items-center justify-center text-center p-4">
            <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#5b0617_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="z-10 bg-[var(--color-surface)] p-3 rounded-2xl border border-[var(--color-border)] shadow-md flex items-center gap-2 max-w-xs">
              <MapPin className="w-5 h-5 text-[var(--color-primary)] shrink-0 animate-bounce" />
              <div className="text-left">
                <div className="text-xs font-bold text-[var(--color-text-primary)] truncate">{event.venue}</div>
                <div className="text-[10px] text-[var(--color-text-secondary)]">{event.address}</div>
              </div>
            </div>
            <div className="z-10 mt-3 text-[11px] font-semibold text-[var(--color-primary)] bg-white/90 px-3 py-1 rounded-full border border-[var(--color-border)]">
              FUTA Campus Grid Sector 4
            </div>
          </div>

          {/* Directions Text */}
          <div className="bg-[var(--color-background)] border border-[var(--color-border)] p-3.5 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--color-primary)]">
              <Compass className="w-4 h-4" />
              <span>Campus Directions:</span>
            </div>
            <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
              {event.directions || 'Take the campus shuttle or main walkway towards the central Chapel quadrangle.'}
            </p>
          </div>

          {/* Shuttle Notice if present */}
          {event.additionalInfo?.transportInfo && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-950">
              <Bus className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Shuttle Service:</strong>
                <span>{event.additionalInfo.transportInfo}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[var(--color-background)] border-t border-[var(--color-border)] flex items-center justify-between gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[var(--color-text-secondary)] hover:bg-black/5 rounded-xl cursor-pointer"
          >
            Close
          </button>

          <a
            href={mapQueryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary py-2 px-4 text-xs font-bold inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Open in Google Maps</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70" />
          </a>
        </div>
      </div>
    </div>
  );
}
