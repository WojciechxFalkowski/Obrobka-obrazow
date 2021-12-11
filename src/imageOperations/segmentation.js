/**
 * Dokonaj segmentacji metodą wododziałową
 * @param {HTMLCanvasElement} sourceCanvas
 * @return {HTMLCanvasElement}
 */
export const watershed = (sourceCanvas) => {
  const resultCanvas = document.createElement('canvas');

  const gray = new window.cv.Mat();
  const opening = new window.cv.Mat();
  const sureBg = new window.cv.Mat();
  const sureFg = new window.cv.Mat();
  const distTrans = new window.cv.Mat();
  const dst = new window.cv.Mat();
  const markers = new window.cv.Mat();
  const unknown = new window.cv.Mat();
  const src = window.cv.imread(sourceCanvas);

  const kernel = window.cv.Mat.ones(3, 3, window.cv.CV_8U)

  // Konwersja na czarno-biały i progowanie obrazu
  window.cv.cvtColor(src, gray, window.cv.COLOR_BGR2GRAY);
  window.cv.threshold(gray, gray, 0, 255, window.cv.THRESH_BINARY_INV + window.cv.THRESH_OTSU)

  // Usunięcie szumów ("otwarcie" i "zamknięcie" / morfologia)
  window.cv.erode(gray, gray, kernel);
  window.cv.dilate(gray, opening, kernel);

  // Detekcja "pewnego na 100%" tła
  window.cv.dilate(opening, sureBg, kernel, new window.cv.Point(-1, -1), 3);

  // Transformanta odległościowa
  window.cv.distanceTransform(opening, distTrans, window.cv.DIST_L2, 5);
  window.cv.normalize(distTrans, distTrans, 1, 0, window.cv.NORM_INF);

  // Odnajdywanie "pewnego na 100%" pierwszego planu (obiektów)
  window.cv.threshold(distTrans, sureFg, 0.7 * 1, 255, window.cv.THRESH_BINARY);
  sureFg.convertTo(sureFg, window.cv.CV_8U, 1, 0);
  window.cv.subtract(sureBg, sureFg, unknown);

  // Wygeneruj markery połączonych elementów
  window.cv.connectedComponents(sureFg, markers);
  for (let i = 0; i < markers.rows; i++) {
    for (let j = 0; j < markers.cols; j++) {
      markers.intPtr(i, j)[0] = markers.ucharPtr(i, j)[0] + 1;
      if (unknown.ucharPtr(i, j)[0] == 255) {
        markers.intPtr(i, j)[0] = 0;
      }
    }
  }

  // Dokonaj podziału metodą wododziałową
  window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2RGB, 0);
  window.cv.watershed(dst, markers);

  // Narysuj granice elementów
  for (let i = 0; i < markers.rows; i++) {
    for (let j = 0; j < markers.cols; j++) {
      if (markers.intPtr(i, j)[0] == -1) {
        dst.ucharPtr(i, j)[0] = 255; // R
        dst.ucharPtr(i, j)[1] = 0; // G
        dst.ucharPtr(i, j)[2] = 0; // B
      }
    }
  }

  window.cv.imshow(resultCanvas, dst);

  src.delete();
  gray.delete();
  opening.delete();
  sureBg.delete();
  sureFg.delete();
  distTrans.delete();
  dst.delete();
  markers.delete();
  unknown.delete();

  return resultCanvas;
}

/**
 * Dokonaj segmentacji koloru na podstawie parametrów Hue i Saturation w modelu HSV
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {number} h
 * @param {number} s
 * @param {number} v
 * @param {number} maxh
 * @param {number} maxs
 * @param {number} maxv
 * @param {string} resultType
 * @return {HTMLCanvasElement}
 */
export const hsvSegmentation = (sourceCanvas, h, s, v, maxh, maxs, maxv, resultType) => {
  const resultCanvas = document.createElement('canvas');
  const src = window.cv.imread(sourceCanvas);

  const hsv = new window.cv.Mat();
  const dst = new window.cv.Mat();
  const mask = new window.cv.Mat();
  const contours = new window.cv.MatVector();
  const hierarchy = new window.cv.Mat();

  window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2RGB);
  window.cv.cvtColor(src, hsv, window.cv.COLOR_BGR2HSV);

  // Generacja maski binarnej zawierającej obraz po segmentacji wg zakresu low-high HSV
  const low = new window.cv.Mat(hsv.rows, hsv.cols, hsv.type(), [h, s, v, 20]);
  const high = new window.cv.Mat(hsv.rows, hsv.cols, hsv.type(), [maxh, maxs, maxv, 255]);
  window.cv.inRange(hsv, low, high, mask)
  // Wyszukanie konturów
  window.cv.findContours(mask, contours, hierarchy, window.cv.RETR_CCOMP, window.cv.CHAIN_APPROX_SIMPLE);

  if (resultType === 'contours') {
    const color = new window.cv.Scalar(255, 0, 0, 255);
    for (let i = 0; i < contours.size(); ++i) {
      window.cv.drawContours(dst, contours, i, color, 1, window.cv.LINE_8, hierarchy, 100);
    }
  } else {
    const colorOffset = 255 / (contours.size() + 1);
    dst.setTo(new window.cv.Scalar(0, 0, 0, 255));
    for (let i = 0; i < contours.size(); ++i) {
      const color = new window.cv.Scalar(255 - parseInt(colorOffset * i), 255 - parseInt(colorOffset * i), 255 - parseInt(colorOffset * i), 255);
      window.cv.drawContours(dst, contours, i, color, -1, window.cv.LINE_8, hierarchy, 100);
    }
  }

  window.cv.imshow(resultCanvas, dst);

  src.delete();
  dst.delete();
  hsv.delete();
  mask.delete();
  low.delete();
  high.delete();
  contours.delete();
  hierarchy.delete();

  return resultCanvas;
}

/**
 * Dokonaj segmentacji koloru na podstawie parametrów L, A i B w modelu LAB
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {number} l
 * @param {number} a
 * @param {number} b
 * @param {number} maxl
 * @param {number} maxa
 * @param {number} maxb
 * @param {string} resultType
 * @return {HTMLCanvasElement}
 */
export const labSegmentation = (sourceCanvas, l, a, b, maxl, maxa, maxb, resultType) => {
  const resultCanvas = document.createElement('canvas');
  const src = window.cv.imread(sourceCanvas);

  l = l * 255 / 100
  a = a + 128
  b = b + 128
  maxl = maxl * 255 / 100
  maxa = maxa + 128
  maxb = maxb + 128

  const lab = new window.cv.Mat();
  const dst = new window.cv.Mat();
  const mask = new window.cv.Mat();
  const contours = new window.cv.MatVector();
  const hierarchy = new window.cv.Mat();

  window.cv.cvtColor(src, dst, window.cv.COLOR_RGBA2RGB);
  window.cv.cvtColor(src, lab, window.cv.COLOR_BGR2Lab);

  // Generacja maski binarnej zawierającej obraz po segmentacji wg zakresu low-high lab
  const low = new window.cv.Mat(lab.rows, lab.cols, lab.type(), [l, a, b, 20]);
  const high = new window.cv.Mat(lab.rows, lab.cols, lab.type(), [maxl, maxa, maxb, 255]);
  window.cv.inRange(lab, low, high, mask)
  // Wyszukanie konturów
  window.cv.findContours(mask, contours, hierarchy, window.cv.RETR_CCOMP, window.cv.CHAIN_APPROX_SIMPLE);

  if (resultType === 'contours') {
    const color = new window.cv.Scalar(255, 0, 0, 255);
    for (let i = 0; i < contours.size(); ++i) {
      window.cv.drawContours(dst, contours, i, color, 1, window.cv.LINE_8, hierarchy, 100);
    }
  } else {
    const colorOffset = 255 / (contours.size() + 1);
    dst.setTo(new window.cv.Scalar(0, 0, 0, 255));
    for (let i = 0; i < contours.size(); ++i) {
      const color = new window.cv.Scalar(255 - parseInt(colorOffset * i), 255 - parseInt(colorOffset * i), 255 - parseInt(colorOffset * i), 255);
      window.cv.drawContours(dst, contours, i, color, -1, window.cv.LINE_8, hierarchy, 100);
    }
  }

  window.cv.imshow(resultCanvas, dst);

  src.delete();
  dst.delete();
  lab.delete();
  mask.delete();
  low.delete();
  high.delete();
  contours.delete();
  hierarchy.delete();

  return resultCanvas;
}
