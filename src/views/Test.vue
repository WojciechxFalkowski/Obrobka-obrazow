<template>
  <div class="home d-flex flex-column">
    <div class="mb-4">
      <button class="btn btn-primary" @click="boxFilteringImageOption(getImagesCollection)">Box filtering</button>
      <button class="btn btn-primary" @click="unsharpMaskingImageOption(getImagesCollection)">Unsharp masking</button>
      <!--      <button class="btn btn-primary" @click="bilateralFilteringImageOption(getImagesCollection)">Bilateral filtering</button>-->
      <button class="btn btn-primary" @click="saltAndPepperImageOption(getImagesCollection)">SaltAndPepper</button>
      <button class="btn btn-primary" @click="testClick">SaltAndPepper</button>
      <button class="btn btn-primary" @click="testClickA">Test a</button>
      <button class="btn btn-primary" @click="testClickB">Test b</button>
      <button class="btn btn-primary" @click="testClickC">Test c</button>
      <button class="btn btn-primary" @click="testClickD">Test d</button>
      <button class="btn btn-primary" @click="testClickE">TestRoute histogram</button>

    </div>
    <!--    src="C:\Users\48698\OneDrive\Documents\skill\projects\apo_wojciech_falkowski\dist_electron\uploads\blog_img_1-desktop.jpg"-->
    <!--    ref="defaultImageRef"-->

    <div class="container-fluid">
      <div class="row pb-5" v-for="imageModel of getImagesCollection" :key="imageModel.id">
        <div class="col-8 d-flex home__image-wrapper pb-2" ref="imageWrapperRef">
          <img :key="image.id" v-for="image of imageModel.images" :class="image.isActive?'active':''"
               @click="toggleImageActivity({modelId:imageModel.id,imageId:image.id})"
               :src="image.imageDataURL?image.imageDataURL:image.path"
               :data-title="image.id"
               class="home__default-image p-2" alt="img"
               id="canvasInput" width="512" height="512"/>
        </div>
        <div class="col-4 bg-info">
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
import ImageStatistics from "./../components/ImageStatistics"
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
    ImageStatistics
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
    // window.customAPI.ipcRenderer.customOn('images:duplicate', () => {
    //   console.log('images:duplicate')
    //   console.log(this.getActiveImages)
    // })
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
    testClick(){
      // console.log('testClick')
      // window.customAPI.ipcRenderer.send('asynchronous-message', {a:'abc',id:21,text:'createNewWindow'});
      // console.log(window.customAPI)
      // window.customAPI.ipcRenderer.invoke('asynchronous-reply', (event, arg) => {
      //   console.log(arg) // prints "pong"
      // })

      window.customAPI.ipcRenderer.send('logged-in',2)
      // window.customAPI.ipcRenderer.send('app:on-file-delete', {filepath}).then(() => {
      //   this.getUploadedFiles()
      // });
    },
    testClickA(){
      window.customAPI.ipcRenderer.send('logged-in',null)

    },
    testClickB(){
      window.customAPI.ipcRenderer.send('logged-in',2)

    },
    testClickC(){
      window.customAPI.ipcRenderer.send('logged-in',5)
    },
    testClickD(){
      window.customAPI.ipcRenderer.send('logged-in',1)
    },
    testClickE(){
      this.$router.push('/stretch-histogram')
    },
    getImageData(img) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
      return context.getImageData(0, 0, img.width, img.height);
    },
    boxFilteringImageOption(images) {
      this.addImages(boxFiltering(images))
    },
    addImages(images) {
      images.forEach(filteredImage => {
        this.addImage(filteredImage)
      })
    },
    // convertToCanvas(dst, imageId) {
    //   const canvas = document.createElement('canvas');
    //   const ctx = canvas.getContext('2d');
    //   canvas.id = imageId;
    //   canvas.width = dst.cols;
    //   canvas.height = dst.rows;
    //   /**
    //    * https://stackoverflow.com/questions/38556730/imagedata-byte-length-is-not-a-multiple-of-4-width
    //    * 4 * width * height
    //    * @type {Uint8ClampedArray}
    //    */
    //       // const uint = new Uint8ClampedArray(dst.data, dst.cols, dst.rows);
    //   const uint = new Uint8ClampedArray(dst.data, dst.cols, dst.rows);
    //   const imgData = new ImageData(uint, dst.cols);
    //
    //   ctx.putImageData(imgData, 0, 0)
    //   return canvas;
    // },
    // convertToImage(imagePath) {
    //   const newImage = document.createElement("img"); // create img tag
    //   newImage.src = imagePath;
    //
    //   return newImage;
    // },
    // async toImg(canvas){
    //   const blob = await new Promise(
    //       (resolve) => canvas.toBlob(blob => resolve(blob), "image/jpg", 0.8)
    //   );
    //   const buffer = new Buffer(await blob.arrayBuffer());
    // },
    unsharpMaskingImageOption(images) {
      console.log('images')
      console.log(images)
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

</style>