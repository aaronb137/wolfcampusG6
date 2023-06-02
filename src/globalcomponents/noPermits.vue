<template>
  <div class="permission-denied-container">
    <div class="permission-denied">
      <h1 class="display-1">403 - Access Denied</h1>
      <p class="lead">
        You do not have the necessary permissions to access this page.
      </p>
      <div class="extra-space"></div>
      <template v-if="routeString">
        <v-btn style="background-color: #55a7da;" :to="routeString">Return back</v-btn>
      </template>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";

export default {
  name: "DashboardFriends",
  setup() {
    const routeString = ref("");

    onAuthStateChanged(auth, (user) => {
      if (user) {
        routeString.value = "/home";
        console.log(routeString.value);
      } else {
        routeString.value = "/";
        console.log(routeString.value);
      }
    });
    return { routeString };
  },
};
</script>

<style>
.permission-denied-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://s3.amazonaws.com/utep-uploads/wp-content/uploads/unr/2019/10/29141118/UNR-Campus-Home-Page-1.jpg");
  background-size: cover;
  background-position: center;
}

.permission-denied {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  padding: 20px;
  margin: 0 auto; /* add this line */
  background-color: rgba(255, 255, 255, 0.8); /* add this line */
}
.extra-space {
  margin-top: 20px;
}
</style>
