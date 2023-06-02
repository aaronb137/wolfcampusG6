<template>
  <!-- Display a card for the book creation form if the localBook object exists -->
  <v-card v-if="localBook" v-model="dialog" max-width="600">
    <!-- Display the card title -->
    <v-card-title class="headline">Create Listing</v-card-title>
    <v-card-text>
      <!-- Display the book image -->
      <v-img :src="getBookImage(localBook)" contain></v-img>
      <!-- Display the book title as a read-only text field -->
      <v-text-field
        label="Book Title"
        v-model="localBook.volumeInfo.title"
        readonly
      ></v-text-field>
      <!-- Display the book ISBN as a read-only text field -->
      <v-text-field
        label="ISBN"
        v-model="localBook.volumeInfo.industryIdentifiers[0].identifier"
        readonly
      ></v-text-field>

      <!-- Create a form to input additional information for the book listing -->
      <v-form ref="form">
        <!-- Input field for the course name -->
        <v-text-field
          label="Course"
          v-model="localBook.volumeInfo.course"
          required
        ></v-text-field>
        <!-- Input field for the book price -->
        <v-text-field
          label="Price"
          v-model="localBook.volumeInfo.price"
          required
        ></v-text-field>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <!-- Create a button to save the listing and close the modal -->
      <v-btn
        rounded="pill"
        text
        @click="createPost(); $emit('close-other-modal')"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
// Import necessary Firebase modules
import { db, auth } from "@/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default {
  name: "CreateBookListing",
  // Define props required by the component
  props: {
    selectedBook: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      localBook: null,
      dialog: false,
    };
  },
  computed: {
    // Computed property for book information
    bookInfo: {
      get() {
        return this.selectedBook;
      },
      set(newVal) {
        this.localBook = newVal;
      },
    },
  },
  watch: {
    // Watch the selectedBook prop and update the localBook and dialog data properties accordingly
    selectedBook: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.dialog = true;
          this.localBook = newVal;
        } else {
          this.dialog = false;
        }
      },
    },
  },
  methods: {
    // Method to create a new book listing in the database
    createPost() {
      const userRef = collection(db, "users");
      const q = query(userRef, where("uid", "==", auth.currentUser.uid));
      onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const postRef = collection(db, "books");
          const payload = {
            title: this.localBook.volumeInfo.title,
            isbn: this.localBook.volumeInfo.industryIdentifiers[0].identifier,
            course: this.localBook.volumeInfo.course,
            price: this.localBook.volumeInfo.price,
            seller: doc.data().FirstName + " " + doc.data().LastName,
            sellerId: auth.currentUser.uid,
            sold: false,
            image: this.localBook.volumeInfo.imageLinks.thumbnail,
            postTime: serverTimestamp(),
          };
          addDoc(postRef, payload).catch((err) => {
            console.log(err.message);
          });
        });
      });
    },
    // Method to get the book image or a default image if not available
    getBookImage(book) {
      if (book.volumeInfo.imageLinks) {
        return book.volumeInfo.imageLinks.thumbnail;
      } else {
        return "path/to/default/image";
      }
    },
  },
};
</script>

<style scoped>

.v-card {
width: 55%;
border: 3px solid #4a6fa5;
border-style: solid;
border-radius: 25px;
margin-top: 5%;
height: 80%;
box-shadow: 0 16px 56px rgba(0, 0, 0, 0.1), 0 16px 56px rgba(0, 0, 0, 0.1),
0 16px 56px rgba(0, 0, 0, 0.1);
margin-inline: 30%;
z-index: 1;
position: absolute;
}
.headline {
text-align: center;
}

.v-btn {
background-color: #c0d6df;
height: 60%;
margin-inline: 50%;
height: 5%;
}
.v-img {
width: 50%;
height: 200px;
margin-inline: 25%;
margin-bottom: 1%;
}

.bookcontainer {
height: 70%;
overflow-y: scroll;
margin-top: 20px;
background-color: #e0e1dd;
width: 100%;
position: absolute;
}
</style>
