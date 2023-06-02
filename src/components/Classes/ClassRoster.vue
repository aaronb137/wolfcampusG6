<template>
  <!--Developed by Clint Vega
This component is used to dynamically display the students in a class based on the URI-->
  <v-card class="sections" border="true">
    <h2 style="text-align: left; margin-left: 1.5rem">Students</h2>
    <v-divider class="mb-6" thickness="2"></v-divider>
    <v-row>

      <!--Each student has their name and profile picture displayed as a link to their profile-->
      <v-column>
        <v-list-item style="text-align: left; padding-left: 2rem" v-for="(student, index) in studentsData" :key="index">
          <router-link :to="'/user/' + student.username">
            <v-avatar size="50" v-if="student">
              <img
                :src="student.profilePicture || 'https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg'"
                style="width: 100%; height: 100%; object-fit: cover;" alt="Avatar" />
            </v-avatar>
          </router-link>

          <v-column>
            <v-btn class="classButton" elevation="0" style="
                cursor: pointer;
                text-transform: none;
                font-size: medium;
                margin-left: .5rem;" :to="'/user/' + student.username">
              {{ `${student.FirstName} ${student.LastName}` }}
            </v-btn>
          </v-column>
        </v-list-item>
        <div class="mb-6"></div>
      </v-column>
    </v-row>
  </v-card>
</template>
  
  
<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { db } from "@/firebase";
import {
  collection,
  query,
  getDocs,
  getDoc,
  where,
  doc,
} from "@firebase/firestore";
export default {
  name: "ClassRoster",
  setup() {

    //Loading class parameters based on URI
    const route = useRoute();
    const classPrefix = ref(route.params.classPrefix);
    const classNumber = ref(route.params.classNumber);
    const students = ref([]);
    const studentsData = ref([]);

    //Function to fetch class data 
    const fetchClassData = async (classPrefix, classNumber) => {
      const querySnapshot = await getDocs(
        query(
          collection(db, "classes"),
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

    //Function to getch user data based on uid (to grab names)
    const fetchUserData = async (uid) => {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error(`User with UID ${uid} not found`);
      }
    };

    //Function that fetches class data and grabs the students array (which contains only student UID's)
    //Then maps the User's name from fetchUserData to the corresponding index in the students array to dispaly
    const getClassData = async () => {
      const classData = await fetchClassData(
        classPrefix.value,
        classNumber.value
      );
      students.value = classData.students || [];
      studentsData.value = await Promise.all(
        students.value.map(async (uid) => {
          return await fetchUserData(uid);
        })
      );
    };
    getClassData();
    return { studentsData };
  },
};
</script>
  
<style scoped>
.sections {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1),
    0 8px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

  position: absolute;
  margin-left: 6%;
  margin-top: 25%;
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
</style>