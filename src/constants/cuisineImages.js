export const cuisineImageMap = {
  turkish: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=200&fit=crop',
  arab: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=200&fit=crop',
  arabic: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=200&fit=crop',
  pakistani: 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=200&fit=crop',
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=200&fit=crop',
  syrian: 'https://images.unsplash.com/photo-1561626423-a51b45aef0a1?w=400&h=200&fit=crop',
  bangladeshi: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&h=200&fit=crop',
  lebanese: 'https://images.unsplash.com/photo-1542778361-2d6a2c2e39a7?w=400&h=200&fit=crop',
  persian: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=200&fit=crop',
  iranian: 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=400&h=200&fit=crop',
  jordanian: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=400&h=200&fit=crop',
  somali: 'https://images.unsplash.com/photo-1567364816519-cbc9c4ffffd6?w=400&h=200&fit=crop',
  mediterranean: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=200&fit=crop',
  default: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=200&fit=crop',
}

export function getCuisineImage(cuisine) {
  if (!cuisine) {
    return cuisineImageMap.default
  }

  const key = cuisine.toLowerCase().trim()
  return cuisineImageMap[key] || cuisineImageMap.default
}

export default getCuisineImage