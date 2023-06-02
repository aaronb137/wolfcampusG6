<template>
  <!--Developed by Clint Vega
This component is used to dynamically display the planned study sessions for a given class. Each study session listed would
link to the study session listed in the main studdy session page.

This component went unused in the final demo / final version of the project due to the created study sessions page
not being implemented before final demonstrations.-->
  <v-card class="sections" border="true">

    <h2 style="text-align: center;">Study Sessions</h2>
    <v-divider thickness="2"></v-divider>

    <v-list-item style="text-align: center;" v-for="(session, index) in studySessions" :key="index">
      <v-btn class="classButton" elevation="0" style="cursor: pointer">
        {{ formatDate(session) }} - {{ formatTime(session) }}
      </v-btn>
    </v-list-item>




  </v-card>
</template>
  
  
<script>
import { ref } from "vue";
import { useRoute } from "vue-router";
import { db } from '@/firebase';
import { collection, query, getDocs, where } from "@firebase/firestore";
export default {
  name: "ClassSessions",
  setup() {

    //Using URI to load prefix and number variables.
    const route = useRoute();
    const classPrefix = ref(route.params.classPrefix);
    const classNumber = ref(route.params.classNumber)
    const studySessions = ref([])

    //Function to query class data from firebase
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

    //Grabbing study sessions from the study sessions array.
    const getClassData = async () => {
      const classData = await fetchClassData(classPrefix.value, classNumber.value);
      studySessions.value = classData.studySessions || [];
    };
    getClassData();
    return { studySessions };
  },
  methods: {

    //Function to display study session timestamp in HH:MM format
    formatTime(timestamp) {
      const date = timestamp.toDate();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const twelveHours = hours % 12 || 12;
      return `${twelveHours}:${minutes} ${ampm}`;
    },

    //Function to display study session timestamp in MM/DD/YY format
    formatDate(timestamp) {
      const date = timestamp.toDate();
      const options = { month: 'numeric', day: 'numeric', year: '2-digit' };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    }
  }
};
</script>
  
<style scoped>
.sections {
  position: absolute;
  margin-left: 78%;
  margin-top: 1%;
  background-color: #e0e1dd;
  border: 6px solid #4a6fa5;
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
}</style>