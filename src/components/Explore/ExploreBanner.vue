<template>
  <!--Developed by Clint Vega
This component is used to display the 'FOR YOU', 'EXPLORE', and 'NEW POST' buttons on the explore page.-->
  <v-banner :sticky="true" lines="three" height="65px" class="no-border">

    <!--If 'For You' button is clicked, emit forYou event to parent so that For You feed is displayed -->
    <v-btn :class="{ 'active': activeButton === 'forYou' }" class="banner-button ml-16" color="Black" elevation="0"
      @click="activateButton('forYou'); $emit('forYouFeed')">
      <h1>For You</h1>
    </v-btn>
    <!--If 'For You' button is clicked, emit forYou event to parent so that Explore feed is displayed -->
    <v-btn :class="{ 'active': activeButton === 'explore' }" class="banner-button ml-16" color="Black" elevation="0"
      @click="activateButton('explore'); $emit('exploreFeed')">
      <h1>Explore</h1>
    </v-btn>

    <!--If 'For You' button is clicked, emit forYou event to parent so that the new post modal is displayed -->
    <v-btn class="newPost" @click="$emit('new-post')">
      <p>New Post</p>
    </v-btn>
  </v-banner>
</template>
    
<script>
export default {
  data() {
    return {
      activeButton: null,
    }
  },
  methods: {
    activateButton(button) {
      this.activeButton = button;
    },
  },

};
</script>
<style scoped>
.no-border {
  border: none;
  background-color: #e0e1dd;
}

.v-btn {
  color: #166088;
}

.active {
  background-color: rgba(22, 96, 136, 0.2);
  /* Opaque version of the blue */
}

.newPost {
  margin-left: 18%;
  margin-top: 2px;
}

.banner-button {

  background-color: #e0e1dd;
  color: black;
}

.newPost {
  color: black;
  background-color: #56a0ce;
}
</style>