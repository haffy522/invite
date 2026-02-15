const adjectives = [
  "luminous", "golden", "serene", "blessed", "radiant",
  "gentle", "graceful", "warm", "peaceful", "bright",
];

const nouns = [
  "moonlight", "lantern", "gathering", "evening", "starlight",
  "crescent", "dawn", "oasis", "garden", "haven",
];

export function generateSlug(): string {
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `${adj}-${noun}-${num}`;
}
