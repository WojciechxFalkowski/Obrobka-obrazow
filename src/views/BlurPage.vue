<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="bluredImage"
                             @boot="blurImage" :methodName="'wygładź obraz'">
      <div class="d-flex flex-column">
        <div class="input-group my-3">
          <label class="input-group-text" for="blur-type">Blur type:</label>
          <select id="blur-type" v-model="blurType" class="form-select">
            <option value="average">Average</option>
            <option value="k-average">K-Average</option>
            <option value="gaussian">Gaussian</option>
            <option value="median">Median</option>
          </select>
        </div>

        <fieldset :disabled="!isBlurTypeShown">
          <div class="input-group my-3">
            <label for="k-value" class="input-group-text">K-value:</label>
            <input v-if="isBlurTypeShown" id="k-value" v-model="kValue"
                   class="form-control" type="number" min="1"
                   max="255"
                   step="1">
          </div>
        </fieldset>

        <div class="input-group my-3">
          <label class="input-group-text" for="kernel-size">Kernel size:</label>
          <select id="kernel-size" v-model="kernelSize" class="form-select">
            <option value="3">3x3</option>
            <option value="5">5x5</option>
            <option value="7">7x7</option>
            <option value="9">9x9</option>
          </select>
        </div>

        <div class="input-group my-3">
          <label class="input-group-text" for="border-type">Border type:</label>
          <select id="border-type" v-model="borderType" class="form-select">
            <option :value="4">Default (reflect 101)</option>
            <option :value="0">Constant</option>
            <option :value="1">Replicate</option>
            <option :value="2">Reflect</option>
            <option :value="255">Preserve original</option>
          </select>
        </div>

        <!--        v-show="borderType === 0" disabled-->
        <fieldset :disabled="!isBorderTypeShown">

          <div class="my-3">
            <span>Border color:</span>
            <div class="input-group my-1">
              <label class="input-group-text" for="red-color">R:</label>
              <input v-if="isBorderTypeShown" v-model="constantRed" class="form-control"
                     id="red-color" type="number" min="0" max="255" step="1">
            </div>

            <div class="input-group my-1">
              <label class="input-group-text" for="green-color">G:</label>
              <input v-if="isBorderTypeShown" v-model="constantGreen" class="form-control"
                     id="green-color" type="number" min="0" max="255" step="1">
            </div>
            <div class="input-group my-1">

              <label class="input-group-text" for="blue-color">B:</label>
              <input v-if="isBorderTypeShown" v-model="constantBlue" class="form-control"
                     id="blue-color" type="number" min="0" max="255" step="1">
            </div>
          </div>
        </fieldset>

      </div>
    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HistogramTransformation from '@/components/HistogramTransformation'
import { createImageModel } from '@/helpers/createImageModel'
import { blur } from '@/imageOperations/blur';
import { convertToCanvas } from '@/imageOperations/imageOperations'

export default {
  name: 'PosterizationPage',
  data () {
    return {
      bluredImage: {},
      open: false,
      tempImage: null,
      kernelSize: 3,
      borderType: 4,
      blurType: 'average',
      constantRed: 0,
      constantGreen: 0,
      constantBlue: 0,
      kValue: 1,
      posterizationValue: 1
    }
  },
  components: {
    HistogramTransformation,
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
    blurImage () {
      const { data, width, height } = this.getActiveImage.imageData
      const newImageData = blur(
        this.blurType,
        convertToCanvas(data, width, height),
        parseInt(this.kernelSize),
        parseInt(this.borderType),
        {
          red: parseInt(this.constantRed),
          green: parseInt(this.constantGreen),
          blue: parseInt(this.constantBlue)
        },
        parseInt(this.kValue)
      ).getContext('2d').getImageData(0, 0, width, height)

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        newImageData.data,
        newImageData.width,
        newImageData.height
      );

      this.bluredImage = {
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
    }
  },
  computed: {
    ...mapGetters({
      getActiveImage: 'activeImages/getActiveImage'
    }),
    isBorderTypeShown(){
      return this.borderType === 0
    },
    isBlurTypeShown(){
      return this.blurType === 'k-average'
    }
  }
}
</script>
