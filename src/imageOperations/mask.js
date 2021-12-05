/**
 * Zastosuj operację logiczną
 * @param {string} type
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {HTMLCanvasElement} maskCanvas
 * @return {HTMLCanvasElement}
 */
export const mask = (type, sourceCanvas, maskCanvas) => {
  const resultCanvas = document.createElement('canvas');

  const dst = new window.cv.Mat();
  const src = window.cv.imread(sourceCanvas);
  const mask = window.cv.imread(maskCanvas);
  window.cv.cvtColor(src, src, window.cv.COLOR_RGBA2GRAY, 0)
  window.cv.cvtColor(mask, mask, window.cv.COLOR_RGBA2GRAY, 0)

  if (type === 'xor') {
    window.cv.bitwise_xor(src, mask, dst)
  } else if (type === 'or') {
    window.cv.bitwise_or(src, mask, dst)
  } else {
    window.cv.bitwise_and(src, mask, dst)
  }

  window.cv.imshow(resultCanvas, dst);
  src.delete();
  dst.delete();
  mask.delete();

  return resultCanvas;
}
