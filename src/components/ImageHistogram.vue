<template>
    <div class="image-histogram">
      <ImageChart v-for="activeImage of activeImages" :imageId="'image_'+imageModelId+'_'+activeImage.id" :imageModelId="imageModelId" :activeImage="activeImage" :key="activeImage.id"/>
    </div>
</template>

<script>
import {mapGetters} from "vuex";
import ImageChart from './ImageChart';
export default {
  name: "ImageHistogram",
  props: ['activeImages', 'imageModelId'],
  components:{
    ImageChart
  },
  mounted() {

  },
  computed: {
    ...mapGetters({getImagesCollection: 'activeImages/getImages'}),
  },
  methods: {
  }
}
</script>

<style lang="scss">
.image-histogram{
  display: flex;
  height: 100%;
  //overflow-x: scroll;
}
</style>