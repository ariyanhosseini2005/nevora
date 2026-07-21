function unsplash(id: string, params = "auto=format&fit=crop&w=1600&q=80") {
  return `https://images.unsplash.com/${id}?${params}`;
}

export const homepageImages = {
  hero: unsplash("photo-1497935586351-b67a49e012bf"),
  coffeeExperience: [
    unsplash("photo-1447933601403-0c6688de566e"),
    unsplash("photo-1442512595331-e89e73853f31"),
    unsplash("photo-1509042239860-f550ce710b93"),
    unsplash("photo-1497935586351-b67a49e012bf"),
  ],
  story: unsplash("photo-1497935586351-b67a49e012bf"),
  products: [
    unsplash("photo-1559056199-641a0ac8b55e", "auto=format&fit=crop&w=800&q=80"),
    unsplash("photo-1442512595331-e89e73853f31", "auto=format&fit=crop&w=800&q=80"),
    unsplash("photo-1509042239860-f550ce710b93", "auto=format&fit=crop&w=800&q=80"),
  ],
} as const;
