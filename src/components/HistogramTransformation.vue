<template>
  <div class="row my-4">
    <div class="col-5">
      <img :src="activeImage.imageDataURL" alt="Image"
           class="histogram_transformation__image w-100">
      <ImageStatistics
        :imageId="'image_'+activeImage.modelId+'_'+activeImage.id"
        :imageModelId="activeImage.modelId" :activeImage="activeImage"
        :key="activeImage.id" />
    </div>
    <div class="col-2 align-self-center">
      <slot></slot>
      <button @click="$emit('boot')" class="btn btn-primary">
        {{ methodName }}
      </button>
    </div>
    <div class="col-5" v-if="Object.keys(stretchedImage).length>0">
      <img :src="stretchedImage.imageDataURL" alt="Image" class="histogram_transformation__image w-100">
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
  props: ['activeImage', 'stretchedImage', 'methodName'],
  components: {
    ImageStatistics
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