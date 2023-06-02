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
        label="Search reports by name or content"
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
          Author
        </th>
        <th class="text-left">
          Date
        </th>
        <th class="text-left">
          Content
          </th>  
          <th class="text-left">
          Actions
          </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="post in filteredPosts" :key="post.uid">
        <td class="border-black">{{ `${post.FirstName} ${post.LastName}`}}</td>
        <td class="border-black">{{ formatDate (post.PostDate) }}</td>
        <td class="border-black">{{ post.content }}</td>
        <td class="border-black">
            <v-btn class="custom-button" color="indigo" @click="repealPost(post)">
              Repeal
            </v-btn>
          </td>
          <td class="border-black">
            <v-btn class="custom-button" color="error" @click="showModal = true">
              Delete
              
            <v-icon
          end
          icon="mdi-cancel"
        ></v-icon>
        <v-dialog v-model="showModal" max-width="500px">
      <v-card>
      <v-card-title class="headline">Confirm Delete</v-card-title>
      <v-card-text>
        Are you sure you want to delete this post?
      </v-card-text>
      <v-card-actions>
        <v-btn color="green" text @click="deletePost(post)">Yes</v-btn>
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

import { ref, onMounted } from "vue";
import { collection, query, where,  doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { formatDistanceToNow } from "date-fns";

export default {
name: "SuperUserDash",
data: () => ({
  searchInput:'',
  loaded: false,
  loading: false,
  showModal: false,
}),
setup() {
  const posts = ref([]);
  const error = ref(null);
// fetches posts from firebase
  const fetchPosts = async () => {
    try {
      const postRef = collection(db, "posts");
      const q = query(postRef, where("isDeleted", "==", false));
      onSnapshot(q, (docSnap) => {
        posts.value = docSnap.docs.map((doc) => {
        const data = doc.data();
        data.id = doc.id;
        return data;
    });
    });
      
      console.log(posts.value);
    } catch (err) {
      error.value = err.message;
    }
  };

  onMounted(() => {
    fetchPosts();
  });

  return { posts, error };
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
//deletes post from firebase
  async deletePost(post) {
  try {        
  const postRef = doc(db, "posts", post.id)
  await updateDoc(postRef, {
  isDeleted: true,
  });
  post.isDeleted = true;
  this.showModal= false;
   } catch (error) {
  console.error("Error adding report: ", error); }
  },
  //repears post from firebase, sets isDeleted to false, and removes reports count
  async repealPost(post) {
  try {
  const postRef = doc(db, "posts", post.id)
  await updateDoc(postRef, {
  isDeleted: false,
  reports:null,
  });
  // post.isDeleted = false;
   } catch (error) {
    console.error("Error adding report: ", error); }
   }

},

onButtonClicked(post) {
  console.log("Row clicked:", post);
},

computed: {
//search bar
  filteredPosts() {
  const searchText = this.searchInput.toLowerCase();
return this.posts.filter(
  (post) =>
    post.FirstName.toLowerCase().includes(searchText) ||
    post.LastName.toLowerCase().includes(searchText) ||
    post.content.toLowerCase().includes(searchText)
);
},
},

}

</script>
<style>
.custom-button {
width: 110px;
height: 50px;

}
</style>
//done terribly by Melanie Bazgan, goodluck fixing this mess
//melaniebazgan@gmail.com