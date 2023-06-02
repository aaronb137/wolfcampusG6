<template>
  <!-- Permanent navigation drawer with expand-on-hover and a custom color -->
  <v-navigation-drawer expand-on-hover rail color="#166088">
    <!-- Display user information with a profile picture and full name -->
    <v-list>
      <v-list-item
        :prepend-avatar="userProfilePicture"
        :title="firstName + ' ' + lastName"
      ></v-list-item>
    </v-list>
    <!-- Divider to separate user information and navigation links -->
    <v-divider color="white"></v-divider>
    <!-- Navigation links with compact density -->
    <v-list density="compact" nav>
      <!-- Home link -->
      <v-list-item prepend-icon="mdi-home" title="Home" value="home" to="/home">
      </v-list-item>
      <!-- Explore link -->
      <v-list-item
        prepend-icon="mdi-domain"
        color="white"
        title="Explore"
        value="explore"
        to="/explore"
      ></v-list-item>
      <!-- Book Resell link -->
      <v-list-item
        prepend-icon="mdi-tag"
        title="Book Resell"
        value="resell"
        to="/bookresell"
      ></v-list-item>
      <!-- Study link -->
      <v-list-item
        prepend-icon="mdi-pen"
        title="Study"
        value="study"
      ></v-list-item>
      <!-- Notes link -->
      <v-list-item
        prepend-icon="mdi-note"
        title="Notes"
        value="notes"
        to="/notes"
      ></v-list-item>
      <!-- Divider to separate navigation links and settings link -->
      <v-divider color="white"></v-divider>
      <!-- Settings link -->
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        value="settings"
        to="/settings"
      ></v-list-item>
      <!-- Divider to separate settings link and sign-out link -->
      <v-divider color="white"></v-divider>
      <!-- Sign Out link with a click event to trigger Logout method -->
      <v-list-item
        prepend-icon="mdi-logout"
        title="Sign Out"
        value="signOut"
        @click="Logout"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import { ref, onMounted } from "vue";
import { onSnapshot, query, where, collection } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";
import { auth, db } from "@/firebase";

export default {
  name: "NavBar",
  
  setup() {
    // Initialize userProfilePicture, firstName, and lastName as reactive references
    const userProfilePicture = ref("");
    const firstName = ref("");
    const lastName = ref("");

    // Create a query for the user document in the Firestore database
    const userRef = collection(db, "users");
    const q = query(userRef, where("uid", "==", auth.currentUser.uid));
  
    // Fetch user information from Firestore
    const fetchImage = () => {
      try {
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            userProfilePicture.value = doc.data().profilePicture;
            firstName.value = doc.data().FirstName;
            lastName.value = doc.data().LastName;
          });
          console.log(firstName.value + " " + lastName.value)
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    // Fetch user information on component mount
    onMounted(() => {
      fetchImage();
    });

    // Return userProfilePicture, firstName, and lastName for use in the template
    return {
      userProfilePicture,
      firstName,
      lastName,
    };
  },
  methods: {
    // Logout method to sign out the user and redirect to the home page
    Logout() {
      const auth = getAuth();
      console.log(auth.currentUser);
      signOut(auth)
        .then(() => {
          console.log(auth.currentUser);
          console.log("Sign Out");
          this.$router.push("/");
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
</script>

<style scoped>
.v-list-item {
  color: white;
}

.v-navigation-drawer {
  background-color: #ffffff;
  color: #166088;
}
</style>
