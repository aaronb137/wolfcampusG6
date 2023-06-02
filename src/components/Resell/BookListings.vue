<template>
  <v-row>
    <!-- Loop through books and display a card for each book -->
    <v-col v-for="book in books" :key="book" class="d-flex" cols="3">
      <VCard class="bookcards">
        <!-- Display the book image -->
        <v-img :src="book.image" cover class="bimage"></v-img>
        <VDivider thickness="2"></VDivider>
        <!-- Display the book title -->
        <p class="book-title">{{ book.title }}</p>
        <VDivider class="dividers"></VDivider>
        <!-- Display the book ISBN -->
        <p>{{ book.isbn }}</p>
        <VDivider class="dividers"></VDivider>
        <!-- Display the course associated with the book -->
        <p>{{ book.course }}</p>
        <VDivider class="dividers"></VDivider>
        <!-- Display the book price -->
        <p>${{ book.price }}</p>
        <VDivider class="dividers"></VDivider>
        <!-- Display the seller's name -->
        <p>{{ book.seller }}</p>
        <!-- Uncomment the following lines if you want to display the post time for each book -->
        <!--<VDivider class="dividers"></VDivider>-->
        <!--<p> {{ book.postTime }}</p>-->
      </VCard>
    </v-col>
  </v-row>
</template>

<script>
import { db } from "@/firebase";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { ref, onMounted, onUnmounted } from "vue";

export default {
  name: "BookListings",

  setup() {
    // Reference to hold books data
    const books = ref([]);

    // Function to fetch books from the firestore database
    const getBooks = () => {
      // Reference to the books collection
      const booksRef = collection(db, "books");
      // Create a query to order books by post time in descending order
      const q = query(booksRef, orderBy("postTime", "desc"));

      // Subscribe to snapshot changes and update books data
      const unsubscribe = onSnapshot(q, (snapshot) => {
        books.value = snapshot.docs.map((doc) => doc.data());
      });

      // Unsubscribe from snapshot changes when the component is unmounted
      onUnmounted(() => {
        unsubscribe();
      });
    };

    // Call getBooks function when the component is mounted
    onMounted(getBooks);
    // Return the required properties
    return { books };
  },
};
</script>

<style scoped>
.bimage {
  width: 100%;
  height: 70%;
}

.bookcards {
  background-color: whitesmoke;
  /* margin: 10%; */
  margin-top: 3%;
  margin-right: 5%;
  margin-left: 25%;

  padding: 0.5rem;
  line-height: 1.5;
  width: 100%;
  height: 450px;
}

.bookcards:hover {
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.book-title {
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
}

.dividers {
  border-color: #05668d;
  border-width: 1px;
}
</style>
