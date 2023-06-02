<template>
  <!-- Define a container with toolbar and button for creating new book listings -->
  <v-container class="dropdowncontainer pa-2" fluid>
    <VToolbar class="toolbar">
      <!-- Add a title for the page -->
      <h1>Woof Books</h1>
      <!-- Add a button for creating new book listings -->
      <v-btn
        rounded="pill"
        prepend-icon="mdi-plus"
        @click="$emit('add-book')"
      >
        Create
      </v-btn>
    </VToolbar>
  </v-container>
</template>

<script>
import { ref } from "vue";

export default {
  name: "ListingsFilterResell",

  setup() {
    // Define a reactive variable for controlling the opening state of the component
    const isOpen = ref(false);

    // Expose the isOpen variable to the template
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
  background-color: white;
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
}
</style>
