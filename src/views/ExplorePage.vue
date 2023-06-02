<template>
  <v-app class="app">
    <v-main>
      <NavBar />

      
      <ExploreBanner @exploreFeed="displayExplore" @forYouFeed="displayForYou" @new-post="openModal"/>
      <ExplorePost class="newPost" v-if="showModal" @cancel-post="closeModal"></ExplorePost>
      <v-row>
        <v-col class="post-col" xs="12" md="8" v-if="
          !forYou">
          <PostComp />
        </v-col>

        <v-col class="post-col" xs="12" md="8" v-if="forYou">
          <ForYou />
        </v-col>
        <v-spacer md="1" />
        <v-col class="wall-col" xs="12" md="4" style="padding-right: 2rem;">
          <WallCards />
        </v-col>
        

      </v-row>
    </v-main>
  </v-app>
</template>
  
<script>
import NavBar from "@/globalcomponents/NavBar.vue"
import WallCards from "../components/Explore/WallCards.vue"
import PostComp from "../components/Explore/PostComp.vue"
import ExploreBanner from "@/components/Explore/ExploreBanner.vue";
import ForYou from "@/components/Explore/ForYou.vue"
import ExplorePost from "@/components/Explore/ExplorePost.vue";
export default {
  name: "App",
  components: {
    PostComp,
    WallCards,
    NavBar,
    ExploreBanner,
    ForYou,
    ExplorePost
  },
  data() {
    return {
      forYou: false,
      showModal: false
    };
  },
  directives: {
    clickOutside: {
      bind(el, binding, vnode) {
  el.clickOutsideEvent = function (event) {
    // Check if the event target is not the 'v-select' component or any of its children
    if (
      !(el == event.target || el.contains(event.target)) &&
      !event.target.closest(".v-select")
    ) {
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
    displayExplore() {
      this.forYou = false;
    }, 
    displayForYou() {
      this.forYou = true;
    },
  },
};
</script>