export const debugLog = {
  createDebugLogger: (namespace: string) => {
    return (...args: any[]) => {
      if (process.env.NODE_ENV !== "production") {
        console.log(`[${namespace}]`, ...args)
      }
    }
  },
}

