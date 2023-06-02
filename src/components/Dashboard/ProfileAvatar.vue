<template>
  <!-- Avatar card -->
  <v-card class="avatar" border="true">
    <!-- Display the profile image or a default avatar image -->
    <v-avatar :image="profileImage || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'"  ></v-avatar>
    <!-- Divider line -->
    <v-divider thickness="2"></v-divider>
    <!-- Display the user's first and last name -->
    <h2 style="text-align: center;">{{ firstName }}  {{  lastName }}</h2>

    <!-- Divider line -->
    <v-divider thickness="2"></v-divider>
    <!-- Display the user's major or 'Undecided' if no major is set -->
    <h2 v-if="!major" style="text-align: center;">Undecided</h2>
    <h2 v-else style="text-align: center;">{{ major }}</h2>
  </v-card>
</template>

<script>
import { auth, db } from "@/firebase";
import { ref, onMounted } from "vue";
import { collection, query, where, onSnapshot } from "firebase/firestore";
export default {
  name: "ProfileAvatar",
  setup() {
    const firstName= ref("");
    const lastName = ref("");
    const major = ref("");
    const profileImage = ref("");

    // Create a reference to the user's document in the 'users' collection
    const userRef = collection(db, "users");
    const q = query(userRef, where("uid", "==", auth.currentUser.uid));

    // Function to fetch the user's image, major, and name
    const fetchImage = () => {
      try {
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            profileImage.value = doc.data().profilePicture;
            major.value = doc.data().Major;
            firstName.value = doc.data().FirstName;
            lastName.value = doc.data().LastName;
          });
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    // Fetch the user's image, major, and name when the component is mounted
    onMounted(() => {
      fetchImage();
    });

    // Expose the reactive variables to the template
    return {
      firstName,
      lastName,
      major,
      profileImage,
    };
  },
};
   
</script>

<style scoped>
.avatar {
  position: absolute;
  margin-left: 6%;
  margin-top: 1%;
  background-color: #ffffff;

  width: 20%;
  border-radius: 10px;
  box-sizing: border-box;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  align-items: center;
  height: 23rem;
}
.v-avatar {
  width: 70%;
  height: 65%;
  margin-left: 15%;
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
</style>