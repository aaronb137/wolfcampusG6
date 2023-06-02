<template>
    <NavBar></NavBar>
<super-nav-bar></super-nav-bar>
    <modifyClass />
  </template>
  
  <script>
  import modifyClass from "@/components/SuperUser/modifyClass.vue";
  import NavBar from '@/globalcomponents/NavBar.vue';
  import SuperNavBar from '@/components/SuperUser/SuperNavBar.vue'
  
  export default {
    name: "SuperClass",
    components: {
      SuperNavBar,
      NavBar,
      modifyClass,
    },
  };
  </script>