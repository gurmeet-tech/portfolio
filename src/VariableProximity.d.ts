import type { CSSProperties, ReactNode, Ref } from 'react'

export interface VariableProximityProps {
  label: string
  fromFontVariationSettings: string
  toFontVariationSettings: string
  containerRef?: { current: HTMLElement | null } | null
  radius?: number
  falloff?: 'linear' | 'exponential' | 'gaussian'
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

declare const VariableProximity: (
  props: VariableProximityProps & { ref?: Ref<HTMLSpanElement> }
) => ReactNode

export default VariableProximity