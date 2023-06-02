<template>
  <!--Developed by Clint Vega
This component is used to create new posts to the explore page, it takes the post content and category as inputs-->
  <v-form>
    <v-card>
      <v-card-title class="text-h5">New Post</v-card-title>

      <v-text-field v-model="postContent" label="New Post" variant="outlined"
        style="max-width: 95%; border:none; min-height: 210px; margin-bottom: -60px;"></v-text-field>

      <v-select v-model="selectedCategory" :items="categories.map(category => category.title)" label="Select a category"
        style="max-width: 30%; margin-left: 2%; border:none; margin-top:-3px;"></v-select>

      <v-row style="justify-content: center;">
        <v-col cols="4">
          <v-btn class="saveBtn" style="margin-left: -4px;" block @click="submitPost(); $emit('cancel-post')">Post</v-btn>
        </v-col>
        <v-col cols="4">
          <v-btn class="cancelBtn" block @click="$emit('cancel-post')">Cancel</v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-form>
</template>
  
<script>
import { ref } from 'vue';
import { db, auth } from "@/firebase";
import { collection, serverTimestamp, addDoc, onSnapshot, getDoc, doc } from "firebase/firestore";
export default {
  name: "ExplorePost",
  setup() {
    // Create a ref for the categories collection
    const categories = ref([]);
    const categoriesRef = collection(db, 'categories');

    // Listen for changes to the categories collection
    //Used to populate the category dropdown that the user will assign their post to.
    onSnapshot(categoriesRef, (querySnapshot) => {
      const newCategories = [];
      querySnapshot.forEach((doc) => {
        newCategories.push({ id: doc.id, ...doc.data() });
      });
      categories.value = newCategories;
    });

    return { categories };
  },
  data() {
    return {
      postContent: "",
      selectedCategory: ""
    };
  },
  methods: {

    //When user clicks submit, their post information is added to a new
    //document in the posts collection, including the inputted content and category.
    async submitPost() {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      const res = await addDoc(collection(db, "posts"), {
        content: this.postContent,
        category: this.selectedCategory,
        PostDate: serverTimestamp(),
        uid: auth.currentUser.uid,
        FirstName: userSnap.data().FirstName,
        LastName: userSnap.data().LastName,
        likes: [],
        isDeleted: false
      });
      this.postContent = "";
      this.selectedCategory = "";
    },


  },
};
</script>
  
<style scoped>
.v-form {

  position: absolute;
  z-index: 1;
  margin-left: 25%;
  margin-right: 25%;
  margin-top: 5%;
  margin-bottom: 5%;
  width: 50%;
}

.v-card {
  border-radius: 10px;
  margin: 5%;
  height: 92%;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.1), 0 16px 56px rgba(0, 0, 0, 0.1),
    0 16px 56px rgba(0, 0, 0, 0.1);
}

.v-card-title {
  color: black;
  text-align: center;
}

.v-avatar {
  height: 100%;
  width: 100%;
  margin: 5px;
}

.v-btn {


  border-width: 2px;
  margin-left: 11%;
  margin-bottom: 3%;
}

.v-text-field {
  border-color: #4a6fa5;
  border: solid;
  border-width: 2px;
  margin-left: 2%;
}

@media (max-width: 600px) {
  .v-card {
    width: 80%;
    margin: 10% auto;
  }
}

.addClass {
  /* margin-left: 11%; */
  margin-bottom: 3%;
  margin-inline: 40%;
  background-color: #c0d6df;
}

.saveBtn {
  background-color: #56a0ce;
  border: none;
}

@media (max-width: 400px) {
  .v-card {
    width: 90%;
    margin: 20% auto;
  }
}
</style>