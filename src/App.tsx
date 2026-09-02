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
} from './utils/persistentStorage';
import { subscribeToSupabaseImages } from './lib/supabase';

export default function App() {
  // Synchronous first render using consolidated local storage (covers all keys & versions)
  const [items, setItems] = useState<EquipmentItem[]>(() => {
    const saved = loadImagesFromLocalStorage();
    return INITIAL_ITEMS.map((item) => {
      const userSaved = saved[item.id];
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
    async function syncStorage() {
      try {
        const consolidated = await fetchAllImagesWithCloudSync();

        if (Object.keys(consolidated).length > 0) {
          setItems((prev) =>
            prev.map((item) => {
              const userImg = consolidated[item.id];
              if (userImg && typeof userImg === 'string' && userImg.trim() !== '') {
                return { ...item, image: userImg };
              }
              return item;
            })
          );
        }
      } catch (e) {
        console.error('Error during cloud/local image sync:', e);
      }
    }

    syncStorage();

    // Subscribe to real-time changes from Supabase
    const unsubscribe = subscribeToSupabaseImages((itemId, newUrl) => {
      if (itemId && newUrl) {
        setItems((prev) =>
          prev.map((it) => (it.id === itemId ? { ...it, image: newUrl } : it))
        );
        saveImageToIndexedDB(itemId, newUrl).catch(() => {});
      }
    });

    // Auto-sync periodically or when window comes into focus
    const interval = setInterval(syncStorage, 5000);
    window.addEventListener('focus', syncStorage);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(interval);
      window.removeEventListener('focus', syncStorage);
    };
  }, []);

  // Update image with permanent persistence across IndexedDB, localStorage, and Server API
  const handleUpdateItemImage = (itemId: string, newUrl: string) => {
    if (!newUrl || newUrl.trim() === '') return;

    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, image: newUrl } : item
      );

      // Build map of current equipment images
      const imageMap: Record<string, string> = {};
      updated.forEach((it) => {
        imageMap[it.id] = it.image;
      });

      // Save permanently to storage systems and server
      saveAllImagesPermanently(imageMap);

      return updated;
    });

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
