<template>
  <div class="home d-flex flex-column">
    <div class="mb-4">
    </div>

    <div class="container-fluid">
      <div class="row pb-5" v-for="imageModel of getImagesCollection" :key="imageModel.id">
        <div class="col-6 d-flex home__image-wrapper pb-2" ref="imageWrapperRef">
          <img :key="image.id" v-for="image of imageModel.images"
               :class="image.isActive?'active':''"
               @click="toggleImage(imageModel.id,image.id)"
               :src="image.imageDataURL?image.imageDataURL:image.path"
               :data-title="image.id"
               class="home__default-image p-2" alt="img"
               :id="'image_'+imageModel.id+'_'+image.id" />
        </div>
        <div class="col-6">
          <div class="image-histogram">
            <ImageStatistics
              v-for="activeImage of imageModel.images.filter(image => image.isActive)"
              :imageId="'image_'+imageModel.id+'_'+activeImage.id"
              :imageModelId="imageModel.id" :activeImage="activeImage"
              :key="activeImage.id" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ImageStatistics from './../components/ImageStatistics'
import { mapActions, mapGetters } from 'vuex';
import {
  boxFiltering,
  unsharpMasking,
  bilateralFiltering,
  saltAndPepper
} from '../imageOperations/imageOperations'
import { MENU_IMAGE_SAVE, MENU_IMAGE_DUPLICATE } from '@/contracts/menu'

export default {
  name: 'Home',
  components: {
    ImageStatistics
  },
  data () {
    return {
      imageUrl: null,
      images: []
    }
  },
  computed: {
    ...mapGetters({
      getImagesCollection: 'activeImages/getImages',
      getActiveImages: 'activeImages/getActiveImages'
    })
  },
  mounted () {
    // console.log('imageModel.images')
    // console.log(this.getImagesCollection)
    window.customAPI.ipcRenderer.customOn(MENU_IMAGE_DUPLICATE, () => {
      this.getActiveImages.forEach(activeImage => {
        this.addModel(activeImage);
      })
    })
    window.customAPI.ipcRenderer.customOn(MENU_IMAGE_SAVE, () => {
      // console.log('save image in rendered process')
      // console.log(this.getActiveImages);
      window.customAPI.ipcRenderer.send('app:save-image', this.getActiveImages);
    })
  },
  beforeDestroy () {
    window.customAPI.ipcRenderer.customRemoveAllListeners('images:duplicate')
    window.customAPI.ipcRenderer.customRemoveAllListeners(MENU_IMAGE_SAVE)
  },
  methods: {
    ...mapActions(
      {
        addModel: 'activeImages/addModel',
        toggleImageActivity: 'activeImages/toggleImageActivity',
        addImage: 'activeImages/addImage'
      }
    ),
    toggleImage(modelId,imageId){
      this.toggleImageActivity({modelId,imageId})
      // console.log('getActiveImages')
      // console.log(this.getActiveImages.length)
      window.customAPI.ipcRenderer.send('app:on-active-images-change',this.getActiveImages.length)
    },
    boxFilteringImageOption (images) {
      this.addImages(boxFiltering(images))
    },
    addImages (images) {
      images.forEach(filteredImage => {
        this.addImage(filteredImage)
      })
    },
    unsharpMaskingImageOption (images) {
      this.addImages(unsharpMasking(images));
    },
    bilateralFilteringImageOption (images) {
      this.addImages(bilateralFiltering(images));
    },
    saltAndPepperImageOption (images) {
      this.addImages(saltAndPepper(images))
    }
  }
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

.image-histogram {
  display: flex;
  height: 100%;
  //overflow-x: scroll;
}
</style>