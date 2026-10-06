export type Coords = { latitude: number; longitude: number }

// Asks the browser (or the app's web view) for the user's position. Resolves
// null when permission is denied, the device can't tell, or it takes too long.
export function getCurrentPosition(): Promise<Coords | null> {
  if (!navigator.geolocation) return Promise.resolve(null)
  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      () => resolve(null),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 10 * 60 * 1000 },
    )
  })
}
