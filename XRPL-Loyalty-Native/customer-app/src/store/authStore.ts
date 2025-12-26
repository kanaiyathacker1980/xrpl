import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  walletAddress: string | null
  walletSeed: string | null
  login: (address: string, seed: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      walletAddress: null,
      walletSeed: null,
      login: (address, seed) => 
        set({ isAuthenticated: true, walletAddress: address, walletSeed: seed }),
      logout: () => 
        set({ isAuthenticated: false, walletAddress: null, walletSeed: null }),
    }),
    {
      name: 'xrpl-auth-storage',
    }
  )
)
