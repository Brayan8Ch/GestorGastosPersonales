import {
  Briefcase, Laptop, TrendingUp, Home, Gift, RotateCcw, ShoppingBag, PiggyBank,
  ShoppingCart, Car, Heart, BookOpen, Gamepad2, Shirt, Zap, Smartphone,
  Utensils, Plane, Dumbbell, RefreshCw, CircleDot,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { TransactionType } from '@/types'

export const CATEGORIES: Record<TransactionType, string[]> = {
  income: ['Salario', 'Freelance', 'Inversiones', 'Alquiler', 'Bono', 'Reembolso', 'Venta', 'Dividendos', 'Otro'],
  expense: ['Vivienda', 'Alimentación', 'Transporte', 'Salud', 'Educación', 'Entretenimiento', 'Ropa', 'Servicios', 'Tecnología', 'Restaurantes', 'Viajes', 'Deporte', 'Suscripciones', 'Otro'],
}

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Salario: Briefcase,
  Freelance: Laptop,
  Inversiones: TrendingUp,
  Alquiler: Home,
  Bono: Gift,
  Reembolso: RotateCcw,
  Venta: ShoppingBag,
  Dividendos: PiggyBank,
  Vivienda: Home,
  Alimentación: ShoppingCart,
  Transporte: Car,
  Salud: Heart,
  Educación: BookOpen,
  Entretenimiento: Gamepad2,
  Ropa: Shirt,
  Servicios: Zap,
  Tecnología: Smartphone,
  Restaurantes: Utensils,
  Viajes: Plane,
  Deporte: Dumbbell,
  Suscripciones: RefreshCw,
  Otro: CircleDot,
}

export function getCategoryIcon(category: string): LucideIcon {
  return CATEGORY_ICONS[category] ?? CircleDot
}
