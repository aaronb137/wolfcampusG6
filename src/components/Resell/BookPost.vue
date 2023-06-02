<template>
  <v-card>
    <!-- Display the card title -->
    <v-card-title class="headline">Search Books</v-card-title>
    <v-card-text>
      <!-- Create a text field to input the search query -->
      <v-text-field
        class="query"
        v-model="query"
        label="Search For Book"
      ></v-text-field>
      <!-- Create a button to trigger the searchBooks method -->
      <v-btn class="search" @click="searchBooks">Search</v-btn>
      <!-- Display the search results in a container -->
      <div class="bookcontainer">
        <v-list>
          <!-- Loop through the search results and display each book -->
          <v-list-item
            v-for="book in books"
            :key="book.id"
            @click="selectBook(book)"
          >
            <!-- Display the book thumbnail -->
            <v-img :src="getBookImage(book)" contain></v-img>
            <!-- Display the book title -->
            <v-list-item-title>{{ book.volumeInfo.title }}</v-list-item-title>
            <!-- Display the book author(s) -->
            <v-list-item-subtitle>{{
              book.volumeInfo.authors
            }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  name: "BookPost",
  data() {
    return {
      query: "",
      books: [],
      selectedBook: null,
    };
  },

  methods: {
    // Function to search for books using the Google Books API
    searchBooks() {
      axios
        .get("https://www.googleapis.com/books/v1/volumes", {
          params: {
            q: this.query,
          },
        })
        .then((response) => {
          // Update the books data with the search results
          this.books = response.data.items;
          this.currentPage = 1;
        })
        .catch((error) => {
          // Log any errors that occur during the search
          console.error(error);
        });
    },

    // Function to get the book image URL
    getBookImage(book) {
      if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
        return book.volumeInfo.imageLinks.thumbnail;
      } else {
        // Return a default image if no image is available
        return "https://via.placeholder.com/128x192?text=No%20Image";
      }
    },

    // Function to handle book selection
    selectBook(book) {
      this.selectedBook = book;
      // Emit an event to notify the parent component of the selected book
      this.$emit('book-selected', this.selectedBook);
    },
  },
};
</script>

<style scoped>
.v-card {
  width: 45%;
  
  background-color: #ffffff;
  border-radius: 10px;
  margin-top: 5%;
  height: 700px;
  box-shadow: 0 16px 56px rgba(0, 0, 0, 0.1), 0 16px 56px rgba(0, 0, 0, 0.1),
    0 16px 56px rgba(0, 0, 0, 0.1);
  margin-inline: 28%;
  z-index: 1;
  position: absolute;
}
.search {
  left: 5%;
  background-color: #56a0ce;
  color: black;
  margin-top: 10px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.headline {
  text-align: center;
}

.query {
  margin-left: 5%;
  width: 90%;
  color: #56a0ce;
  border: 2px solid #56a0ce;
}
.v-img {
  width: 50%;
  height: 192px;
}

.bookcontainer {
  height: 70%;
  overflow-y: scroll;
  margin-top: 20px;

  background-color: #ffffff;
  width: 100%;
  position: absolute;
}
</style>
