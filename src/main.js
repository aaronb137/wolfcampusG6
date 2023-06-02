import '@babel/polyfill'
import 'mutationobserver-shim'
import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import { createRouter, createWebHistory } from 'vue-router'
// import {  getAuth } from "firebase/auth"
import { getCurrentUser } from '@/firebase'
// import { auth } from "./firebase"; // adjust the path to your Firebase configuration file

loadFonts()

import BookResellView from './views/BookResellView.vue'
import ProfileView from './views/ProfileView.vue'
import HomeView from './views/HomeView.vue'
import AboutViewVue from './views/AboutView.vue'
import WelcomeView from './views/WelcomeView.vue'
import ExplorePage from './views/ExplorePage.vue'
import NotesView from './views/NotesCards.vue'
import FilterMenu from './globalcomponents/ListingsFilter.vue'
import NavBarVue from './globalcomponents/NavBar.vue'
import ListingsFilter from './globalcomponents/ListingsFilter.vue'
import SettingsView from './views/SettingsView.vue'
import ClassPage from './views/ClassPage.vue'
import SuperClass from './views/SuperClass.vue'
import SuperUsers from './views/SuperUsers.vue'
import ReportsView from './views/ReportsView.vue'
import SuperNavBar from './components/SuperUser/SuperNavBar.vue'
import noPermitsVue from './globalcomponents/noPermits.vue'
import StudyView from './views/StudyView.vue'

import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:3000",
  timeout: 1000
});

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/bookresell', component:BookResellView, meta: {requiresAuth:true} },
    { path: '/home', component: HomeView, meta: {requiresAuth:true}  },
    { path: '/about', component: AboutViewVue, meta: {requiresAuth:true}  },
    { path: '/', component: WelcomeView },
    { path: '/explore', component: ExplorePage, meta: {requiresAuth:true}},
    { path: '/notes', component: NotesView, meta: {requiresAuth:true}  },
    { path: '/settings', component: SettingsView, meta: {requiresAuth:true} },
    { path: '/user/:username', component: ProfileView, meta: {requiresAuth: true}},
    { path: '/classes/:classPrefix([A-Z]{2,4}):classNumber(\\d+)', component: ClassPage, meta: {requiresAuth: true} },
    {path : '/modifclass', component: SuperClass, meta: {requiresAuth: true}},
    {path: '/modifuser', component: SuperUsers, meta: {requiresAuth: true}},
    {path: '/reports', component: ReportsView, meta: {requiresAuth: true}},
    {path: '/nopermits', component: noPermitsVue},
    {path: '/study', component: StudyView}
  ]
});

// const auth = getAuth();

router.beforeEach(async (to) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  if (requiresAuth && !await getCurrentUser()) {
    return '/nopermits';
  } 
})

createApp(App)
  .use(router)
  .use(vuetify)
  .component('filter-menu', FilterMenu)
  .component('nav-bar', NavBarVue) 
  .component('listings-filter', ListingsFilter)
  .component('super-nav-nar', SuperNavBar)
  .mount('#app')