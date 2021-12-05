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
      <button @click="$emit('boot')" class="btn btn-primary">
        {{ methodName }}
      </button>
    </div>
    <div class="col-5" v-if="Object.keys(stretchedImage).length>0">
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

export default {
  name: 'HistogramTransformation',
  props: ['activeImage', 'activeImages', 'stretchedImage', 'methodName'],
  components: {
    ImageStatistics
  },
  created () {
    // console.log(typeof this.activeImage)
    // console.log(Object.entries(this.activeImage).length > 0)
    // console.log(Object.entries(this.activeImage))
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