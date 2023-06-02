<template>
  <div>
  
    <v-sheet
            :class="[computedMargin]"
            elevation="4"
            rounded
          >
    <v-card
      class="mx-auto"
      color="grey-lighten-3"
      max-width="400"
    >
      <v-card-text>
        <v-text-field
          ref="searchInput"
          v-model="searchInput"
          :loading="loading"
          density="default"
          variant="solo"
          label="Search class by prefix or number"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
        ></v-text-field>
      </v-card-text>
    </v-card>
    </v-sheet>
  </div>
    <v-table style="margin-left: 3.5rem;">
    <thead>
      <tr>
        <th class="text-left">
          Prefix
        </th>
        <th class="text-left">
          Number
        </th>
        <th class="text-left">
          Students
        </th>
        <th class="text-left">
          Moderator
        </th>

      </tr>
    </thead>
    <tbody>
      <tr v-for="clas in filteredClasses" :key="clas.uid">
        <td class="border-black">{{ clas.prefix }}</td>
        <td class="border-black">{{ clas.classNum}}</td>
        <td class="border-black">{{ clas.students.length}}</td>
        

        <td class="border-black">
  <v-select
    class="custom-dropdown"
    :value="selectedUser"
    @input="selectedUser = $event"
    :items="usersEmail"
    label="Select Moderator"
    variant="solo-filled"
  ></v-select>
</td>
<td class="border-black">
  <v-btn class="custom-button" @click="onAddModeratorClick(event, clas)" color="indigo">
    Add
  </v-btn>
          </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, query,  getDocs, where, updateDoc, doc} from "firebase/firestore";
import { db } from "@/firebase";


export default {
    data: () => ({
    loaded: false,
    loading: false,
    searchInput: '',
    selectedUser : '',
    
    

  }),

  setup() {
  const classes = ref([]);
  const error = ref(null);
  const users = ref([]);
  const usersEmail = ref([]);


// fetches all classes that have a moderator
  const fetchClas = async () => {
    try {
      const postRef = collection(db, "classes");
      const q = query(postRef, where ("moderatorUID", "!=" , ""));
      const querySnapshot = await getDocs(q);
      const clasArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      classes.value = clasArray;
      console.log(classes.value);
    } catch (err) {
      error.value = err.message;
    }
  };
// fetches all moderators and not deleted users
  const fetchUsers = async () => {
    try {
      const postRef = collection(db, "accounts");
      const q = query(postRef,where ("isModerator", "==", true),where ("isDeleted", "==", false));
      const querySnapshot = await getDocs(q);
      const usersArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      users.value = usersArray;
      usersEmail.value = usersArray.map(user => user.AcctEmail);
      console.log(users.value);
    } catch (err) {
      error.value = err.message;
    }
  };

  onMounted(() => {
    fetchClas();
    fetchUsers();
  });
console.log(usersEmail);
  return { classes, error, users, usersEmail };
},
computed: {
//search bar
filteredClasses() {
const searchText = this.searchInput.toLowerCase();
return this.classes.filter(
(clas) =>
 clas.prefix.toLowerCase().includes(searchText) ||
 clas.classNum.toString().toLowerCase().includes(searchText)
);
},
},
methods: {
//this doesnt work yet
async onAddModeratorClick(event, clas) {
  const { selectedUser } = this;
console.log(selectedUser.uid);
try {
  const postRef = doc(db, "classes", clas.id);
  await updateDoc(postRef, {
    moderatorUID: selectedUser.uid,
  });
} catch (error) {
  console.error("Error adding report: ", error);
}
},
}

}

</script>
<style>
.custom-button {
width: 110px;
height: 50px;

}
/* .custom-dropdown {
width: 200px;
height: 50px;
} */
</style>

//done terribly by Melanie Bazgan, goodluck fixing this mess
//melaniebazgan@gmail.com