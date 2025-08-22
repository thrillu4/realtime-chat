import { create } from 'zustand'
import type { IUseTheme } from '../types'

export const useThemeStore = create<IUseTheme>((set) => ({
	theme: localStorage.getItem('theme') || 'luxury',
	setTheme: (theme) => {
		localStorage.setItem('theme', theme)
		set({ theme })
	},
}))
