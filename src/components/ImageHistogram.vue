<template>
  <div>
    <div>
      <ImageChart v-for="activeImage of activeImages" :imageId="'image_'+imageModelId+'_'+activeImage.id" :imageModelId="imageModelId" :activeImage="activeImage" :key="activeImage.id"/>
<!--      <canvas v-for="image of activeImages" :key="image.id" class="border" width="256"-->
<!--              height="256"></canvas>-->
    </div>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import ImageChart from './ImageChart';
export default {
  name: "ImageHistogram",
  props: ['activeImages', 'imageModelId'],
  components:{
    ImageChart
  },
  mounted() {
    // console.log('mounted ImageHistogram')
    // console.log(this.getImagesCollection)

    // this.getImagesCollection.forEach(imageModel => {

    // })
  },
  updated() {
    console.log('ImageHistogram');
    console.log(this.activeImages)
    // this.activeImages.forEach(image => {
    //   const imageElId = `image_${this.imageModelId}_${image.id}`
    //   // console.log(this.getImageData(imageElId))
    //   this.processImage(this.getImageData(imageElId), imageElId)
    // })
  },
  computed: {
    ...mapGetters({getImagesCollection: 'activeImages/getImages'}),
  },
  methods: {
    getImageData(imageElId) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const image = document.getElementById(imageElId);
      canvas.width = image.width;
      canvas.height = image.height;
      canvas.id=imageElId;
      context.drawImage(image, 0, 0);
      return context.getImageData(0, 0, image.width, image.height);
    },
    processImage(inImg) {
      // eslint-disable-next-line no-unused-vars
      const width = inImg.width;
      // eslint-disable-next-line no-unused-vars
      const height = inImg.height;
      const src = new Uint32Array(inImg.data.buffer);
      const isValueHistogram = false;

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
      if (isValueHistogram) {
        for (let i = 1; i < 256; i++) {
          if (maxBrightness < histBrightness[i]) {
            maxBrightness = histBrightness[i]
          }
        }
      } else {
        for (let i = 0; i < 256; i++) {
          if (maxBrightness < histR[i]) {
            maxBrightness = histR[i]
          } else if (maxBrightness < histG[i]) {
            maxBrightness = histG[i]
          } else if (maxBrightness < histB[i]) {
            maxBrightness = histB[i]
          }
        }
      }

      const canvas = document.getElementById('canvasHistogram');
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
    }
  }
}
</script>

<style lang="scss">

</style>