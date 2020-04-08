import Vue from 'vue'
import App from './App.vue'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'

// 简单使用axios
import axios from '@/api'

// 使用自己的插件
import plugin from '@/plugin'

import '@/styles/index.less'

Vue.use(plugin)

Vue.prototype.$http = axios

Vue.use(elementUI)
// 日志的详细与否，生产环境  开发环境
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
