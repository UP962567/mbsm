import { create } from 'zustand';

interface useBookingCreateModal {
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
};

export const useBookingModal = create<useBookingCreateModal>((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));