import React, { useState, useEffect } from 'react';
import { CATALOG_ITEMS as INITIAL_ITEMS } from './data/catalogData';
import { EquipmentItem } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CatalogSection } from './components/CatalogSection';
import { TrussAndRoofHighlight } from './components/TrussAndRoofHighlight';
import { EquipmentModal } from './components/EquipmentModal';
import { ImageCustomizerModal } from './components/ImageCustomizerModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ContactAndFooter } from './components/ContactAndFooter';
import { AudioVisualizerBackground } from './components/AudioVisualizerBackground';
import {
  loadImagesFromLocalStorage,
  saveAllImagesPermanently,
  clearAllImagesPermanently,
  fetchAllImagesWithCloudSync,
  saveImageToIndexedDB,
  sanitizeImagePath,
  PRIMARY_LOCAL_KEY,
} from './utils/persistentStorage';
import { subscribeToSupabaseImages, saveImageToSupabase, isSupabaseConfigured } from './lib/supabase';

export default function App() {
  // Synchronous first render using consolidated local storage (covers all keys & versions)
  const [items, setItems] = useState<EquipmentItem[]>(() => {
    const saved = loadImagesFromLocalStorage();
    return INITIAL_ITEMS.map((item) => {
      const userSaved = saved[item.id] || ((item.id === 'cabezales-moviles-pro' || item.id === 'show-robot-led') ? saved['cabezales-moviles-robot-led'] : undefined);
      if (userSaved && typeof userSaved === 'string' && userSaved.trim() !== '') {
        const clean = sanitizeImagePath(userSaved);
        if (clean) {
          return { ...item, image: clean };
        }
      }
      return item;
    });
  });

  const [activeModalItem, setActiveModalItem] = useState<EquipmentItem | null>(null);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [pendingAuthAction, setPendingAuthAction] = useState<(() => void) | null>(null);

  // Security gatekeeper for photo modifications
  const requireAdminAuth = (onAuthorizedAction: () => void) => {
    if (isAdminUnlocked) {
      onAuthorizedAction();
    } else {
      setPendingAuthAction(() => onAuthorizedAction);
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAdminUnlocked(true);
    if (pendingAuthAction) {
      pendingAuthAction();
      setPendingAuthAction(null);
    } else {
      setIsImageManagerOpen(true);
    }
  };

  // Asynchronous recovery from Supabase Cloud DB, IndexedDB, and server synchronization
  useEffect(() => {
    let isMounted = true;

    async function syncStorage() {
      try {
        const consolidated = await fetchAllImagesWithCloudSync();

        if (!isMounted || !consolidated || Object.keys(consolidated).length === 0) return;

        setItems((prev) => {
          let hasDiff = false;
          const updated = prev.map((item) => {
            const userImg = consolidated[item.id] || ((item.id === 'cabezales-moviles-pro' || item.id === 'show-robot-led') ? consolidated['cabezales-moviles-robot-led'] : undefined);
            if (
              userImg &&
              typeof userImg === 'string' &&
              userImg.trim() !== '' &&
              userImg !== item.image
            ) {
              hasDiff = true;
              return { ...item, image: userImg };
            }
            return item;
          });

          return hasDiff ? updated : prev;
        });
      } catch (e) {
        console.error('Error during cloud/local image sync:', e);
      }
    }

    // Initial sync on mount
    syncStorage();

    // Subscribe to real-time changes from Supabase (instant websocket push)
    const unsubscribe = subscribeToSupabaseImages((itemId, newUrl) => {
      if (itemId && newUrl) {
        setItems((prev) => {
          const existing = prev.find((it) => it.id === itemId);
          if (existing && existing.image === newUrl) {
            return prev;
          }
          return prev.map((it) => (it.id === itemId ? { ...it, image: newUrl } : it));
        });
        saveImageToIndexedDB(itemId, newUrl).catch(() => {});
        try {
          const current = loadImagesFromLocalStorage();
          current[itemId] = newUrl;
          localStorage.setItem(PRIMARY_LOCAL_KEY, JSON.stringify(current));
        } catch {
          // ignore
        }
      }
    });

    // Throttled sync on window focus (at most once every 30 seconds when refocusing)
    let lastFocusSync = Date.now();
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusSync > 30000) {
        lastFocusSync = now;
        syncStorage();
      }
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      if (unsubscribe) unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  // Update image with permanent persistence across IndexedDB, localStorage, and Server API
  const handleUpdateItemImage = (itemId: string, newUrl: string) => {
    if (!newUrl || newUrl.trim() === '') return;

    setItems((prev) => {
      const target = prev.find((it) => it.id === itemId);
      if (target && target.image === newUrl) {
        return prev;
      }
      return prev.map((item) =>
        item.id === itemId ? { ...item, image: newUrl } : item
      );
    });

    // 1. IndexedDB
    saveImageToIndexedDB(itemId, newUrl).catch(() => {});

    // 2. Primary localStorage
    try {
      const current = loadImagesFromLocalStorage();
      current[itemId] = newUrl;
      localStorage.setItem(PRIMARY_LOCAL_KEY, JSON.stringify(current));
    } catch {
      // ignore
    }

    // 3. Supabase Cloud DB (single upsert, prevents 15-item cascade and realtime storm)
    if (isSupabaseConfigured()) {
      saveImageToSupabase(itemId, newUrl).catch(() => {});
    }

    // 4. Server disk
    fetch('/api/custom-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ images: { [itemId]: newUrl } }),
    }).catch(() => {});

    if (activeModalItem && activeModalItem.id === itemId) {
      setActiveModalItem((prev) => (prev ? { ...prev, image: newUrl } : null));
    }
  };

  const handleBatchUpdateImages = (newImagesMap: Record<string, string>) => {
    setItems((prev) => {
      const updated = prev.map((item) => {
        const replacement = newImagesMap[item.id];
        return replacement && typeof replacement === 'string' && replacement.trim() !== ''
          ? { ...item, image: replacement }
          : item;
      });

      const imageMap: Record<string, string> = {};
      updated.forEach((it) => {
        imageMap[it.id] = it.image;
      });

      saveAllImagesPermanently(imageMap);
      return updated;
    });
  };

  const handleResetAllImages = async () => {
    await clearAllImagesPermanently();
    setItems(INITIAL_ITEMS);
    if (activeModalItem) {
      const original = INITIAL_ITEMS.find((it) => it.id === activeModalItem.id);
      if (original) setActiveModalItem(original);
    }
  };

  const handleOpenTrussDetails = () => {
    const trussItem = items.find((it) => it.id === 'techo-truss-10x10');
    if (trussItem) {
      setActiveModalItem(trussItem);
    }
  };

  return (
    <div className="min-h-screen bg-[#090b10] text-slate-100 relative selection:bg-cyan-400 selection:text-black font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Background dynamic audio waveform */}
      <AudioVisualizerBackground />

      {/* Main Navigation with Camera/Images Icon */}
      <Navbar onOpenImageManager={() => requireAdminAuth(() => setIsImageManagerOpen(true))} />

      {/* Main Content Sections */}
      <main className="relative z-10">
        {/* Hero Section */}
        <Hero />

        {/* Catalog Section - Pure Showcase with Technical Specs */}
        <CatalogSection
          items={items}
          onViewItemDetails={(item) => setActiveModalItem(item)}
          onUpdateItemImage={handleUpdateItemImage}
          onRequestProtectedUpload={(itemId) => {
            requireAdminAuth(() => {
              setIsImageManagerOpen(true);
            });
          }}
          onOpenImageManager={() => requireAdminAuth(() => setIsImageManagerOpen(true))}
        />

        {/* Dedicated Truss & Roof 10x10 Highlight Section */}
        <TrussAndRoofHighlight
          trussImage={items.find((it) => it.id === 'techo-truss-10x10')?.image}
          onViewDetails={handleOpenTrussDetails}
        />
      </main>

      {/* Footer & Company Info */}
      <ContactAndFooter onOpenAdmin={() => requireAdminAuth(() => setIsImageManagerOpen(true))} />

      {/* Equipment Detail Modal with responsive & ergonomic viewport sizing */}
      <EquipmentModal
        item={activeModalItem}
        onClose={() => setActiveModalItem(null)}
        onUpdateItemImage={handleUpdateItemImage}
        onRequestAuth={(onSuccess) => requireAdminAuth(onSuccess)}
      />

      {/* Image Manager / Uploader Modal with responsive mobile tabs and backup tools */}
      <ImageCustomizerModal
        isOpen={isImageManagerOpen}
        onClose={() => setIsImageManagerOpen(false)}
        items={items}
        onUpdateItemImage={handleUpdateItemImage}
        onBatchUpdateImages={handleBatchUpdateImages}
        onResetAllImages={handleResetAllImages}
      />

      {/* Security PIN Authentication Modal */}
      <AdminAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingAuthAction(null);
        }}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}
