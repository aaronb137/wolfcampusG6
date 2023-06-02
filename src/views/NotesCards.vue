<template>
  <!-- Import and display ListingsFilterNotes component with the add-note event handler -->
  <ListingsFilterNotes @add-note="openModal"></ListingsFilterNotes>
  <!-- Import and display NavBar component -->
  <nav-bar></nav-bar>
  <!-- Import and display AddNote component with the closeModal event handler and clickOutside directive -->
  <AddNote v-if="showModal" v-click-outside="closeModal" @close-modal="closeModal"></AddNote>
  <!-- Import and display NotesLists component -->
  <NotesLists></NotesLists>
</template>

<script>
import ListingsFilterNotes from "@/components/Notes/ListingsFilter.vue";
import NotesLists from "@/components/Notes/NotesLists.vue";
import AddNote from "@/components/Notes/AddNote.vue";

export default {
  name: "NotesView",
  components: {
    ListingsFilterNotes,
    NotesLists,
    AddNote,
  },

  data() {
    return {
      showModal: false, // Determines whether the AddNote modal is displayed
    };
  },

  directives: {
    clickOutside: {
      // Custom directive to handle clicks outside the target element
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },

  methods: {
    // Opens the AddNote modal
    openModal() {
      this.showModal = true;
    },
    // Closes the AddNote modal
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>

<style scoped>

</style>
