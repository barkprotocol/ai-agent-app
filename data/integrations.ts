export interface Integration {
  name: string
  icon: string
  description: string
  theme: {
    primary: `#${string}`
    secondary: `#${string}`
  }
}

export const INTEGRATIONS: readonly Integration[] = [
  {
    name: "Integration 1",
    icon: "icon1",
    description: "Description 1",
    theme: {
      primary: "#007bff",
      secondary: "#6c757d",
    },
  },
  {
    name: "Integration 2",
    icon: "icon2",
    description: "Description 2",
    theme: {
      primary: "#28a745",
      secondary: "#343a40",
    },
  },
] as const

