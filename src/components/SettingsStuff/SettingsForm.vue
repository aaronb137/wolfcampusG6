<template>
  <v-dialog v-model="deleteDialog" persistent max-width="290">
    <v-card>
      <v-card-title class="headline">Are you sure?</v-card-title>
      <v-card-text>
        You are about to delete your profile. This action cannot be undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" text @click="deleteProfile">Delete Profile</v-btn>
        <v-btn color="login" text @click="deleteDialog = false">Cancel</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-form>
    <v-alert
      v-model="badAlert"
      type="error"
      title="Error Submitting Picture"
      closable
      close-label="Close"
      :class="{ shake: badAlert }"
      v-show="err"
      style="position: fixed; z-index: 10; width: 50%; margin-bottom: 2rem"
      >{{ err }}</v-alert
    >
    <v-alert
      v-model="goodAlert"
      type="success"
      title="Post sent"
      closable
      close-label="Close"
      style="position: fixed; z-index: 10; width: 50%; margin-bottom: 2rem"
      v-if="response"
      >{{ response }}</v-alert
    >
    <v-card>
      <v-row no-gutters>
        <v-col cols="4">
          <v-img :src="profilePictureUrl" contain v-if="profilePictureUrl"
            ><template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                ></v-progress-circular>
              </v-row> </template
          ></v-img>
        </v-col>
        <v-col cols="8">
          <v-card-title> Change Profile Picture </v-card-title>
          <v-card-text>
            <v-file-input
              v-model="file"
              label="Upload Profile Picture"
              accept="image/*"
              @change="previewImage"
            ></v-file-input>
            <v-btn class="savebtn" @click="uploadPicture">Save</v-btn>
          </v-card-text>
        </v-col>
      </v-row>
    </v-card>

    <v-card>
      <v-card-title class="text-h5">About You</v-card-title>
      <v-card-text class="">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              label="Pronouns"
              v-model="Pronouns"
              outlined
              class="mt-5"
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="6">
            <v-text-field
              label="Major"
              v-model="Major"
              outlined
              class="mt-5"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div>
      <span>
        <v-btn class="login" @click="saveSettings">Save Settings</v-btn></span
      >
      <span>
        <v-btn class="deletebtn" @click="deleteDialog = true"
          >Delete Profile</v-btn
        ></span
      >
    </div>
  </v-form>
</template>

<script>
// import { ref } from 'vue'
import axios from "axios";
import ErrorService from "@/helperfuncts/errorHelper.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { auth, db } from "@/firebase";
import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  where,
  query,
  collection,
} from "firebase/firestore";

export default {
  name: "SettingsForm",
  data() {
    return {
      file: null,
      profilePictureUrl:
        "https://firebasestorage.googleapis.com/v0/b/wolfcampus-d04e6.appspot.com/o/app_images%2FDALL%C2%B7E%202023-03-05%2021.43.57%20-%20a%20wolf%20wearing%20a%20backpack%20mona%20lisa%20style%20painting.png?alt=media&token=f20b043a-8aef-49a8-893a-bf2196258fbc",
      deleteDialog: false,
      goodAlert: false,
      badAlert: false,
      err: "",
      response: ""
    };
  },
  methods: {
    previewImage(e) {
      const file = e.target.files[0];
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.profilePictureUrl = e.target.result;
      };
    },

    async pfpRetrieve() {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        auth.currentUser.uid + "/profilePicture/" + this.file
      );

      const uploadTask = uploadBytesResumable(storageRef, this.file);
      const db = getFirestore();
      const userRef = doc(db, "users", auth.currentUser.uid);
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

      this.profilePictureUrl = downloadURL;

      try {
        await setDoc(userRef, { profilePicture: downloadURL }, { merge: true });
        console.log("PFP Saved..");
      } catch (err) {
        console.log(err);
      }
    },

    // primary function that attempts to upload image to firebase
    async uploadPicture() {
      this.goodAlert = false;
      this.badAlert = false;
      let formData = new FormData();
      formData.append("image", this.file);
      formData.append("UID", auth.currentUser.uid);
      axios
        .post("http://localhost:5000/predict", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          this.goodAlert = true;
          this.response = "Image uploaded!";
          this.pfpRetrieve();
          console.log("Image saved to database:", response.data.label);
        })
        .catch((err) => {
          this.badAlert = true;
          let errorMessage = ErrorService.getErrorMessage(err.response.status);
          this.err = errorMessage;
          console.log(errorMessage);
        });
    },

    //deleting profile
    async deleteProfile() {
      try {
        // Create a query to find the document in the accounts collection where the uid field matches the current user's UID
        const accountsQuery = query(
          collection(db, "accounts"),
          where("uid", "==", auth.currentUser.uid)
        );

        // Execute the query
        const querySnapshot = await getDocs(accountsQuery);

        // Check if a matching document is found
        if (!querySnapshot.empty) {
          // Get the document ID of the matching account document
          const matchingAccountId = querySnapshot.docs[0].id;
          console.log(matchingAccountId);
          // Update the isDeleted field of the matching account document using the document ID
          const accountDocRef = doc(db, "accounts", matchingAccountId);
          await updateDoc(accountDocRef, {
            isDeleted: true,
          });
        } else {
          console.error("Account document not found");
        }
      } catch (error) {
        console.error("Error deleting profile:", error);
      }
      this.deleteDialog = false;
    },
  },
};
</script>

<style scoped>
.v-form {
  background-color: white;
  width: 50%;
  margin-left: 25%;
  margin-top: 5%;
  border-radius: 10px;
  height: 75%;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.1), 0 16px 56px rgba(0, 0, 0, 0.1),
    0 16px 56px rgba(0, 0, 0, 0.1);
}
.v-card {
  background-color: white;
  border-width: 5px;
  margin: 5%;
  height: 35%;
}

.login {
  background-color: #56a0ce;
  border-color: #56a0ce;
  margin-left: 5%;
  width: 20%;
}

.deletebtn {
  background-color: #ce4a53;
  border-color: red;
  margin-left: 50%;
  width: 20%;
}

.v-img {
  height: 100%;
  width: 100%;
}

.savebtn {
  margin-left: 10%;
  background-color: #56a0ce;
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

.v-text-field,
.v-select,
.v-checkbox {
  margin-bottom: 16px;
}
</style>
