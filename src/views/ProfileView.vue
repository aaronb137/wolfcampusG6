<template>
  <v-row>
    <v-col >
      <ProfilePage />
    </v-col>
    <v-col  >
      <ProfileFeed  />
    </v-col>
  </v-row>
  <nav-bar></nav-bar>
</template>

<script>
// import ProfileAvatar from "@/components/Dashboard/ProfileAvatar.vue";
import ProfilePage from "@/components/Profile/ProfilePage.vue";
import ProfileFeed from "@/components/Profile/ProfileFeed.vue";
export default {
  name: "ProfileView",
  components: {
    ProfilePage,
    ProfileFeed,
  },
};
</script>

<style scoped>

.profile-page {
  position: absolute;
  /* top: 5%; */
  /* margin-right: 5%; */
  /* left: 0%; */
  /* height: 120%; */
  /* width: 150%; */
  /* transform: translateY(-50%); */
  /* font-size: 15px; */
}
</style>