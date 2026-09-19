/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Paperclip, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  Info,
  Check,
  Megaphone,
  WifiOff
} from 'lucide-react';
import { Announcement } from '../types';
import { announcementsService } from '../services/announcements/announcements.service';
import AnnouncementOffline from '../components/AnnouncementOffline';
import { LoadingState } from '../components/common/LoadingState';

interface AnnouncementDetailProps {
  isOfflineSimulated: boolean;
  onMarkAsRead: (id: string) => void;
}

export default function AnnouncementDetail({
  isOfflineSimulated,
  onMarkAsRead
}: AnnouncementDetailProps) {
  const { announcementId } = useParams<{ announcementId: string }>();
  const navigate = useNavigate();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloadToast, setDownloadToast] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (announcementId) {
      setIsLoading(true);
      announcementsService.getAnnouncementById(announcementId)
        .then((data) => {
          if (!isMounted) return;
          setAnnouncement(data);
          if (data) {
            onMarkAsRead(data.id);
          }
        })
        .catch((err) => {
          console.warn('[AnnouncementDetail] Failed to load notice:', err);
        })
        .finally(() => {
          if (isMounted) setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [announcementId, onMarkAsRead]);

  if (isLoading) {
    return (
      <div className="announcements-page py-12">
        <LoadingState message="Loading notice..." />
      </div>
    );
  }

  if (!announcement) {
    return (
      <div className="announcements-page text-center py-12" id="announcement-not-found">
        <div className="bg-amber-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-amber-800">
          <Megaphone className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold font-serif text-[var(--color-text-primary)] mb-2">
          Announcement Not Found
        </h2>
        <p className="text-sm text-[var(--color-text-secondary)] mb-6 max-w-md mx-auto">
          The requested notice could not be located or may have been removed by the publicity desk.
        </p>
        <button
          onClick={() => navigate('/announcements')}
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Announcements</span>
        </button>
      </div>
    );
  }

  // Handle unbundled item offline check
  if (isOfflineSimulated && !announcement.isPrebundledOffline) {
    return (
      <div className="announcements-page py-8" id="announcement-offline-unbundled">
        <button
          onClick={() => navigate('/announcements')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-primary)] hover:underline mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Announcements Feed</span>
        </button>

        <AnnouncementOffline />
      </div>
    );
  }

  const handleShare = () => {
    const shareData = {
      title: announcement.title,
      text: `${announcement.title}\n\n${announcement.excerpt || announcement.message}\n\nRead full notice on ASF Platform:`,
      url: window.location.href
    };

    if (navigator.share) {
      navigator.share(shareData).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadAttachment = (filename: string) => {
    setDownloadToast(`Simulated download of ${filename} started...`);
    setTimeout(() => setDownloadToast(''), 3000);
  };

  // Get Priority Badge Color
  const getPriorityStyle = (priority?: string) => {
    switch (priority) {
      case 'Urgent':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-800',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
        };
      case 'Important':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
        };
      default:
        return {
          bg: 'bg-stone-50 border-stone-200 text-stone-700',
          icon: <Info className="w-3.5 h-3.5 text-stone-500" />
        };
    }
  };

  const priorityStyle = getPriorityStyle(announcement.priority);

  return (
    <div className="announcements-page select-none" id={`announcement-detail-${announcement.id}`}>
      
      {/* Top Action Back Button */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/announcements')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors shadow-2xs cursor-pointer"
          id="announcement-back-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-primary)]" />
          <span>All Notices</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors shadow-2xs cursor-pointer"
            id="announcement-share-btn"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-[var(--color-primary)]" />}
            <span>{copied ? 'Link Copied' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Main Notice Article */}
      <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        
        {/* Category & Metadata Header */}
        <div className="space-y-3 border-b border-[var(--color-border)] pb-5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-[var(--color-primary-tint)] text-[var(--color-primary)] font-bold text-xs rounded-full border border-amber-200/50">
              {announcement.category}
            </span>

            {announcement.priority && announcement.priority !== 'Normal' && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${priorityStyle.bg}`}>
                {priorityStyle.icon}
                <span>{announcement.priority} Notice</span>
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-[var(--color-text-primary)] leading-tight">
            {announcement.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--color-text-secondary)]">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(announcement.publishedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{announcement.author}</span>
            </div>
          </div>
        </div>

        {/* Notice Body Content */}
        <div className="prose prose-sm sm:prose-base max-w-none text-[var(--color-text-primary)] font-serif leading-relaxed whitespace-pre-line">
          {announcement.content || announcement.message}
        </div>

        {/* Official Channel Signature */}
        <div className="pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-[var(--color-text-secondary)]">
          <div>
            <p className="font-bold text-[var(--color-text-primary)]">Publicity & Media Committee</p>
            <p className="text-[11px]">Anglican Students' Fellowship FUTA</p>
          </div>
          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Official Notice</span>
          </div>
        </div>

      </article>

      {/* Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 right-6 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-lg animate-fade-in z-50">
          {downloadToast}
        </div>
      )}

    </div>
  );
}
