<template>
  <div class="home d-flex flex-column">
    <div class="mb-4">
<!--      <button class="btn btn-primary" @click="boxFilteringImageOption(getImagesCollection)">Box filtering</button>-->
<!--      <button class="btn btn-primary" @click="unsharpMaskingImageOption(getImagesCollection)">Unsharp masking</button>-->
<!--      <button class="btn btn-primary" @click="saltAndPepperImageOption(getImagesCollection)">SaltAndPepper</button>-->
<!--      <button class="btn btn-primary" @click="testClick">SaltAndPepper</button>-->

    </div>
    <!--    src="C:\Users\48698\OneDrive\Documents\skill\projects\apo_wojciech_falkowski\dist_electron\uploads\blog_img_1-desktop.jpg"-->
    <!--    ref="defaultImageRef"-->

    <div class="container-fluid">
      <div class="row pb-5" v-for="imageModel of getImagesCollection" :key="imageModel.id">
        <div class="col-8 d-flex home__image-wrapper pb-2" ref="imageWrapperRef">
          <img :key="image.id" v-for="image of imageModel.images" :class="image.isActive?'active':''"
               @click="toggleImageActivity({modelId:imageModel.id,imageId:image.id})"
               :src="image.path"
               :data-title="image.id"
               class="home__default-image p-2" alt="img"
               :id="'image_'+imageModel.id+'_'+image.id"/>
        </div>
        <div class="col-4 bg-info">
          <ImageHistogram :imageModelId="imageModel.id" :activeImages="imageModel.images.filter(image=>image.isActive)"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ImageHistogram from "./../components/ImageHistogram"
import {mapActions, mapGetters} from 'vuex';
import {
  boxFiltering,
  unsharpMasking,
  bilateralFiltering,
  saltAndPepper
} from '../imageOperations/imageOperations'

export default {
  name: 'Home',
  components: {
    ImageHistogram
  },
  data() {
    return {
      imageUrl: null,
      images: [],
    }
  },
  computed: {
    ...mapGetters({getImagesCollection: 'activeImages/getImages',getActiveImages:'activeImages/getActiveImages'})
  },
  mounted() {
    window.customAPI.ipcRenderer.customOn('images:duplicate', () => {
      console.log('images:duplicate')
      console.log(this.getActiveImages)
    })

    // console.log('mounted')
    // console.log(this.$store.getters['activeImages/getImages'])
  },
  methods: {
    ...mapActions(
        {
          toggleImageActivity: 'activeImages/toggleImageActivity',
          addImage: 'activeImages/addImage'
        },
    ),
    boxFilteringImageOption(images) {
      this.addImages(boxFiltering(images))
    },
    addImages(images) {
      images.forEach(filteredImage => {
        this.addImage(filteredImage)
      })
    },
    unsharpMaskingImageOption(images) {
      this.addImages(unsharpMasking(images));
    },
    bilateralFilteringImageOption(images) {
      this.addImages(bilateralFiltering(images));
    },
    saltAndPepperImageOption(images) {
      this.addImages(saltAndPepper(images))
    }
  },
}
</script>
<style lang="scss">
.home {
  &__default-image {
    width: 400px;
    height: 400px;

    &.active {
      border: 1px solid black;
    }
  }

  &__image-wrapper {
    overflow-x: scroll;
  }
}
</style>