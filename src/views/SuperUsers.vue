<template>
    <NavBar></NavBar>
<super-nav-bar></super-nav-bar>
    <ModifyUser/>
  </template>
  
  <script>
 import ModifyUser from "@/components/SuperUser/modifyUser.vue";
 import NavBar from '@/globalcomponents/NavBar.vue';
  import SuperNavBar from '@/components/SuperUser/SuperNavBar.vue'
  
  export default {
    name: "SuperUsers",
    components: {
      SuperNavBar,
      NavBar,
    ModifyUser
},
  };
  </script>