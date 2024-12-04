import { KeyboardEvent } from 'react'

export default function getHotkeyHandler(hotkeyMap: Map<string, Function>): (event: KeyboardEvent) => void {
  return (event: KeyboardEvent): void => {
    const callback = hotkeyMap.get(event.key)

    if (callback) {
      callback(event)
    }
  }
}
