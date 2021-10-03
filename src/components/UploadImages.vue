<template>
  <div class="upload-images">
    <div class="upload-images__icon-wrapper">
      <img class="upload-images__icon" src="./../assets/img/upload.svg" alt="">
      <p class="mt-2 fw-bold text-uppercase text-purple">Przeciągnij pliki do dodania</p>
    </div>

    <!--    <input @change="previewFiles" ref="imageRef" id="fileContents" type="file" multiple class="">-->
    <button class="upload-images__btn" @click="handleOpenDialog">Dodaj plik</button>
  </div>
</template>

<script>

export default {
  name: "UploadImages",
  props: ['handleOpenDialog'],
  methods: {
    previewFiles(event) {
      console.log(event.target.files);
      this.images = Object.values(event.target.files)
      console.log(Object.values(event.target.files));
      console.log(typeof event.target.files[0]);
      // event.target.files.forEach(file=>{
      //   console.log(file)
      // })
    },
  }
}
</script>

<style lang="scss">
.upload-images {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  //background-color: yellow;
  flex-direction: column;
  min-height: 80vh;

  &__icon {
    height: 100px;
  }

  &__btn {
    border: none;
    outline: none;
    padding: 6px 12px;
    font-size: 12px;
    text-transform: uppercase;
    background-color: #d056e6;
    color: #fff;
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
  }
}


</style>