<template>
  <div class="status-center">
    <div class="status-header">
      <h1>Status Center</h1>
    </div>
    <div class="status-body">
      <h2><u>Status</u></h2>
      <form>
        <div style="text-align: center">
          <label for="input-field">Status Message:</label>
        </div>
        <input type="text" id="statusMessage" v-model="form.inputText" />
        <button
          class="button mt-4 mb-2"
          :disabled="submitting"
          @click.prevent="submitStatus"
        >
          Submit
        </button>
      </form>
      <p v-if="latestStatus">{{ latestStatus }}</p>
      <ul v-if="statusList.length">
        <li v-for="status in statusList" :key="status.id">
          <div class="status-item" :class="{ editing: status.editing }">
            <div class="status-name">{{ status.name }}:</div>
            <div class="status-message" v-if="!status.editing">
              {{ status.message }}
            </div>
            <div class="status-edit" v-if="!status.editing">
              <button class="button" @click="status.editing = true">
                Edit
              </button>
            </div>
            <div class="status-save" v-if="status.editing">
              <input type="text" v-model="status.message" />
              <button class="button" @click="saveStatus(status)">Save</button>
            </div>
            <div class="status-time">{{ formatDate(status.timestamp) }}</div>
          </div>
        </li>
      </ul>
      <div v-else class="status-message">No statuses to display.</div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from "@firebase/firestore";
import { db, auth } from "@/firebase/index";

export default {
  name: "StatusCenter",

  setup() {
    const statusList = ref([]);
    const form = ref({
      inputText: "",
    });
    const latestStatus = ref("");
    const submitting = ref(false);

    const submitStatus = async () => {
      if (submitting.value) {
        return;
      }

      // Get the last posted status
      const lastStatus = statusList.value[0];
      const now = new Date();

      // Check if the last status has expired
      if (!lastStatus || now >= lastStatus.expiration.toDate()) {
        // Add the new status to the database with a timestamp and expiration time
        const expiration = new Date();
        expiration.setHours(24, 0, 0, 0);
        submitting.value = true;
        const newDocRef = await addDoc(collection(db, "statuses"), {
          name: auth.currentUser.displayName,
          message: form.value.inputText,
          timestamp: serverTimestamp(),
          expiration: expiration,
        });

        // Get the new status from the database and update the status list and latest status
        const docSnapshot = await getDoc(doc(db, "statuses", newDocRef.id));
        const newStatus = {
          id: docSnapshot.id,
          name: docSnapshot.data().name,
          message: docSnapshot.data().message,
          timestamp: docSnapshot.data().timestamp.toDate(),
          expiration: docSnapshot.data().expiration.toDate(),
        };
        statusList.value.unshift(newStatus);
        latestStatus.value = newStatus.message;

        // Clear the form input
        form.value.inputText = "";
      } else {
        // Display an error message if the last status has not expired
        latestStatus.value = `You cannot post a new status until ${lastStatus.expiration
          .toDate()
          .toLocaleDateString()} at 12:00 AM.`;
      }
    };

    const getStatuses = async () => {
      // Get all statuses that have not expired
      const q = query(
        collection(db, "statuses"),
        where("expiration", ">", new Date()),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);

      // Update the status list
      statusList.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
        message: doc.data().message,
        timestamp: doc.data().timestamp.toDate(),
      }));
    };

    const deleteExpiredStatuses = async () => {
      // Delete all expired statuses
      const q = query(
        collection(db, "statuses"),
        where("expiration", "<", new Date())
      );
      const querySnapshot = await getDocs(q);

      for (const doc of querySnapshot.docs) {
        await deleteDoc(doc(db, "statuses", doc.id));
      }
    };

    const saveStatus = async (status) => {
      await updateDoc(doc(db, "statuses", status.id), {
        message: status.message,
      });
      status.editing = false;
    };

    const formatDate = (value) => {
      const date = new Date(value);
      return date.toLocaleString();
    };

    // Load the initial status list
    getStatuses();

    // Delete expired statuses every hour
    setInterval(deleteExpiredStatuses, 3600000);

    return { statusList, form, submitStatus, formatDate, saveStatus };
  },
};
</script>

<style scoped>
.container-style {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100vh;
}
.status-center {
  background-color: #ffffff;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  text-align: center;
  height: 50vh;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 11rem;
  margin-top: -30rem;
  box-sizing: border-box;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
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
  border: 5px solid #55a7da;
}
.status-header {
  background-color: #f5f5f5;
  border-bottom: 1px solid #ccc;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  text-align: center;
  border: 10px solid #55a7da;
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
  border-radius: 20px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1);
  width: 600px;
  padding: 20px;
  margin-left: 20px;
  border: 5px solid #55a7da;
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
  border: 2px solid #55a7da;
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
  background-color: #55a7da;
  color: rgb(0, 0, 0);
}
.status-card {
  background-color: #fff;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 285px;
  overflow: hidden;
  padding: 20px;
  margin-left: 79%;
  margin-top: 1.5%;
  border: 5px solid #55a7da;
}
.status-header {
  border: 5px solid #55a7da;
  background-color: #f5f5f5;
  padding: 10px;
}
.status-header h2 {
  margin: 0;
}
.status-body {
  padding: 20px;
}
.status-footer {
  background-color: #f5f5f5;
  padding: 10px;
  text-align: right;
}
.status-footer button {
  background-color: #55a7da;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  padding: 10px 20px;
  transition: background-color 0.2s ease-in-out;
}
.status-footer button:hover {
  background-color: #55a7da;
}
</style>
