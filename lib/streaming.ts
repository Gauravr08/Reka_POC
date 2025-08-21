export async function* readStream(reader: ReadableStreamDefaultReader<Uint8Array>) {
  const decoder = new TextDecoder();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (value) yield decoder.decode(value, { stream: true });
  }
}

export async function streamToText(res: Response, onChunk: (t: string) => void) {
  const reader = res.body?.getReader();
  if (!reader) return;
  for await (const chunk of readStream(reader)) {
    onChunk(chunk);
  }
}
