const windowPadding = 16
const offset = 8 // trigger 元素 与 popup 之间的距离

type Placement = 'top' | 'bottom'

export const getPlacement = (triggerElement: HTMLElement, popupElement: HTMLElement): Placement => {
  if (!triggerElement || !popupElement) {
    return 'bottom'
  }

  const triggerRect = triggerElement.getBoundingClientRect()
  const popupRect = popupElement.getBoundingClientRect()

  let plc: Placement = 'bottom'

  const top = triggerRect.bottom + offset
  if (top + popupRect.height > window.innerHeight - windowPadding) {
    plc = 'top'
  }

  return plc
}

export const getPopupPosition = (
  triggerElement: HTMLElement,
  popupElement: HTMLElement,
  placement: Placement,
  notOver: boolean
) => {
  if (!triggerElement || !popupElement) {
    return { top: 0, left: 0 }
  }

  const triggerRect = triggerElement.getBoundingClientRect()
  const popupRect = popupElement.getBoundingClientRect()

  let top = 0
  switch (placement) {
    case 'top': {
      top = notOver
        ? triggerRect.top - popupRect.height - offset
        : Math.max(triggerRect.top - popupRect.height - offset, windowPadding)
      break
    }
    case 'bottom': {
      const maxTop = window.innerHeight - popupRect.height - windowPadding
      top = notOver ? triggerRect.bottom + offset : Math.min(triggerRect.bottom + offset, maxTop)
      break
    }
  }

  const left = Math.min(triggerRect.left, window.innerHeight - popupRect.width - windowPadding)

  return { top, left }
}
