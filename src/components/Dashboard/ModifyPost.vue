<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" width="720">
      <v-card :class="{ shake: badAlert }">
        <v-alert
          v-model="badAlert"
          type="error"
          title="Error Submitting Post"
          closable
          close-label="Close"
          v-if="err"
          >{{ err }}</v-alert
        >
        <v-card-title style="margin-top: 0.5rem">
          <span><v-icon>mdi-lead-pencil</v-icon></span>
          <span class="text-h5 bold ml-4">Modify Your Post</span>
          <span></span>
        </v-card-title>

        <v-container style="margin-bottom: -2.4rem;">
          <v-textarea
            clearable
            clear-icon="mdi-close-circle"
            variant="outlined"
            no-resize=""
            v-model="currPost.content"
          ></v-textarea>
        </v-container>
        <v-card-actions>
          <v-btn
            @click="
              modifyPost();
              $emit('closeModify');
            "
            variant="default"
            style="background-color: #56a0ce; margin: .5rem;"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import axios from "axios";
import ErrorService from "@/helperfuncts/errorHelper.js";
export default {
  name: "ModifyModal",
  props: {
    selectedPost: {
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
    selectedPost: {
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
    async modifyPost() {
      this.goodAlert = false;
      this.badAlert = false;
      const originalContent = this.currPost.content;
      axios
        .post("http://localhost:5000/modify", {
          content: this.currPost.content,
          postID: this.currPost.id,
        })
        .then((response) => {
          this.response = "Post modified!";
          this.goodAlert = true;
          this.$emit("good-post", this.goodAlert);
          console.log("Post modified on database:", response.data);
        })
        .catch((err) => {
          this.badAlert = true;
          this.$emit("postHandler", this.badAlert);
          let errorMessage = ErrorService.getErrorMessage(err.response.status);
          this.err = errorMessage;
          console.log(err);
          this.currPost.content = originalContent;
        });
    },
  },
};
</script>

<style scoped>
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
