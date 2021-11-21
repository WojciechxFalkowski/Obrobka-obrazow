// initial state
// const imageModel = {
//     defaultImage: '',
//     activeImages: [],
//     customImages: []
// }
// import {convertImgToDataUrl} from "../../imageOperations/imageOperations";

const state = () => ({
  imagesCollection: []
})

// getters
const getters = {
  getImages: (state) => {
    return state.imagesCollection
  },
  getActiveImages: (state) => {
    const activeImages = []
    state.imagesCollection.forEach(imageModel => {
      activeImages.push(...imageModel.images.filter(image => image.isActive))
    })
    return activeImages
  },
  getActiveImage: (state) => {
    const activeImages = []
    state.imagesCollection.forEach(imageModel => {
      activeImages.push(...imageModel.images.filter(image => image.isActive))
    })

    if (activeImages.length > 0) {
      // Find newest photo by timestamp
      const newestActiveImageTimestamp = activeImages.reduce((maxTimestamp, image) => image.timestamp > maxTimestamp
        ? image.timestamp : maxTimestamp, activeImages[0].timestamp);

      return activeImages.find(image => image.timestamp === newestActiveImageTimestamp)
    } else {
      console.log(':(')
      console.log(activeImages.length)
    }
  }

}

// actions
const actions = {
  addImage ({ commit }, image) {
    commit('addImage', image)
  },
  addModel ({ commit }, image) {
    commit('addModel', image)
  },
  toggleImageActivity ({ commit }, { modelId, imageId }) {
    commit('toggleImageActivity', { modelId, imageId })
  }
}

// mutations
const mutations = {
  addImage (state, image) {
    const imageModel = state.imagesCollection.find(imageModel => imageModel.id === image.modelId);

    imageModel.images.push({
      id: imageModel.images.length,
      modelId: image.modelId,
      isActive: false,
      ...image
    })
  },
  addModel (state, image) {
    state.imagesCollection.push({
      id: state.imagesCollection.length,
      images: [
        {
          ...image,
          id: 0,
          modelId: state.imagesCollection.length,
          isActive: false
        }
      ]
    })
  },
  toggleImageActivity (state, { modelId, imageId }) {
    const activeModel = state.imagesCollection.find(imageModel => imageModel.id === modelId);
    const activeImage = activeModel.images.find(image => image.id === imageId);
    activeImage.isActive = !activeImage.isActive;
    if (activeImage.isActive) {
      activeImage.timestamp = (new Date()).getTime()
    } else {
      activeImage.timestamp = null;
    }
  }
}


export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}