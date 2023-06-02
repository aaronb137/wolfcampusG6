<template>
  <ListingsFilterResell @add-book="openModal"></ListingsFilterResell>
  <BookListings></BookListings>
  <BookPost
    v-if="showModal"
    v-click-outside="closeModal"
    @add-book="openModal"
    @book-selected="selectedBook"
  ></BookPost>
  <CreateBookListing
    v-if="showOtherModal"
    v-click-outside="closeOtherModal"
    :selectedBook="bookData"
    @open-modal="openOtherModal"
    @close-other-modal="closeOtherModal"
  ></CreateBookListing>
  <nav-bar></nav-bar>
</template>

<script>
import BookListings from "@/components/Resell/BookListings.vue";
import BookPost from "@/components/Resell/BookPost.vue";
import ListingsFilterResell from "@/components/Resell/ListingsFilter.vue";
import CreateBookListing from "@/components/Resell/CreateBookListing.vue";

export default {
  name: "BookResellView",
  components: {
    BookListings,
    BookPost,
    ListingsFilterResell,
    CreateBookListing,
  },
  data() {
    return {
      showModal: false,
      bookData: null,
      showOtherModal: false,
    };
  },
  directives: {
    clickOutside: {
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
    openModal() {
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    openOtherModal() {
      this.showOtherModal = true;
    },
    closeOtherModal() {
      this.showOtherModal = false;
    },

    selectedBook(book) {
      this.bookData = book;
      console.log("Selected book in parent component:", book);
      this.showModal = false;
      this.showOtherModal = true;
    },
  },
};
</script>

<style scoped></style>
