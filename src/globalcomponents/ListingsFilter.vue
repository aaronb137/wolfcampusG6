<template>
  <v-container class="dropdowncontainer pa-2" fluid>
    <VToolbar class="toolbar">
      <v-btn
      rounded="pill"
     
      prepend-icon="mdi-pencil-outline"
      
    >Edit</v-btn>
      
      <VAutocomplete
        :items="['HIST 310', 'CS 135', 'BIOL 191', 'CPE 301']"
        label="Classes"
        class="dropdown"
        clearable="true"
      ></VAutocomplete>

      <VAutocomplete
        :items="[
          'History of the World Map by Map',
          'The C++ Programming Language',
          'Campbell Biology 12th Edition',
          'Mega 2560 Complete Starter Kit',
        ]"
        filled
        label="Books"
        class="dropdown"
        clearable="true"
      ></VAutocomplete
    >
    <v-btn
      rounded="pill"
      prepend-icon="mdi-plus"
      @click="isOpen = true"
    >Create</v-btn>
  </VToolbar>
  
 <!-- <v-text-field class="searchbar"></v-text-field>-->
  </v-container>

  <BookPost :open="isOpen" @close="isOpen = !isOpen">

  </BookPost>
</template>

<script>
import BookPost from "../components/Resell/BookPost.vue";
import { ref } from "vue";


export default {
  name: "ListingsFilter",
  components: {BookPost},

  setup() {
    const isOpen = ref(false)

    return { isOpen }
  }
};
</script>

<style scoped>
.dropdowncontainer {
  background-color: #166088;
  
}

.dropdown {
  margin: 1%;
  background-color: #dbe9ee;
}

.toolbar {
  width: 50%;
  height: 80%;
  margin: auto;
  background-color: #166088;
}

.v-btn {
  background-color: #c0d6df;
  height: 60%;

}



</style>
