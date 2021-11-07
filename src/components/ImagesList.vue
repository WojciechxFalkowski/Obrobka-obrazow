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

            <svg @click="(e)=>addToActiveFiles(e,index)" class="icon images-list__add-icon"
                 xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g id="_8.add" data-name="8.add">
                <circle class="cls-1" cx="12" cy="12" r="11"/>
                <path class="cls-1" d="M12 6v12M18 12H6"/>
              </g>
            </svg>

          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import {convertImgToDataUrl} from "../imageOperations/imageOperations";

export default {
  name: "ImagesList.vue",
  props: ['uploadedImages', 'deleteUploadedImage'],
  data() {},
  methods: {
    ...mapActions({addModel: 'activeImages/addModel'}),
    addToActiveFiles(event, index) {
      const newImage = new Image();
      newImage.src = this.uploadedImages[index].path;
      this.addModel({...this.uploadedImages[index], imageData: convertImgToDataUrl(newImage)});
      event.target.classList.add('disabled')
    }
  }
}
</script>

<style lang="scss">
@import '../assets/scss/_variables.scss';

p {
  margin-bottom: unset;
}

.images-list {
  height: 100%;

  &__container {
    max-height: 70vh;
    overflow-y: scroll;
    height: calc(100% - 38px);
  }

  button {
    margin-top: 2rem;
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
    width: 1rem;
    cursor: pointer;
    margin: 0 10px;

    &:hover {
      opacity: 0.5;
    }
  }

  &__add-icon {
    & path, & circle {
      fill: none;
      stroke: #000;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-width: 2px;
    }

    &:hover {
      opacity: 1;

      & path, & circle {
        stroke: $turquoise;
      }
    }

    &.disabled {
      visibility: hidden;
    }

    & * {
      pointer-events: none;
    }
  }
}
</style>