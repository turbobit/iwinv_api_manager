'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ResourceContextType {
  selectedZone: string | null;
  selectedFlavor: string | null;
  selectedImage: string | null;
  setSelectedZone: (zone: string | null) => void;
  setSelectedFlavor: (flavor: string | null) => void;
  setSelectedImage: (image: string | null) => void;
  clearSelections: () => void;
}

const ResourceContext = createContext<ResourceContextType>({
  selectedZone: null,
  selectedFlavor: null,
  selectedImage: null,
  setSelectedZone: () => {},
  setSelectedFlavor: () => {},
  setSelectedImage: () => {},
  clearSelections: () => {},
});

export function ResourceProvider({ children }: { children: ReactNode }) {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const clearSelections = () => {
    setSelectedZone(null);
    setSelectedFlavor(null);
    setSelectedImage(null);
  };

  return (
    <ResourceContext.Provider
      value={{
        selectedZone,
        selectedFlavor,
        selectedImage,
        setSelectedZone,
        setSelectedFlavor,
        setSelectedImage,
        clearSelections,
      }}
    >
      {children}
    </ResourceContext.Provider>
  );
}

export const useResource = () => useContext(ResourceContext); 