import { createApp } from 'vue'
import { globalRegister } from './global'
import 'normalize.css'
import './assets/css/index.less'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import App from './App.vue'

// import ElementPlus from 'element-plus'
// import 'element-plus/dist/index.css'

import router from './router'
import store from './store'
import { setupStore } from './store'
// import myRequest from './service'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// globalRegister(app)
// 源码内部也会传过来app
// app.use(function(app:App){

// })
// app.use({
//   install: function(app:Appp) {

//   }
// })
app.use(globalRegister)
app.use(store)
setupStore()
// path: /user => user
app.use(router)

// app.use(ElementPlus)

// myRequest.request({
//   url: '/home/multidata',
//   method: 'GET'
//   // showLoading: true
// })

// interface DataType {
//   data: any
//   returnCode: string
//   success: boolean
// }

// myRequest
//   .request<DataType>({
//     url: '/home/multidata',
//     method: 'GET',
//     showLoading: false
//   })
//   .then((res) => {
//     console.log(res.data)
//     console.log(res.returnCode)
//     console.log(res.success)
//   })
// myRequest.request({
//   url: '/home/multidata',
//   method: 'GET',
//   interceptors: {
//     requestInterceptor: (config) => {
//       console.log('单独请求的config')
//       return config
//     },
//     responseInterceptor: (res) => {
//       console.log('单独响应的response')
//       return res
//     }
//   }
// })

app.mount('#app')
