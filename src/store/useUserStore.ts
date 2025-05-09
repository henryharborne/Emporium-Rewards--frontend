import { create } from 'zustand';

type AdminInfo = {
  name: string;
  email: string;
  token: string;
};

type UserState = {
  admin: AdminInfo | null;
  setAdmin: (info: AdminInfo) => void;
  logoutAdmin: () => void;
};

export const useUserStore = create<UserState>((set) => ({
  admin: null,

  setAdmin: (info) => {
    localStorage.setItem('adminToken', info.token);
    set({ admin: info });
  },

  logoutAdmin: () => {
    localStorage.removeItem('adminToken');
    set({ admin: null });
  },
}));
