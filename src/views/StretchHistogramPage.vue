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
                             @boot="equalizeHistogram" :methodName="'Wyrównaj histogram'" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  stretchingHistogram,
  equalizationHistogram,
} from '@/imageOperations/imageOperations'
import HistogramTransformation from '@/components/HistogramTransformation'
import { createImageModel } from '@/helpers/createImageModel'

export default {
  name: 'StretchHistogramPage',
  components: {
    HistogramTransformation
  },
  data () {
    return {
      stretchedImage: {},
      equalizedImage: {},
      minStretchValue: 0,
      maxStretchValue: 255,

    }
  },
  updated () {
    if (parseInt(this.minStretchValue) > parseInt(this.maxStretchValue)) {
      this.minStretchValue = this.maxStretchValue
    }
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
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
    equalizeHistogram () {
      const imgData = equalizationHistogram(
        this.getActiveImage.pixelAmounts.gray,
        this.getActiveImage.imageData.data
      )

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

      // this.addImage(this.equalizedImage)
    },
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