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
  equalizationHistogram, stretchInRangeOperation
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