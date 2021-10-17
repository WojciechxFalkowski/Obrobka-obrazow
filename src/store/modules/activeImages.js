// initial state
// const imageModel = {
//     defaultImage: '',
//     activeImages: [],
//     customImages: []
// }
const state = () => ({
    imagesCollection: []
})

// getters
const getters = {
    getImages: (state) => {
        return state.imagesCollection
    }
}

// mutations
const mutations = {
    addImage(state, {modelId, image}) {
        const imageModel = state.imagesCollection.find(imageModel => imageModel.id === modelId);

        imageModel.images.push({
            id: imageModel.images.length,
            isActive: false,
            ...image
        })
    },
    addModel(state, image) {
        state.imagesCollection.push({
            id: state.imagesCollection.length,
            images: [{
                id: 0,
                isActive: false,
                ...image
            }],
        })
    },
    toggleImageActivity(state, {modelId, imageId}) {
        const activeModel = state.imagesCollection.find(imageModel => imageModel.id === modelId);
        const activeImage = activeModel.images.find(image => image.id === imageId);

        activeImage.isActive = !activeImage.isActive;
    },
}

// actions
const actions = {
    addImage({commit}, {modelId, image}) {
        commit('addImage', {modelId, image})
    },
    addModel({commit}, image) {
        commit('addModel', image)
    },
    toggleImageActivity({commit}, {modelId, imageId}) {
        commit('toggleImageActivity', {modelId, imageId})
    },
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}