import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Vuex from 'vuex'
import store from './store/index'
Vue.config.productionTip = false
// import "@/assets/scss/custom-bootstrap.scss"
Vue.use(Vuex);

// const store = new Vuex.Store({
//     state: {
//         count: 0
//     },
//     mutations: {
//         increment (state) {
//             state.count++
//         }
//     }
// })

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
