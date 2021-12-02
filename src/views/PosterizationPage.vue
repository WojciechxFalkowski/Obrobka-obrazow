<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="posterizationImage"
                             @boot="posterization" :methodName="'Posteryzacja'">
      <div class="d-flex flex-column">
        <label for="posterization_value">Liczba kolorów</label>
        <input id="posterization_value" type="number" class="form-control text-center mb-2" :min="1"
               :max="255" :step="1"
               v-model="posterizationValue">
      </div>
    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HistogramTransformation from '@/components/HistogramTransformation'
import {  posterizationOperation } from '@/imageOperations/imageOperations'
import { createImageModel } from '@/helpers/createImageModel'

export default {
  name: 'PosterizationPage',
  data () {
    return {
      posterizationImage: {},
      posterizationValue: 1,
    }
  },
  components: {
    HistogramTransformation
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
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

      // this.addImage(this.posterizationImage)
    },
  },
  computed: {
    ...mapGetters({
      getActiveImage: 'activeImages/getActiveImage'
    })
  }
}
</script>
