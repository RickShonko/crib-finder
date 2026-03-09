const MAX_WIDTH = 1200;
const MAX_HEIGHT = 1200;
const WEBP_QUALITY = 0.8;
const WATERMARK_TEXT = 'CampusRentals';

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function calculateDimensions(
  width: number,
  height: number
): { width: number; height: number } {
  if (width <= MAX_WIDTH && height <= MAX_HEIGHT) return { width, height };

  const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
  return {
    width: Math.round(width * ratio),
    height: Math.round(height * ratio),
  };
}

function addWatermark(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const fontSize = Math.max(14, Math.round(width * 0.03));
  ctx.save();
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.lineWidth = 1;
  ctx.textAlign = 'right';
  ctx.textBaseline = 'bottom';

  const padding = fontSize * 0.8;
  const x = width - padding;
  const y = height - padding;

  ctx.strokeText(WATERMARK_TEXT, x, y);
  ctx.fillText(WATERMARK_TEXT, x, y);
  ctx.restore();
}

function canvasToWebPBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Failed to create WebP blob'));
      },
      'image/webp',
      WEBP_QUALITY
    );
  });
}

/**
 * Optimizes an image file: resizes, compresses, converts to WebP, and adds watermark.
 * Returns a WebP Blob ready for upload.
 */
export async function optimizeImage(file: File): Promise<{ blob: Blob; fileName: string }> {
  const img = await loadImage(file);
  const { width, height } = calculateDimensions(img.naturalWidth, img.naturalHeight);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.drawImage(img, 0, 0, width, height);
  addWatermark(ctx, width, height);

  URL.revokeObjectURL(img.src);

  const blob = await canvasToWebPBlob(canvas);
  const baseName = file.name.replace(/\.[^.]+$/, '');
  const fileName = `${Date.now()}-${baseName}.webp`;

  return { blob, fileName };
}
