<template>
  <!--Developed by Clint Vega
This component is used to dynamically display class information 
for a given class based on the URI-->

  <v-card class="avatar" border="true">
    <div class="avatar-container">
      <v-avatar :image=classPhoto size=200>
      </v-avatar>

    </div>
    <v-divider thickness="2"></v-divider>
      <h2 style="text-align: center;">{{ classPrefix }}{{ classNumber }}</h2>
    <v-divider thickness="2"></v-divider>
      <h3 style="text-align: center;"> {{ classDesc }}</h3>
    <v-divider thickness="2"></v-divider>
      <h3 style="text-align: center;"> Moderator: {{ moderatorName }}</h3>


  </v-card>
</template>
  
  
<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from '@firebase/auth'
import { collection, query, getDocs, where, doc, getDoc } from "@firebase/firestore";

export default {
  name: "ClassInfo",
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
    const moderatorName = ref("");

    //Querying class data from firebase based on URI
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

    //Function to call fetchClass data and map returned information to appropriate variables.
    const getClassData = async () => {
      const classData = await fetchClassData(classPrefix.value, classNumber.value);
      profFirstName.value = classData.profFirstName;
      profLastName.value = classData.profLastName;
      classPhoto.value = classData.classPhoto || "https://firebasestorage.googleapis.com/v0/b/wolfcampus-d04e6.appspot.com/o/Default%20photos%2FDefaultClass_200x200.png?alt=media&token=49228938-b501-45fb-85e8-21df46c03118";
      profTitle.value = classData.profTitle;
      classDesc.value = classData.classDesc;
      moderatorUID.value = classData.moderatorUID;
      moderatorUID.value = classData.moderatorUID;
      moderatorName.value = await fetchModeratorName(moderatorUID.value);

    };

    //Funciton that takes moderatorUID from class data and queries firebase to retrieve the user's display name.
    const fetchModeratorName = async (uid) => {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const moderatorData = userDoc.data();
        return `${moderatorData.FirstName} ${moderatorData.LastName}`;
      } else {
        throw new Error(`User with UID ${uid} not found`);
      }
    };

    //Checking user is signed in. This was to check if current user is the moderator. 
    //This would have allowed editing of class description.
    //Class descriptions were standardized by webscraping UNR's catalogue therefore this functionality was removed.
    const isAuthChecked = ref(false);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUID.value = auth.currentUser.uid;
      } else {
        currentUID.value = null;
      }
      isAuthChecked.value = true;
    });

    onMounted(async () => {
      await getClassData();
    });
    return { classPrefix, classNumber, profFirstName, profLastName, profTitle, classPhoto, classDesc, currentUID, moderatorUID, isAuthChecked, moderatorName };
  }
};
</script>
  
<style scoped>
.avatar {
  position: absolute;
  margin-left: 6%;
  margin-top: 1%;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1),
    0 8px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

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
</style>
  