<template>
  <!-- Creates a bordered card component -->
<v-card class="sections" border="true">
  <!-- Display "Following" as the card header -->
  <h2 style="text-align: left; margin-left: 1.5rem">Following</h2>
  <!-- Create a divider with thickness of 2 and margin bottom 6 -->
  <v-divider class="mb-6" thickness="2"></v-divider>
  <!-- Create a row to contain the list of users -->
  <v-row>
    <v-column>
      <!-- Display a list of students the user is following -->
      <v-list-item
        style="text-align: left; padding-left: 2rem"
        v-for="(student, index) in followingData"
        :key="index"
      >
        <!-- Create a router link to the student's profile -->
        <router-link :to="'/user/' + student.username">
          <!-- Display the student's avatar if available -->
          <v-avatar size="50" v-if="student">
            <img :src="student.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'" style="width: 100%; height: 100%; object-fit: cover;" alt="Avatar" />
          </v-avatar>
        </router-link>

        <!-- Create a column to hold the student's name -->
        <v-column>
          <!-- Create a button to navigate to the student's profile -->
          <v-btn
            class="classButton"
            elevation="0"
            style="
              cursor: pointer;
              text-transform: none;
              font-size: medium;
              margin-left: .5rem;"
              :to="'/user/' + student.username"
          >
            <!-- Display the student's first and last name -->
            {{ `${student.FirstName} ${student.LastName}` }}
          </v-btn>
        </v-column>
      </v-list-item>
      <!-- Create an empty space with margin bottom 6 -->
      <div class="mb-6"></div>
    </v-column>
  </v-row>
</v-card>
</template>

<script>
// Import necessary dependencies from Vue, Firebase, and Firestore
import { ref } from "vue";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  getDoc,
  doc,
} from "@firebase/firestore";

// Define the DashboardFriends component
export default {
  name: "DashboardFriends",
  setup() {
    // Create reactive references for the list of users being followed and their data
    const following = ref([]);
    const followingData = ref([]);

    // Function to fetch the following list of a user with the given UID
    const fetchFollowingData = async (uid) => {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data().following || [];
      } else {
        throw new Error(`User with UID ${uid} not found`);
      }
    };

    // Function to fetch user data for a given UID
    const fetchUserData = async (uid) => {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error(`User with UID ${uid} not found`);
      }
    };

    // Function to get data for all users in the following list of the current user
    const getUserData = async (uid) => {
      following.value = await fetchFollowingData(uid);
      followingData.value = await Promise.all(
        following.value.map(async (uid) => {
          return await fetchUserData(uid);
        })
      );
    };

    // Watch for authentication state changes and fetch user data accordingly
    onAuthStateChanged(auth, (user) => {
      if (user) {
        getUserData(user.uid);
      } else {
        followingData.value = [];
      }
    });

    // Expose the followingData ref to the template
    return { followingData };
  },
};
</script>

<style scoped>
.sections {
  position: absolute;
  margin-left: 6%;
  margin-top: 30%;
  background-color: #ffffff;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  
  width: 20%;
  border-radius: 25px;
  box-sizing: border-box;
  align-items: center;
}
.avatar-container {
  display: flex;
  justify-content: center;
}
.v-avatar {
  width: 70%;
  height: auto;
  margin-top: 2%;
  margin-bottom: 2%;
}
body {
  background-color: #4a6fa5;
}
.v-divider {
  color: black;
}
h2 {
  color: black;
  font-size: 1.5rem;
  margin-inline: 5%;
  text-align: left;
  line-height: 2;
}
h3 {
  color: black;
  font-size: 1.25rem;
  margin-inline: 5%;
  text-align: left;
  line-height: 2;
}
</style>