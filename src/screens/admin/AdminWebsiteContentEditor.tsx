/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { AdminContextType } from './AdminLayout';
import { websiteCopyService } from '../../services/websiteCopy/websiteCopy.service';
import { 
  WebsiteCopyModel, 
  WebsiteConfiguration, 
  DynamicWebsiteSection, 
  ControlledSectionType,
  SectionBackground,
  SectionAlignment,
  SectionLayout,
  WebsiteSectionItem
} from '../../types/websiteCopy';
import { 
  Globe, 
  Save, 
  RotateCcw, 
  Eye, 
  EyeOff,
  Layout, 
  Users, 
  MapPin, 
  Sparkles, 
  CheckCircle,
  HelpCircle,
  ArrowRight,
  Megaphone,
  BookOpen,
  Calendar,
  AlertTriangle,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Sliders,
  Layers,
  Quote as QuoteIcon,
  Star,
  ExternalLink,
  Undo2,
  Send,
  AlertCircle
} from 'lucide-react';
import { ControlledSection } from '../public/sections/ControlledSection';

type SectionTab = 'sections' | 'hero' | 'about' | 'life' | 'visit' | 'cta' | string;

export const AdminWebsiteContentEditor: React.FC = () => {
  const { activeRole } = useOutletContext<AdminContextType>();

  // Permission Checks:
  // Draft read/save/discard: Publicity Coordinator, Technical Admin (mapped from Technical Administrator)
  // Publish/reset: Publicity Coordinator, President (mapped from President / Executive), General Secretary
  // Note: Technical Administrator MUST NOT be authorized to publish or reset the website.
  const canEditDraft = activeRole === 'Publicity Coordinator' || activeRole === 'Technical Administrator';
  const canPublishOrReset = activeRole === 'Publicity Coordinator' || activeRole === 'President / Executive' || activeRole === 'General Secretary';
  
  // Authoritative configurations
  const [draftConfig, setDraftConfig] = useState<WebsiteConfiguration>(() => websiteCopyService.getDraftConfig());
  const [publishedConfig, setPublishedConfig] = useState<WebsiteConfiguration>(() => websiteCopyService.getPublishedConfig());
  
  // Working state for active edits
  const [copy, setCopy] = useState<WebsiteCopyModel>(() => draftConfig.copy);
  const [sections, setSections] = useState<DynamicWebsiteSection[]>(() => draftConfig.sections);
  const [activeTab, setActiveTab] = useState<SectionTab>('sections');
  
  // Feedback and modal states
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const [isAddSectionModalOpen, setIsAddSectionModalOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(true);

  // Add Section Modal Form State
  const [newSectionType, setNewSectionType] = useState<ControlledSectionType>('text_image');
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [newSectionSubtitle, setNewSectionSubtitle] = useState('');
  const [newSectionDesc, setNewSectionDesc] = useState('');
  const [newSectionBadge, setNewSectionBadge] = useState('');
  const [newSectionImageUrl, setNewSectionImageUrl] = useState('');
  const [newSectionBg, setNewSectionBg] = useState<SectionBackground>('default');
  const [newSectionAlign, setNewSectionAlign] = useState<SectionAlignment>('left');
  const [newSectionLayout, setNewSectionLayout] = useState<SectionLayout>('text_image');
  const [newSectionShowCta, setNewSectionShowCta] = useState(false);
  const [newSectionCtaText, setNewSectionCtaText] = useState('Learn More');
  const [newSectionCtaLink, setNewSectionCtaLink] = useState('#visit');
  const [newSectionItems, setNewSectionItems] = useState<WebsiteSectionItem[]>([
    { id: 'item-1', title: 'Fellowship Pillar', description: 'Gathering together in unity.' },
    { id: 'item-2', title: 'Scriptural Study', description: 'Grounded in biblical truth.' },
    { id: 'item-3', title: 'Campus Outreach', description: 'Sharing Christ across campus.' }
  ]);

  const loadData = () => {
    setIsLoading(true);
    setLoadError(null);
    setActionError(null);

    Promise.all([
      websiteCopyService.fetchDraftConfig(),
      websiteCopyService.fetchPublishedConfig()
    ])
      .then(([draft, published]) => {
        setDraftConfig(draft);
        setPublishedConfig(published);
        setCopy(draft.copy);
        setSections(draft.sections);
      })
      .catch((err) => {
        console.error('[AdminWebsiteContentEditor] Fetch error:', err);
        setLoadError(err?.message || 'Failed to load website configuration from server.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Initial load from backend
  useEffect(() => {
    loadData();
  }, []);

  // Sync state if service updates
  useEffect(() => {
    const unsubscribe = websiteCopyService.subscribe(() => {
      const freshDraft = websiteCopyService.getDraftConfig();
      const freshPublished = websiteCopyService.getPublishedConfig();
      setDraftConfig(freshDraft);
      setPublishedConfig(freshPublished);
    });
    return unsubscribe;
  }, []);

  const handleCopyChange = (section: keyof Omit<WebsiteCopyModel, 'lastUpdated' | 'updatedBy' | 'version'>, field: string, value: string) => {
    setCopy(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  // Save Working Draft (does not affect live website)
  const handleSaveDraft = async () => {
    if (!canEditDraft) return;
    setIsSavingDraft(true);
    setActionError(null);
    try {
      const updated = await websiteCopyService.saveDraft({
        copy,
        sections
      }, activeRole);
      
      setDraftConfig(updated);
      setSaveSuccessMsg('Draft saved successfully! (Unpublished)');
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (e: any) {
      console.error('Failed to save draft:', e);
      setActionError(e?.message || 'Failed to save draft.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Publish Draft Live (increments version and updates live public site)
  const handlePublishLive = async () => {
    if (!canPublishOrReset) return;
    setIsPublishing(true);
    setIsPublishConfirmOpen(false);
    setActionError(null);
    try {
      // First ensure draft is up to date
      await websiteCopyService.saveDraft({ copy, sections }, activeRole);
      // Promote draft to published
      const published = await websiteCopyService.publishDraft(activeRole);
      
      setPublishedConfig(published);
      setDraftConfig(published);
      setSaveSuccessMsg(`Published live! Website is now running v${published.version}.`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    } catch (e: any) {
      console.error('Failed to publish website:', e);
      setActionError(e?.message || 'Failed to publish live website.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Discard draft changes and restore live published state
  const handleDiscardDraft = async () => {
    if (!canEditDraft) return;
    setIsSavingDraft(true);
    setActionError(null);
    try {
      const reverted = await websiteCopyService.discardDraft();
      setDraftConfig(reverted);
      setCopy(reverted.copy);
      setSections(reverted.sections);
      setSaveSuccessMsg('Draft discarded. Restored live published version.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (e: any) {
      console.error('Failed to discard draft:', e);
      setActionError(e?.message || 'Failed to discard draft.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Reorder Sections
  const handleMoveSection = async (index: number, direction: 'up' | 'down') => {
    if (!canEditDraft) return;
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;

    const newSections = [...sections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIdx, 0, moved);

    // Update order indices
    const updated = newSections.map((s, idx) => ({ ...s, order: idx + 1 }));
    setSections(updated);
    try {
      await websiteCopyService.saveDraft({ sections: updated }, activeRole);
    } catch (e: any) {
      setActionError(e?.message || 'Failed to reorder sections.');
    }
  };

  // Toggle Section Visibility
  const handleToggleVisibility = async (sectionId: string, currentVisibility: boolean) => {
    if (!canEditDraft) return;
    const updated = sections.map(s => s.id === sectionId ? { ...s, isVisible: !currentVisibility } : s);
    setSections(updated);
    try {
      await websiteCopyService.saveDraft({ sections: updated }, activeRole);
    } catch (e: any) {
      setActionError(e?.message || 'Failed to update section visibility.');
    }
  };

  // Delete Custom Section
  const handleDeleteSection = async (sectionId: string) => {
    if (!canEditDraft) return;
    const updated = sections.filter(s => s.id !== sectionId);
    setSections(updated);
    if (activeTab === sectionId) {
      setActiveTab('sections');
    }
    try {
      await websiteCopyService.saveDraft({ sections: updated }, activeRole);
    } catch (e: any) {
      setActionError(e?.message || 'Failed to delete section.');
    }
  };

  // Add Section Submit
  const handleAddSectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionTitle.trim() || !canEditDraft) return;
    setActionError(null);

    try {
      const newSection = await websiteCopyService.addSection({
        type: newSectionType,
        title: newSectionTitle.trim(),
        subtitle: newSectionSubtitle.trim() || undefined,
        description: newSectionDesc.trim() || undefined,
        imageUrl: newSectionImageUrl.trim() || undefined,
        items: ['feature_grid', 'card_grid'].includes(newSectionType) ? newSectionItems : undefined,
        configuration: {
          background: newSectionBg,
          alignment: newSectionAlign,
          layout: newSectionLayout,
          showCta: newSectionShowCta,
          ctaText: newSectionCtaText,
          ctaLink: newSectionCtaLink,
          badge: newSectionBadge.trim() || undefined
        },
        isVisible: true
      }, activeRole);

      const freshDraft = websiteCopyService.getDraftConfig();
      setDraftConfig(freshDraft);
      setSections(freshDraft.sections);
      setIsAddSectionModalOpen(false);
      setActiveTab(newSection.id);
      
      // Reset modal form
      setNewSectionTitle('');
      setNewSectionSubtitle('');
      setNewSectionDesc('');
      setNewSectionBadge('');
      setNewSectionImageUrl('');

      setSaveSuccessMsg(`Added new "${newSection.title}" section to draft!`);
      setTimeout(() => setSaveSuccessMsg(null), 3500);
    } catch (e: any) {
      console.error('Failed to add section:', e);
      setActionError(e?.message || 'Failed to add section.');
    }
  };

  // Reset to Defaults
  const handleResetToDefault = async () => {
    if (!canPublishOrReset) return;
    setIsSavingDraft(true);
    setIsResetConfirmOpen(false);
    setActionError(null);
    try {
      const resetConfig = await websiteCopyService.resetCopy(activeRole);
      const freshDraft = websiteCopyService.getDraftConfig();
      const freshPublished = websiteCopyService.getPublishedConfig();
      setDraftConfig(freshDraft);
      setPublishedConfig(freshPublished);
      setCopy(resetConfig.copy);
      setSections(freshDraft.sections);
      setActiveTab('sections');
      
      setSaveSuccessMsg('Reset all website copy and sections to system defaults.');
      setTimeout(() => setSaveSuccessMsg(null), 3000);
    } catch (e: any) {
      console.error('Failed to reset copy:', e);
      setActionError(e?.message || 'Failed to reset website content.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const isDraftModified = JSON.stringify(copy) !== JSON.stringify(publishedConfig.copy) ||
    JSON.stringify(sections) !== JSON.stringify(publishedConfig.sections);

  // Active custom section if selected
  const activeCustomSection = sections.find(s => s.id === activeTab);

  return (
    <div className="space-y-6 select-none" id="admin-website-content-editor-screen">
      
      {/* Top Banner & Action Controls */}
      <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#5B0617]/10 text-[#5B0617]">
              <Globe className="w-5 h-5" />
            </span>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#52525B]">
              <span>Publicity Coordinator Workspace</span>
              <span>/</span>
              <span className="text-[#5B0617] font-bold">Website Content & Section CMS</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#18181B] tracking-tight">
            Website Content & Section Builder
          </h1>
          <p className="text-xs sm:text-sm text-[#52525B] max-w-2xl">
            Control live website copy, add structured sections with curated design configurations, reorder content blocks, and publish releases safely.
          </p>
        </div>

        {/* Action Buttons & Draft Status */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold bg-[#FAF8F5] border-[#E8E1D9]">
            <span className={`w-2 h-2 rounded-full ${isDraftModified ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
            <span className="text-[#18181B]">
              {isDraftModified ? 'Draft: Unpublished Changes' : `Live v${publishedConfig.version}`}
            </span>
          </div>

          {/* Discard / Revert Button */}
          {canEditDraft && isDraftModified && (
            <button
              onClick={handleDiscardDraft}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-[#52525B] hover:text-[#18181B] hover:bg-stone-100 border border-[#E4E4E7] transition-colors"
              title="Discard draft changes and revert to live published version"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
          )}

          {/* Save Draft Button */}
          {canEditDraft && (
            <button
              onClick={handleSaveDraft}
              disabled={isSavingDraft || isPublishing}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#18181B] bg-white hover:bg-stone-50 border border-[#E4E4E7] shadow-sm transition-all"
            >
              <Save className="w-3.5 h-3.5 text-[#5B0617]" />
              <span>{isSavingDraft ? 'Saving Draft...' : 'Save Draft'}</span>
            </button>
          )}

          {/* Publish Website Button */}
          {canPublishOrReset && (
            <button
              onClick={() => setIsPublishConfirmOpen(true)}
              disabled={isSavingDraft || isPublishing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#5B0617] hover:bg-[#480512] shadow-sm shadow-[#5B0617]/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isPublishing ? 'Publishing...' : 'Publish to Website'}</span>
            </button>
          )}

          {/* Reset Defaults */}
          {canPublishOrReset && (
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="p-2 rounded-xl text-[#71717A] hover:text-amber-600 hover:bg-amber-50 transition-colors"
              title="Reset website to system defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Load Error Banner */}
      {loadError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{loadError}</span>
          </div>
          <button
            onClick={loadData}
            className="px-3 py-1.5 bg-rose-700 text-white rounded-xl font-bold hover:bg-rose-800 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Action Error Banner */}
      {actionError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="text-rose-700 hover:text-rose-900">
            &times;
          </button>
        </div>
      )}

      {/* Success Banner Notification */}
      {saveSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <button onClick={() => setSaveSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            &times;
          </button>
        </div>
      )}

      {/* Editor Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Navigation Tabs - Left Column */}
        <div className="lg:col-span-3 space-y-3">
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-4 shadow-sm space-y-1">
            <div className="flex items-center justify-between px-3 py-1.5 mb-2 border-b border-[#F4EFEA] pb-2">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#52525B]">
                Sections & Layout
              </p>
              <button
                onClick={() => setIsAddSectionModalOpen(true)}
                className="flex items-center gap-1 text-[11px] font-bold text-[#5B0617] hover:underline"
              >
                <Plus className="w-3 h-3" />
                <span>Add Section</span>
              </button>
            </div>
            
            {/* Sections Manager Tab */}
            <button
              onClick={() => setActiveTab('sections')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${
                activeTab === 'sections' 
                  ? 'bg-[#5B0617] text-white shadow-md shadow-[#5B0617]/10' 
                  : 'text-[#18181B] hover:bg-[#FAF8F5] bg-transparent'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Layers className="w-4 h-4 shrink-0" />
                Section Order & Manager
              </span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${activeTab === 'sections' ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-600'}`}>
                {sections.length}
              </span>
            </button>

            <div className="pt-2 pb-1 px-3">
              <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
                Core Sections
              </p>
            </div>

            <button
              onClick={() => setActiveTab('hero')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                activeTab === 'hero' 
                  ? 'bg-[#5B0617] text-white font-bold shadow-md shadow-[#5B0617]/10' 
                  : 'text-[#18181B] hover:bg-[#FAF8F5]'
              }`}
            >
              <Layout className="w-3.5 h-3.5 shrink-0" />
              Hero Welcome
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                activeTab === 'about' 
                  ? 'bg-[#5B0617] text-white font-bold shadow-md shadow-[#5B0617]/10' 
                  : 'text-[#18181B] hover:bg-[#FAF8F5]'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 shrink-0" />
              About Fellowship
            </button>

            <button
              onClick={() => setActiveTab('life')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                activeTab === 'life' 
                  ? 'bg-[#5B0617] text-white font-bold shadow-md shadow-[#5B0617]/10' 
                  : 'text-[#18181B] hover:bg-[#FAF8F5]'
              }`}
            >
              <Users className="w-3.5 h-3.5 shrink-0" />
              Life at ASF
            </button>

            <button
              onClick={() => setActiveTab('visit')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                activeTab === 'visit' 
                  ? 'bg-[#5B0617] text-white font-bold shadow-md shadow-[#5B0617]/10' 
                  : 'text-[#18181B] hover:bg-[#FAF8F5]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              Visit & Details
            </button>

            <button
              onClick={() => setActiveTab('cta')}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center gap-2.5 ${
                activeTab === 'cta' 
                  ? 'bg-[#5B0617] text-white font-bold shadow-md shadow-[#5B0617]/10' 
                  : 'text-[#18181B] hover:bg-[#FAF8F5]'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5 shrink-0" />
              Call to Action
            </button>

            {/* Custom Sections Tabs */}
            {sections.filter(s => s.id.startsWith('sec-custom-')).length > 0 && (
              <>
                <div className="pt-3 pb-1 px-3 border-t border-[#F4EFEA] mt-2">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-stone-400">
                    Custom Sections
                  </p>
                </div>
                {sections.filter(s => s.id.startsWith('sec-custom-')).map(sec => (
                  <button
                    key={sec.id}
                    onClick={() => setActiveTab(sec.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      activeTab === sec.id 
                        ? 'bg-[#5B0617] text-white font-bold shadow-md shadow-[#5B0617]/10' 
                        : 'text-[#18181B] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-amber-500" />
                      <span className="truncate">{sec.title}</span>
                    </span>
                    {!sec.isVisible && <EyeOff className="w-3 h-3 text-stone-400 shrink-0 ml-1" />}
                  </button>
                ))}
              </>
            )}

            {/* + Add Section CTA Button */}
            <div className="pt-3 border-t border-[#F4EFEA] mt-2">
              <button
                onClick={() => setIsAddSectionModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-[#5B0617]/40 text-[#5B0617] hover:bg-[#5B0617]/5 text-xs font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>+ Add Section</span>
              </button>
            </div>
          </div>
        </div>

        {/* Editor Form - Middle Column */}
        <div className={`space-y-6 ${showPreview ? 'lg:col-span-5' : 'lg:col-span-9'}`}>
          <div className="bg-white border border-[#E4E4E7] rounded-2xl p-6 shadow-sm">
            
            {/* TAB: SECTIONS MANAGER & REORDER */}
            {activeTab === 'sections' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181B]">
                    Website Sections & Ordering
                  </h3>
                  <p className="text-xs text-[#52525B] mt-0.5">
                    Reorder homepage sections, toggle visibility on the live site, or add custom design blocks.
                  </p>
                </div>

                <div className="space-y-2.5">
                  {sections.map((sec, idx) => {
                    const isCustom = sec.id.startsWith('sec-custom-');
                    return (
                      <div
                        key={sec.id}
                        className={`p-4 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          sec.isVisible 
                            ? 'bg-white border-[#E8E1D9] hover:border-[#5B0617]/30' 
                            : 'bg-stone-50 border-stone-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="w-6 h-6 rounded-lg bg-stone-100 text-stone-600 text-xs font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-[#18181B] truncate">
                                {sec.title}
                              </h4>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#5B0617]/10 text-[#5B0617] font-semibold">
                                {sec.type}
                              </span>
                            </div>
                            <p className="text-[11px] text-stone-500 truncate">
                              Background: {sec.configuration?.background || 'default'} • Status: {sec.isVisible ? 'Visible' : 'Hidden'}
                            </p>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-1 shrink-0">
                          {/* Move Up */}
                          <button
                            onClick={() => handleMoveSection(idx, 'up')}
                            disabled={idx === 0}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move section up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          {/* Move Down */}
                          <button
                            onClick={() => handleMoveSection(idx, 'down')}
                            disabled={idx === sections.length - 1}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move section down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                          {/* Toggle Visibility */}
                          <button
                            onClick={() => handleToggleVisibility(sec.id, sec.isVisible)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              sec.isVisible 
                                ? 'text-emerald-700 hover:bg-emerald-50' 
                                : 'text-stone-400 hover:bg-stone-100'
                            }`}
                            title={sec.isVisible ? 'Hide from public site' : 'Show on public site'}
                          >
                            {sec.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                          </button>
                          {/* Edit Content Button */}
                          <button
                            onClick={() => {
                              const coreMapping: Record<string, SectionTab> = {
                                'sec-hero': 'hero',
                                'sec-about': 'about',
                                'sec-life': 'life',
                                'sec-visit': 'visit',
                                'sec-cta': 'cta'
                              };
                              setActiveTab(coreMapping[sec.id] || sec.id);
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#5B0617] hover:bg-[#5B0617]/10"
                            title="Edit section content"
                          >
                            <Sliders className="w-3.5 h-3.5" />
                          </button>
                          {/* Delete Custom Section */}
                          {isCustom && (
                            <button
                              onClick={() => handleDeleteSection(sec.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                              title="Delete custom section"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => setIsAddSectionModalOpen(true)}
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#FAF8F5] border border-dashed border-[#5B0617]/40 text-[#5B0617] font-bold text-xs hover:bg-[#5B0617]/5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Controlled Section</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB: HERO SECTION */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181B]">Hero Section Content</h3>
                  <p className="text-xs text-[#52525B]">The primary welcome screen visible to new campus visitors.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Headline</label>
                    <input
                      type="text"
                      value={copy.hero.headline}
                      onChange={e => handleCopyChange('hero', 'headline', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#5B0617] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Supporting Description</label>
                    <textarea
                      rows={3}
                      value={copy.hero.supportingText}
                      onChange={e => handleCopyChange('hero', 'supportingText', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#5B0617] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#18181B] mb-1">Primary Button Text</label>
                      <input
                        type="text"
                        value={copy.hero.primaryCtaText}
                        onChange={e => handleCopyChange('hero', 'primaryCtaText', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#5B0617] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#18181B] mb-1">Secondary Button Text</label>
                      <input
                        type="text"
                        value={copy.hero.secondaryCtaText}
                        onChange={e => handleCopyChange('hero', 'secondaryCtaText', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#5B0617] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: ABOUT SECTION */}
            {activeTab === 'about' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181B]">About Fellowship Pillars</h3>
                  <p className="text-xs text-[#52525B]">Fellowship overview and the four core pillars of community life.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Headline</label>
                    <input
                      type="text"
                      value={copy.about.headline}
                      onChange={e => handleCopyChange('about', 'headline', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#5B0617] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Description</label>
                    <textarea
                      rows={3}
                      value={copy.about.description}
                      onChange={e => handleCopyChange('about', 'description', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#5B0617] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#18181B] mb-1">Pillar 1 Title</label>
                      <input
                        type="text"
                        value={copy.about.worshipTitle}
                        onChange={e => handleCopyChange('about', 'worshipTitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#18181B] mb-1">Pillar 2 Title</label>
                      <input
                        type="text"
                        value={copy.about.learnTitle}
                        onChange={e => handleCopyChange('about', 'learnTitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#18181B] mb-1">Pillar 3 Title</label>
                      <input
                        type="text"
                        value={copy.about.prayTitle}
                        onChange={e => handleCopyChange('about', 'prayTitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#18181B] mb-1">Pillar 4 Title</label>
                      <input
                        type="text"
                        value={copy.about.lifeTitle}
                        onChange={e => handleCopyChange('about', 'lifeTitle', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: LIFE SECTION */}
            {activeTab === 'life' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181B]">Life at ASF Section</h3>
                  <p className="text-xs text-[#52525B]">Narrative focusing on authentic student life on campus.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Heading</label>
                    <input
                      type="text"
                      value={copy.life.heading}
                      onChange={e => handleCopyChange('life', 'heading', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Supporting Copy</label>
                    <textarea
                      rows={3}
                      value={copy.life.supportingCopy}
                      onChange={e => handleCopyChange('life', 'supportingCopy', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: VISIT SECTION */}
            {activeTab === 'visit' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181B]">Visit Us & Gathering Details</h3>
                  <p className="text-xs text-[#52525B]">Service venue, times, and steps for new students.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Headline</label>
                    <input
                      type="text"
                      value={copy.visit.headline}
                      onChange={e => handleCopyChange('visit', 'headline', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#18181B] mb-1">Main Gathering Name</label>
                      <input
                        type="text"
                        value={copy.visit.mainGatheringName}
                        onChange={e => handleCopyChange('visit', 'mainGatheringName', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#18181B] mb-1">Service Time</label>
                      <input
                        type="text"
                        value={copy.visit.serviceTime}
                        onChange={e => handleCopyChange('visit', 'serviceTime', e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Service Venue</label>
                    <input
                      type="text"
                      value={copy.visit.serviceVenue}
                      onChange={e => handleCopyChange('visit', 'serviceVenue', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: CTA SECTION */}
            {activeTab === 'cta' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-[#18181B]">Call to Action Banner</h3>
                  <p className="text-xs text-[#52525B]">Concluding invitation banner encouraging students to come along.</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Heading</label>
                    <input
                      type="text"
                      value={copy.cta.heading}
                      onChange={e => handleCopyChange('cta', 'heading', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Text Narrative</label>
                    <textarea
                      rows={3}
                      value={copy.cta.text}
                      onChange={e => handleCopyChange('cta', 'text', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Button Text</label>
                    <input
                      type="text"
                      value={copy.cta.ctaButtonText}
                      onChange={e => handleCopyChange('cta', 'ctaButtonText', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EDIT CUSTOM SECTION */}
            {activeCustomSection && (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-3">
                  <div>
                    <h3 className="font-serif text-lg font-bold text-[#18181B]">
                      Edit Custom Section: {activeCustomSection.title}
                    </h3>
                    <p className="text-xs text-[#52525B]">Type: {activeCustomSection.type}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSection(activeCustomSection.id)}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-bold"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Section</span>
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Section Title</label>
                    <input
                      type="text"
                      value={activeCustomSection.title}
                      onChange={e => {
                        const updated = sections.map(s => s.id === activeCustomSection.id ? { ...s, title: e.target.value } : s);
                        setSections(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Subtitle / Tagline</label>
                    <input
                      type="text"
                      value={activeCustomSection.subtitle || ''}
                      onChange={e => {
                        const updated = sections.map(s => s.id === activeCustomSection.id ? { ...s, subtitle: e.target.value } : s);
                        setSections(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#18181B] mb-1">Description / Body Text</label>
                    <textarea
                      rows={3}
                      value={activeCustomSection.description || ''}
                      onChange={e => {
                        const updated = sections.map(s => s.id === activeCustomSection.id ? { ...s, description: e.target.value } : s);
                        setSections(updated);
                      }}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#18181B] mb-1">Badge Tag</label>
                      <input
                        type="text"
                        value={activeCustomSection.configuration?.badge || ''}
                        onChange={e => {
                          const updated = sections.map(s => s.id === activeCustomSection.id ? {
                            ...s,
                            configuration: { ...s.configuration, badge: e.target.value }
                          } : s);
                          setSections(updated);
                        }}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#18181B] mb-1">Background Theme</label>
                      <select
                        value={activeCustomSection.configuration?.background || 'default'}
                        onChange={e => {
                          const updated = sections.map(s => s.id === activeCustomSection.id ? {
                            ...s,
                            configuration: { ...s.configuration, background: e.target.value as SectionBackground }
                          } : s);
                          setSections(updated);
                        }}
                        className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl bg-white"
                      >
                        <option value="default">Default Off-White (#FDFBF9)</option>
                        <option value="subtle">Subtle Warm Surface (#F4EFEA)</option>
                        <option value="brand">Brand Maroon (#5B0617)</option>
                        <option value="accent">Warm Gold Accent (#FEF9EE)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Action Footer */}
            <div className="pt-5 border-t border-[#F4EFEA] flex items-center justify-between">
              <span className="text-[11px] text-[#52525B]">
                Remember to click "Save Draft" or "Publish to Website" to persist.
              </span>
              <button
                onClick={handleSaveDraft}
                disabled={isSavingDraft || isPublishing}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#5B0617] text-white text-xs font-bold rounded-xl hover:bg-[#480512] transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Draft Changes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Interactive Preview - Right Column */}
        {showPreview && (
          <div className="lg:col-span-4 space-y-3 sticky top-6">
            <div className="bg-white border border-[#E4E4E7] rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-2">
                <span className="text-xs font-bold text-[#18181B] flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-[#5B0617]" />
                  Live Component Preview
                </span>
                <span className="text-[10px] uppercase font-extrabold text-[#52525B] tracking-wider">
                  {activeTab}
                </span>
              </div>

              {/* Preview Canvas */}
              <div className="rounded-xl border border-stone-200 overflow-hidden bg-[#FDFBF9] max-h-[500px] overflow-y-auto">
                {activeTab === 'hero' && (
                  <div className="p-6 text-center space-y-4">
                    <span className="inline-block px-3 py-1 bg-[#5B0617]/10 text-[#5B0617] text-[10px] font-bold rounded-full">
                      Welcome to ASF
                    </span>
                    <h2 className="font-serif text-xl font-bold text-[#18181B] leading-tight">
                      {copy.hero.headline}
                    </h2>
                    <p className="text-xs text-[#52525B] leading-relaxed">
                      {copy.hero.supportingText}
                    </p>
                    <div className="flex justify-center gap-2 pt-2">
                      <span className="px-3 py-1.5 bg-[#5B0617] text-white text-[10px] font-bold rounded-lg shadow-sm">
                        {copy.hero.primaryCtaText}
                      </span>
                      <span className="px-3 py-1.5 bg-stone-100 text-stone-700 text-[10px] font-bold rounded-lg">
                        {copy.hero.secondaryCtaText}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'about' && (
                  <div className="p-6 space-y-4">
                    <h3 className="font-serif text-base font-bold text-[#18181B] text-center">
                      {copy.about.headline}
                    </h3>
                    <p className="text-xs text-[#52525B] text-center">
                      {copy.about.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <div className="p-2.5 rounded-lg border border-stone-200 bg-white text-center">
                        <p className="text-[11px] font-bold text-[#18181B]">{copy.about.worshipTitle}</p>
                      </div>
                      <div className="p-2.5 rounded-lg border border-stone-200 bg-white text-center">
                        <p className="text-[11px] font-bold text-[#18181B]">{copy.about.learnTitle}</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'cta' && (
                  <div className="p-6 bg-[#5B0617] text-white text-center space-y-3">
                    <h3 className="font-serif text-base font-bold leading-snug">
                      {copy.cta.heading}
                    </h3>
                    <p className="text-[11px] text-white/80 leading-relaxed">
                      {copy.cta.text}
                    </p>
                    <span className="inline-block px-4 py-1.5 bg-white text-[#5B0617] text-[10px] font-bold rounded-lg shadow-sm">
                      {copy.cta.ctaButtonText}
                    </span>
                  </div>
                )}

                {activeCustomSection && (
                  <ControlledSection section={activeCustomSection} />
                )}

                {activeTab === 'sections' && (
                  <div className="p-6 text-center space-y-3">
                    <Layers className="w-8 h-8 text-[#5B0617] mx-auto opacity-70" />
                    <p className="text-xs font-bold text-[#18181B]">
                      {sections.filter(s => s.isVisible).length} Visible Sections
                    </p>
                    <p className="text-[11px] text-stone-500">
                      Sections will appear sequentially on the public homepage in the order defined in the manager.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: ADD CONTROLLED SECTION BUILDER */}
      {isAddSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-[#F4EFEA] pb-4">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-[#5B0617]/10 text-[#5B0617]">
                  <Sparkles className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#18181B]">Add Controlled Website Section</h3>
                  <p className="text-xs text-[#52525B]">Choose a verified design pattern to enrich the public website safely.</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddSectionModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddSectionSubmit} className="space-y-5">
              {/* Step 1: Select Type */}
              <div>
                <label className="block text-xs font-bold text-[#18181B] mb-2">Select Section Type</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { type: 'text_image', label: 'Text + Image', icon: Layout },
                    { type: 'feature_grid', label: 'Feature Grid', icon: Star },
                    { type: 'quote', label: 'Quote / Pastoral', icon: QuoteIcon },
                    { type: 'callout', label: 'Notice / Callout', icon: Megaphone },
                    { type: 'scripture_highlight', label: 'Scripture Focus', icon: BookOpen },
                    { type: 'event_highlight', label: 'Event Highlight', icon: Calendar }
                  ].map(opt => {
                    const Icon = opt.icon;
                    const isSelected = newSectionType === opt.type;
                    return (
                      <button
                        key={opt.type}
                        type="button"
                        onClick={() => setNewSectionType(opt.type as ControlledSectionType)}
                        className={`p-3 rounded-xl border text-left flex flex-col gap-1.5 transition-all ${
                          isSelected 
                            ? 'border-[#5B0617] bg-[#5B0617]/5 text-[#5B0617] ring-1 ring-[#5B0617]' 
                            : 'border-[#E4E4E7] bg-white text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <Icon className="w-4 h-4 text-[#5B0617]" />
                        <span className="text-xs font-bold">{opt.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Content Fields */}
              <div className="space-y-3 pt-2 border-t border-[#F4EFEA]">
                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Section Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Welcome Freshers 2026"
                    value={newSectionTitle}
                    onChange={e => setNewSectionTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl focus:ring-1 focus:ring-[#5B0617] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Subtitle / Supporting Tagline</label>
                  <input
                    type="text"
                    placeholder="e.g. A word from the Executive Committee"
                    value={newSectionSubtitle}
                    onChange={e => setNewSectionSubtitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#18181B] mb-1">Description / Body Text</label>
                  <textarea
                    rows={3}
                    placeholder="Provide the core message or summary for this section..."
                    value={newSectionDesc}
                    onChange={e => setNewSectionDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-1">Badge Label (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Featured Announcement"
                      value={newSectionBadge}
                      onChange={e => setNewSectionBadge(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#18181B] mb-1">Background Theme</label>
                    <select
                      value={newSectionBg}
                      onChange={e => setNewSectionBg(e.target.value as SectionBackground)}
                      className="w-full px-3 py-2 text-xs border border-[#E4E4E7] rounded-xl bg-white"
                    >
                      <option value="default">Default Off-White (#FDFBF9)</option>
                      <option value="subtle">Subtle Sandstone (#F4EFEA)</option>
                      <option value="brand">Brand Maroon (#5B0617)</option>
                      <option value="accent">Warm Gold Accent (#FEF9EE)</option>
                    </select>
                  </div>
                </div>

                {/* Optional CTA Toggle */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSectionShowCta}
                      onChange={e => setNewSectionShowCta(e.target.checked)}
                      className="rounded text-[#5B0617] focus:ring-[#5B0617]"
                    />
                    <span className="text-xs font-bold text-[#18181B]">Include Call-to-Action Button</span>
                  </label>
                  {newSectionShowCta && (
                    <div className="grid grid-cols-2 gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Button Text (e.g. Read Outline)"
                        value={newSectionCtaText}
                        onChange={e => setNewSectionCtaText(e.target.value)}
                        className="px-2.5 py-1.5 text-xs border border-[#E4E4E7] rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Link Target (e.g. #visit)"
                        value={newSectionCtaLink}
                        onChange={e => setNewSectionCtaLink(e.target.value)}
                        className="px-2.5 py-1.5 text-xs border border-[#E4E4E7] rounded-lg bg-white"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#F4EFEA]">
                <button
                  type="button"
                  onClick={() => setIsAddSectionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#5B0617] hover:bg-[#480512] text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Add Section to Draft
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM PUBLISH LIVE MODAL */}
      {isPublishConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 max-w-md w-full space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-[#5B0617]">
              <span className="p-2 bg-[#5B0617]/10 rounded-xl">
                <Send className="w-5 h-5 text-[#5B0617]" />
              </span>
              <div>
                <h3 className="text-base font-bold text-[#18181B]">Publish to Live Website</h3>
                <p className="text-[11px] text-stone-500">Release v{(publishedConfig.version || 1) + 1}</p>
              </div>
            </div>
            
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to publish all working draft modifications to the live public website? Visitors to the homepage will immediately see the updated headlines, narratives, and section orders.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsPublishConfirmOpen(false)}
                className="px-4 h-9 bg-white border border-[#E4E4E7] text-[#18181B] hover:bg-stone-50 transition-colors rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handlePublishLive}
                className="px-4 h-9 bg-[#5B0617] text-white hover:bg-[#480512] transition-colors rounded-xl text-xs font-bold shadow-md shadow-[#5B0617]/20"
              >
                Confirm & Publish Live
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM RESET MODAL DIALOG */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl p-6 max-w-md w-full space-y-4 animate-scale-up">
            <div className="flex items-center gap-3 text-amber-600">
              <span className="p-2 bg-amber-50 rounded-xl">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <h3 className="text-base font-bold text-[#18181B]">Confirm Factory Reset</h3>
            </div>
            
            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to discard all custom drafts and reset the public website copy and sections back to the original hardcoded defaults? This action is immediate and cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 h-9 bg-white border border-[#E4E4E7] text-[#18181B] hover:bg-stone-50 transition-colors rounded-xl text-xs font-semibold"
              >
                Cancel Reset
              </button>
              <button
                onClick={handleResetToDefault}
                className="px-4 h-9 bg-amber-600 text-white hover:bg-amber-700 transition-colors rounded-xl text-xs font-semibold shadow-md shadow-amber-600/15"
              >
                Reset Default Copy & Sections
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminWebsiteContentEditor;
