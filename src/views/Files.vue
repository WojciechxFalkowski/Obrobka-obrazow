<template>
  <div class="container">
    <div class="row">
      <h1 class="col-12">Pliki</h1>

      <div class="col-5">
        <UploadImages :handle-open-dialog="openDialog" handle-add-files="addFiles"/>
        <!--        <button @click="readFile" ref="btnCreate" class="btn btn-default">Create</button>-->
        <!--        <button @click="testFunction" ref="btnRead" class="btn btn-default">Read</button>-->
        <!--        <button ref="btnDelete" class="btn btn-default">Delete</button>-->

        <!--    <div :style="{height:'500px',width:'500px',backgroundColor:'rgba(0,0,0,0.1)'}">-->
        <!--      <img v-if="images.length>0" :src="images[0].path" alt="">-->
        <!--    </div>-->

        <!--        <img v-for="(image,index) of getImages" :key="index" :src="image.path" alt="">-->
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
    readFile() {
      console.log('readFile')

      console.log('pathname');
      // console.log(window.customAPI.file.getFiles())
      // console.log(window.customAPI);
      // console.log(window.customAPI.file.getFiles())

      // ask backend to read file
      // const path = "C:\\Users\\48698\\OneDrive\\Documents\\skill\\projects\\apo_wojciech_falkowski\\public\\images";
      // console.log(this.$refs.imageRef)
      // const payload = {path};
      // window.ipc.send('READ_FILE', payload);
    },
    previewFiles(event) {
      console.log(event.target.files);
      this.images = Object.values(event.target.files)
      console.log(Object.values(event.target.files));
      console.log(typeof event.target.files[0]);
      // event.target.files.forEach(file=>{
      //   console.log(file)
      // })
    },
    deleteUploadedImage(filepath) {
      window.customAPI.ipcRenderer.invoke('app:on-file-delete', {filepath}).then(() => {
        this.getUploadedFiles()
      });
    },
    getUploadedFiles() {
      window.customAPI.ipcRenderer.invoke('app:get-files').then((files = []) => {
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
    testFunction() {
      console.log(window)
      // const payload = {
      //   value:'ping'
      // }
      // console.log(window.ipc.send('TEST_IPC-MAIN',payload));

      // window.ipc.invoke('some-name', someArgument).then((result) => {
      //   // ...
      // })

    }

  },
}
</script>
