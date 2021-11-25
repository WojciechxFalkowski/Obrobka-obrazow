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
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="negationImage"
                             @boot="negation" :methodName="'Negacja'" />
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

    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="posterizationImage"
                             @boot="posterization" :methodName="'Posteryzacja'">
      <div class="d-flex flex-column">
        <label for="posterization_value">Liczba kolorów</label>
        <input id="posterization_value" type="number" class="form-control text-center mb-2" :min="1"
               :max="255" :step="1"
               v-model="posterizationValue">
      </div>
    </HistogramTransformation>

    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="stretchedImageInRange"
                             @boot="stretchHistogramInRange"
                             :methodName="'Rozciągnij histogram w zakresie p1, p2, q3, q4'">
      <div class="d-flex flex-column">
        <label for="p1_stretch_in_range__value">p1: {{ p1StretchInRange }}</label>
        <input id="p1_stretch_in_range__value" type="number"
               class="form-control text-center mb-2" :min="0" :max="255" :step="1"
               v-model="p1StretchInRange">

        <label for="p2_stretch_in_range__value">p2: {{ p2StretchInRange }}</label>
        <input id="p2_stretch_in_range__value" type="number"
               class="form-control text-center mb-2" :min="0" :max="255" :step="1"
               v-model="p2StretchInRange">

        <label for="q3_stretch_in_range__value">q3: {{ q3StretchInRange }}</label>
        <input id="q3_stretch_in_range__value" type="number"
               class="form-control text-center mb-2" :min="0" :max="255" :step="1"
               v-model="q3StretchInRange">

        <label for="q4_stretch_in_range__value">q4: {{ q4StretchInRange }}</label>
        <input id="q4_stretch_in_range__value" type="number"
               class="form-control text-center mb-2" :min="0" :max="255" :step="1"
               v-model="q4StretchInRange">
      </div>
    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  stretchingHistogram,
  equalizationHistogram,
  negationOperation,
  thresholdOperation,
  thresholdExtendedOperation,
  posterizationOperation,
  stretchInRangeOperation
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
      negationImage: {},
      thresholdImage: {},
      thresholdExtendedImage: {},
      posterizationImage: {},
      stretchedImageInRange: {},
      minStretchValue: 0,
      maxStretchValue: 255,
      minTresholdExtendedValue: 0,
      maxTresholdExtendedValue: 255,
      tresholdValue: 128,
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
    if (parseInt(this.minTresholdExtendedValue) > parseInt(this.maxTresholdExtendedValue)) {
      this.minTresholdExtendedValue = this.maxTresholdExtendedValue
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

      this.addImage(this.stretchedImage)
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

      this.addImage(this.equalizedImage)
    },
    negation () {
      const imgData = negationOperation(this.getActiveImage.imageData.data)

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        imgData,
        this.getActiveImage.imageData.width,
        this.getActiveImage.imageData.height
      );

      this.negationImage = {
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

      this.addImage(this.negationImage)
    },
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

      this.addImage(this.thresholdImage)
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

      this.addImage(this.thresholdExtendedImage)
    },
    posterization () {
      const imgData =
        posterizationOperation(
          this.getActiveImage.imageData.data,
          parseInt(this.posterizationValue)
        )

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        imgData,
        this.getActiveImage.imageData.width,
        this.getActiveImage.imageData.height
      );

      this.posterizationImage = {
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

      this.addImage(this.posterizationImage)
    },
    stretchHistogramInRange () {
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

      this.addImage(this.stretchedImageInRange)
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