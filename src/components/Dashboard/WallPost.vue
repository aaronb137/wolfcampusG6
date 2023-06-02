<template>
  <v-container class="p-Container">
    <v-alert
      v-model="badAlert"
      type="error"
      title="Error Submitting Post"
      closable
      close-label="Close"
      :class="{ shake: badAlert }"
      v-if="err"
      >{{ err }}</v-alert
    >
    <v-alert
      v-model="goodAlert"
      type="success"
      title="Post sent"
      closable
      close-label="Close"
      v-if="response"
      >{{ response }}</v-alert
    >
    <v-textarea
      clearable
      clear-icon="mdi-close-circle"
      label="Post to your wall"
      no-resize=""
      v-model="postContent"
    ></v-textarea>
    <v-btn @click="submitPost" >Submit</v-btn>
  </v-container>
</template>

<script>
import axios from "axios";
import { auth, db } from "@/firebase/index";
import { getDoc, doc } from "firebase/firestore";
import ErrorService from "@/helperfuncts/errorHelper.js";
export default {
  name: "WallPost",
  data() {
    return {
      postContent: "",
      err: "",
      response: "",
      goodAlert: false,
      badAlert: false,
    };
  },
  methods: {
    currentDate() {
      const current = new Date();
      const date =
        `${
          current.getMonth() + 1
        }/${current.getDate()}/${current.getFullYear()}` +
        " " +
        `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`;
      return date;
    },
    async submitPost() {
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userSnap = await getDoc(userRef);
      this.goodAlert = false;
      this.badAlert = false;
      axios
        .post("http://localhost:5000/process", {
          content: this.postContent,
          uid: auth.currentUser.uid,
          firstname: userSnap.data().FirstName,
          lastname: userSnap.data().LastName,
        })
        .then((response) => {
          this.goodAlert = true;
          this.response = "Post submitted!";
          console.log("Post saved to database:", response.data);
        })
        .catch((err) => {
          this.badAlert = true;
          let errorMessage = ErrorService.getErrorMessage(err.response.status);
          this.err = errorMessage;
          console.log(errorMessage);
        });
      // Clear the textarea content
      this.postContent = "";
    },
  },
};
</script>
<style scoped>
.p-Container {
  width: 48%;
  margin-left: 29%;
  
}
.shake {
  animation: shake 0.5s;
}
.v-textarea {
  border-radius: 10px;
  background-color: white;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
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
.shake {
  animation: shake 0.5s;
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>