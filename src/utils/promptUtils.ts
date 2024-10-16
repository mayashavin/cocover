function pickRandom<T>(list: T[]): T {
  return list[Math.floor(Math.random() * list.length)];
}

const progressMessages = [
  "Drawing",
  "Generating image",
  "Creating art",
  "Painting",
  "Sketching",
  "Rendering",
  "Designing",
  "Illustrating",
  "Creating masterpiece",
  "Dreaming",
  "Imagining",
  "Thinking",
];

export function getProgressMessage(): string {
  return `${pickRandom(progressMessages)}\u2026`;
}
