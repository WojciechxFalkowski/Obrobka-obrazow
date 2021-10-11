<template>
  <div class="images-list">
    <ul class="list-group images-list__container">
      <li
          class="list-group-item images-list__item d-flex justify-content-between align-items-center"
          v-for="(uploadedImage,index) of uploadedImages"
          :key="index">
        <img class="img-thumbnail" :src="uploadedImage.path" :alt="uploadedImage.name">

        <div class="images-list__wrapper">
          <div class="images-list__description">
            <p class="fw-bold">{{ uploadedImage.name }}</p>
            <p>{{ uploadedImage.size.number }} <span class="text-uppercase">{{ uploadedImage.size.unit }}</span></p>
          </div>

          <div>
            <img @click="deleteUploadedImage(uploadedImage.path)" class="icon" src="./../assets/img/delete.svg"
                 alt="delete document icon">
            <img class="icon" src="./../assets/img/open.svg" alt="open document icon">
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ImagesList.vue",
  props: ['uploadedImages', 'deleteUploadedImage'],
  data() {
    return {
      helloWorld: 'Hello World'
    }
  },
  methods: {
    handleClick() {
      console.log('clicked')
      console.log(this)
      console.log(this.$router)
      console.log(this.$route)
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss">
p {
  margin-bottom: unset;
}

.images-list {
  height: 100%;

  &__container {
    max-height: 80vh;
    overflow-y: scroll;
    height: 100%;
  }

  //&__item:hover {
  //  opacity: 0.5;
  //  cursor: pointer;
  //}

  .img-thumbnail {
    height: 80px;
    max-width: 30%;
  }

  &__wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-basis: 70%;
  }

  &__description {
    text-align: left;
  }

  .icon {
    width: 16px;
    cursor: pointer;
    margin: 0 10px;
  }
}
</style>