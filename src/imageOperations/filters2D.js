export const AVERAGE = "average";
export const K_AVERAGE = "k-average";
export const MEDIAN = "median";
export const GAUSSIAN = "gaussian";

export const BORDER_COPY = 255;

/**
 * Skopiuj obramowanie między dwoma obrazami, aby zasymulować BORDER_CONSTANT przy podanym
 * rozmiarze tablicy "kernela"
 * @param {cv.Mat} src
 * @param {cv.Mat} dst
 * @param {number} kernelSize
 * @param {number} imgWidth
 * @param {number} imgHeight
 */
export const copyBorderByKernel = (
  src,
  dst,
  kernelSize,
  imgWidth,
  imgHeight
) => {
  // Kopiowanie pikseli z obramowania
  const width = Math.floor(0.5 * kernelSize);

  // Górna granica
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < imgWidth; x++) {
      const srcPixel = src.ucharPtr(y, x);
      const dstPixel = dst.ucharPtr(y, x);

      dstPixel[0] = srcPixel[0];
      dstPixel[1] = srcPixel[1];
      dstPixel[2] = srcPixel[2];
      dstPixel[3] = srcPixel[3];
    }
  }
  // Dolna granica
  for (let y = 0; y < width; y++) {
    for (let x = 0; x < imgWidth; x++) {
      const srcPixel = src.ucharPtr(imgHeight - y - 1, x);
      const dstPixel = dst.ucharPtr(imgHeight - y - 1, x);

      dstPixel[0] = srcPixel[0];
      dstPixel[1] = srcPixel[1];
      dstPixel[2] = srcPixel[2];
      dstPixel[3] = srcPixel[3];
    }
  }
  // Lewa granica
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < imgHeight; y++) {
      const srcPixel = src.ucharPtr(y, x);
      const dstPixel = dst.ucharPtr(y, x);

      dstPixel[0] = srcPixel[0];
      dstPixel[1] = srcPixel[1];
      dstPixel[2] = srcPixel[2];
      dstPixel[3] = srcPixel[3];
    }
  }
  // Prawa granica
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < imgHeight; y++) {
      const srcPixel = src.ucharPtr(y, imgWidth - x - 1);
      const dstPixel = dst.ucharPtr(y, imgWidth - x - 1);

      dstPixel[0] = srcPixel[0];
      dstPixel[1] = srcPixel[1];
      dstPixel[2] = srcPixel[2];
      dstPixel[3] = srcPixel[3];
    }
  }
};

/**
 * Wykonaj filtację k-uśredniającą
 * (macierz z samymi jedynkami poza środkiem, gdzie jest kValue)
 *
 * @param {cv.Mat} src Obraz źródłowy
 * @param {cv.Mat} dst Obraz wynikowy (może być jednocześnie obrazem źródłowym)
 * @param {number} kernelSize
 * @param {number} kValue
 */
const kAverage = (src, dst, kernelSize, kValue) => {
  // Budowa macierzy filtrującej
  const kernelElementsCount = kernelSize * kernelSize;
  const midKernelElementIndex = Math.floor(kernelElementsCount * 0.5);
  const kernelDivider = kernelElementsCount + kValue - 1;
  let kernelArr = new Float32Array(kernelSize * kernelSize);
  kernelArr = kernelArr.map((_val, index) => {
    if (index === midKernelElementIndex) {
      return kValue / kernelDivider;
    } else {
      return 1 / kernelDivider;
    }
  });
  const kernel = window.cv.matFromArray(kernelSize, kernelSize, window.cv.CV_32F, kernelArr);
  // Wykonanie filtrowania
  window.cv.filter2D(
    src,
    dst,
    window.cv.CV_8U,
    kernel,
    new window.cv.Point(-1, -1),
    0,
    window.cv.BORDER_DEFAULT
  );
};

/**
 * Przygotuj obramowanie do dalszej obróbki filtrami 2D
 *
 * @param {cv.Mat} src
 * @param {number} kernelSize
 * @param {number} borderType
 * @param {number|object} borderColor
 * @return {cv.Mat}
 */
const prepareBorder = (src, kernelSize, borderType, borderColor) => {
  const dst = new window.cv.Mat();

  // Powiększenie obrazu o obramowanie
  const borderWidth = Math.floor(0.5 * kernelSize);
  if (borderType !== BORDER_COPY) {
    // Obramowanie wg rodzaju wspieranego przez OpenCV
    let borderColorScalar;
    if (typeof borderColor === "number") {
      borderColorScalar = new window.cv.Scalar(
        borderColor,
        borderColor,
        borderColor,
        255
      );
    } else {
      borderColorScalar = new window.cv.Scalar(
        borderColor.red,
        borderColor.green,
        borderColor.blue,
        255
      );
    }
    window.cv.copyMakeBorder(
      src,
      dst,
      borderWidth,
      borderWidth,
      borderWidth,
      borderWidth,
      borderType,
      borderColorScalar
    );
  } else {
    // Obramowanie skopiowane z obrazu oryginalnego
    src.copyTo(dst);
  }

  return dst;
};

/**
 * Zakończ obsługę dodatkowego obramowania dla filtrów 2D (usuń dodatkowe piksele)
 *
 * @param {cv.Mat} src
 * @param {cv.Mat} dst
 * @param {number} kernelSize
 * @param {number} borderType
 * @return {cv.Mat}
 */
const finalizeBorder = (src, dst, kernelSize, borderType) => {
  let final;
  const borderWidth = Math.floor(0.5 * kernelSize);
  let { width, height } = src.size();
  if (borderType !== BORDER_COPY) {
    // Pomniejsz obrazek o dodane obramowanie
    const copyRect = new window.cv.Rect(borderWidth, borderWidth, width, height);
    final = dst.roi(copyRect);
  } else {
    // Skopiuj piksele obramowania z obrazu źródłowego
    copyBorderByKernel(src, dst, kernelSize, width, height);
    final = dst;
  }
  return final;
};

/**
 * Rozmyj obrazek poprzez uśrednienie K-pudełkowe
 * @param {string} type average/median/gaussian
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {number} kernelSize
 * @param {number|undefined} borderType
 * @param {object|undefined} borderColor
 * @param {number|undefined} kValue
 * @return {HTMLCanvasElement}
 */
export const blur = (
  type,
  sourceCanvas,
  kernelSize,
  borderType,
  borderColor,
  kValue
) => {
  const resultCanvas = document.createElement("canvas");

  if (typeof borderType === "undefined") {
    borderType = window.cv.BORDER_DEFAULT;
  }
  if (typeof borderColor === "undefined") {
    borderColor = {
      red: 0,
      green: 0,
      blue: 0,
    };
  }
  if (typeof kValue === "undefined" || isNaN(kValue)) {
    kValue = 1;
  }

  const src = window.cv.imread(sourceCanvas);

  // Powiększenie obrazu o obramowanie
  const dst = prepareBorder(src, kernelSize, borderType, borderColor);

  if (type === MEDIAN) {
    // Rozmycie medianowe
    window.cv.medianBlur(dst, dst, kernelSize);
  } else if (type === GAUSSIAN) {
    // Rozmycia Gaussa
    window.cv.GaussianBlur(
      dst,
      dst,
      new window.cv.Size(kernelSize, kernelSize),
      -1,
      -1,
      window.cv.BORDER_DEFAULT
    );
  } else if (type === K_AVERAGE) {
    // Filtracja k-liniowa (macierz z samymi jedynkami poza wartością środkową równą "kValue")
    kAverage(dst, dst, kernelSize, kValue);
  } else {
    // Rozmycie uśredniające
    window.cv.blur(
      dst,
      dst,
      new window.cv.Size(kernelSize, kernelSize),
      new window.cv.Point(-1, -1),
      window.cv.BORDER_DEFAULT
    );
  }

  // Usunięcie dodatkowego obramowania
  const final = finalizeBorder(src, dst, kernelSize, borderType);

  window.cv.imshow(resultCanvas, final);

  src.delete();
  dst.delete();
  if (dst !== final) {
    final.delete();
  }

  return resultCanvas;
};

/**
 * Wykonaj filtracje 2D obrazu
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {number[]} filterArr
 * @param {number|undefined} borderColor
 * @return {HTMLCanvasElement}
 */
export const filter2D = (sourceCanvas, filterArr, borderType, borderColor) => {
  const resultCanvas = document.createElement("canvas");

  const kernelSize = Math.sqrt(filterArr.length);
  const src = window.cv.imread(sourceCanvas);

  // Zmiana na obraz czarnobiały (wymagana do działania filtracji 2D)
  window.cv.cvtColor(src, src, window.cv.COLOR_BGR2GRAY);

  // Powiększenie obrazu o obramowanie
  const dst = prepareBorder(src, kernelSize, borderType, borderColor);

  // Przygotowanie macierzy transformacji
  const kernel = window.cv.matFromArray(kernelSize, kernelSize, window.cv.CV_32F, filterArr);

  // Wykonanie filtrowania
  window.cv.filter2D(
    dst,
    dst,
    window.cv.CV_32F,
    kernel,
    new window.cv.Point(-1, -1),
    0,
    window.cv.BORDER_DEFAULT
  );

  // Usunięcie dodatkowego obramowania
  const final = finalizeBorder(src, dst, kernelSize, borderType);

  window.cv.imshow(resultCanvas, final);

  src.delete();
  dst.delete();
  if (dst !== final) {
    final.delete();
  }

  return resultCanvas;
};

/**
 * Wykonaj filtrację Sobel
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {object|undefined} borderColor
 * @return {HTMLCanvasElement}
 */
export const sobel = (sourceCanvas, borderType, borderColor) => {
  const resultCanvas = document.createElement("canvas");
  const kernelSize = 3;

  const sobelX = new window.cv.Mat();
  const sobelY = new window.cv.Mat();
  const absSobelX = new window.cv.Mat();
  const absSobelY = new window.cv.Mat();
  const src = window.cv.imread(sourceCanvas);

  // Konwersja na obraz czarnobiały - bez tego Sobel nie zadziała
  window.cv.cvtColor(src, src, window.cv.COLOR_BGR2GRAY);

  // Powiększenie obrazu o obramowanie
  const dst = prepareBorder(src, kernelSize, borderType, borderColor);

  // Rozmycia Gaussa
  window.cv.GaussianBlur(
    dst,
    dst,
    new window.cv.Size(kernelSize, kernelSize),
    0,
    0,
    window.cv.BORDER_DEFAULT
  );

  // Wykonanie filtrowania - osobno X i Y
  window.cv.Sobel(dst, sobelX, window.cv.CV_16S, 1, 0, kernelSize, 1, 0, window.cv.BORDER_DEFAULT);
  window.cv.Sobel(dst, sobelY, window.cv.CV_16S, 0, 1, kernelSize, 1, 0, window.cv.BORDER_DEFAULT);

  // Złączenie obrazów X i Y w jeden
  window.cv.convertScaleAbs(sobelX, absSobelX);
  window.cv.convertScaleAbs(sobelY, absSobelY);
  window.cv.addWeighted(absSobelX, 0.5, absSobelY, 0.5, 0, dst);

  // Usunięcie dodatkowego obramowania
  const final = finalizeBorder(src, dst, kernelSize, borderType);

  window.cv.imshow(resultCanvas, final);

  src.delete();
  dst.delete();
  sobelX.delete();
  sobelY.delete();
  absSobelX.delete();
  absSobelY.delete();
  if (dst !== final) {
    final.delete();
  }

  return resultCanvas;
};

/**
 * Wykonaj filtrację Canny
 * @param {HTMLCanvasElement} sourceCanvas
 * @param {number} threshold
 * @param {object|undefined} borderColor
 * @return {HTMLCanvasElement}
 */
export const canny = (sourceCanvas, threshold, borderType, borderColor) => {
  const resultCanvas = document.createElement("canvas");

  if (isNaN(threshold)) {
    threshold = 0;
  }

  const kernelSize = 3;

  const sobelX = new window.cv.Mat();
  const sobelY = new window.cv.Mat();
  const absSobelX = new window.cv.Mat();
  const absSobelY = new window.cv.Mat();
  const src = window.cv.imread(sourceCanvas);

  // Konwersja na obraz czarnobiały - bez tego Canny nie zadziała
  window.cv.cvtColor(src, src, window.cv.COLOR_BGR2GRAY);

  // Powiększenie obrazu o obramowanie
  const dst = prepareBorder(src, kernelSize, borderType, borderColor);

  // Rozmycia Gaussa
  window.cv.blur(
    dst,
    dst,
    new window.cv.Size(kernelSize, kernelSize),
    new window.cv.Point(-1, -1),
    window.cv.BORDER_DEFAULT
  );

  // Wykonanie filtrowania
  window.cv.Canny(dst, dst, threshold, threshold * 3, kernelSize);

  // Usunięcie dodatkowego obramowania
  const final = finalizeBorder(src, dst, kernelSize, borderType);

  window.cv.imshow(resultCanvas, final);

  src.delete();
  dst.delete();
  sobelX.delete();
  sobelY.delete();
  absSobelX.delete();
  absSobelY.delete();
  if (dst !== final) {
    final.delete();
  }

  return resultCanvas;
};

// TODO: Wyrównanie histogramu (na Teams był podany kod przykładowy)
// TODO: Projekt
// - czcionka o stałej szerokości (monospace)
// - dopasowanie wg wzroca do wpisanego tekstu w pole, np "d", "do", "test"
// - nie interesuje nas tekst obrócony, przekreślony, wyboldowany etc
