<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="stretchedImage"
                             @boot="stretchHistogram" :methodName="'Rozciągnij histogram'"
    >
      <div class="d-flex flex-column">
        <label for="min_stretch_value">{{ minStretchValue }}</label>
        <input id="min_stretch_value" type="range" min="0" :max="255" step="1"
               v-model="minStretchValue">
      </div>

      <div class="d-flex flex-column">
        <label for="max__stretch_value">{{ maxStretchValue }}</label>
        <input id="max__stretch_value" type="range" min="0" max="255" step="1"
               v-model="maxStretchValue">
      </div>
    </HistogramTransformation>

    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="equalizedImage"
                             @boot="equalizeHistogram" :methodName="'Wyrównaj histogram'">

    </HistogramTransformation>

    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="equalizedImageLab"
                             @boot="equalizeHistogramTest" :methodName="'Wyrównaj histogram Lab'">

    </HistogramTransformation>

    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="stretchedImageInRange"
                             @boot="stretchHistogramInRange"
                             :methodName="'Rozciągnij histogram w zakresie p1, p2, q3, q4'">
      <div class="d-flex flex-column">
        <label for="p1_stretch_in_range__value">p1</label>
        <input id="p1_stretch_in_range__value" type="number"
               class="form-control text-center mb-2" :min="0" :max="255" :step="1"
               v-model="p1StretchInRange">

        <label for="p2_stretch_in_range__value">p2</label>
        <input id="p2_stretch_in_range__value" type="number"
               class="form-control text-center mb-2" :min="0" :max="255" :step="1"
               v-model="p2StretchInRange">

        <label for="q3_stretch_in_range__value">q3</label>
        <input id="q3_stretch_in_range__value" type="number"
               class="form-control text-center mb-2" :min="0" :max="255" :step="1"
               v-model="q3StretchInRange">

        <label for="q4_stretch_in_range__value">q4</label>
        <input id="q4_stretch_in_range__value" type="number"
               class="form-control text-center mb-2" :min="0" :max="255" :step="1"
               v-model="q4StretchInRange">
      </div>
    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  stretchingHistogram,
  // eslint-disable-next-line no-unused-vars
  equalizationHistogram,equalizationHistogramLab, stretchInRangeOperation
} from '@/imageOperations/imageOperations'
import HistogramTransformation from '@/components/HistogramTransformation'
import { createImageModel } from '@/helpers/createImageModel'
// eslint-disable-next-line no-unused-vars
import { rgb_to_lab, rgb2lab, lab2rgb } from '@/imageOperations/rgbToLab'

export default {
  name: 'StretchHistogramPage',
  components: {
    HistogramTransformation
  },
  data () {
    return {
      stretchedImage: {},
      equalizedImage: {},
      equalizedImageLab: {},
      minStretchValue: 0,
      maxStretchValue: 255,
      stretchedImageInRange: {},
      posterizationValue: 1,
      p1StretchInRange: 0,
      p2StretchInRange: 255,
      q3StretchInRange: 0,
      q4StretchInRange: 255
    }
  },
  updated () {
    if (parseInt(this.minStretchValue) > parseInt(this.maxStretchValue)) {
      this.minStretchValue = this.maxStretchValue
    }
  },
  methods: {
    stretchHistogram () {
      const imgData = stretchingHistogram(this.getActiveImage.imageData.data,
        parseInt(this.minStretchValue), parseInt(this.maxStretchValue)
      )

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        imgData,
        this.getActiveImage.imageData.width,
        this.getActiveImage.imageData.height
      );

      this.stretchedImage = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }

      // this.addImage(this.stretchedImage)
    },
    equalizeHistogramTest () {
      console.log('equalizeHistogramTest')
      console.log(this.getActiveImage)
      const imageDataM = []
      const lChannel = []
      const aChannel = []
      const bChannel = []
      for (let i = 0; i < this.getActiveImage.imageData.data.length; i += 4) {
        const r = this.getActiveImage.imageData.data[i]
        const g = this.getActiveImage.imageData.data[i + 1]
        const b = this.getActiveImage.imageData.data[i + 2]
        const [x,y,z] = rgb2lab([r, g, b])
        if(i===0)
        {
          console.log(x)
          console.log(y)
          console.log(z)
          console.log(rgb2lab([r, g, b]))
        }
        lChannel.push(Math.floor(x))
        aChannel.push(Math.floor(y))
        bChannel.push(Math.floor(z))
        // imageDataM.push(...rgb2lab([r, g, b]))

        imageDataM.push(Math.floor(x))
        imageDataM.push(Math.floor(y))
        imageDataM.push(Math.floor(z))
        imageDataM.push(255)
      }

      const lLut = (new Array(256)).fill(0);
      lChannel.forEach(channel => {
        lLut[Math.floor(channel)]++
      })
      // console.log('imageDataM')
      // console.log(imageDataM)
      // console.log('lChannel')
      // console.log(lChannel)
      // console.log('lLUT')
      // console.log(lLut)

      // eslint-disable-next-line no-unused-vars
      const imgData = equalizationHistogramLab(
        lLut,
        imageDataM
      )
      // const imageDataAfterLabToRGB = []
      // for (let i = 0; i < this.getActiveImage.imageData.data.length; i += 4) {
      //   const lChannell = this.getActiveImage.imageData.data[i]
      //   const aChannell = this.getActiveImage.imageData.data[i + 1]
      //   const bChannell = this.getActiveImage.imageData.data[i + 2]
      //   const [r,g,b] = lab2rgb([lChannell, aChannell, bChannell])
      //   imageDataAfterLabToRGB.push(Math.floor(r))
      //   imageDataAfterLabToRGB.push(Math.floor(g))
      //   imageDataAfterLabToRGB.push(Math.floor(b))
      //   imageDataAfterLabToRGB.push(255)
      // }
      // const imgData = equalizationHistogram(
      //   this.getActiveImage.pixelAmounts.gray,
      //   this.getActiveImage.imageData.data
      // )
      // const imageDataModified = []
      // for (let i = 0; i < imageDataModified.length; i++) {
      //   imageDataModified.push(...imageDataModified[i])
      // }
      // console.log('imageDataModified')
      // console.log(imageDataModified)
      // const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
      //   imageDataM,
      //   this.getActiveImage.imageData.width,
      //   this.getActiveImage.imageData.height
      // );

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        imgData,
        this.getActiveImage.imageData.width,
        this.getActiveImage.imageData.height
      );

      this.equalizedImageLab = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }

      // this.addImage(this.equalizedImage)
    },
    equalizeHistogramLab () {
      console.log('equalizeHistogramLab')
      console.log(this.getActiveImage)
      // const imageDataM = []
      const lChannel = []
      const aChannel = []
      const bChannel = []
      for (let i = 0; i < this.getActiveImage.imageData.data.length; i += 4) {
        const r = this.getActiveImage.imageData.data[i]
        const g = this.getActiveImage.imageData.data[i + 1]
        const b = this.getActiveImage.imageData.data[i + 2]
        const [x,y,z] = rgb2lab([r, g, b])
        lChannel.push(Math.floor(x))
        aChannel.push(Math.floor(y))
        bChannel.push(Math.floor(z))
        // imageDataM.push(...rgb2lab([r, g, b]))

        // imageDataM.push(Math.floor(x))
        // imageDataM.push(Math.floor(y))
        // imageDataM.push(Math.floor(z))
        // imageDataM.push(255)
      }

      const lLut = (new Array(256)).fill(0);
      lChannel.forEach(channel => {
        lLut[Math.floor(channel)]++
      })
      // console.log('imageDataM')
      // console.log(imageDataM)
      // console.log('lChannel')
      // console.log(lChannel)
      // console.log('lLUT')
      // console.log(lLut)

      // eslint-disable-next-line no-unused-vars
      const imgData = equalizationHistogramLab(
        lLut,
        lChannel
      )
      console.log('===porownanie===')
      console.log(lLut)
      console.log(imgData)

      const imageDataAfterLabToRGB = []

      for (let i = 0; i < aChannel.length; i += 1) {
        const lChannell = imgData[i]
        const aChannell = aChannel[i]
        const bChannell = bChannel[i]
        const [r,g,b] = lab2rgb([lChannell, aChannell, bChannell])
        imageDataAfterLabToRGB.push(Math.floor(r))
        imageDataAfterLabToRGB.push(Math.floor(g))
        imageDataAfterLabToRGB.push(Math.floor(b))
        imageDataAfterLabToRGB.push(255)
      }
      // const imgData = equalizationHistogram(
      //   this.getActiveImage.pixelAmounts.gray,
      //   this.getActiveImage.imageData.data
      // )
      // const imageDataModified = []
      // for (let i = 0; i < imageDataModified.length; i++) {
      //   imageDataModified.push(...imageDataModified[i])
      // }
      // console.log('imageDataModified')
      // console.log(imageDataModified)
      // const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
      //   imageDataM,
      //   this.getActiveImage.imageData.width,
      //   this.getActiveImage.imageData.height
      // );

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        imageDataAfterLabToRGB,
        this.getActiveImage.imageData.width,
        this.getActiveImage.imageData.height
      );

      this.equalizedImageLab = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }

      // this.addImage(this.equalizedImage)
    },
    equalizeHistogram () {
      const imgData = equalizationHistogram(
        this.getActiveImage.pixelAmounts.gray,
        this.getActiveImage.imageData.data
      )
      const imageDataModified = []
      for (let i = 0; i < imageDataModified.length; i++) {
        imageDataModified.push(...imageDataModified[i])
      }

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        imgData,
        this.getActiveImage.imageData.width,
        this.getActiveImage.imageData.height
      );

      this.equalizedImage = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }
    },
    stretchHistogramInRange () {
      console.log(this.getActiveImage)
      const imgData =
        stretchInRangeOperation(
          this.getActiveImage.imageData.data,
          parseInt(this.p1StretchInRange),
          parseInt(this.p2StretchInRange),
          parseInt(this.q3StretchInRange),
          parseInt(this.q4StretchInRange)
        )

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        imgData,
        this.getActiveImage.imageData.width,
        this.getActiveImage.imageData.height
      );

      this.stretchedImageInRange = {
        id: null,
        imageData: imageData,
        imageDataURL: imageDataUrl,
        // isActive: null,
        isGrayScale: isGrayScale,
        modelId: this.getActiveImage.modelId,
        // name: null,
        // path: null,
        pixelAmounts
        // size:null,
        // time:null,
        // timestamp:null,
      }
    }
  },
  computed: {
    ...mapGetters({
      getActiveImage: 'activeImages/getActiveImage'
    })
  }
}
</script>

<style lang="scss">
.stretch-histogram {

}

</style>