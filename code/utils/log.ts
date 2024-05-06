export const log = console.log

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logMore = (...args: any[]) => console.dir(...args, { depth: 10 })
