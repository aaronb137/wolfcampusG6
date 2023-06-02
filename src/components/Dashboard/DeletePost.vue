<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" max-width="500px">
        <v-card>
        <v-card-title class="headline">Confirm Deletion</v-card-title>
        <v-card-text>
          Are you sure you want to delete this post?
        </v-card-text>
        <v-card-actions>
          <v-btn style="background-color: #ce4a53;" default @click="deletePost()">Delete</v-btn>
          <v-btn style="color: #56a0ce;" default @click="dialog = false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { doc, updateDoc } from "@firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "DeleteModal",
  props: {
    deletedPost: {
      type: Object,
      default: null,
    },
  },

  data: () => ({
    currPost: null,
    dialog: false,
    err: "",
    response: "",
    goodAlert: false,
    badAlert: false,
  }),

  watch: {
    deletedPost: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.dialog = true;
          this.currPost = { ...newVal };

          console.log(this.currPost);
        } else {
          this.dialog = false;
        }
      },
    },
  },

  methods: {
    async deletePost() {
      try {
        const postRef = doc(db, "posts", this.currPost.id);
        await updateDoc(postRef, {
          isDeleted: true,
        });
        this.currPost.isDeleted = true;
        this.dialog = false;
      } catch (error) {
        console.error("Error deleting post: ", error);
      }
    },
  },
};
</script>