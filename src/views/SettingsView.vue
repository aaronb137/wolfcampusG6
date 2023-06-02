<template>
  <!-- Import and display NavBar component -->
  <navBar />
  <!-- Display the Settings header -->
  <h1>Settings</h1>
  <!-- Import and display SettingsForm component -->
  <SettingsForm />
</template>

<script>
import SettingsForm from "@/components/SettingsStuff/SettingsForm.vue";
import navBar from "@/globalcomponents/NavBar.vue";

export default {
  name: "SettingsView",
  components: {
    SettingsForm, // Register the SettingsForm component
    navBar,       // Register the navBar component
  },
  setup() {
    return {
      // No reactive properties needed for this component
    };
  },
};
</script>
<style scoped>
h1 {
    text-align: center;
}
</style>
