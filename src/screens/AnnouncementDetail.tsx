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
import { mockAnnouncements } from '../data/announcementData';
import AnnouncementOffline from '../components/AnnouncementOffline';

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
  const [copied, setCopied] = useState(false);
  const [downloadToast, setDownloadToast] = useState('');

  const announcement = mockAnnouncements.find(a => a.id === announcementId);

  // Auto-mark as read when opened
  useEffect(() => {
    if (announcement) {
      onMarkAsRead(announcement.id);
    }
  }, [announcement, onMarkAsRead]);

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
      text: `${announcement.title}\n\n${announcement.excerpt}\n\nRead full notice on ASF Platform:`,
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

  const handleDownloadAttachment = () => {
    setDownloadToast(`Downloading ${announcement.attachmentName} (${announcement.attachmentSize})...`);
    setTimeout(() => {
      setDownloadToast('');
    }, 3500);
  };

  // Badge styling
  const getBadgeStyle = () => {
    if (announcement.priority === 'Urgent') return 'announcement-badge-urgent';
    if (announcement.priority === 'Important') return 'announcement-badge-important';
    return 'announcement-badge-normal';
  };

  // Split content into editorial paragraphs
  const paragraphs = announcement.content.split('\n\n').filter(p => p.trim() !== '');

  return (
    <div className="announcement-detail select-none" id="announcement-detail-screen">
      
      {/* Back Navigation Bar */}
      <div className="flex items-center justify-between mb-6" id="announcement-detail-nav">
        <button
          onClick={() => navigate('/announcements')}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-background)] transition-colors shadow-2xs"
          id="announcement-back-btn"
        >
          <ArrowLeft className="w-4 h-4 text-[var(--color-primary)]" />
          <span>Back to Feed</span>
        </button>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-bold text-[var(--color-primary)] hover:bg-[var(--color-primary-tint)] transition-colors shadow-2xs"
          id="announcement-share-btn"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Share Notice</span>
            </>
          )}
        </button>
      </div>

      {/* Detail Article Card */}
      <article className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xs">
        
        {/* Article Header */}
        <header className="announcement-detail-header">
          <div className="flex items-center gap-2 mb-3">
            <span className={`announcement-badge ${getBadgeStyle()}`}>
              {announcement.priority === 'Urgent' && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
              {announcement.priority === 'Important' && <Info className="w-3.5 h-3.5 shrink-0" />}
              <span>{announcement.category}</span>
            </span>

            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Verified Official Notice</span>
            </span>
          </div>

          <h1 className="announcement-detail-title">
            {announcement.title}
          </h1>

          <div className="announcement-detail-meta">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
              <span className="font-semibold text-[var(--color-text-primary)]">{announcement.author}</span>
            </div>
            <span className="text-[var(--color-border)]">•</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[var(--color-text-light)] shrink-0" />
              <span>Published {announcement.publishedAt}</span>
            </div>
          </div>
        </header>

        {/* Article Content Paragraphs */}
        <div className="announcement-detail-body">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="whitespace-pre-line leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Attachment Card Box */}
        {announcement.attachmentName && (
          <div className="announcement-attachment" id="announcement-attachment-box">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-[var(--color-primary-tint)] text-[var(--color-primary)] rounded-xl shrink-0">
                <Paperclip className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[var(--color-text-primary)] truncate max-w-[200px] sm:max-w-xs">
                  {announcement.attachmentName}
                </p>
                <p className="text-[11px] text-[var(--color-text-secondary)] mt-0.5">
                  Official Attachment ({announcement.attachmentSize})
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadAttachment}
              className="px-3.5 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors inline-flex items-center gap-1.5 shrink-0 shadow-2xs"
              id="download-attachment-btn"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
          </div>
        )}

        {/* Article Footer */}
        <footer className="mt-8 pt-6 border-t border-[var(--color-border)] flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-[var(--color-text-secondary)]">
            <span>Anglican Students' Fellowship FUTA • Official Communication Desk</span>
          </div>

          <button
            onClick={() => navigate('/announcements')}
            className="btn-primary text-xs py-2 px-4 inline-flex items-center gap-2"
            id="announcement-return-footer-btn"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Announcements</span>
          </button>
        </footer>
      </article>

      {/* Download Toast Notification */}
      {downloadToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-text-primary)] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-white/10 max-w-sm w-[90%] flex items-center gap-2 animate-bounce z-50">
          <Download className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
          <span>{downloadToast}</span>
        </div>
      )}
    </div>
  );
}
