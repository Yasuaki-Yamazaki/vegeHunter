import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import './localize'
import Amplify, * as AmplifyModules from 'aws-amplify'
import { AmplifyPlugin } from 'aws-amplify-vue'
import aws_exports from './aws-exports'
import { components } from 'aws-amplify-vue'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Amplify.configure(aws_exports)

Vue.use(AmplifyPlugin, AmplifyModules)

// ユーザーID(DB-PK)、クイズレベル格納
Vue.prototype.$userDataID = null;
Vue.prototype.$quizLevel = null;
Vue.prototype.$quizLv1Count = null;   // 「かんたん」のクイズ数
Vue.prototype.$quizLv2Count = null;   // 「むずかしい」のクイズ数

new Vue({
  router,
  store,

  components: { 
    App,
    ...components
  },

  vuetify,
  render: h => h(App)
}).$mount('#app')
