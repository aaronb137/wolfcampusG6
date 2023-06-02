<template>
  <!-- Container for the dropdown and toolbar -->
  <v-container class="dropdowncontainer pa-2" fluid>
    <VToolbar class="toolbar">
      <!-- Title of the notes app -->
      <h1>Woof Notes</h1>

      <!-- Button to trigger the 'add-note' event -->
      <v-btn
        rounded="pill"
        prepend-icon="mdi-plus"
        @click="$emit('add-note')"
      >
        Create
      </v-btn>
    </VToolbar>
  </v-container>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ListingsFilterNotes",

  setup() {
    // A ref to control the open state of the dropdown (not used in this component)
    const isOpen = ref(false);

    return { isOpen };
  },
};
</script>

<style scoped>
.dropdowncontainer {
  background-color: white;
}

h1 {
  width: 60%;
  height: 80%;
  margin-left: 25%;
  
}
.toolbar {
  background-color: white;
}

.v-btn {
  background-color: #56a0ce;
 
  margin-top: 0%;

  text-align: center;
  
  
}
h1 {
  font-size: 2.5rem;
  font-weight: 500;
  text-align: center;
  color: black;
  
  width: 60%;
  height: 80%;
  margin-left: 25%;
}
</style>

