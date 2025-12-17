import { createContext, useContext, type ReactNode } from 'react';
import type { ProductsApiResponse } from '../types/types';

interface InitialData {
  products?: ProductsApiResponse;
}

const DataContext = createContext<InitialData>({});

export function DataProvider({ 
  children, 
  initialData 
}: { 
  children: ReactNode; 
  initialData: InitialData;
}) {
  return (
    <DataContext.Provider value={initialData}>
      {children}
    </DataContext.Provider>
  );
}

export function useInitialData() {
  return useContext(DataContext);
}
