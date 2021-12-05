<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImages="getActiveImages" :stretchedImage="maskImage"
                             @boot="applyChanges" :methodName="'wyostrz obraz'">
      <div class="d-flex flex-column">
        <div class="input-group my-3">
          <label class="input-group-text" for="first-image">
            First image:
          </label>

          <select id="first-image" v-model="firstImageName" class="form-select">
            <option v-for="getActiveImage of getActiveImages" :value="getActiveImage.name"
                    :key="getActiveImage.modelId">
              {{ getActiveImage.name }}
            </option>

          </select>
        </div>

        <div class="input-group my-3">
          <label class="input-group-text" for="operation-type">
            Operation type:
          </label>

          <select id="operation-type" v-model="operationType" class="form-select">
            <option value="and">AND</option>
            <option value="or">OR</option>
            <option value="xor">XOR</option>
          </select>
        </div>

        <div class="input-group my-3">
          <label class="input-group-text" for="second-image">
            Second image:
          </label>

          <select id="second-image" v-model="secondImageName" class="form-select">
            <option v-for="getActiveImage of getActiveImages" :value="getActiveImage.name"
                    :key="getActiveImage.modelId">
              {{ getActiveImage.name }}
            </option>

          </select>
        </div>

        <!--        <div class="input-group my-3">-->
        <!--          <label class="input-group-text" for="border-type">Border type:</label>-->
        <!--          <select id="border-type" v-model="borderType" class="form-select">-->
        <!--            <option :value="4">Default (reflect 101)</option>-->
        <!--            <option :value="0">Constant</option>-->
        <!--            <option :value="1">Replicate</option>-->
        <!--            <option :value="2">Reflect</option>-->
        <!--            <option :value="255">Preserve original</option>-->
        <!--          </select>-->
        <!--        </div>-->

        <!--        <fieldset :disabled="!isBorderTypeShown">-->
        <!--          <div class="my-3">-->
        <!--            <div class="input-group my-1">-->
        <!--              <label class="input-group-text" for="border-color">Border color:</label>-->
        <!--              <input v-if="isBorderTypeShown" v-model="constant" class="form-control"-->
        <!--                     id="border-color" type="number" min="0" max="255" step="1">-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </fieldset>-->

        <!--        <fieldset :disabled="!isCannyMaskSelected">-->
        <!--          <div class="my-3">-->
        <!--            <div class="input-group my-1">-->
        <!--              <label class="input-group-text" for="red-color">Threshold:</label>-->
        <!--              <input v-if="isCannyMaskSelected" v-model="cannyThreshold" class="form-control"-->
        <!--                     id="red-color" type="number" min="0" max="100" step="1">-->
        <!--            </div>-->
        <!--          </div>-->
        <!--        </fieldset>-->

      </div>
    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HistogramTransformation from '@/components/HistogramTransformation'
import { createImageModel } from '@/helpers/createImageModel'
import { convertToCanvas } from '@/imageOperations/imageOperations'
import { mask } from '@/imageOperations/mask'

export default {
  name: 'PosterizationPage',
  data () {
    return {
      open: false,
      tempImage: null,
      operationType: 'and',
      maskImage: {},
      firstImageName: null,
      secondImageName: null
    }
  },
  components: {
    HistogramTransformation
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
    applyChanges () {
      if (this.firstImageName && this.secondImageName) {
        console.log('Teraz')
        // console.log(this.firstImageName)
        // console.log(this.secondImageName)
        const image = this.getActiveImages.find(image => image.name === this.firstImageName)
        const maskImage = this.getActiveImages.find(image => image.name === this.secondImageName)

        console.log(convertToCanvas(image.imageData.data, image.imageData.width, image.imageData.height))
        console.log(image)
        console.log(maskImage)
        // console.log('a')
        // console.log(convertToCanvas(image.imageData.data, image.imageData.width,
        //   image.imageData.height))
        // console.log('aa')
        const newCanvas = mask(
          this.operationType,
          convertToCanvas(image.imageData.data, image.imageData.width, image.imageData.height),
          convertToCanvas(maskImage.imageData.data, image.imageData.width, image.imageData.height)
        )

        const newImageData = newCanvas.getContext('2d')
          .getImageData(0, 0, image.imageData.width, image.imageData.height)

        this.createImage(newImageData)

        // console.log('newCanvas')
        // console.log(newCanvas)
      } else {
        console.log('NIE WYPELNIONO DANYCH')
      }
      // console.log(this.getActiveImage)
      // console.log(this.getActiveImages)


    },
    createImage (newImageData) {
      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        newImageData.data,
        newImageData.width,
        newImageData.height
      );

      this.maskImage = {
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
      getActiveImage: 'activeImages/getActiveImage',
      getActiveImages: 'activeImages/getActiveImages'
    }),
    isBorderTypeShown () {
      return this.borderType === 0
    },
    isCannyMaskSelected () {
      return this.maskType === 'canny'
    }
  }
}
</script>
