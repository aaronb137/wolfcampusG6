// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'


// Vuetify
import { createVuetify } from 'vuetify'

// export default createVuetify(
//   // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// )
// import { createApp } from 'vue'
// import { createVuetify } from 'vuetify'

const myCustomTheme = {
  dark: false,
  colors: {
    background: '#e0e1dd',
    surface: '#ffffff',
    primary: '#55a7da',
    'primary-darken-1': '#3700B3',
    secondary: '#669bbc',
    'black': '#00000',
    error: 'B41919',
    info: '#2196F3',
    login: '#669bbc',
    warning: '#FB8C00',
  }
}

export default createVuetify({
  theme: {
    defaultTheme:'myCustomTheme',
    themes: {
      myCustomTheme,
    }
  }
  // theme: false,
})

// export default createVuetify({
//   theme: {
//     defaultTheme: 'dark'
//   }
// })