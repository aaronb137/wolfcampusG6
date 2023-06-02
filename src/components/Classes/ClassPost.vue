<template>
  <!--Developed by Clint Vega
This component is used to dynamically post to a given class based on the URI-->
  <v-container>
    <!--Text area taking post content as an input-->
    <v-textarea clearable clear-icon="mdi-close-circle" label="Post to your wall" no-resize=""
      v-model="postContent"></v-textarea>
    <v-btn @click="submitPost">Submit</v-btn>
  </v-container>
</template>

<script>
import { db, auth } from '@/firebase/index'
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { ref } from 'vue'
import { useRoute } from "vue-router";
export default {
  name: "ClassPost",
  setup() {

  },
  data() {

    //Using URI to load prefix and number variables to write to appropriate class
    const route = useRoute();
    const classPrefix = ref(route.params.classPrefix);
    const classNumber = ref(route.params.classNumber);
    return {
      postContent: "",
      classPrefix,
      classNumber,

    };
  },
  methods: {

    //Submits post information and class information to a newly created post document to be added
    //to the posts collection
    async submitPost() {
      try {
        if (this.postContent.trim() !== "") {
          const res = await addDoc(collection(db, "posts"), {
            content: this.postContent,
            PostDate: serverTimestamp(),
            uid: auth.currentUser.uid,
            classPrefix: this.classPrefix,
            classNumber: this.classNumber,
            FirstName: auth.currentUser.displayName.split(' ')[0],
            LastName: auth.currentUser.displayName.split(' ')[1],
            postType: "post",
            likes: [],
            isDeleted: false,
            reports: []
          });
          console.log(res);
          this.postContent = "";
        } else {
          console.log("Post content is empty.");
        }
      } catch (error) {
        console.error("Error submitting post:", error);
      }
    },
  },
};
</script>

<style scoped>
.v-container {
  width: 40%;
  /* margin-right: 25%; */
  margin-left: 35%;
}

.v-textarea {

  border-radius: 10px;
  background-color: white;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 8px 8px rgba(0, 0, 0, 0.1),
    0 8px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;

}

.v-btn {
  background-color: #56a0ce;
  color: black;
  margin-top: 10px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
</style>