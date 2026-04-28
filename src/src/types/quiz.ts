export interface QuizOption {
  id: string
  label: string
  vibes: string[]
  purposes: string[]
}

export interface QuizQuestion {
  id: string
  text: string
  options: QuizOption[]
}

export interface QuizResult {
  vibes: string[]
  purposes: string[]
  label: string
  description: string
}
