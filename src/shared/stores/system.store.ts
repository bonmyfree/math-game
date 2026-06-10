import { create } from 'zustand'

import { SystemLogData } from '@/features/system/services'

interface SystemState {
  systemEodLogs: SystemLogData[]
}

interface SystemAction {
  setEodLogs: (systemEodLogs: SystemLogData[]) => void
}
export const useSystemStore = create<SystemState & SystemAction>((set) => ({
  systemEodLogs: [],

  setEodLogs: (systemEodLogs: SystemLogData[]) => set({ systemEodLogs }),
}))
