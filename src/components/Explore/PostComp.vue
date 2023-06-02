<template>
  <!--Developed by Clint Vega
This component is used to display the posts from all categories, regardless of liked category status
on the Explore page.-->
  <div>
    <v-card v-for="post in posts" :key="post.id" class="post ml-16 mt-8" max-width="800">
      <v-card-title class="d-flex justify-space-between align-center ">
        <div>
          <router-link class="user-link" :to="'/user/' + post.username">
            <v-avatar :image=post.profilePicture></v-avatar>
            <span class="ml-5">{{ `${post.FirstName} ${post.LastName}` }}</span>
          </router-link>
        </div>

        <v-menu offset-y>
          <template v-slot:activator="{ props }">
            <v-btn flat icon="mdi-dots-vertical" v-bind="props">
            </v-btn>
          </template>

          <v-list>
            <v-list-item v-if="currentUID === post.uid || currentUID === moderatorUID" @click="deletePost(post)">
              <div class="d-flex align-center" style="color:rgb(180, 25, 25)">
                <v-list-item-title>Delete</v-list-item-title>
                <v-icon class="ml-2">mdi-delete</v-icon>
              </div>
            </v-list-item>
            <v-list-item v-else @click="reportPost(post)">
              <div class="d-flex align-center">
                <v-list-item-title>Report</v-list-item-title>
                <v-icon class="ml-2">mdi-flag</v-icon>
              </div>
            </v-list-item>
          </v-list>
        </v-menu>

      </v-card-title>

      <v-card-text class="text-h5 py-2">
        {{ post.content }}
      </v-card-text>

      <v-card-actions>
        <v-list-item class="w-100">
          <div class="justify-self-start">
            <span class="subtitle me-2">{{ post.category }}</span>
          </div>
          <template v-slot:append>
            <div class="justify-self-end">
              <span class="subtitle me-2">{{ formatDate(post.PostDate) }}</span>
              <span class="me-2">·</span>
              <span class="subtitle me-2">{{ formatTime(post.PostDate) }}</span>
              <span class="">·</span>
              <v-btn class="me-1" @click="isLiked(post) ? unlikePost(post) : likePost(post)"
                :style="{ 'color': isLiked(post) ? '#C1121F' : 'black' }" icon>
                <v-icon v-if="!isLiked(post)">mdi-heart-outline</v-icon>
                <v-icon v-else>mdi-heart</v-icon>
              </v-btn>

              <span class="subheading me-2">{{ post.likes.length }}</span>
            </div>
          </template>
        </v-list-item>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { collection, onSnapshot, query, where, updateDoc, doc, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebase";
export default {
  name: "PostComp",
  setup() {
    const posts = ref([]);
    const error = ref(null);

    //Fetching user data to map profile picture to post
    const fetchUserData = async (uid) => {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error(`User with UID ${uid} not found`);
      }
    };

    //Function to fetch posts from all categories.
    const fetchPosts = async () => {
      try {
        const postRef = collection(db, "posts");
        const q = query(postRef, where("category", "!=", ""), where("isDeleted", "==", false));
        onSnapshot(q, async (docSnap) => {
          const usersData = await Promise.all(docSnap.docs.map(doc => fetchUserData(doc.data().uid)));
          posts.value = docSnap.docs.map((doc, index) => {
            const data = doc.data();
            data.id = doc.id;
            data.profilePicture = usersData[index].profilePicture || '';
            data.username = usersData[index].username || '';
            return data;
          });
          posts.value.sort((a, b) => b.PostDate - a.PostDate);
        });
      } catch (err) {
        error.value = err.message;
      }
    };

    //When page is loaded, fetch posts
    onMounted(() => {
      fetchPosts();
    });
    return { posts, error };
  },
  methods: {
    formatTime(timestamp) {
      if (!timestamp) {
        return '';
      }
      const date = timestamp.toDate();
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const twelveHours = hours % 12 || 12;
      return `${twelveHours}:${minutes} ${ampm}`;
    },
    formatDate(timestamp) {
      if (!timestamp) {
        return '';
      }
      const date = timestamp.toDate();
      const options = { month: 'numeric', day: 'numeric', year: '2-digit' };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    },
    //function to check if post is liked by current user
    isLiked(post) {
      return post.likes.includes(auth.currentUser.uid);
    },

    //function to like a post
    async likePost(post) {
      try {
        const uid = auth.currentUser.uid;
        const postRef = doc(db, "posts", post.id);
        // Like the post by adding the user's UID to the likes array
        await updateDoc(postRef, {
          likes: arrayUnion(uid),
        });
        post.likes.push(uid);
      } catch (error) {
        console.error("Error updating likes: ", error);
      }
    },

    //function to unlike a post
    async unlikePost(post) {
      try {
        const uid = auth.currentUser.uid;
        const postRef = doc(db, "posts", post.id);
        // Unlike the post by removing the user's UID from the likes array
        await updateDoc(postRef, {
          likes: arrayRemove(uid),
        });
        const index = post.likes.indexOf(uid);
        if (index > -1) {
          post.likes.splice(index, 1);
        }
      } catch (error) {
        console.error("Error updating likes: ", error);
      }
    },

    //function to report a post
    async reportPost(post) {
      try {
        const uid = auth.currentUser.uid;
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          reports: arrayUnion(uid),
        });
        post.reports.push(uid);
      } catch (error) {
        console.error("Error adding report: ", error);
      }
    },

    //function to delete a post
    async deletePost(post) {
      try {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
          isDeleted: true,
        });
        post.isDeleted = true;
      } catch (error) {
        console.error("Error deleting post: ", error);
      }
    },
  }
};
</script>

<style scoped>
.no-border {
  border: none;
}

.post {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1),
    0 8px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
}

.mdi-heart-outline {
  margin-top: -3px;
}

.v-btn .mdi-heart-outline:hover {
  margin-top: -3px;
  color: rgb(180, 25, 25);
  transform: scale(1.1);
}

.v-btn .mdi-heart:hover {
  margin-top: -3px;
  transform: scale(1.1);
}

.user-link {
  text-decoration: none;
  color: inherit;
}

.user-link:hover {
  text-decoration: none;
  color: inherit;
}

/*.v-btn :hover .v-btn__content::before {
    background-color: pink;
  } */</style>