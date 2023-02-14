export async function Wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function DateToMs(date: Date) {
  return new Date(date).getTime();
}
