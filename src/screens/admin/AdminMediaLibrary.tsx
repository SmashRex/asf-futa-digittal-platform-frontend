/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { 
  Search, 
  Filter, 
  Upload, 
  Image as ImageIcon, 
  Eye, 
  EyeOff, 
  Edit3, 
  Trash2, 
  Plus, 
  Check, 
  X, 
  Tag, 
  Calendar, 
  FileText,
  Sparkles,
  Maximize2
} from 'lucide-react';

export interface MediaAsset {
  id: string;
  title: string;
  event: string;
  category: string;
  status: 'Live' | 'Hidden' | 'Draft';
  uploadDate: string;
  dimensions: string;
  fileSize: string;
  imageUrl: string;
  tags: string[];
}

const INITIAL_MEDIA_ITEMS: MediaAsset[] = [
  {
    id: 'media-01',
    title: 'Campfire Devotionals',
    event: 'Youth Retreat 2024',
    category: 'Retreat',
    status: 'Live',
    uploadDate: 'Oct 15, 2024',
    dimensions: '1920x1080',
    fileSize: '1.8 MB',
    imageUrl: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
    tags: ['Devotional', 'Worship', 'Campfire']
  },
  {
    id: 'media-02',
    title: 'Worship Team Sanctuary',
    event: 'Sunday Service',
    category: 'Worship',
    status: 'Hidden',
    uploadDate: 'Oct 12, 2024',
    dimensions: '2048x1365',
    fileSize: '2.4 MB',
    imageUrl: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&q=80&w=800',
    tags: ['Choir', 'Sanctuary', 'Sunday']
  },
  {
    id: 'media-03',
    title: 'Food Drive Volunteers',
    event: 'Community Outreach',
    category: 'Outreach',
    status: 'Live',
    uploadDate: 'Oct 05, 2024',
    dimensions: '1600x1200',
    fileSize: '1.2 MB',
    imageUrl: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&q=80&w=800',
    tags: ['Service', 'Community', 'Volunteers']
  },
  {
    id: 'media-04',
    title: 'Semester Opening Vigil Poster',
    event: 'Semester Opening',
    category: 'Flyer',
    status: 'Live',
    uploadDate: 'Sept 28, 2024',
    dimensions: '1080x1350',
    fileSize: '3.1 MB',
    imageUrl: 'https://images.unsplash.com/photo-1511649475669-e288648b2339?auto=format&fit=crop&q=80&w=800',
    tags: ['Flyer', 'Vigil', 'Poster']
  },
  {
    id: 'media-05',
    title: 'Bible Study Discussion Group',
    event: 'Weekly Bible Study',
    category: 'Fellowship',
    status: 'Live',
    uploadDate: 'Sept 20, 2024',
    dimensions: '1920x1080',
    fileSize: '1.5 MB',
    imageUrl: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800',
    tags: ['Bible Study', 'Discussion', 'Freshmen']
  },
  {
    id: 'media-06',
    title: 'Choir Rehearsal Hall',
    event: 'Music Ministry',
    category: 'Rehearsal',
    status: 'Draft',
    uploadDate: 'Sept 14, 2024',
    dimensions: '1920x1280',
    fileSize: '2.0 MB',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800',
    tags: ['Choir', 'Praise', 'Music']
  }
];

export const AdminMediaLibrary: React.FC = () => {
  const { addAuditLog } = useOutletContext<AdminContextType>();

  const [mediaList, setMediaList] = useState<MediaAsset[]>(INITIAL_MEDIA_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('All Events');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Modal State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewMedia, setPreviewMedia] = useState<MediaAsset | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaAsset | null>(null);

  // New Upload Form State
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadEvent, setUploadEvent] = useState('Youth Retreat 2024');
  const [uploadCategory, setUploadCategory] = useState('Retreat');
  const [uploadTags, setUploadTags] = useState('');
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string | null>(null);

  // Filter Logic
  const filteredMedia = mediaList.filter(item => {
    const matchesEvent = selectedEvent === 'All Events' || item.event === selectedEvent;
    const matchesStatus = selectedStatus === 'All Status' || item.status === selectedStatus;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesEvent && matchesStatus && matchesSearch;
  });

  const handleToggleStatus = (id: string) => {
    setMediaList(prev => prev.map(item => {
      if (item.id === id) {
        const nextStatus = item.status === 'Live' ? 'Hidden' : 'Live';
        addAuditLog('Updated Media Status', item.title, `Changed status to ${nextStatus}`);
        return { ...item, status: nextStatus };
      }
      return item;
    }));
  };

  const handleDeleteMedia = (id: string) => {
    const item = mediaList.find(m => m.id === id);
    if (item && window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      setMediaList(prev => prev.filter(m => m.id !== id));
      addAuditLog('Deleted Media Asset', item.title, `Removed from publicity library`);
    }
  };

  const handleCreateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim()) return;

    const newAsset: MediaAsset = {
      id: `media-${Date.now()}`,
      title: uploadTitle.trim(),
      event: uploadEvent,
      category: uploadCategory,
      status: 'Live',
      uploadDate: 'Just now',
      dimensions: '1920x1080',
      fileSize: '1.4 MB',
      imageUrl: uploadPreviewUrl || 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&q=80&w=800',
      tags: uploadTags.split(',').map(t => t.trim()).filter(Boolean)
    };

    setMediaList(prev => [newAsset, ...prev]);
    addAuditLog('Uploaded Media Asset', newAsset.title, `Event: ${newAsset.event}`);

    // Reset
    setUploadTitle('');
    setUploadTags('');
    setUploadPreviewUrl(null);
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8" id="admin-media-library-screen">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B] mb-1">
            <span>Publicity Workspace</span>
            <span>/</span>
            <span className="text-[#5B0617] font-bold">Media Gallery & Visual Assets</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Media Library & Visual Assets
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] mt-1">
            Upload, tag, and organize event photography, posters, and announcement imagery for the fellowship.
          </p>
        </div>

        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs sm:text-sm font-bold transition-all shadow-sm shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Upload New Media</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#E4E4E7] p-4 shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#52525B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, event, or keyword..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs sm:text-sm text-[#18181B] focus:bg-white focus:outline-none focus:border-[#5B0617]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex items-center gap-2 w-full md:w-auto shrink-0 overflow-x-auto">
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
          >
            <option value="All Events">All Events</option>
            <option value="Youth Retreat 2024">Youth Retreat 2024</option>
            <option value="Sunday Service">Sunday Service</option>
            <option value="Community Outreach">Community Outreach</option>
            <option value="Semester Opening">Semester Opening</option>
            <option value="Weekly Bible Study">Weekly Bible Study</option>
            <option value="Music Ministry">Music Ministry</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
          >
            <option value="All Status">All Status</option>
            <option value="Live">Live</option>
            <option value="Hidden">Hidden</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-[#E4E4E7] space-y-3">
          <ImageIcon className="w-10 h-10 text-[#52525B] mx-auto opacity-50" />
          <h3 className="font-serif font-bold text-base text-[#18181B]">No Media Assets Found</h3>
          <p className="text-xs text-[#52525B]">Try adjusting your search query or filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
          {filteredMedia.map((media) => (
            <div
              key={media.id}
              className="group bg-white rounded-2xl border border-[#E4E4E7] overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-4/3 w-full bg-[#FAF8F5] overflow-hidden">
                <img
                  src={media.imageUrl}
                  alt={media.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-xs ${
                    media.status === 'Live'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : media.status === 'Hidden'
                      ? 'bg-stone-100 text-[#52525B] border border-[#E4E4E7]'
                      : 'bg-amber-50 text-amber-900 border border-amber-200'
                  }`}>
                    {media.status}
                  </span>
                </div>

                {/* Hover Quick Overlay Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                  <button
                    onClick={() => setPreviewMedia(media)}
                    className="p-2 rounded-full bg-white/90 text-[#18181B] hover:bg-white transition-colors"
                    title="Fullscreen Preview"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleToggleStatus(media.id)}
                    className="p-2 rounded-full bg-white/90 text-[#18181B] hover:bg-white transition-colors"
                    title={media.status === 'Live' ? 'Hide Asset' : 'Make Live'}
                  >
                    {media.status === 'Live' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleDeleteMedia(media.id)}
                    className="p-2 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors"
                    title="Delete Asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Details Content */}
              <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-xs sm:text-sm text-[#18181B] line-clamp-1">
                    {media.title}
                  </h3>
                  <p className="text-[11px] text-[#5B0617] font-semibold mt-0.5 truncate">
                    {media.event}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E4E4E7] flex items-center justify-between text-[10px] text-[#52525B]">
                  <span>{media.uploadDate}</span>
                  <span className="font-medium text-[#18181B]">{media.fileSize}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload New Media Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 border border-[#E4E4E7] shadow-2xl relative">
            <button
              onClick={() => setIsUploadModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-100 text-[#52525B]"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase bg-[#5B0617] text-white rounded">
                PUBLICITY MEDIA UPLOAD
              </span>
              <h2 className="font-serif font-bold text-xl text-[#18181B] mt-1">
                Upload New Visual Asset
              </h2>
              <p className="text-xs text-[#52525B]">
                Add high-resolution photography, event flyers, or graphics to the library.
              </p>
            </div>

            <form onSubmit={handleCreateUpload} className="space-y-4">
              {/* File Upload Drop Area */}
              <div className="border-2 border-dashed border-[#E4E4E7] rounded-2xl p-6 text-center hover:border-[#5B0617] hover:bg-[#FAF8F5] transition-all cursor-pointer bg-[#FAF8F5]/50">
                <div className="w-10 h-10 rounded-full bg-[#5B0617]/10 text-[#5B0617] flex items-center justify-center mx-auto mb-2">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-[#18181B]">Click or drag photo here to upload</p>
                <p className="text-[11px] text-[#52525B] mt-0.5">PNG, JPG, or WEBP up to 10MB</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Asset Title *</label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., Youth Praise Night Banner"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:bg-white focus:outline-none focus:border-[#5B0617]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Associated Event</label>
                  <select
                    value={uploadEvent}
                    onChange={(e) => setUploadEvent(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
                  >
                    <option value="Youth Retreat 2024">Youth Retreat 2024</option>
                    <option value="Sunday Service">Sunday Service</option>
                    <option value="Community Outreach">Community Outreach</option>
                    <option value="Semester Opening">Semester Opening</option>
                    <option value="Weekly Bible Study">Weekly Bible Study</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Asset Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:outline-none"
                  >
                    <option value="Retreat">Retreat</option>
                    <option value="Worship">Worship</option>
                    <option value="Outreach">Outreach</option>
                    <option value="Flyer">Flyer</option>
                    <option value="Fellowship">Fellowship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={uploadTags}
                  onChange={(e) => setUploadTags(e.target.value)}
                  placeholder="Devotional, Worship, Banner"
                  className="w-full p-2.5 rounded-xl bg-[#FAF8F5] border border-[#E4E4E7] text-xs font-medium text-[#18181B] focus:bg-white focus:outline-none focus:border-[#5B0617]"
                />
              </div>

              <div className="pt-3 border-t border-[#E4E4E7] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#FAF8F5] hover:bg-[#E4E4E7] text-xs font-bold text-[#52525B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B0617] hover:bg-[#7A1F2B] text-white text-xs font-bold shadow-xs"
                >
                  Save & Publish Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lightbox / Fullscreen Preview Modal */}
      {previewMedia && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden border border-[#E4E4E7] shadow-2xl relative">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] bg-black flex items-center justify-center">
              <img
                src={previewMedia.imageUrl}
                alt={previewMedia.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 space-y-3 bg-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#18181B]">
                    {previewMedia.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#5B0617]">{previewMedia.event}</p>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  {previewMedia.status}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-2">
                {previewMedia.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 rounded-md bg-[#FAF8F5] text-[#52525B] text-[10px] font-semibold border border-[#E4E4E7]">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
