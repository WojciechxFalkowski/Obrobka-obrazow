<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="sharpImage"
                             @boot="applyChanges" :methodName="'wyostrz obraz'">
      <div class="d-flex flex-column">
        <div class="input-group my-3">
          <label class="input-group-text" for="mask-type">
            Mask:
          </label>

          <select id="mask-type" v-model="maskType" class="form-select">
            <option value="mask-1">Laplasjan 1</option>
            <option value="mask-2">Laplasjan 2</option>
            <option value="mask-3">Laplasjan 3</option>
            <option value="sobel-x">Sobel X</option>
            <option value="sobel-y">Sobel Y</option>
            <option value="prewitt-n">Prewitt N</option>
            <option value="prewitt-ne">Prewitt NE</option>
            <option value="prewitt-e">Prewitt E</option>
            <option value="prewitt-se">Prewitt SE</option>
            <option value="prewitt-s">Prewitt S</option>
            <option value="prewitt-sw">Prewitt SW</option>
            <option value="prewitt-w">Prewitt W</option>
            <option value="prewitt-nw">Prewitt NW</option>
            <option value="sobel">Sobel</option>
            <option value="canny">Canny</option>
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

        <fieldset :disabled="!isBorderTypeShown">
          <div class="my-3">
            <div class="input-group my-1">
              <label class="input-group-text" for="border-color">Border color:</label>
              <input v-if="isBorderTypeShown" v-model="constant" class="form-control"
                     id="border-color" type="number" min="0" max="255" step="1">
            </div>
          </div>
        </fieldset>

        <fieldset :disabled="!isCannyMaskSelected">
          <div class="my-3">
            <div class="input-group my-1">
              <label class="input-group-text" for="red-color">Threshold:</label>
              <input v-if="isCannyMaskSelected" v-model="cannyThreshold" class="form-control"
                     id="red-color" type="number" min="0" max="100" step="1">
            </div>
          </div>
        </fieldset>

      </div>

    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import HistogramTransformation from '@/components/HistogramTransformation'
import { createImageModel } from '@/helpers/createImageModel'
import { convertToCanvas } from '@/imageOperations/imageOperations'
import { sobel, canny, filter2D, sobelDirection } from '@/imageOperations/filters2D'

export default {
  name: 'PosterizationPage',
  data () {
    return {
      open: false,
      tempImage: null,
      maskType: 'mask-1',
      borderType: 4,
      constant: 0,
      cannyThreshold: 100,
      sharpImage: {}
    }
  },
  components: {
    HistogramTransformation
  },
  methods: {
    applyChanges () {
      const { data, width, height } = this.getActiveImage.imageData

      let newCanvas;
      switch (this.maskType) {
        case 'sobel': {
          newCanvas = sobel(
            convertToCanvas(data, width, height),
            parseInt(this.borderType),
            parseInt(this.constant)
          )
          break;
        }
        case 'canny': {
          newCanvas = canny(
            convertToCanvas(data, width, height),
            parseInt(this.cannyThreshold),
            parseInt(this.borderType),
            parseInt(this.constant)
          )
          break;
        }
        case 'sobel-x': {
          newCanvas = sobelDirection(
            convertToCanvas(data, width, height),
            parseInt(this.borderType),
            parseInt(this.constant),
            this.maskType
          )
          break;
        }
        case 'sobel-y': {
          newCanvas = sobelDirection(
            convertToCanvas(data, width, height),
            parseInt(this.borderType),
            parseInt(this.constant),
            this.maskType
          )
          break;
        }
        default: {
          newCanvas = filter2D(
            convertToCanvas(data, width, height),
            this.getFilterArr(),
            parseInt(this.borderType),
            parseInt(this.constant)
          );
          break;
        }
      }

      const newImageData = newCanvas.getContext('2d').getImageData(0, 0, width, height)

      const { imageData, imageDataUrl, isGrayScale, pixelAmounts } = createImageModel(
        newImageData.data,
        newImageData.width,
        newImageData.height
      );

      this.sharpImage = {
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
    getFilterArr () {
      let filterArr;
      if (this.maskType === 'mask-1') {
        filterArr = [0, -1, 0, -1, 4, -1, 0, -1, 0];
      } else if (this.maskType === 'mask-2') {
        filterArr = [-1, -1, -1, -1, 8, -1, -1, -1, -1];
      } else if (this.maskType === 'prewitt-n') {
        filterArr = [1, 2, 1, 0, 0, 0, -1, -2, -1];
      } else if (this.maskType === 'prewitt-ne') {
        filterArr = [0, 1, 2, -1, 0, 1, -2, -1, 0];
      } else if (this.maskType === 'prewitt-e') {
        filterArr = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
      } else if (this.maskType === 'prewitt-se') {
        filterArr = [-2, -1, 0, -1, 0, 1, 0, 1, 2];
      } else if (this.maskType === 'prewitt-s') {
        filterArr = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
      } else if (this.maskType === 'prewitt-sw') {
        filterArr = [0, -2, -1, 1, 0, -1, 1, 2, 0];
      } else if (this.maskType === 'prewitt-w') {
        filterArr = [1, 0, -1, 2, 0, -2, 1, 0, -1];
      } else if (this.maskType === 'prewitt-nw') {
        filterArr = [2, 1, 0, 1, 0, -1, 0, -1, -2];
      } else {
        // mask-3
        filterArr = [1, -2, 1, -2, 4, -2, 1, -2, 1];
      }
      return filterArr;
    }
  },
  computed: {
    ...mapGetters({
      getActiveImage: 'activeImages/getActiveImage'
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
