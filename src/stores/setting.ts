import create from "zustand";
import { devtools, persist } from "zustand/middleware";

interface SettingStore {
  openKeys: string[];
  setOpenKeys: (openKeys: string[]) => void;
}

export const useSettingStore = create<SettingStore>()(
  devtools(
    persist((set) => ({
      openKeys: [],
      setOpenKeys: (openKeys: string[]) => set({ openKeys }),
    }))
  )
);
