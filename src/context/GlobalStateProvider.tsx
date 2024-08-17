import { createContext, useContext, useState, ReactNode } from 'react';

// กำหนดประเภทของค่าที่จะถูกเก็บใน Context
type GlobalStateContextType = {
    viewMode: 'grid' | 'list';
    toggleViewMode: () => void;
};

// สร้าง Context โดยให้ค่าเริ่มต้นเป็น undefined และให้ TypeScript รู้จักประเภท
const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

// สร้าง Provider
export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid'); // สถานะเพื่อจัดการโหมดการแสดงผล

    const toggleViewMode = () => {
        setViewMode(viewMode === 'grid' ? 'list' : 'grid');
    };

    return (
        <GlobalStateContext.Provider value={{ viewMode, toggleViewMode }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

// สร้าง custom hook สำหรับใช้ state ใน component อื่นๆ
export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (!context) {
        throw new Error('useGlobalState must be used within a GlobalStateProvider');
    }
    return context;
};
