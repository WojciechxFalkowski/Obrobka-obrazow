<template>
  <div class="container-fluid">
    <HistogramTransformation :activeImage="getActiveImage" :stretchedImage="segmentationImage"
                             @boot="segmentation" :methodName="'Segmentacja'">
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

        <fieldset v-show="type !== 'watershed'">
          <div class="input-group my-3">

            <label class="input-group-text" for="result-type">
              Result type:
            </label>

            <select id="result-type" v-model="resultType" class="form-select">
              <option value="contours">Draw contours</option>
              <option value="mono-map">Monochrome map</option>
            </select>
          </div>
        </fieldset>

        <fieldset v-show="type === 'hsv'">
          <div class="input-group my-3">
            <div class="w-100">MIN</div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="low_h">L: {{ lowH }}</label>
              <input id="low_h" type="range" min="0" :max="360" step="1"
                     v-model="lowH">
            </div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="low_s">S: {{ lowS }}</label>
              <input id="low_s" type="range" min="0" :max="255" step="1"
                     v-model="lowS">
            </div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="low_v">V: {{ lowV }}</label>
              <input id="low_v" type="range" min="0" :max="255" step="1"
                     v-model="lowV">
            </div>

            <div class="w-100 mt-4">MAX</div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="high_h">L: {{ highH }}</label>
              <input id="high_h" type="range" min="0" :max="360" step="1"
                     v-model="highH">
            </div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="high_s">S: {{ highS }}</label>
              <input id="high_s" type="range" min="0" :max="255" step="1"
                     v-model="highS">
            </div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="high_v">V: {{ highV }}</label>
              <input id="high_v" type="range" min="0" :max="255" step="1"
                     v-model="highV">
            </div>
          </div>
        </fieldset>

        <fieldset v-show="type === 'lab'">
          <div class="input-group my-3">
            <div class="w-100">MIN</div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="low_l">L: {{ lowL }}</label>
              <input id="low_l" type="range" :min="0" :max="100" step="1"
                     v-model="lowL">
            </div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="low_a">A: {{ lowA }}</label>
              <input id="low_a" type="range" :min="-128" :max="127" step="1"
                     v-model="lowA">
            </div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="low_b">B: {{ lowB }}</label>
              <input id="low_b" type="range" :min="-128" :max="127" step="1"
                     v-model="lowB">
            </div>

            <div class="w-100 mt-4">MAX</div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="high_l">L: {{ highL }}</label>
              <input id="high_l" type="range" :min="0" :max="100" step="1"
                     v-model="highL">
            </div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="high_a">A: {{ highA }}</label>
              <input id="high_a" type="range" :min="-128" :max="127" step="1"
                     v-model="highA">
            </div>

            <div class="d-flex flex-column align-items-start m-auto">
              <label for="high_b">B: {{ highB }}</label>
              <input id="high_b" type="range" :min="-128" :max="127" step="1"
                     v-model="highB">
            </div>
          </div>
        </fieldset>
      </div>

      <button @click="saveImage">Zapisz obraz</button>
    </HistogramTransformation>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import HistogramTransformation from '@/components/HistogramTransformation'
import { convertToCanvas } from '@/imageOperations/imageOperations'
import { createImageModel } from '@/helpers/createImageModel'
import { watershed, hsvSegmentation, labSegmentation } from '@/imageOperations/segmentation'

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
    saveImage () {
      this.addImage(this.segmentationImage)
    },
    segmentation () {
      const { data, width, height } = this.getActiveImage.imageData
      let newImageData = null;

      switch (this.type) {
        case 'watershed': {
          newImageData = watershed(convertToCanvas(data, width, height)).getContext('2d')
            .getImageData(0, 0, width, height)
          break;
        }

        case 'hsv': {
          newImageData = hsvSegmentation(
            convertToCanvas(data, width, height),
            parseInt(this.lowH) / 2,
            parseInt(this.lowS),
            parseInt(this.lowV),
            parseInt(this.highH) / 2,
            parseInt(this.highS),
            parseInt(this.highV),
            this.resultType
          ).getContext('2d').getImageData(0, 0, width, height)
          break;
        }
        case 'lab': {
          newImageData = labSegmentation(
            convertToCanvas(data, width, height),
            parseInt(this.lowL),
            parseInt(this.lowA),
            parseInt(this.lowB),
            parseInt(this.highL),
            parseInt(this.highA),
            parseInt(this.highB),
            this.resultType
          ).getContext('2d').getImageData(0, 0, width, height);
          break;
        }
        default: {

          break;
        }
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
