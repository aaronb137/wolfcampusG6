<template>

  <!--This component was designed largely by Deandre Mylove.
  The buttons and functionality for them were implemented by Clint Vega

This component dynamically load's a user's profile picture, name, and classes based on the URI.
Other users can use the follow or block buttons to follow and block the user repsectivley.-->


    <!--Modal that displays asking the user to confirm they want to block the the user's profile-->
  <v-dialog v-model="blockDialog" persistent max-width="290">
  <v-card>
      <v-card-title class="text-h5" >Block {{firstname }} {{lastname}}?</v-card-title>
      <v-card-text class="noBorder">They will not be able to view your profile or posts.
         They will also not be able to follow you.</v-card-text>
    <div class="buttons" style="display: flex; justify-content: center;">
      <v-btn class="block" @click="blockUser(currentUID,profileUID); blockDialog=false"> Block</v-btn>
      <v-btn class="cancel ml-2 mb-2"  @click="blockDialog=false" >Cancel</v-btn>
    </div>
    </v-card>
  </v-dialog>

  <!--User information-->
  <v-container>
    <div v-if="currentUID !== profileUID">
    <v-row class="d-flex justify-space-between">
    <v-col cols="12" class="text-right">


      <!--Block button is located under a 3-dot 'more' button
      The more/block buttons do not display if user is on their own profile-->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn flat icon="mdi-dots-vertical" v-bind="props">
            </v-btn>
          </template>
          <v-list>
            <v-list-item  @click="blockDialog=true">
              <div class="d-flex align-center" style="color:rgb(180, 25, 25)">
                <v-list-item-title>Block User</v-list-item-title>
                <v-icon class="ml-2" style="transform:scale(0.8);">mdi-block-helper</v-icon>
              </div>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
    </v-row>
    </div>

    <!--Displaying profile information-->
    <v-row>
      <v-col md="12">
        <v-avatar :image=profilePicture>

        </v-avatar>
        <h2 class="my-4">{{ firstname }} {{ lastname }}</h2>
        <div v-if="currentUID !== profileUID">

        <!--Follow/Unfollow button display if the user does not or does follow the user respectivley
        This button will not display if a user is looking at their own profile-->
        <v-btn color="login" class="mb-4" v-if="!isFollowing" @click="followUser(currentUID, profileUID)">Follow</v-btn>
        <v-btn color="login" class="mb-4" v-else @click="unfollowUser(currentUID, profileUID)">Unfollow</v-btn>
      </div>

      <!--If user is on their own profile, a button to go to the dashboard is displayed instead of a follow button-->
      <div v-if="currentUID == profileUID">
        <v-btn color="login" class="mb-4" :to="'/home'">Dashboard</v-btn>
        
      </div>
        <v-card class="class-list mt-6">
          
          <!--Displaying classes as links to class pages-->
          <v-card-text flat>
            <h1>Classes</h1>
            <v-list>
              <v-list-item v-for="(userClass, index) in classes" :key="index">
                <v-btn class="classButton" elevation="0" style="cursor: pointer"
                  :to="'/classes/' + userClass.prefix + userClass.number">{{ userClass.prefix }}{{ userClass.number}}
                </v-btn>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

    </v-row>
  </v-container>
</template>
  
<script>
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from '@firebase/auth'
import { collection, onSnapshot, where, query, arrayUnion, arrayRemove, updateDoc, doc } from "@firebase/firestore";
export default {
  name: "OtherProfileAvatar",
  data(){
    return{
    blockDialog: false
  }
  },
  setup() {
    //Grabbing current user UID for following
    const currentUID = ref("")

    //Variables to load profile
    const route = useRoute();
    const profileUID = ref("");
    const username = ref(route.params.username);
    const firstname = ref("");
    const lastname = ref("");
    const profilePicture = ref("");
    const major = ref("Undecided");
    const classes = ref([])
    const followers = ref([])

    //Grabbing user data and loading profile based on URI which
    //is in format of /user/[username]
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
        profilePicture.value = user.profilePicture;
        classes.value = user.classes || [];
        profileUID.value = user.uid;
        followers.value = user.followers || [];
      });
    };

    //Grabbing current uid to decide which componnets to display ( (un)follow, block, dashboard)
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUID.value = auth.currentUser.uid;
      } else {
        currentUID.value = null;
      }
    });

    //When page is loaded, grab user data
    onMounted(() => {
        getUserData();
      });

    //computed variable to check if current user follows profile user
    const isFollowing = computed(() => followers.value.includes(currentUID.value));
    return { firstname, lastname, major, profilePicture, classes, profileUID, isFollowing, currentUID };
  },

  methods: {

    //Function to follow user. This adds profile user's UID to current user's 'following' array
    //A cloud function updates the profile user's 'followers' array appropriatley
    async followUser(currentUID, profileUID) {
      if (!currentUID || !profileUID) {
        console.error('Both currentUID and profileUID must be provided.');
        return;
      }

      try {
        const userDocRef = doc(db, 'users', currentUID);
        await updateDoc(userDocRef, {
          following: arrayUnion(profileUID),
        });
      } catch (error) {
        console.error('Error following user:', error);
      }
    },
    //Function to unfollow user. This removes profile user's UID to current user's 'following' array
    //A cloud function updates the profile user's 'followers' array appropriatley
    async unfollowUser(currentUID, profileUID) {
    if (!currentUID || !profileUID) {
      console.error('Both currentUID and profileUID must be provided.');
      return;
    }

    try {
      const userDocRef = doc(db, 'users', currentUID);
      await updateDoc(userDocRef, {
        following: arrayRemove(profileUID),
      });
    } catch (error) {
      console.error('Error unfollowing user:', error);
    }
  },

    //Function to block user. This adds profile user's UID to current user's 'blocked' array
    //A cloud function updates the profile user's 'blockedBy' array appropriatley
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
.v-container {
  width: 55%;
  margin-left: 30%;
  text-align: center;
  margin-top: 5%;
  height: 80%;
  border-radius: 10px;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.1), 0 16px 56px rgba(0, 0, 0, 0.1),
    0 16px 56px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.v-card-text {
  text-align: center;
  border: solid;
  border-width: 0.5px;
  border-color: black;
border-radius: 10px;
}

.v-avatar {
  width: 40%;
  height: auto;
  margin-top: 2%;
  margin-bottom: 2%;
}

.classButton {
  background-color: transparent;
}

.noBorder{
  border:transparent
}
.block{
  background-color:#ce4a53
 
}

.cancel{
  
  border-width: 2px;
}
</style>