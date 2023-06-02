<template>
<!--This page was developed by Clint originally using only Flask and a JSON file
as a backend for the progress demo. It went unused in the final demonstration and version
of the code. (The new version of the page was handled by Melanie)-->

<v-container fluid>
  <v-card>
    <v-card-title class="mb-2">Reported Posts</v-card-title>
    <v-card-text>
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left">Author</th>
            <th class="text-left">Date</th>
            <th class="text-left">Content</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="post in posts" :key="post.uid">
           
            <td>{{ `${post.FirstName} ${post.LastName}`}}</td> 
            <td>{{ formatDate (post.PostDate) }}</td>
            <td>{{ post.content }}</td>
            <td class="text-right">
              <v-btn color="indigo">Repeal</v-btn>
              <v-btn color="error" class="mr-3" @click="deletePost(post)">Delete</v-btn>

            </td>
          </tr>
          <tr>
            <td colspan="5" class="border-top py-3"></td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card-text>
  </v-card>
</v-container>

</template>

<script>

import { ref, onMounted } from "vue";
import { collection, query, where,  doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";
import { formatDistanceToNow } from "date-fns";

export default {
name: "SuperUserDash",
  setup() {
    const posts = ref([]);
    const error = ref(null);

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

    async deletePost(post) {
    try {        
    const postRef = doc(db, "posts", post.id)
    await updateDoc(postRef, {
    isDeleted: true,
    });
    post.isDeleted = true;
     } catch (error) {
    console.error("Error adding report: ", error); }
  },
  computed: {
    displayedPosts() {
      return this.posts.slice(0, this.maxPosts);
    },
  },

}
}



</script>



<style scoped>
.v-card {
max-width: 80%;
margin: 5px auto;
}
td {
padding: 10px;
}
.v-btn {
margin: 0 10px;
}
.text-right {
text-align: right;
}
tbody tr {
border-top: 1px solid lightgray;
}
.black {
background-color: #000000;
}
</style>
