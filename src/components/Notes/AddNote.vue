<template>
  <!-- Note card -->
  <v-card>
    <!-- Note card title -->
    <v-card-title>
      <v-card-title class="headline">Post Notes</v-card-title>
    </v-card-title>
    <!-- Display the note image if available -->
    <v-img :src="noteImage" contain v-if="noteImage"></v-img>
    <!-- Input fields for note details -->
    <v-card-text>
      <!-- File input for note image -->
      <v-file-input
        label="File input"
        accept="image/*"
        variant="outlined"
        @change="previewImage"
      ></v-file-input>

      <!-- Input field for note title -->
      <v-text-field
        v-model="noteTitle"
        label="Note Title"
        required
      ></v-text-field>
      <!-- Input field for course -->
      <v-text-field
        v-model="course"
        item-text="courseName"
        label="Course"
        required
      ></v-text-field>
      <!-- Input field for description -->
      <v-text-field
        v-model="description"
        label="Description"
        required
      ></v-text-field>
    </v-card-text>
    <!-- Save button for the note -->
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        class="savebtn"
        @click="
          uploadNote();
          $emit('close-modal');
        "
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// Import required Firebase modules
import { auth, db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
  getStorage,
  uploadBytesResumable,
  ref,
  getDownloadURL,
} from "firebase/storage";

export default {
  name: "AddNote",

  setup() {
    // Reference to the note image
    const noteImage = ref(
      "https://firebasestorage.googleapis.com/v0/b/wolfcampus-d04e6.appspot.com/o/app_images%2FDALL%C2%B7E%202023-05-02%2021.38.26%20-%20wolf%20taking%20notes%20in%20a%20mona%20lisa%20style%20painting.png?alt=media&token=f590fdf3-fa14-43ac-a335-e443c63f777c"
    );

    return {
      noteImage,
    };
  },
  data() {
    return {
      file: null,
      imageUrl: "",
      noteTitle: "",
      description: "",

      course: "",
    };
  },

  methods: {
    // Preview the image uploaded by the user
    previewImage(e) {
      const file = e.target.files[0];
      this.file = file;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        this.noteImage = e.target.result;
      };
    },

    // Upload the note to the database
    async uploadNote() {
      const storage = getStorage();
      const file = this.file;
      const storageRef = ref(storage, "notes/" + file.name);

      // 'file' comes from the Blob or File API
      const uploadTask = uploadBytesResumable(storageRef, file);

      // Monitor the progress of the upload
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          // Handle unsuccessful uploads
          console.log(error);
        },
        async () => {
          // Handle successful uploads on complete
          // For instance, get the download URL: https://firebasestorage.googleapis.com/...
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at", downloadURL);
          this.noteImage = downloadURL;

          // Save the note data to Firestore
          const uid = auth.currentUser.uid;
          const displayName = auth.currentUser.displayName;
          const docRef = await addDoc(collection(db, "notes"), {
            noteTitle: this.noteTitle,
            course: this.course,
            description: this.description,
            uid: uid,
            name: displayName,
            noteImage: this.noteImage,
            uploadDate: serverTimestamp(),
          });
          console.log("Document written with ID: ", docRef.id);
        }
      );
    },
  },
};
</script>

<style scoped>
.v-card {
  width: 40%;
  border: 3px solid #4a6fa5;
  border-style: solid;
  border-radius: 25px;
  margin-top: 6%;
  height: 675px;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.1), 0 16px 56px rgba(0, 0, 0, 0.1),
    0 16px 56px rgba(0, 0, 0, 0.1);
  margin-inline: 30%;
  z-index: 1;
  position: absolute;
}

.v-card-title {
  color: black;
  text-align: center;
}

.savebtn {
  background-color: #56a0ce;
  color: black;
  margin-inline: 40%;
  width: 20%;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.v-img {
  width: 50%;
  height: 200px;
  margin-inline: 25%;
}

@media (max-width: 600px) {
  .v-card {
    width: 80%;
    margin: 10% auto;
  }
}
</style>
