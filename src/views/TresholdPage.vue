<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="thresholdImage"
                             @boot="threshold" :methodName="'Progowanie'">
      <div class="d-flex flex-column">
        <label for="threshold_value">{{ tresholdValue }}</label>
        <input id="threshold_value" type="range" min="0" :max="255" step="1"
               v-model="tresholdValue">
      </div>
    </HistogramTransformation>

    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="thresholdExtendedImage"
                             @boot="thresholdExtended"
                             :methodName="'Progowanie z zachowaniem poziomów szarości'"
    >
      <div class="d-flex flex-column">
        <label for="min_threshold_extended_value">{{ minTresholdExtendedValue }}</label>
        <input id="min_threshold_extended_value" type="range" min="0" :max="255" step="1"
               v-model="minTresholdExtendedValue">
      </div>

      <div class="d-flex flex-column">
        <label for="max_threshold_extended_value">{{ maxTresholdExtendedValue }}</label>
        <input id="max_threshold_extended_value" type="range" min="0" max="255" step="1"
               v-model="maxTresholdExtendedValue">
      </div>
    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HistogramTransformation from '@/components/HistogramTransformation'
import {
  thresholdOperation,
  thresholdExtendedOperation
} from '@/imageOperations/imageOperations'
import { createImageModel } from '@/helpers/createImageModel'

export default {
  name: 'NegationPage',
  data () {
    return {
      thresholdImage: {},
      thresholdExtendedImage: {},
      minTresholdExtendedValue: 0,
      maxTresholdExtendedValue: 255,
      tresholdValue: 128,
    }
  },
  components: {
    HistogramTransformation
  },
  updated () {
    if (parseInt(this.minTresholdExtendedValue) > parseInt(this.maxTresholdExtendedValue)) {
      this.minTresholdExtendedValue = this.maxTresholdExtendedValue
    }
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
    threshold () {
      const imgData = thresholdOperation(
        this.getActiveImage.imageData.data,
        parseInt(this.tresholdValue)
      )

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        imgData,
        this.getActiveImage.imageData.width,
        this.getActiveImage.imageData.height
      );

      this.thresholdImage = {
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

      // this.addImage(this.thresholdImage)
    },
    thresholdExtended () {

      const imgData =
        thresholdExtendedOperation(
          this.getActiveImage.imageData.data,
          parseInt(this.minTresholdExtendedValue),
          parseInt(this.maxTresholdExtendedValue)
        )

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        imgData,
        this.getActiveImage.imageData.width,
        this.getActiveImage.imageData.height
      );

      this.thresholdExtendedImage = {
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

      // this.addImage(this.thresholdExtendedImage)
    },
  },
  computed: {
    ...mapGetters({
      getActiveImage: 'activeImages/getActiveImage'
    })
  }
}
</script>
