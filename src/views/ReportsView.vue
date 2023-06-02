<template>
  <NavBar></NavBar>
<super-nav-bar></super-nav-bar>
    <ReviewReports />
  </template>
  
  <script>
import ReviewReports from "@/components/SuperUser/reviewReportnew.vue";
import NavBar from '@/globalcomponents/NavBar.vue';
import SuperNavBar from '@/components/SuperUser/SuperNavBar.vue'
  
  export default {
    name: "SuperClass",
    components: {
    SuperNavBar,
    NavBar,
    ReviewReports
},
  };
  </script>