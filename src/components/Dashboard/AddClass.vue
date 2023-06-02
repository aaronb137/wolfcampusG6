<!-- Vue.js single-file component for adding classes to a user's account -->
<template>
  <v-form>
    <v-card>
      <!-- Title of the form -->
      <v-card-title class="text-h5">Add Class</v-card-title>
      <!-- Carousel component for displaying multiple class input fields -->
      <v-carousel
        hide-delimiter-background
        delimiter-icon="mdi-square"
        show-arrows="hover"
        height=""
      >
        <!-- Carousel item for each class, using v-for to loop through classes -->
        <v-carousel-item v-for="(classData, index) in classes" :key="index">
          <v-card-text class="">
            <!-- Input field for class prefix -->
            <v-col cols="12" md="12">
              <v-text-field
                :label="'Class Prefix ' + (index + 1)"
                v-model="classData.prefix"
                type="text"
                outlined
                :color="colors[index % colors.length]"
              ></v-text-field>
            </v-col>
            <!-- Input field for class number -->
            <v-col cols="12" md="12">
              <v-text-field
                :label="'Class Number ' + (index + 1)"
                v-model="classData.number"
                type="number"
                outlined
                :color="colors[index % colors.length]"
              ></v-text-field>
            </v-col>
          </v-card-text>
          <!-- Divider to separate carousel items -->
          <v-divider class="mb-2"></v-divider>
        </v-carousel-item>
      </v-carousel>
      <!-- Container for Save and More Classes buttons -->
      <div>
        <span>
          <!-- Save button, triggers saveSettings method and emits 'close-modal' event -->
          <v-btn
            class="saveBtn"
            @click="
              saveSettings();
              $emit('close-modal');
            "
            >Save</v-btn
          ></span
        >
        <!-- More Classes button, triggers addClass method -->
        <span>
          <v-btn class="addClass" @click="addClass"> More Classes </v-btn>
        </span>
      </div>
    </v-card>
  </v-form>
</template>
<!-- Vue.js single-file component for adding classes to a user's account -->
<script>
// Imports necessary Firebase Firestore functions
import { db, auth } from "@/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";

export default {
  name: "AddClass",
  data() {
    return {
      // Array of class objects with prefix and number properties
      classes: [
        {
          prefix: "",
          number: null,
        },
      ],
      // Array of colors for input field styling
      colors: ["blue", "green", "pink", "purple", "orange", "white"],
    };
  },
  methods: {
    // saveSettings method: saves class data to Firestore
    async saveSettings() {
      // Get user Firestore document reference and fetch user document
      const userRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      // Get existing classes from user document or initialize empty array
      const existingClasses = userDoc.exists()
        ? userDoc.data().classes || []
        : [];
      // Create newClasses array with cleaned class data
      const newClasses = this.classes.map((classData) => ({
        prefix: classData.prefix.replace(/\s+/g, "").toUpperCase(),
        number: classData.number.replace(/\s+/g, ""),
      }));

      // Filter out classes that already exist in existingClasses
      const uniqueNewClasses = newClasses.filter((newClass) => {
        return !existingClasses.some(
          (existingClass) =>
            existingClass.prefix === newClass.prefix &&
            existingClass.number === newClass.number
        );
      });
      // Merge existingClasses and uniqueNewClasses arrays
      const allClasses = [...existingClasses, ...uniqueNewClasses];
      // Update user document with the new classes array
      await updateDoc(userRef, { classes: allClasses });

      // Iterate through newClasses array
      newClasses.forEach(async (classData) => {
        // Get class Firestore document reference and fetch class document
        const classRef = doc(
          db,
          "classes",
          classData.prefix + " " + classData.number
        );
        const classDoc = await getDoc(classRef);
        // Get existing students from class document or initialize empty array
        const existingStudents = classDoc.exists()
          ? classDoc.data().students || []
          : [];

        // Check if the student is not already in the existingStudents array
        if (!existingStudents.includes(auth.currentUser.uid)) {
          // Merge existingStudents and current user's uid
          const allStudents = [...existingStudents, auth.currentUser.uid];

          // Update class document with the new students array
          await setDoc(classRef, { students: allStudents }, { merge: true });
          // Emit 'add-class' event to parent component
          this.$emit("add-class");
        }
      });
    },

    // addClass method: adds a new empty class object to the classes array
    addClass() {
      this.classes.push({
        prefix: "",
        number: null,
      });
    },
  },
};
</script>
<!-- Scoped CSS styles for the AddClass component -->
<style scoped>
.v-form {
  position: absolute;
  z-index: 1;
  margin-left: 25%;
  margin-right: 25%;
  margin-top: 5%;
  height: 45%;
  margin-bottom: 5%;
  width: 50%;
}
.v-card {
  border-radius: 10px;
  margin: 5%;
  height: 100%;
  box-shadow: 0 16px 72px rgba(0, 0, 0, 0.1), 0 16px 72px rgba(0, 0, 0, 0.1),
    0 16px 72px rgba(0, 0, 0, 0.1);
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


.v-text-field {
  border-color: #4a6fa5;
  border: solid;
  border-width: 2px;
  margin-left: 2%;
}

@media (max-width: 600px) {
  .v-card {
    width: 80%;
    margin: 10% auto;
  }
}

.addClass {
  /* margin-left: 11%; */
width: 20%;
  margin-left: 57%;
  background-color: #c0d6df;
}

.saveBtn {
  background-color: #56a0ce;
  
  margin-left: 6%;
}

@media (max-width: 400px) {
  .v-card {
    width: 90%;
    margin: 20% auto;
  }
}
</style>
