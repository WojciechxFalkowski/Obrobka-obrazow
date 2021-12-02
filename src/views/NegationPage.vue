<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="negationImage"
                             @boot="negation" :methodName="'Negacja'" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HistogramTransformation from '@/components/HistogramTransformation'
import { negationOperation } from '@/imageOperations/imageOperations'
import { createImageModel } from '@/helpers/createImageModel'

export default {
  name: 'NegationPage',
  data () {
    return {
      negationImage: {}
    }
  },
  components: {
    HistogramTransformation
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
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

      // this.addImage(this.negationImage)
    }
  },
  computed: {
    ...mapGetters({
      getActiveImage: 'activeImages/getActiveImage'
    })
  }
}
</script>
