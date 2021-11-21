<template>
  <div class="px-2 w-100 d-flex flex-column justify-content-between">
    <!--    <canvas :id="getCanvasId"></canvas>-->
    <div>
      <img v-if="imageData.length>0" :src="imageData" alt="chart">

      <div class="m-auto">
        <div class="form-check form-check-inline ps-8">
          <input class="form-check-input" type="radio" :name="`radio_options_${imageModelId}_${imageId}`"
                 :id="`radio_option_${imageModelId}_${imageId}_1`" :value="GRAY_VALUE"
                 v-model="selectedInputRatioValue">
          <label class="form-check-label" :for="`radio_option_${imageModelId}_${imageId}_1`">{{ GRAY_VALUE }}</label>
        </div>
        <div v-if="!activeImage.isGrayScale" class="form-check form-check-inline">
          <input class="form-check-input" type="radio" :name="`radio_options_${imageModelId}_${imageId}`"
                 :id="`radio_option_${imageModelId}_${imageId}_2`" value="RGB"
                 v-model="selectedInputRatioValue">
          <label class="form-check-label" :for="`radio_option_${imageModelId}_${imageId}_2`">{{ RGB_VALUE }}</label>
        </div>

        <div v-if="!activeImage.isGrayScale" class="form-check form-check-inline">
          <input class="form-check-input" type="radio" :name="`radio_options_${imageModelId}_${imageId}`"
                 :id="`radio_option_${imageModelId}_${imageId}_3`" :value="R_VALUE"
                 v-model="selectedInputRatioValue">
          <label class="form-check-label" :for="`radio_option_${imageModelId}_${imageId}_3`">{{ R_VALUE }}</label>
        </div>

        <div v-if="!activeImage.isGrayScale" class="form-check form-check-inline">
          <input class="form-check-input" type="radio" :name="`radio_options_${imageModelId}_${imageId}`"
                 :id="`radio_option_${imageModelId}_${imageId}_4`" :value="G_VALUE"
                 v-model="selectedInputRatioValue">
          <label class="form-check-label" :for="`radio_option_${imageModelId}_${imageId}_4`">{{ G_VALUE }}</label>
        </div>

        <div v-if="!activeImage.isGrayScale" class="form-check form-check-inline">
          <input class="form-check-input" type="radio" :name="`radio_options_${imageModelId}_${imageId}`"
                 :id="`radio_option_${imageModelId}_${imageId}_5`" :value="B_VALUE"
                 v-model="selectedInputRatioValue">
          <label class="form-check-label" :for="`radio_option_${imageModelId}_${imageId}_5`">{{ B_VALUE }}</label>
        </div>
      </div>
    </div>

    <div class="image-chart__table">
      <h2 class="">LUT</h2>
      <table>
        <tr>
          <th>Index</th>
          <td v-for="(_,index) of activeImage.pixelAmounts.red" :key="index">{{ index }}</td>
        </tr>
        <tr :style="'color:red'">
          <th>Red</th>
          <td v-for="(red,index) of activeImage.pixelAmounts.red" :key="index">{{ red }}</td>
        </tr>
        <tr :style="'color:green'">
          <th>Green</th>
          <td v-for="(green,index) of activeImage.pixelAmounts.green" :key="index">{{ green }}</td>
        </tr>
        <tr :style="'color:blue'">
          <th>Blue</th>
          <td v-for="(blue,index) of activeImage.pixelAmounts.blue" :key="index">{{ blue }}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {convertToImage} from '@/imageOperations/imageOperations'

export default {
  name: "ImageStatistics",
  props: ['imageId', 'activeImage', 'imageModelId'],
  data() {
    return {
      imageData: '',
      GRAY_VALUE: 'GRAY',
      RGB_VALUE: 'RGB',
      R_VALUE: 'R',
      G_VALUE: 'G',
      B_VALUE: 'B',
      selectedInputRatioValue: 'GRAY',
      CANVAS_MARGIN_TOP: 10,
      CANVAS_MARGIN_LEFT: 60,
      CANVAS_WIDTH: 350,
    }
  },
  mounted() {
    this.imageData = convertToImage(this.processImage()).src
  },
  methods: {
    processImage() {
      const isValueHistogram = this.selectedInputRatioValue === this.GRAY_VALUE;
      let maxChartBarValue = 0;
      const pixelArrayR = this.activeImage.pixelAmounts.red
      const pixelArrayG = this.activeImage.pixelAmounts.green
      const pixelArrayB = this.activeImage.pixelAmounts.blue
      // const pixelArrayRGB = this.activeImage.pixelAmounts.rgb
      const pixelArrayGrayScale = this.activeImage.pixelAmounts.gray
      if (isValueHistogram) {
        maxChartBarValue = this.activeImage.pixelAmounts.maxGrayScaleValue;
        // console.log('RGB')
        // console.log(Math.max(this.activeImage.pixelAmounts.maxRValue * 0.299, this.activeImage.pixelAmounts.maxGValue * 0.587, this.activeImage.pixelAmounts.maxBValue * 0.114))
        // maxChartBarValue = Math.max(this.activeImage.pixelAmounts.maxRValue * 0.299, this.activeImage.pixelAmounts.maxGValue * 0.587, this.activeImage.pixelAmounts.maxBValue * 0.114)

      } else {
        switch (this.selectedInputRatioValue) {
          case 'R': {
            maxChartBarValue = this.activeImage.pixelAmounts.maxRValue
            break;
          }
          case 'G': {
            maxChartBarValue = this.activeImage.pixelAmounts.maxGValue
            break;
          }
          case 'B': {
            maxChartBarValue = this.activeImage.pixelAmounts.maxBValue
            break;
          }
          case 'RGB': {
            maxChartBarValue = this.activeImage.pixelAmounts.maxRGBValue
            break;
          }
        }
      }


      const canvas = document.createElement('canvas');
      // const canvas = document.getElementById(this.getCanvasId);
      const ctx = canvas.getContext('2d');
      canvas.width = this.CANVAS_WIDTH;
      let guideHeight = 8;
      const startY = (canvas.height - guideHeight);
      const chartWidth = (canvas.width - this.CANVAS_MARGIN_LEFT)
      const blockWidth = chartWidth / 256;
      const blockHeight = (startY - this.CANVAS_MARGIN_TOP) / maxChartBarValue;
      ctx.lineWidth = blockWidth;
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw OY line
      ctx.beginPath();
      ctx.moveTo(this.CANVAS_MARGIN_LEFT - 2, canvas.height);
      ctx.lineTo(this.CANVAS_MARGIN_LEFT - 2, startY - maxChartBarValue * blockHeight);
      ctx.closePath();
      ctx.stroke();

      //Draw maxChartBar value
      ctx.fillStyle = "#000";
      const fontSize = maxChartBarValue > 100000 ? 14 : 16;
      ctx.font = `${fontSize}px serif`;
      const maxChartBarYPosition = this.CANVAS_MARGIN_TOP
      ctx.fillText(`${maxChartBarValue}`, 0, maxChartBarYPosition + fontSize / 4);
      //Draw maxChartBar line
      ctx.beginPath();
      ctx.moveTo(this.CANVAS_MARGIN_LEFT - this.CANVAS_MARGIN_LEFT / 8 - 2, maxChartBarYPosition);
      ctx.lineTo(this.CANVAS_MARGIN_LEFT + this.CANVAS_MARGIN_LEFT / 8 - 2, maxChartBarYPosition);
      ctx.closePath();
      ctx.stroke();

      //Draw maxChartBar half value
      const halfMaxChartBarValue = Math.floor(maxChartBarValue / 2)
      const halfMaxChartBarYPosition = this.CANVAS_MARGIN_TOP + fontSize / 2 + halfMaxChartBarValue * blockHeight;
      ctx.fillText(`${halfMaxChartBarValue}`, 0, halfMaxChartBarYPosition + fontSize / 4);
      //Draw maxChartBar half line
      ctx.beginPath();
      ctx.moveTo(this.CANVAS_MARGIN_LEFT - this.CANVAS_MARGIN_LEFT / 8 - 2, halfMaxChartBarYPosition);
      ctx.lineTo(this.CANVAS_MARGIN_LEFT + this.CANVAS_MARGIN_LEFT / 8 - 2, halfMaxChartBarYPosition);
      ctx.closePath();
      ctx.stroke();

      //Draw 256 red,green,blue bars.
      for (let i = 0; i < 256; i++) {
        let x = this.CANVAS_MARGIN_LEFT + i * blockWidth;
        if (isValueHistogram) {
          // Value
          ctx.strokeStyle = "#000000";
          ctx.beginPath();
          ctx.moveTo(x, startY);
          // ctx.lineTo(x, startY - pixelArrayRGB[i] * blockHeight);
          ctx.lineTo(x, startY - pixelArrayGrayScale[i] * blockHeight);
          // ctx.lineTo(x, startY - (pixelArrayR[i] * 0.299 + pixelArrayG[i] * 0.587 + pixelArrayB[i] * 0.114) * blockHeight);
          ctx.closePath();
          ctx.stroke();
        } else {
          // Red
          if (this.selectedInputRatioValue === 'RGB' || this.selectedInputRatioValue === 'R') {
            ctx.strokeStyle = "#ff0000";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - pixelArrayR[i] * blockHeight);
            ctx.closePath();
            ctx.stroke();
          }

          if (this.selectedInputRatioValue === 'RGB' || this.selectedInputRatioValue === 'G') {
            // Green
            ctx.strokeStyle = "#00ff00";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - pixelArrayG[i] * blockHeight);
            ctx.closePath();
            ctx.stroke();
          }
          if (this.selectedInputRatioValue === 'RGB' || this.selectedInputRatioValue === 'B') {
            // Blue
            ctx.strokeStyle = "#0000ff";
            ctx.beginPath();
            ctx.moveTo(x, startY);
            ctx.lineTo(x, startY - pixelArrayB[i] * blockHeight);
            ctx.closePath();
            ctx.stroke();
          }
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
      // console.log('selectedInputRatioValue changed');
      this.imageData = convertToImage(this.processImage()).src
    }
  }
}
</script>

<style lang="scss">
.image-chart {
  &__table {
    overflow-x: scroll;

    & th, & td {
      border: 1px solid gray;
      min-width: 21px;
    }
  }
}
</style>