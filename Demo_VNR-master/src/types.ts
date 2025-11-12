export type ResourceType = 'quote' | 'video' | 'image' | 'pdf' | 'audio'
export type Domain = 'chinh_tri' | 'quan_su' | 'ngoai_giao' | 'tu_tuong' | 'kinh_te'

export interface PersonalInfo {
  birth: string
  death: string
  hometown: string
  active_period: string
  party_membership: string
}

export interface TimelineEntry {
  year: string
  event: string
  image?: string
}

export interface ResourceItem {
  type: ResourceType
  content?: string
  url?: string
  source?: string
}

export interface Character {
  id: number
  name: string
  image: string
  title: string
  personal_info: PersonalInfo
  description: string
  timeline: TimelineEntry[]
  contributions: string[]
  thoughts: string[]
  resources: ResourceItem[]
  related: number[]
  signature?: string
  domains?: Domain[]
}
