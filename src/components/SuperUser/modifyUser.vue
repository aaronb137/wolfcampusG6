
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
  v-model="searchInput"
  :loading="loading"
  density="default"
  variant="solo"
  label="Search users by name or email"
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
          Email
        </th>
        <th class="text-left">
          Last Login
        </th>
        <th class="text-left">
          Current Status
        </th>
        <th class="text-left">Actions</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="users in filteredUsers" :key="users.uid">
        <td class="border-black">{{ users.AcctEmail }}</td>
        <td class="border-black">{{ formatDistanceToNow(users.LastLogin) }}</td>
        <td class="border-black" v-if="users.isModerator===true">Moderator</td>
        <td class="border-black" v-if="users.isModerator===false">Student</td>
            <!-- <v-combobox
            v-model="selectedUser"
             label="Select Permits"
            :items= "[ 'SuperUser', 'Moderator', 'Student']"
             variant="solo-filled"
            ></v-combobox> -->

        <td class="border-black">
            <v-btn class="custom-button" color="indigo"  v-if="users.isModerator===true" @click="demoteUser(users)">Demote</v-btn>
            <v-btn class="custom-button" color="indigo"  v-if="users.isModerator===false" @click="promoteUser(users)">Promote</v-btn>
          </td>
          <td class="border-black">
            <v-btn
            class="custom-button"
             color="error" @click="showModal = true">
              Delete
              <v-icon
            end
            icon="mdi-cancel"
          ></v-icon>
          <v-dialog v-model="showModal" max-width="500px">
        <v-card>
        <v-card-title class="headline">Confirm Delete</v-card-title>
        <v-card-text>
          Are you sure you want to delete this user?
        </v-card-text>
        <v-card-actions>
          <v-btn color="green" text @click="deleteUser(users)">Yes</v-btn>
          <v-btn color="red" text @click="showModal = false">No</v-btn>
          
        </v-card-actions>
      </v-card>
    </v-dialog>
            </v-btn>
          </td>
      </tr>
    </tbody>
  </v-table>

</template>

<script>
import { ref, onMounted} from "vue";
import { collection, query,  doc, updateDoc,where, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { formatDistanceToNow } from "date-fns";


export default {
    data: () => ({
    searchInput:'',
    loaded: false,
    loading: false,
    showModal: false,
    headers: [
      { text: 'Email', value: 'email' },
      { text: 'Last Login', value: 'lastLogin' },
    ],
    
    
    

      
  }),

  setup() {
    const users = ref([]);
    const error = ref(null);
//query for users, if the user is deleted its not shown
    const fetchUsers = async () => {
      try {
        const userRef = collection(db, "accounts");
        const q = query(userRef,where ("isDeleted", "==", false));
         onSnapshot(q, (docSnap) =>{
          users.value = docSnap.docs.map((doc) => {
            const data = doc.data();
            data.id = doc.id;
            return data;
          });
        });
        // users.value = usersArray;
        console.log(users.value);
      } catch (err) {
        error.value = err.message;
      }
    };

    onMounted(() => {
      fetchUsers();
    });

    return { users, error };
  },

  methods: {
    formatTime(timestamp) {
      const date = timestamp.toDate();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      const twelveHours = hours % 12 || 12;
      return `${twelveHours}:${minutes} ${ampm}`;
    },

    formatDate(timestamp) {
      const date = timestamp.toDate();
      const options = { month: "short", day: "numeric", year: "2-digit" };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    },

    formatDistanceToNow(timestamp) {
      const date = timestamp.toDate();
      return formatDistanceToNow(date);
    },

  onButtonClicked(user) {
    console.log("Row clicked:", user);
  },
  //user demotion, if the user is a moderator, they are demoted to a student
  async demoteUser(user){
    console.log(user.AcctEmail);
    try{
      const userRef = doc(db, "accounts", user.AcctEmail);
      await updateDoc(userRef, {
        isModerator: false,
      });
      user.isModerator = false;
    } catch (err) {
      console.log(err.message);
    }
  },
  //user promotion, if the user is a student, they are promoted to a moderator
  async promoteUser(user){
    console.log(user.AcctEmail);
    try{
      const userRef = doc(db, "accounts", user.AcctEmail);
      await updateDoc(userRef, {
        isModerator: true,
      });
      user.isModerator = true;
    } catch (err) {
      console.log(err.message);
    }
  },
  //user deletion, if the user is deleted, they are no longer shown in the table
  async deleteUser(user){
    console.log(user.AcctEmail);
    try{
      const userRef = doc(db, "accounts", user.AcctEmail);
      await updateDoc(userRef, {
        isDeleted: true,
      });
      user.isDeleted = true;
      this.showModal = false;
    } catch (err) {
      console.log(err.message);
    }
 
  },

  },
  
  computed: {
    //search bar
  filteredUsers() {
    const searchText = this.searchInput.toLowerCase();
  return this.users.filter(
    (user) =>
      user.AcctEmail.toLowerCase().includes(searchText) ||
      user.LastLogin.toString().toLowerCase().includes(searchText)
  );
  },
},
}


//   methods: {
//     onClick () {
//   this.loading = true
//   setTimeout(() => {
//     this.loading = false
//     const searchText = this.$refs.searchInput.value.toLowerCase()
//     this.filteredUsers = this.filteredUsers.filter(user => {
//       return user.name.toLowerCase().includes(searchText) ||
//              user.email.toLowerCase().includes(searchText)
//     })
//   }, 2000)
// }
// },
//     onButtonClicked (item) {
      
//       console.log('Row clicked:', item)
//     },

// }
</script>
<style>
.custom-button {
  width: 110px;
  height: 50px;

}
</style>
//done terribly by Melanie Bazgan, goodluck fixing this mess
//melaniebazgan@gmail.com