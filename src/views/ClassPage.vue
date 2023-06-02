<template>
  <nav-bar></nav-bar>
  <NotInClass v-show="isAuthChecked && !students.includes(currentUID)"></NotInClass>
  <div v-show="isAuthChecked && students.includes(currentUID)">
  <ClassInfo></ClassInfo>
  <!-- <ClassAnnouncements></ClassAnnouncements> -->
  <!--<ClassSessions></ClassSessions>-->
  <ClassRoster></ClassRoster>
  <ClassPost></ClassPost>
  <ClassFeed></ClassFeed>
</div>
</template>
  
<script>
// @ is an alias to /src
import ClassInfo from "@/components/Classes/ClassInfo.vue"
import ClassPost from "@/components/Classes/ClassPost.vue"
import ClassFeed from "@/components/Classes/ClassFeed.vue"
// import ClassAnnouncements from "@/components/Classes/ClassAnnouncements.vue";
// import ClassSessions from "@/components/Classes/ClassSessions.vue"
import ClassRoster from "@/components/Classes/ClassRoster.vue"
import NotInClass from "@/components/Classes/NotInClass.vue"

import { ref } from "vue";
import { useRoute } from "vue-router";
import { db, auth } from '@/firebase';
import { onAuthStateChanged } from '@firebase/auth';
import {  doc, onSnapshot } from "@firebase/firestore";


export default {
  name: "ClassPage",
  components: {
    ClassInfo,
    ClassPost,
    ClassFeed,
    ClassRoster,
    NotInClass
    // ClassSessions
    // ClassAnnouncements
  },
  setup() {
      const route = useRoute();
      const classPrefix = ref(route.params.classPrefix);
      const classNumber = ref(route.params.classNumber)
      const moderatorUID = ref(null);
      const currentUID = ref(null);
      const students = ref([]);
  
      
      const getClassData = () => {
      const classDocRef = doc(db, 'classes', `${classPrefix.value} ${classNumber.value}`);
      
      onSnapshot(classDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const classData = docSnapshot.data();
          moderatorUID.value = classData.moderatorUID;
          students.value = classData.students;
        } else {
          throw new Error(`Class ${classPrefix.value} - ${classNumber.value} not found`);
        }
      });
    };
  
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
      return { currentUID, isAuthChecked, students };
    }

};
</script>
  
<style scoped>
body {
  background-color: #fdf0d5;
}
</style>