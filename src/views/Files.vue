<template>
  <div class="container">
    <div class="row">
      <h1 class="col-12">Pliki</h1>

      <div class="col-5">
        <UploadImages :handle-open-dialog="openDialog" :handle-add-files="addFiles"/>
      </div>

      <div class="col-7">
        <ImagesList :uploadedImages="uploadedImages" :delete-uploaded-image="deleteUploadedImage"/>
      </div>
    </div>

  </div>
</template>
<script>

import ImagesList from "../components/ImagesList";
import UploadImages from "../components/UploadImages";

export default {
  name: 'About',
  components: {
    ImagesList,
    UploadImages
  },
  data() {
    return {
      uploadedImages: []
    }
  },
  mounted() {
    this.getUploadedFiles()
  },
  computed: {
    getImages() {
      return this.uploadedImages
    }
  },

  methods: {
    sortImages(images) {
      return images.sort((a, b) => {
        return a.name - b.name
      });
    },
    previewFiles(event) {
      this.images = Object.values(event.target.files)
      // console.log(Object.values(event.target.files));
      // console.log(typeof event.target.files[0]);
    },
    deleteUploadedImage(filepath) {
      window.customAPI.ipcRenderer.invoke('app:on-file-delete', {filepath}).then(() => {
        this.getUploadedFiles()
      });
    },
    getUploadedFiles() {
      window.customAPI.ipcRenderer.invoke('app:get-files').then((files = []) => {
        // console.log(files)
        this.uploadedImages = this.sortImages(files)
      });
    },
    openDialog() {
      window.customAPI.ipcRenderer.invoke('app:on-fs-dialog-open').then(() => {
        this.getUploadedFiles()
      });
    },
    addFiles(files) {
      window.customAPI.ipcRenderer.invoke('app:on-file-add', files).then(() => {
        this.getUploadedFiles()
      });
    },
  },
}
</script>
