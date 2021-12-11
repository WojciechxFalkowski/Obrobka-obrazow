<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="segmentationImage"
                             @boot="segmentation" :methodName="'Segmentacja'"
    >
      <div class="d-flex flex-column">
        <div class="input-group my-3">
          <label class="input-group-text" for="type">
            Method:
          </label>

          <select id="type" v-model="type" class="form-select">
            <option value="watershed">Watershed</option>
            <option value="hsv">HSV</option>
            <option value="lab">LAB</option>
          </select>
        </div>
      </div>

    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HistogramTransformation from '@/components/HistogramTransformation'
import { convertToCanvas } from '@/imageOperations/imageOperations'
import { createImageModel } from '@/helpers/createImageModel'
import { watershed } from '@/imageOperations/segmentation'

export default {
  name: 'NegationPage',
  data () {
    return {
      segmentationImage: {},
      type: 'watershed',
      open: false,
      tempImage: null,
      resultType: 'contours',
      // HSV
      lowH: 220,
      lowS: 30,
      lowV: 0,
      highH: 360,
      highS: 255,
      highV: 255,
      // LAB
      lowL: 14,
      lowA: -79,
      lowB: -127,
      highL: 66,
      highA: 127,
      highB: -41
    }
  },
  components: {
    HistogramTransformation
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
    segmentation () {
      const { data, width, height } = this.getActiveImage.imageData
      let newImageData = null;

      if (this.type === 'watershed') {
        newImageData = watershed(convertToCanvas(data, width, height)).getContext('2d')
          .getImageData(0, 0, width, height)
      }

      // console.log(newImageData)
      // const imgData = negationOperation(this.getActiveImage.imageData.data)

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        newImageData.data,
        newImageData.width,
        newImageData.height
      );

      this.segmentationImage = {
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
