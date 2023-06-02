<template>
  <!--Developed by Clint Vega
This component is used to display a 'join class' button instead of the standard class page if the current user
is not in the class. If a user is not in the class, only the class information (name/description) will be displayed along with the button to join the class.
Posts and the class roster are not accessbile until the student is in the class-->
  <v-container class="centered" max-width="500">
    <v-card class="avatar" border="true">
      <div class="avatar-container">
        <v-avatar :image="classPhoto" size="200"></v-avatar>
      </div>
      <v-divider thickness="2"></v-divider>
        <h2 style="text-align: center;">{{ classPrefix }}{{ classNumber }}</h2>
      <v-divider thickness="2"></v-divider>
        <h3 style="text-align: center;">{{ classDesc }}</h3>
      <v-divider thickness="2"></v-divider>
      <v-row no-gutters>
        <v-col cols="12">
          <v-btn color="primary" block class="join-class-btn" @click="addClass(classPrefix, classNumber)">Join
            Class</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>
    
    
<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from '@firebase/auth'
import { collection, query, getDocs, where, doc, updateDoc, arrayUnion } from "@firebase/firestore";

export default {
  name: "NotInClass",
  setup() {


    const route = useRoute();
    const classPrefix = ref(route.params.classPrefix);
    const classNumber = ref(route.params.classNumber)
    const profFirstName = ref("");
    const profLastName = ref("");
    const profTitle = ref("");
    const classPhoto = ref("");
    const classDesc = ref("");
    const moderatorUID = ref(null);
    const currentUID = ref(null);

    //funciton to fetch class data from firebase
    const fetchClassData = async (classPrefix, classNumber) => {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'classes'),
          where("prefix", "==", classPrefix),
          where("classNum", "==", classNumber)
        )
      );
      if (querySnapshot.docs.length > 0) {
        return querySnapshot.docs[0].data();
      } else {
        throw new Error(`Class ${classPrefix} - ${classNumber} not found`);
      }
    };

    //mapping appropriate variables with data from retrieved from firebase
    const getClassData = async () => {
      const classData = await fetchClassData(classPrefix.value, classNumber.value);
      profFirstName.value = classData.profFirstName;
      profLastName.value = classData.profLastName;
      classPhoto.value = classData.classPhoto || "https://firebasestorage.googleapis.com/v0/b/wolfcampus-d04e6.appspot.com/o/Default%20photos%2FDefaultClass_200x200.png?alt=media&token=49228938-b501-45fb-85e8-21df46c03118";
      profTitle.value = classData.profTitle;
      classDesc.value = classData.classDesc;
      moderatorUID.value = classData.moderatorUID;
    };

    //Checking current and grabbing current UID to use use join class button appropriatley.
    const isAuthChecked = ref(false);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUID.value = auth.currentUser.uid;
      } else {
        currentUID.value = null;
      }
      isAuthChecked.value = true;
    });

    getClassData();
    return { classPrefix, classNumber, profFirstName, profLastName, profTitle, classPhoto, classDesc, currentUID, moderatorUID, isAuthChecked };
  },

  methods:
  {
    //Function to add class
    async addClass(classPrefix, classNumber) {
      if (this.currentUID) {
        // Add the class to the user's document
        const userDocRef = doc(db, 'users', this.currentUID);
        await updateDoc(userDocRef, {
          classes: arrayUnion({ prefix: classPrefix, number: classNumber })
        });

        // Add the user's UID to the class document in the classes collection
        const classDocRef = doc(db, 'classes', `${classPrefix} ${classNumber}`);
        await updateDoc(classDocRef, {
          students: arrayUnion(this.currentUID)
        });

      } else {
        console.log(error)
      }
    },
  },

};
</script>
    
<style scoped>
.avatar {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1),
    0 8px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  position: absolute;
  margin-left: 6%;
  margin-top: 1%;
  width: 25%;
  border-radius: 10px;
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

.v-avatar {
  border: solid;
  border-color: black;
  border-width: 1px;
}

.edit-icon {
  position: absolute;
  top: 10px;
  right: 10px;
}

.centered {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}
</style>
    