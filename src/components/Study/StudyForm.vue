<template>
  <div class="form-container">
    <div style="text-align: center">
      <legend>
        <h1>
          <b>{{
            formEditMode ? "Edit Study Session" : "Create a Study Session"
          }}</b>
        </h1>
      </legend>
    </div>
    <form>
      <fieldset>
        <div class="form-row">
          <label for="name"
            ><b><u>Select Class:</u></b></label
          >
          <input type="text" id="name" v-model="form.name" />
        </div>
        <div class="form-row">
          <label for="date"
            ><b><u>Date:</u></b></label
          >
          <input type="date" id="date" v-model="form.date" />
        </div>
        <div class="form-row">
          <label for="time"
            ><b><u>Time:</u></b></label
          >
          <v-time-picker v-model="picker"></v-time-picker>
          <input type="time" id="time" v-model="form.time" />
        </div>
        <div class="form-row">
          <label for="message"
            ><b><u>Study Session Title:</u></b></label
          >
          <textarea id="message" v-model="form.message"></textarea>
        </div>
        <div class="form-row">
          <label for="location"
            ><b><u>Study Session Location:</u></b></label
          >
          <select
            id="location"
            v-model="form.location"
            @change="checkCustomLocation"
          >
            <option value="">Please Select a Location</option>
            <option value="Location A">Mathewson-IGT Knowledge Center</option>
            <option value="Location B">Davidson Math and Science Center</option>
            <option value="Location C">
              William Pennington Engineering Building
            </option>
            <option value="Location D">
              William N. Pennington Student Achievement Center
            </option>
            <option value="Location E">William Raggio Building</option>
            <option value="Location F">Joe Crowley Student Union</option>
            <option value="Location G"><b>Custom Location</b></option>
            <!-- add more options for other locations as needed -->
          </select>
          <input
            type="text"
            v-model="customLocation"
            v-if="isCustomLocationSelected"
            placeholder="Enter a custom location"
            required
          />
        </div>

        <div class="form-row">
          <label for="room"
            ><b><u>Room Number:</u></b></label
          >
          <input type="text" id="room" v-model="form.room" required />
        </div>
        <button
          class="button"
          @click.prevent="formEditMode ? updateForm() : submitForm()"
          type="submit"
        >
          {{ formEditMode ? "Update" : "Submit" }}
        </button>
        <button
          class="button"
          style="margin-left: 27.3rem"
          @click.prevent="clearForm()"
          type="button"
        >
          Clear
        </button>
      </fieldset>
    </form>
  </div>

  <StatusCenter></StatusCenter>
  <ControlCenter></ControlCenter>
</template>

<script>
import { ref } from "vue";
import { collection, getDoc, addDoc } from "@firebase/firestore";
import { db, auth } from "@/firebase";
import StatusCenter from "./StatusCenter.vue";
import ControlCenter from "./ControlCenter.vue";

export default {
  name: "StudyForm",
  components: {
    StatusCenter,
    ControlCenter,
  },
  setup() {
    const theme = ref(null);
    return theme;
  },

  data() {
    return {
      form: {
        name: "",
        date: null,
        time: "",
        message: "",
        location: "",
        comments: "",
        inputText: "",
      },
      customLocation: "",
    };
  },
  computed: {
    isCustomLocationSelected() {
      return this.form.location === "Location G";
    },
  },

  methods: {
    clearForm() {
      this.form = {
        name: "",
        date: null,
        time: "",
        message: "",
        location: "",
        comments: "",
        inputText: "",
      };
      this.customLocation = "";
    },

    checkCustomLocation() {
      if (this.isCustomLocationSelected) {
        this.customLocation = "";
      }
    },
    onClick() {
      this.theme = this.theme === "light" ? "dark" : "light";
    },

    async getStuff() {
      const userRef = collection(db, "users");
      const userSnap = await getDoc(userRef);
      this.users.value.push(userSnap);
    },

    submitForm() {
      const currentDate = new Date();
      const enteredDate = new Date(this.form.date);

      // Check if entered date is in the past or is not a valid date
      if (isNaN(enteredDate) || enteredDate < currentDate) {
        window.alert("Please enter a valid date.");
        return;
      }

      // Check if all required fields are filled out
      if (
        !this.form.name ||
        !this.form.date ||
        !this.form.time ||
        !this.form.message ||
        !this.form.location ||
        !this.form.room
      ) {
        window.alert("Please fill out all required fields.");
        return;
      }

      const data = {
        name: this.form.name,
        date: this.form.date,
        time: this.form.time,
        message: this.form.message,
        location: this.form.location,
        comments: this.form.comments,
        createdBy: auth.currentUser.uid,
      };

      // Add data to Firestore collection
      addDoc(collection(db, "study"), { ...data })
        .then(() => {
          // Show success alert
          window.alert("Form submitted successfully!");
        })
        .catch((error) => {
          console.error("Error adding document: ", error);
        });
    },
  },
};
</script>

<style scoped>
.container-style {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 75px;
}
.card2 {
  width: 30%;
  height: 50%;
  margin-top: 15%;
  margin-right: 5%;
  background-color: white;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 10px;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.3);
}
.control-center {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.devices {
  margin-top: 20px;
}
.devices h2 {
  font-size: 18px;
}
.devices ul {
  list-style: none;
  padding: 0;
}
.devices li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.logs {
  margin-top: 20px;
}
.logs h2 {
  font-size: 18px;
}
.logs ul {
  list-style: none;
  padding: 0;
}
.logs li {
  padding: 10px;
  border-bottom: 1px solid #ccc;
}
.card1 {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  padding: 20px;
  margin: 5px;
  border: 5px solid #3f7eeb;
}
.card-header {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  text-align: center;
  border: 5px solid #3f7eeb;
}
.card-body {
  padding: 20px;
}
.button-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.button {
  background-color: #55a7da;
  border: none;
  border-radius: 5px;
  color: rgb(0, 0, 0);
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
}
.button:hover {
  transform: scale(1.1);
}
/* form styling below */
.form-container {
  background-color: #f9fafb;
  border-radius: 10px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1);
  width: 600px;
  padding: 20px;
  margin-left: 40rem;
  margin-top: 5rem;

  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.form-row {
  margin-bottom: 20px;
}
label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}
input[type="text"],
input[type="date"],
input[type="message"],
input[type="location"],
input[type="comments"],
textarea {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 2px solid #3f7eeb;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
input[type="text"]:focus,
input[type="date"]:focus,
input[type="message"]:focus,
input[type="location"]:focus,
input[type="comments"]:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}
.btn {
  border-radius: 5px;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
.btn-primary {
  background-color: #3f7eeb;
  color: rgb(0, 0, 0);
}
.control-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  overflow: hidden;
  padding: 20px;
  margin: 5px;
  border: 5px solid #3f7eeb;
}
.control-header {
  border: 5px solid #3f7eeb;
  background-color: #f5f5f5;
  padding: 10px;
}
.control-header h2 {
  margin: 0;
}
.control-body {
  padding: 20px;
}
.control-footer {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: right;
}
.control-footer button {
  background-color: #3f7eeb;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  padding: 10px 20px;
  transition: background-color 0.2s ease-in-out;
}
.control-footer button:hover {
  background-color: #3f7eeb;
}

select#location {
  border: 2px solid #3f7eeb;
  border-radius: 5px;
}

#time {
  border: 2px solid #3f7eeb;
  border-radius: 5px;
}
</style>
