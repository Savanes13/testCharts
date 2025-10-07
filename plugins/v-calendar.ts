import { defineNuxtPlugin } from '#app'
import VCalendar from 'v-calendar'
import '@popperjs/core'
import 'v-calendar/dist/style.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VCalendar, {})
})