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

    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="otsuImage"
                             @boot="otsu" :methodName="'Otsu'">
      <div class="d-flex flex-column">
        <div class="input-group my-3">
          <label class="input-group-text" for="first-image">
            First image:
          </label>

          <select id="first-image" v-model="thresholdType" class="form-select">
            <option value="otsu">Otsu</option>
            <option value="adaptive-mean">Adaptive (mean)</option>
            <option value="adaptive-gaussian">Adaptive (gaussian)</option>

          </select>
        </div>
        <!--        <label for="threshold_value">{{ tresholdValue }}</label>-->
        <!--        <input id="threshold_value" type="range" min="0" :max="255" step="1"-->
        <!--               v-model="tresholdValue">-->
      </div>
    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HistogramTransformation from '@/components/HistogramTransformation'
import {
  thresholdOperation,
  thresholdExtendedOperation, convertToCanvas, ostuThreshold
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
      otsuImage: {},
      thresholdType: 'otsu'

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
    otsu () {
      const { data, width, height } = this.getActiveImage.imageData

      const newCanvas = ostuThreshold(convertToCanvas(data, width, height), this.thresholdType)
      const newImageData = newCanvas.getContext('2d')
        .getImageData(0, 0, width, height)
      this.createImage(newImageData)

    },
    createImage (newImageData) {
      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        newImageData.data,
        newImageData.width,
        newImageData.height
      );

      this.otsuImage = {
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
