let _isClient = false
try {
  window
  _isClient = true
} catch (error) {}

export const isClient = _isClient

export const isSsr = !_isClient
