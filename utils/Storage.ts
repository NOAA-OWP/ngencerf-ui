// utils/Storage.ts

export const getStorageKey = (storeId: string) => {
  // 1. Safety check for SSR (Server Side Rendering)
  // Pinia stores initialize on the server too, where 'window' does not exist.
  if (typeof window === 'undefined') {
    return storeId
  }

  // 2. Extract the segment. 
  // If URL is /sessions/ngen-pw-user/ngencerf_owp_ea
  // parts = ['', 'sessions', 'ngen-pw-user', 'ngencerf_owp_ea']
  // pathParts[3] is 'ngencerf_owp_ea'.
  // This is admittedly very Parallel Works hosting specific.
  const pathParts = window.location.pathname.split('/')
  
  // Fallback to 'global' if the path segment is missing to prevent "undefined-storeId"
  const prefix = pathParts[3] || 'global' 
  
  return `${prefix}-${storeId}`
}
