/**
 * https://docs.w3cub.com/dom/imagedata/imagedata
 */
export const createCanvasImage = () => {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    const arr = new Uint8ClampedArray(40000);

// Iterate through every pixel
    for (let i = 0; i < arr.length; i += 4) {
        arr[i + 0] = 0;    // R value
        arr[i + 1] = 190;  // G value
        arr[i + 2] = 0;    // B value
        arr[i + 3] = 255;  // A value
    }

// Initialize a new ImageData object
    let imageData = new ImageData(arr, 200);

// Draw image data to the canvas
    ctx.putImageData(imageData, 20, 20);
}
// let imgData = new ImageData(uint, dst.cols);
// imgData.data = uint;
// console.log('imgData')
// console.log(imgData)
// ctx.beginPath();
// ctx.rect(20, 20, 150, 100);
// ctx.stroke();
// ctx.beginPath();
// ctx.rect(100, 100, 150, 100);
// ctx.stroke();
//
// ctx.putImageData(imgData, 0, 0)