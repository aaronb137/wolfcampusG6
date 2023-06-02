<template>
  <!-- Row to display notes -->
  <v-row>
    <!-- Loop through notes array and display each note in a column -->
    <v-col v-for="note in notes" :key="note" class="d-flex" cols="3">
      <!-- Card to display note information -->
      <v-card class="notecards">
        <!-- Display the note image and handle click event to show the modal -->
        <div @click="showModal(note.noteImage)">
          <v-img :src="note.noteImage" cover max-height="250" class="nimage">
            <!-- Placeholder for the image while it's loading -->
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular
                  indeterminate
                  color="grey-lighten-5"
                ></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </div>
        <!-- Divider between the image and the note title -->
        <v-divider thickness="2"></v-divider>
        <!-- Display note title -->
        <p class="note-title">{{ note.noteTitle }}</p>
        <!-- Divider between note title and course -->
        <v-divider class="dividers"></v-divider>
        <!-- Display course -->
        <p>{{ note.course }}</p>
        <!-- Divider between course and description -->
        <v-divider class="dividers"></v-divider>
        <!-- Display description -->
        <p>{{ note.description }}</p>
        <!-- Divider between description and user name -->
        <v-divider class="dividers"></v-divider>
        <!-- Display user name -->
        <p>{{ note.name }}</p>
      </v-card>
    </v-col>

    <!-- Dialog for displaying the image preview -->
    <v-dialog
      v-model="modal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card class="popup">
        <!-- Toolbar for image preview modal -->
        <v-toolbar>
          <!-- Close button for the modal -->
          <v-btn icon dark @click="modal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <!-- Title for the toolbar -->
          <v-toolbar-title>Image Preview</v-toolbar-title>
          <!-- Spacer to align the download button to the right -->
          <v-spacer></v-spacer>
          <!-- Download button for the image -->
          <v-toolbar-items>
            <v-btn dark text @click="downloadImage">
              Download
              <v-icon right>mdi-download</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <!-- Display the selected image in the modal -->
        <v-img :src="selectedImage" cover class="modal-image"></v-img>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "@/firebase";

export default {
  name: "NotesLists",

  setup() {
    // Reference to hold notes data
    const notes = ref([]);

    // Function to fetch notes from the firestore database
    const fetchNotes = async () => {
      // Reference to the notes collection
      const notesCollection = collection(db, "notes");
      // Create a query to order notes by upload date in descending order
      const q = query(notesCollection, orderBy("uploadDate", "desc"));

      // Subscribe to snapshot changes and update notes data
      const unsubscribe = onSnapshot(q, (snapshot) => {
        notes.value = snapshot.docs.map((doc) => doc.data());
      });

      // Unsubscribe from snapshot changes when the component is unmounted
      onUnmounted(() => {
        unsubscribe();
      });
    };

    // Call fetchNotes function when the component is mounted
    onMounted(fetchNotes);

    // Modal state and selected image reference
    const modal = ref(false);
    const selectedImage = ref("");

    // Function to show the modal with the selected image
    const showModal = (imageSrc) => {
      selectedImage.value = imageSrc;
      modal.value = true;
    };

    // Function to download the selected image
    const downloadImage = () => {
      const link = document.createElement("a");
      link.href = selectedImage.value;
      link.download = "image";
      link.target = "_blank";
      link.click();
    };

    // Return the required properties and methods
    return {
      notes,
      modal,
      selectedImage,
      showModal,
      downloadImage,
    };
  },
};
</script>

<style scoped>
.nimage {
  width: 100%;
}

.modal-image {
  width: 60%;
  height: 75%;
  margin-inline: 20%;
}

.notecards {
  background-color: white;
  /* margin: 10%; */
  margin-top: 3%;
  margin-right: 5%;
  margin-left: 25%;

  padding: 0.5rem;
  line-height: 1.5;
  width: 100%;
  height: 400px;
}

.notecards:hover {
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.note-title {
  text-align: center;
  color: black;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 90%;
  margin: 0 auto;
}

p {
  text-align: center;
  color: black;
  margin-left: 5%;
}

.dividers {
  border-color: #05668d;
  border-width: 1px;
}

.v-dialog {
  height: 70%;
  width: 50%;
}

.v-toolbar {
  background-color: white;
  color: black;
}
</style>
