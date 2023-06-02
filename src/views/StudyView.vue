<template>
  <NavBar></NavBar>
  <StudyForm></StudyForm>
</template>

<script>
import StudyForm from "@/components/Study/StudyForm.vue";
import NavBar from "@/globalcomponents/NavBar.vue";

export default {
  name: "SuperClass",
  components: {
    NavBar,
    StudyForm
  },
};
</script>
