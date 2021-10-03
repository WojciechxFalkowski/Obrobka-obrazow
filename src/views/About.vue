<template>
  <div class="crud-file">
    <h1>CRUD FILE</h1>
    <!--    <form>-->
    <!--      <div class="form-group">-->
    <!--        <label>File name</label>-->
    <!--        <input id="fileName" type="text" class="form-control">-->
    <!--      </div>-->
    <!--      <div class="form-group">-->
    <!--        <label>Contents</label>-->
    <!--        <textarea id="fileContents" class="form-control" rows="5"></textarea>-->
    <!--      </div>-->
    <!--    </form>-->
    <form action="form-floating">
      <!--      <div class="form-floating mb-3">-->
      <!--        <input id="fileName" type="text" class="form-control" placeholder="File name">-->
      <!--        <label for="fileName">File name</label>-->
      <!--      </div>-->

      <!--      <div class="form-floating">-->
      <!--        <input id="fileContents" type="text" class="form-control" placeholder="Contents">-->
      <!--        <label for="fileContents">Contents</label>-->
      <!--      </div>-->

      <!--            <div class="form-floating">-->
      <input @change="previewFiles" ref="imageRef" id="fileContents" type="file" multiple class=""
             placeholder="Contents">
      <!--            </div>-->
    </form>
    <button @click="readFile" ref="btnCreate" class="btn btn-default">Create</button>
    <button @click="testFunction" ref="btnRead" class="btn btn-default">Read</button>
    <button ref="btnDelete" class="btn btn-default">Delete</button>

    <div :style="{height:'500px',width:'500px',backgroundColor:'rgba(0,0,0,0.1)'}">
      <img v-if="images.length>0" :src="images[0].path" alt="">
    </div>

    <img v-for="(image,index) of getImages" :key="index" :src="image.path" alt="">

  </div>
</template>
<script>

export default {
  name: 'About',
  data() {
    return {
      images: []
    }
  },
  mounted() {
    console.log('mounted')
    window.customAPI.ipcRenderer.invoke('app:get-files').then((files = []) => {
      console.log(files)
      this.images = [...files]
    });

  },
  computed: {
    getImages() {
      return this.images;
    }
  },

  methods: {
    addFiles() {

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
