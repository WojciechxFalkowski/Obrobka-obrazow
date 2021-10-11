<template>
  <div @dragover="dragover" @dragleave="dragleave" @drop="drop" class="upload-images">
    <div class="upload-images__icon-wrapper">
      <img class="upload-images__icon" src="./../assets/img/upload.svg" alt="">
      <p class="mt-2 fw-bold text-uppercase text-purple">Przeciągnij pliki do dodania</p>
    </div>

    <button class="upload-images__btn" @click="handleOpenDialog">Dodaj plik</button>
  </div>
</template>

<script>


export default {
  name: "UploadImages",
  props: ['handleOpenDialog', 'handleAddFiles'],
  methods: {
    dragover(event) {
      event.preventDefault();
      // Add some visual fluff to show the user can drop its files
      if (!event.currentTarget.classList.contains('bg-green-300')) {
        event.currentTarget.classList.remove('bg-gray-100');
        event.currentTarget.classList.add('bg-green-300');
      }
    },
    dragleave(event) {
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
    },
    drop(event) {
      event.preventDefault();
      const fileList = event.dataTransfer.files
      event.currentTarget.classList.add('bg-gray-100');
      event.currentTarget.classList.remove('bg-green-300');
      const files = []
      for (const [, value] of Object.entries(fileList)) {
        files.push({
          name: value.name,
          path: value.path
        })
      }
      this.handleAddFiles(files)
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