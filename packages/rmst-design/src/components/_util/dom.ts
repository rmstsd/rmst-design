export function on<El extends Window | HTMLElement>(
  el: El,
  type: El extends Window ? keyof WindowEventMap : keyof HTMLElementEventMap,
  listener: EventListenerOrEventListenerObject,
  options?: AddEventListenerOptions
) {
  const ac = new AbortController()
  el.addEventListener(type, listener, { ...options, signal: ac.signal })

  return () => {
    ac.abort()
  }
}
