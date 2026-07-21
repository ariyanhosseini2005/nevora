export const colors = {
  coffeeDark: "#1B120D",
  deepEspresso: "#24150F",
  premiumGold: "#C8A45D",
  coffeeBrown: "#6F4025",
  cream: "#F6F1EA",
  softWhite: "#FCFAF7",
} as const;

export type ColorToken = keyof typeof colors;
