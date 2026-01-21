const isObject = (val: unknown): val is Record<any, any> => val !== null && typeof val === 'object'

// https://www.mattzeunert.com/2016/02/19/custom-chrome-devtools-object-formatters.html
export function initCustomFormatter(): void {
  const MobxStyle = { style: 'color: #dd5c15' }

  const __jf = (window as any).__jf

  const formatter = {
    header(obj: unknown) {
      if (!__jf) {
        return null
      }
      const { isObservable, toJS } = __jf()
      if (!isObservable || !toJS) {
        return null
      }

      if (!isObject(obj)) {
        return null
      }

      if (isObservable(obj)) {
        const data = toJS(obj)

        return [
          'div',
          {},
          ['span', MobxStyle, 'Mobx'],
          '<',
          // '电饭锅',
          formatValue(data),
          '>'
        ]
      }

      return null
    },
    hasBody: function (obj) {
      return false
    }
  }

  function formatValue(v: unknown) {
    return ['object', { object: v }]
  }

  if ((window as any).devtoolsFormatters) {
    ;(window as any).devtoolsFormatters.push(formatter)
  } else {
    ;(window as any).devtoolsFormatters = [formatter]
  }
}
