const BAR_COUNT = 24;
const MIN_BAR_HEIGHT = 3;

export function drawTelegramMicBars(
  canvas: HTMLCanvasElement,
  analyser: AnalyserNode,
  dataBuffer?: Uint8Array<ArrayBuffer>
): Uint8Array<ArrayBuffer> {
  const buffer =
    dataBuffer && dataBuffer.length === analyser.frequencyBinCount
      ? dataBuffer
      : new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(buffer);

  const context = canvas.getContext("2d");
  const rect = canvas.getBoundingClientRect();
  if (!context || rect.width === 0 || rect.height === 0) {
    return buffer;
  }

  const dpr = window.devicePixelRatio || 1;
  const width = Math.max(1, Math.floor(rect.width * dpr));
  const height = Math.max(1, Math.floor(rect.height * dpr));
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
  }

  context.clearRect(0, 0, width, height);

  const styles = getComputedStyle(canvas);
  const color = styles.color;
  const barGap = Math.max(1, width / 120);
  const barWidth = Math.max(2, width / BAR_COUNT - barGap);
  const centerY = height / 2;

  context.fillStyle = color;

  for (let index = 0; index < BAR_COUNT; index += 1) {
    const dataIndex = Math.floor((index / BAR_COUNT) * buffer.length);
    const normalized = buffer[dataIndex] / 255;
    const barHeight = Math.max(MIN_BAR_HEIGHT, normalized * height * 0.85);
    const x = index * (barWidth + barGap);
    context.fillRect(x, centerY - barHeight / 2, barWidth, barHeight);
  }

  return buffer;
}

export class MicVisualizerLoop {
  private frameId?: number;
  private dataBuffer?: Uint8Array<ArrayBuffer>;

  start(canvas: HTMLCanvasElement, getAnalyser: () => AnalyserNode | undefined) {
    this.stop();

    const draw = () => {
      const analyser = getAnalyser();
      if (analyser) {
        this.dataBuffer = drawTelegramMicBars(canvas, analyser, this.dataBuffer);
      }

      this.frameId = window.requestAnimationFrame(draw);
    };

    draw();
  }

  stop() {
    if (this.frameId === undefined) {
      return;
    }

    window.cancelAnimationFrame(this.frameId);
    this.frameId = undefined;
    this.dataBuffer = undefined;
  }
}
