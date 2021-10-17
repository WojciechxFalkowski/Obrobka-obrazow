import Vue from 'vue'
import Vuex from 'vuex'
import activeImages from './modules/activeImages'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    modules: {
        activeImages,
    },
    strict: debug,
})