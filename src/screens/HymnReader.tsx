/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Bookmark, 
  BookMarked, 
  ChevronLeft, 
  ChevronRight, 
  Share2, 
  Copy, 
  Check, 
  WifiOff, 
  Sparkles, 
  AlertCircle,
  Loader2,
  BookOpen
} from 'lucide-react';
import { HymnItem } from '../types';
import { hymnsService } from '../services/hymns/hymns.service';
import { buildHymnRoute, HYMN_ROUTES } from '../config/hymns.config';
import { HymnHeader, HymnLyrics } from '../components/hymn';

interface HymnReaderProps {
  isOfflineSimulated: boolean;
  bookmarkedHymnIds: string[];
  onToggleBookmark: (hymnId: string) => void;
}

export default function HymnReader({
  isOfflineSimulated,
  bookmarkedHymnIds,
  onToggleBookmark
}: HymnReaderProps) {
  const { hymnId } = useParams<{ hymnId: string }>();
  const navigate = useNavigate();

  const [hymn, setHymn] = useState<HymnItem | null>(null);
  const [prevHymn, setPrevHymn] = useState<HymnItem | null>(null);
  const [nextHymn, setNextHymn] = useState<HymnItem | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const loadHymn = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await hymnsService.getHymnByIdOrNumber(id);
      if (!data) {
        setHymn(null);
        setError(`Hymn "${id}" was not found.`);
      } else {
        setHymn(data);
        // Load adjacent hymns for navigation
        const adjacent = await hymnsService.getAdjacentHymns(data.number);
        setPrevHymn(adjacent.prev);
        setNextHymn(adjacent.next);
      }
    } catch (err: any) {
      console.error('Failed to load hymn:', err);
      setError('Unable to load hymn details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (hymnId) {
      loadHymn(hymnId);
      window.scrollTo(0, 0);
    }
  }, [hymnId, loadHymn]);

  const isBookmarked = hymn ? bookmarkedHymnIds.includes(hymn.id) : false;
  const isUnavailableOffline = isOfflineSimulated && hymn ? !hymn.isPrebundledOffline : false;

  const handleBookmarkClick = () => {
    if (!hymn) return;
    onToggleBookmark(hymn.id);
    setToastMessage(!isBookmarked ? 'Hymn saved to bookmarks!' : 'Hymn removed from bookmarks.');
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleShareClick = () => {
    if (!hymn) return;
    if (navigator.share) {
      navigator.share({
        title: `ASF SOP ${hymn.number}: ${hymn.title}`,
        text: `Song of Praise ${hymn.number}: ${hymn.title}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setToastMessage('Hymn link copied to clipboard!');
      setTimeout(() => setToastMessage(''), 3000);
    }
  };

  const handleCopyLyrics = () => {
    if (!hymn) return;
    let text = `SOP ${hymn.number}: ${hymn.title}\n`;
    if (hymn.author) text += `Words: ${hymn.author}\n\n`;

    hymn.stanzas.forEach((stanza, idx) => {
      text += `Stanza ${stanza.number}:\n${stanza.lines.join('\n')}\n\n`;
      if (idx === 0 && hymn.chorus) {
        text += `Chorus:\n${hymn.chorus.join('\n')}\n\n`;
      }
    });

    navigator.clipboard.writeText(text.trim());
    setIsCopied(true);
    setToastMessage('Full hymn lyrics copied to clipboard!');
    setTimeout(() => {
      setIsCopied(false);
      setToastMessage('');
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--color-background)] select-none min-h-screen" id="hymn-reader-screen">
      
      {/* Sticky Top Bar Controls */}
      <header className="sticky top-0 z-40 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-3 px-5 flex items-center justify-between shadow-2xs" id="hymn-reader-controls">
        <button
          onClick={() => navigate(HYMN_ROUTES.HOME)}
          className="flex items-center gap-1.5 text-xs font-bold text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors cursor-pointer"
          id="hymn-reader-back-btn"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>SOP Index</span>
        </button>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {hymn && (
            <>
              <button
                onClick={handleCopyLyrics}
                className="p-2 min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-secondary)] border border-[var(--color-border)] transition-all cursor-pointer active:scale-95"
                title="Copy hymn lyrics"
                id="hymn-copy-btn"
              >
                {isCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              </button>

              <button
                onClick={handleShareClick}
                className="p-2 min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] flex items-center justify-center rounded-lg hover:bg-[var(--color-background)] text-[var(--color-text-secondary)] border border-[var(--color-border)] transition-all cursor-pointer active:scale-95"
                title="Share hymn"
                id="hymn-share-btn"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                onClick={handleBookmarkClick}
                className={`p-2 sm:px-3 min-w-[38px] min-h-[38px] sm:min-w-[42px] sm:min-h-[42px] rounded-lg border transition-all flex items-center justify-center gap-1.5 text-xs font-bold cursor-pointer active:scale-95 ${
                  isBookmarked
                    ? 'bg-[var(--color-primary-tint)] border-[var(--color-primary)] text-[var(--color-primary)]'
                    : 'bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text-secondary)]'
                }`}
                id="hymn-bookmark-btn"
              >
                {isBookmarked ? (
                  <BookMarked className="w-4 h-4 fill-current text-[var(--color-primary)]" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
              </button>
            </>
          )}
        </div>
      </header>

      {/* Main Reading Workspace Canvas */}
      <main className="flex-1 overflow-y-auto px-4 py-8 md:py-12 flex flex-col items-center" id="hymn-reader-workspace">
        
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-3" id="hymn-reader-loading">
            <Loader2 className="w-8 h-8 text-[var(--color-primary)] animate-spin" />
            <p className="text-xs text-[var(--color-text-secondary)] font-medium">Opening SOP Hymn...</p>
          </div>
        )}

        {/* Not Found / Error State */}
        {!isLoading && (error || !hymn) && (
          <div className="max-w-md w-full bg-surface border border-[var(--color-border)] rounded-2xl p-8 text-center space-y-4 shadow-2xs my-12" id="hymn-not-found-card">
            <div className="w-12 h-12 bg-red-100 text-[var(--color-error)] rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--color-text-primary)]">Hymn Not Found</h2>
              <p className="text-xs text-[var(--color-text-secondary)] mt-1">
                {error || `We couldn't locate hymn "${hymnId}". It may not exist in the Song of Praise collection.`}
              </p>
            </div>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
              <button
                onClick={() => navigate(HYMN_ROUTES.HOME)}
                className="w-full sm:w-auto px-4 py-2 bg-[var(--color-primary)] text-white text-xs font-bold rounded-lg hover:bg-[#5B0617] transition-all cursor-pointer"
              >
                Browse All Hymns
              </button>
              <button
                onClick={() => navigate('/hymns?q=')}
                className="w-full sm:w-auto px-4 py-2 bg-white text-[var(--color-text-primary)] border border-[var(--color-border)] text-xs font-bold rounded-lg hover:bg-gray-50 transition-all cursor-pointer"
              >
                Search Hymn Book
              </button>
            </div>
          </div>
        )}

        {/* Active Hymn View */}
        {!isLoading && hymn && (
          <article className="hymn-reader select-text w-full max-w-[680px]">
            
            {/* Header Block */}
            <HymnHeader hymn={hymn} />

            {/* Offline Alert when unbundled and offline simulator is ON */}
            {isUnavailableOffline ? (
              <div className="hymn-offline space-y-3 text-center my-8 p-6 rounded-xl" id="hymn-offline-unbundled-alert">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto text-[var(--color-error)]">
                  <WifiOff className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-red-900">Hymn Unavailable Offline</h4>
                  <p className="text-xs text-red-800 mt-1 max-w-xs mx-auto leading-relaxed">
                    SOP {hymn.number} requires an active internet connection to download lyrics. Prebundled offline hymns are accessible anytime.
                  </p>
                </div>
                <button
                  onClick={() => navigate(HYMN_ROUTES.HOME)}
                  className="btn-secondary text-xs py-2 px-4 mt-2 cursor-pointer"
                >
                  Return to Hymn Book
                </button>
              </div>
            ) : (
              /* Lyric Stanzas & Chorus Block */
              <HymnLyrics 
                stanzas={hymn.stanzas} 
                chorus={hymn.chorus} 
                chorusPosition="after-stanza-1"
              />
            )}

            {/* Previous / Next Sequential Navigation */}
            <div className="mt-12 pt-6 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-bold" id="hymn-prev-next-bar">
              {prevHymn ? (
                <button
                  onClick={() => navigate(buildHymnRoute(prevHymn.id))}
                  className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors py-2 px-3.5 rounded-lg border border-[var(--color-border)] hover:bg-white shadow-2xs cursor-pointer active:scale-95"
                  id="prev-hymn-btn"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>SOP {prevHymn.number}</span>
                </button>
              ) : <div />}

              {nextHymn ? (
                <button
                  onClick={() => navigate(buildHymnRoute(nextHymn.id))}
                  className="flex items-center gap-1.5 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors py-2 px-3.5 rounded-lg border border-[var(--color-border)] hover:bg-white shadow-2xs cursor-pointer active:scale-95"
                  id="next-hymn-btn"
                >
                  <span>SOP {nextHymn.number}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : <div />}
            </div>

          </article>
        )}

      </main>

      {/* Dynamic Toast Popup */}
      {toastMessage && (
        <div 
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] md:bottom-6 left-1/2 -translate-x-1/2 bg-[var(--color-text-primary)] text-white text-xs px-4 py-3 rounded-xl shadow-lg border border-white/10 max-w-sm w-[90%] flex items-start gap-2 animate-bounce z-50 leading-relaxed"
          id="hymn-reader-toast"
        >
          <div className="bg-white/10 p-1 rounded-full text-[#fabb53] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
