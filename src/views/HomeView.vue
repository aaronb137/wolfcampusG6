<template>
  <div>
    <!-- Import and display DashboardFriends component -->
    <DashboardFriends />
    <!-- Import and display AddClass component with the closeModal event handler and clickOutside directive -->
    <AddClass class="addclass" v-if="showModal" @close-modal="closeModal" v-click-outside="closeModal"></AddClass>
    <!-- Import and display MyClasses component with the add-class event handler -->
    <MyClasses @add-class="openModal"></MyClasses>
    <!-- Import and display ProfileAvatar component -->
    <ProfileAvatar />
    <!-- Import and display WallPost component -->
    <WallPost />
    <!-- Import and display NavBar component -->
    <nav-bar></nav-bar>
    <!-- Import and display WolfFeed component -->
    <WolfFeed />
  </div>
</template>

<script>
import DashboardFriends from "@/components/Dashboard/DashboardFriends.vue";
import MyClasses from "@/components/Dashboard/MyClasses.vue";
import ProfileAvatar from "@/components/Dashboard/ProfileAvatar.vue";
import WallPost from "@/components/Dashboard/WallPost.vue";
import WolfFeed from "@/components/Dashboard/WolfFeed.vue";
import AddClass from "@/components/Dashboard/AddClass.vue";

export default {
  name: "HomeView",
  components: {
    DashboardFriends,
    MyClasses,
    ProfileAvatar,
    WallPost,
    WolfFeed,
    AddClass
  },
  data() {
    return {
      showModal: false, // Determines whether the AddClass modal is displayed
    };
  },
  directives: {
    clickOutside: {
      // Custom directive to handle clicks outside the target element
      bind(el, binding, vnode) {
        el.clickOutsideEvent = function(event) {
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
    // Opens the AddClass modal
    openModal() {
      this.showModal = true;
    },
    // Closes the AddClass modal
    closeModal() {
      this.showModal = false;
    },
  },
};
</script>


<style scoped>
body {
  background-color: #fdf0d5;
}


</style>
