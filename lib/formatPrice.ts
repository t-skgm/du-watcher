export const parsePriceStr = (priceStr: string) => (priceStr ? Number(priceStr.replace(/[^0-9]/g, '')) : undefined)
