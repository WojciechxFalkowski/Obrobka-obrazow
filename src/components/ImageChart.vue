<template>
  <div class="">
    <!--    <canvas :id="getCanvasId"></canvas>-->
    <img v-if="imageData.length>0" :src="imageData" alt="chart">

    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio1" :value="BLACK_VALUE"
             v-model="selectedInputRatioValue">
      <label class="form-check-label" for="inlineRadio1">Black</label>
    </div>
    <div class="form-check form-check-inline">
      <input class="form-check-input" type="radio" name="inlineRadioOptions" id="inlineRadio2" :value="RGB_VALUE"
             v-model="selectedInputRatioValue">
      <label class="form-check-label" for="inlineRadio2">RGB</label>
    </div>
  </div>
</template>

<script>
import {convertToImage} from './../imageOperations/imageOperations'

export default {
  name: "ImageChart",
  props: ['imageId', 'activeImage', 'imageModelId'],
  data() {
    return {
      imageData: '',
      BLACK_VALUE: 'BLACK',
      RGB_VALUE: 'RGB',
      selectedInputRatioValue: 'BLACK',
    }
  },
  mounted() {
    console.log('created ImageChart')
    console.log('selectedInputRatioValue')
    console.log(this.selectedInputRatioValue)
    // console.log(this.getImage(this.imageId))
    // console.log(this.processImage(this.getImage(this.imageId)))
    // console.log(convertToImage(this.processImage(this.getImage(this.imageId))).src)
    this.imageData = convertToImage(this.processImage(this.getImage(this.imageId))).src
  },
  updated() {
    console.log('updated')
    // console.log(this.selectedInputRatioValue)

  },
  methods: {
    getImageData(imageElId) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const image = document.getElementById(imageElId);
      // console.log('getImageData')
      // console.log(image)
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.id = imageElId;
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    },
    processImage(inImg) {
      const src = new Uint32Array(inImg.data.buffer);
      const isValueHistogram = this.selectedInputRatioValue === this.BLACK_VALUE;

      let histBrightness = (new Array(256)).fill(0);
      let histR = (new Array(256)).fill(0);
      let histG = (new Array(256)).fill(0);
      let histB = (new Array(256)).fill(0);
      for (let i = 0; i < src.length; i++) {
        let r = src[i] & 0xFF;
        let g = (src[i] >> 8) & 0xFF;
        let b = (src[i] >> 16) & 0xFF;
        histBrightness[r]++;
        histBrightness[g]++;
        histBrightness[b]++;
        histR[r]++;
        histG[g]++;
        histB[b]++;
      }

      let maxBrightness = 0;
      for (let i = 1; i < 256; i++) {
        if (maxBrightness < histBrightness[i]) {
          maxBrightness = histBrightness[i]
        }
      }

      const canvas = document.createElement('canvas');
      // const canvas = document.getElementById(this.getCanvasId);
      const ctx = canvas.getContext('2d');
      let guideHeight = 8;
      let startY = (canvas.height - guideHeight);
      let dx = canvas.width / 256;
      let dy = startY / maxBrightness;
      ctx.lineWidth = dx;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 256; i++) {
        let x = i * dx;
        if (isValueHistogram) {
          // Value
          ctx.strokeStyle = "#000000";
          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, startY - histBrightness[i] * dy);
          ctx.closePath();
          ctx.stroke();
        } else {
          // Red
          ctx.strokeStyle = "rgba(220,0,0,0.5)";

          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, startY - histR[i] * dy);
          ctx.closePath();
          ctx.stroke();
          // Green
          ctx.strokeStyle = "rgba(0,210,0,0.5)";

          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, startY - histG[i] * dy);
          ctx.closePath();
          ctx.stroke();
          // Blue
          ctx.strokeStyle = "rgba(0,0,255,0.5)";

          ctx.beginPath();
          ctx.moveTo(x, startY);
          ctx.lineTo(x, startY - histB[i] * dy);
          ctx.closePath();
          ctx.stroke();
        }
        // Guide
        ctx.strokeStyle = 'rgb(' + i + ', ' + i + ', ' + i + ')';
        ctx.beginPath();
        ctx.moveTo(x, startY);
        ctx.lineTo(x, canvas.height);
        ctx.closePath();
        ctx.stroke();
      }
      return canvas.toDataURL()
    },
    getImage(imageId) {
      return this.getImageData(imageId)
    }
  },
  computed: {
    getCanvasId() {
      return `canvas_${this.imageModelId}_${this.activeImage.id}`
    }
  },
  watch: {
    selectedInputRatioValue: function () {
      console.log('selectedInputRatioValue changed');
      this.imageData = convertToImage(this.processImage(this.getImage(this.imageId))).src
    }
  }
}
</script>

<style>

</style>