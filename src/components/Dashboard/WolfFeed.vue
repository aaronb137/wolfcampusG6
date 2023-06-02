<template>
  <div >
    <div class="d-flex justify-center ml-4 mt-6" v-if="classesEmpty === true">
      <h5 class="text-h5">
        Looks like you aren't in a community yet...
      </h5>
    </div>

    <div v-else>
      <h1>Wolf Feed</h1>

      <div v-scroll.self="handleScroll" class="post-container">
        <VCard v-for="post in posts" :key="post.uid" class="post">
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
                <v-icon v-if="!isLiked(post)" >mdi-heart-outline</v-icon>
                <v-icon v-else>mdi-heart</v-icon>
              </v-btn>
              <span class="subheading ml-0">{{ post.likes.length }}</span>
            </div>
          </v-row>
        </VCard>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
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

  data() {
    return {
      menu: [],
      closedStatus: [],
      showModal: false,
    };
  },

  setup() {
    const posts = ref([]);
    const error = ref(null);
    const currentUID = ref(null);
    const classesEmpty = ref(false);
    // const moderatorUID = ref(null);

    const checkClasses = async () => {
      try {
        const classesRef = doc(collection(db, "users"), auth.currentUser.uid);

        onSnapshot(classesRef, (classSnap) => {
          const myClasses = classSnap.data()?.classes ?? [];

          if (myClasses.length != 0 || !myClasses || myClasses === undefined) {
            classesEmpty.value = false;
          } else {
            classesEmpty.value = true;
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

    const fetchUserData = async (uid) => {
      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        return userDoc.data();
      } else {
        throw new Error(`User with UID ${uid} not found`);
      }
    };

    const fetchPosts = async () => {
      await checkClasses();
      try {
        const postRef = collection(db, "posts");
        const q = query(postRef, where("isDeleted", "==", false));
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

    onMounted(() => {
      fetchPosts();
    });

    const isAuthChecked = ref(false);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        currentUID.value = auth.currentUser.uid;
      } else {
        currentUID.value = null;
      }
      isAuthChecked.value = true;
    });

    return { posts, error, currentUID, classesEmpty };
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

    isLiked(post) {
      return post.likes.includes(auth.currentUser.uid);
    },

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

    async deletePost(post) {
      this.$emit("post-to-delete", post);
    },

    async modifyPost(post) {
      this.$emit("post-selected", post);
    },

    handleScroll() {
      this.closedStatus = this.closedStatus.map(() => false);
    },
  },

  computed: {
    displayedPosts() {
      return this.posts.slice(0, this.maxPosts);
    },

    menuStatus() {
      return this.posts.map((post) => post.closedStatus);
    },
  },
};
</script>

<style scoped>
h1 {
  width: 15%;
  margin-left: 47%;
  color: black;
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
  height: 61%;
  overflow-y: scroll;
  margin-top: 20px;
  background-color: #e0e1dd;

  width: 48%;
  position: absolute;
  margin-left: 30%;
  padding-right: 1rem;
}

.post {

  background-color: white;
  margin-bottom: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1),
    0 8px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  padding: 10px;
  border-radius: 10px;
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
  background-color: white;
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