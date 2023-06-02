<template>
  <!--This component was designed largely by Deandre Mylove.
  The functionality was implemented by Clint Vega (other than modify post, which was implemented by Aaron Bartee)

This component dynamically load's a feed component containing only the the posts from the 
user profile that is being viewed based on the URI.-->
  <div>
    <div class="d-flex justify-center ml-4 mt-6" v-if="posts.length === 0">
      <h5 class="text-h5 mt-16">
        {{ firstname }} has no posts.
      </h5>
    </div>

    <div v-else>

      <div class="mt-16">
        <div>
          <h1>{{ firstname }}'s Feed</h1>
        </div>
        <div v-scroll.self="handleScroll" class="post-container">
          <!--Posts are displayed as a v-card -->
          <VCard v-for="post in posts" :key="post.uid" class="post" variant="outlined">
            <VCardItem class="post-header">
              <v-row no-gutters class="align-items-center justify-space-between">

                <router-link class="user-link" :to="'/user/' + post.username">
                  <v-avatar size="50" :image=post.profilePicture></v-avatar>
                </router-link>

                <router-link class="user-link  pt-3 mr-auto pl-4" :to="'/user/' + post.username">
                  <div class="author-name">
                    {{ `${post.FirstName} ${post.LastName}` }}
                  </div>

                  <div class="post-date d-flex">
                    {{ formatDistanceToNow(post.PostDate) }} ago
                  </div>
                </router-link>

                <v-menu offset-y>
                  <template v-slot:activator="{ props }">
                    <v-btn flat icon="mdi-dots-vertical" v-bind="props"> </v-btn>
                  </template>

                  <v-list>
                    <!--If current user owns the post, display delete and modify buttons-->
                    <v-list-item v-if="currentUID === post.uid" @click="deletePost(post)">
                      <div class="d-flex align-center" style="color: rgb(180, 25, 25)">
                        <v-list-item-title>Delete</v-list-item-title>
                        <v-icon class="ml-2">mdi-delete</v-icon>
                      </div>
                    </v-list-item>
                    <v-list-item v-if="currentUID === post.uid" @click="modifyPost(post)">
                      <div class="d-flex align-center" style="color: rgb(0, 0, 0)">
                        <v-list-item-title>Modify</v-list-item-title>
                        <v-icon class="ml-2">mdi-lead-pencil</v-icon>
                      </div>
                    </v-list-item>

                    <!--If current user does not own post, display report button-->
                    <v-list-item v-else @click="reportPost(post)">
                      <div class="d-flex align-center">
                        <v-list-item-title>Report</v-list-item-title>
                        <v-icon class="ml-2">mdi-flag</v-icon>
                      </div>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-row>
            </VCardItem>

            <div class="post-content">{{ post.content }}</div>
            <v-row class="d-flex justify-end pr-8">
              <div class="ml-auto">
                <v-btn class="me-1" @click="isLiked(post) ? unlikePost(post) : likePost(post)"
                  :style="{ color: isLiked(post) ? '#C1121F' : 'black' }" icon flat>
                  <v-icon v-if="!isLiked(post)">mdi-heart-outline</v-icon>
                  <v-icon v-else>mdi-heart</v-icon>
                </v-btn>
                <span class="subheading ml-0">{{ post.likes.length }}</span>
              </div>
            </v-row>
          </VCard>
        </div>
      </div>
    </div>
  </div>
</template>
  
<script>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  query,
  where,
  getDoc,
} from "@firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged } from "@firebase/auth";
import { formatDistanceToNow } from "date-fns";

export default {
  name: "WolfFeed",


  setup() {
    const route = useRoute();
    const posts = ref([]);
    const error = ref(null);
    const currentUID = ref(null);
    const username = ref(route.params.username);
    const firstname = ref("");
    const profileUID = ref('');

    //Fetch user data to grab the posts from the profile.
    const fetchUserData = async (uid) => {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error(`User with UID ${uid} not found`);
      }
    };

    //Fetch only posts where the uid matches the profile's uid 
    const fetchPosts = async () => {
      try {
        const postRef = collection(db, "posts");
        console.log(profileUID)
        const uid = profileUID.value
        const q = query(postRef, where("isDeleted", "==", false), where("uid", "==", uid));
        onSnapshot(q, async (docSnap) => {
          const usersData = await Promise.all(
            docSnap.docs.map((doc) => fetchUserData(doc.data().uid))
          );
          posts.value = docSnap.docs.map((doc, index) => {
            const data = doc.data();
            data.id = doc.id;
            data.profilePicture = usersData[index].profilePicture || "";
            data.username = usersData[index].username;
            return data;
          });
          posts.value.sort((a, b) => b.PostDate - a.PostDate);
          console.log(posts);
        });
      } catch (err) {
        error.value = err.message;
      }
    };

    //function to grab the user information whos username from the URI
    //matches the username in the user document
    const getUserData = () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('username', '==', username.value));

      onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.empty) {
          console.error(`No user found with username: ${username.value}`);
          return;
        }
        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();
        firstname.value = user.FirstName;
        profileUID.value = user.uid;

        // Call fetchPosts after setting the profileUID
        fetchPosts();
      });
    };

    //When page is loaded get user data
    onMounted(() => {
      getUserData();
    });

    //Check current uid to display or not display certain components (delete, report, etc.)
    const isAuthChecked = ref(false);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUID.value = auth.currentUser.uid;
      } else {
        currentUID.value = null;
      }
      isAuthChecked.value = true;
    });

    return { posts, error, currentUID, firstname };
  },

  methods: {


    //Function to format time since post.
    formatDistanceToNow(timestamp) {
      const date = timestamp.toDate();
      return formatDistanceToNow(date);
    },

    //function to check if post is liked
    isLiked(post) {
      return post.likes.includes(auth.currentUser.uid);
    },

    //function to like post
    async likePost(post) {
      try {
        const uid = auth.currentUser.uid;
        const postRef = doc(db, "posts", post.id);
        // Like the post by adding the user's UID to the likes array
        await updateDoc(
          postRef,
          {
            likes: arrayUnion(uid),
          },
          { merge: true }
        );
        post.likes.push(uid);
      } catch (error) {
        console.error("Error updating likes: ", error);
      }
    },

    //function to unlike post
    async unlikePost(post) {
      try {
        const uid = auth.currentUser.uid;
        const postRef = doc(db, "posts", post.id);
        // Unlike the post by removing the user's UID from the likes array
        await updateDoc(
          postRef,
          {
            likes: arrayRemove(uid),
          },
          { merge: true }
        );
        const index = post.likes.indexOf(uid);
        if (index > -1) {
          post.likes.splice(index, 1);
        }
      } catch (error) {
        console.error("Error updating likes: ", error);
      }
    },
    
    //function to report post
    async reportPost(post) {
      try {
        console.log(post)
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

    //funciton to delete post
    async deletePost(post) {
      this.$emit("post-to-delete", post);
    },
    
    //function to emit modify event to paretn
    async modifyPost(post) {
      this.$emit("post-selected", post);
    },

    handleScroll() {
      this.closedStatus = this.closedStatus.map(() => false);
    },
  },
};
</script>
  
<style scoped>
h1 {
  margin-left: 30%;
  color: black;
  margin-top: 15px;
}

.elip-menu {
  margin-left: 25rem;
}

.news-feed {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.post-container {

  overflow-y: scroll;
  margin-top: 20px;
  background-color: #e0e1dd;

  width: 40%;
  position: absolute;

  padding-right: 1rem;
}

.post {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1),
    0 8px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  margin-bottom: 8px;
  padding: 10px;
  border-radius: 10px;
  background-color: white;
}

.post-header {
  /* display: flex; */
  align-items: left;
  margin-left: -.2rem;
}

::-webkit-scrollbar {
  width: 8px;
  /* 1px wider than Lion. */
  /* This is more usable for users trying to click it. */
  background-color: rgba(0, 0, 0, 0);
  -webkit-border-radius: 100px;
}

::-webkit-scrollbar-track,
::-webkit-scrollbar-thumb {
  border: 5px solid transparent;
  border-radius: 999px;
}

::-webkit-scrollbar-thumb:vertical {
  background: rgba(0, 0, 0, 0.5);
  -webkit-border-radius: 100px;
}

::-webkit-scrollbar-thumb:vertical:active {
  background: rgba(0, 0, 0, 0.61);
  /* Some darker color when you click it */
  -webkit-border-radius: 100px;
}

::-webkit-scrollbar:hover {
  background-color: rgba(0, 0, 0, 0.09);
}

/* .avatar {
      width: 50px;
      height: 50px;
      margin-right: 10px;
      border-radius: 50%;
    } */

.author-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: black;
}

.author-name {
  font-weight: bold;
  color: black;
  font-weight: bold;
  margin-top: -0.6rem;
}

.post-date {
  color: black;
  font-size: 14px;
  margin-left: auto;
}

.post-content {
  margin-top: 2%;
  margin-left: 1rem;
  margin-bottom: .5rem;
  color: black;
  text-align: left;
}

.post-menu {
  margin-top: -0.5rem;
  margin-left: 13rem;
}



.v-btn .mdi-heart-outline:hover {
  color: rgb(180, 25, 25);
  transform: scale(1.1);
}

.v-btn .mdi-heart:hover {
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
</style>