<template>
  
    <v-card>
      <v-card-title class="text-h5" >Block {{firstname }} {{lastname}}?</v-card-title>
      <v-card-text>They will not be able to view your profile or posts.
         They will also not be able to follow you.</v-card-text>
    <div class="buttons" style="display: flex; justify-content: center;">
      <v-btn class="cancel" color="error" @click="blockUser(currentUID,profileUID); $emit('close-modal')"> Block</v-btn>
      <v-btn class="block ml-2" color="login" @click="$emit('close-modal')" >Cancel</v-btn>
    </div>
    </v-card>
  
</template>

<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from '@firebase/auth'
import { collection, onSnapshot, where, query, arrayUnion, arrayRemove, updateDoc, doc } from "@firebase/firestore";
export default {
  name: "BlockModal",
  setup() {
    //Grabbing current user UID for following
    const currentUID = ref("")

    //Variables to load profile
    const route = useRoute();
    const profileUID = ref("");
    const username = ref(route.params.username);
    const firstname = ref("");
    const lastname = ref("");

    const getUserData = () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.value));

      onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          console.error(`No user found with username: ${username.value}`);
          return;
        }

        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();
        firstname.value = user.FirstName;
        lastname.value = user.LastName;
        profileUID.value = user.uid;
      });
    };

    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUID.value = auth.currentUser.uid;
      } else {
        currentUID.value = null;
      }
    });

    
    getUserData();
    console.log(currentUID)
    return { firstname, lastname, profileUID, currentUID };
  },

  methods: {

    async blockUser(currentUID, profileUID) {
      if (!currentUID || !profileUID) {
        console.error('Both currentUID and profileUID must be provided.');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUID);
        await updateDoc(userDocRef, {
          blocked: arrayUnion(profileUID),
          following: arrayRemove(profileUID),
        });
      } catch (error) {
        console.error('Error blocking user:', error);
      }
    }
}
  

};
</script>

<style scoped>

.v-card {
  border: solid;
  border-color: #4a6fa5;
  border-width: 5px;
  margin-top: 20%;
  width: 20%;
  height: 25%;
  position: absolute;
  align-self: center;
  border-radius: 20px;
  z-index: 1;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.1), 0 16px 56px rgba(0, 0, 0, 0.1),
    0 16px 56px rgba(0, 0, 0, 0.1);
    
}

.v-card-title {
  color: black;
  text-align: center;
}




</style>