export const isUndefined = (value: any): value is undefined => value === undefined

export const isFunction = (value: any): value is Function => typeof value === 'function'

export const isBrowser = typeof window === 'object'
export const isServer = typeof window === 'undefined'
