<template>
  <div class="row my-4">
    <div class="col-5">
      <div v-if="isSingleActiveImage">
        <img :src="activeImage.imageDataURL" alt="Image"
             class="histogram_transformation__image w-100">
        <ImageStatistics
          :imageId="'image_'+activeImage.modelId+'_'+activeImage.id"
          :imageModelId="activeImage.modelId" :activeImage="activeImage"
          :key="activeImage.id" />
      </div>

      <div v-else v-for="(activeImage,index) of activeImages" :key="index">
        <img :src="activeImage.imageDataURL" alt="Image"
             class="histogram_transformation__image w-100">
        <ImageStatistics
          :imageId="'image_'+activeImage.modelId+'_'+activeImage.id"
          :imageModelId="activeImage.modelId" :activeImage="activeImage"
          :key="activeImage.id" />
      </div>
    </div>
    <div class="col-2 align-self-center">
      <slot></slot>
      <button @click="$emit('boot')" class="btn btn-primary" :disabled="!isReadyToBoot">
        {{ methodName }}
      </button>

      <div>
        <button @click="saveImage" class="btn mt-5" :disabled="!isModifiedImage"
                :class="isModifiedImage?'btn-dark':'btn-outline-dark'">
          Zapisz obraz
        </button>
      </div>
    </div>
    <div class="col-5" v-if="isModifiedImage">
      <img :src="stretchedImage.imageDataURL" alt="Image"
           class="histogram_transformation__image w-100">
      <ImageStatistics
        :imageId="'image_'+stretchedImage.modelId+'_'+stretchedImage.id"
        :imageModelId="stretchedImage.modelId" :activeImage="stretchedImage"
        :key="stretchedImage.id" />
    </div>
  </div>
</template>

<script>
import ImageStatistics from './../components/ImageStatistics'
import { mapActions } from 'vuex'

export default {
  name: 'HistogramTransformation',
  props: {
    activeImage: {
      type: Object,
      required: false
    },
    activeImages: {
      type: Array, required: false
    },
    stretchedImage: {
      type: Object, required: false
    },
    methodName: {
      type: String,
      required: true
    },
    isReadyToBoot: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  components: {
    ImageStatistics
  },
  methods: {
    ...mapActions({ addImage: 'activeImages/addImage' }),
    saveImage () {
      this.addImage(this.stretchedImage)
    }
  },
  computed: {
    isSingleActiveImage () {
      // console.log('isSingleActiveImage')
      // console.log(this.activeImage&&Object.entries(this.activeImage).length > 0)
      return this.activeImage && Object.entries(this.activeImage).length > 0
    },
    isMultiActiveImage () {
      // console.log('isMultiActiveImage')
      // console.log(this.activeImages&&this.activeImages.length >= 2)
      return this.activeImages && this.activeImages.length >= 2
    },
    isModifiedImage () {
      return Object.keys(this.stretchedImage).length > 0
    }
  }
}
</script>

<style lang="scss">
.histogram_transformation {
  &__image {
    max-width: 400px;
    max-height: 400px;
    margin-bottom: 20px;
  }
}
</style>