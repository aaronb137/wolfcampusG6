<template>
  <div class="control-card" style="text-align: center">
    <div class="control-header">
      <h1>Control Center</h1>
    </div>
    <div class="control-body">
      <h2><u>Devices</u></h2>
      <form>
        <div>
          <label for="input-field">Device Name:</label>
        </div>
        <input type="text" id="deviceName" v-model="form.inputText" />
        <button class="button mt-4 mb-2" @click.prevent="devicesForm">Submit</button>
      </form>
      <ul v-if="deviceStatus.length > 0">
        <li
          v-for="device in deviceStatus"
          :key="device.name"
          :class="{
            'status-offline': device.status === 'offline',
            'status-online': device.status === 'online',
          }"
        >
          <strong>{{ device.name }}</strong> -
          <span>{{ device.status === "offline" ? "OFFLINE" : "ONLINE" }}</span>
          <button
            v-if="device.status === 'offline'"
            class="button button-red"
            @click.prevent="device.toggleStatus()"
          >
            Turn On
          </button>
          <button
            v-else
            class="button button-red"
            @click.prevent="device.toggleStatus()"
          >
            Turn Off
          </button>
          <button
            class="button button-red"
            @click.prevent="removeDevice(device.name)"
          >
            Remove
          </button>
        </li>
      </ul>
      <ul v-if="!deviceStatus.length" class="no-devices">
        <li class="no-devices-message">No devices to display.</li>
      </ul>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { doc, getDoc, updateDoc } from "@firebase/firestore";
import { db, auth } from "@/firebase/index";

export default {
  name: "ControlCenter",

  setup() {
    const deviceStatus = ref([]);
    const theme = ref(null);
    const outputText = ref("");

    const onClick = () => {
      theme.value = theme.value === "light" ? "dark" : "light";
    };

    const devicesForm = async () => {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userDevices = userDoc.data().devices || {}; // Initialize devices to an empty object if it doesn't exist

      // Add the new device name to the user's devices object with a boolean value of true
      userDevices[form.value.inputText] = true;

      // Update the document with the new devices object
      await updateDoc(userDocRef, { devices: userDevices });

      // Call the getStuff method to update the local deviceStatus array
      await getStuff();

      // Reset the form
      form.value.inputText = "";
    };

    const getStuff = async () => {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userDevices = userDoc.data().devices || {};

      // Add a 'status' property and a 'timestamp' property to each device object
      const devicesWithStatus = Object.entries(userDevices).map(
        ([name, status]) => ({
          name,
          status: status || "offline",
          timestamp: status === "online" ? Date.now() : 0, // Set the timestamp to the current time if the device is online, or 0 if it's offline
          toggleStatus: async () => {
            const newStatus = status === "online" ? "offline" : "online";
            userDevices[name] = newStatus;
            await updateDoc(userDocRef, { devices: userDevices });
            await getStuff();
          },
        })
      );

      // Sort the devicesWithStatus array by the timestamp property, with the newest devices at the beginning of the array
      devicesWithStatus.sort((a, b) => b.timestamp - a.timestamp);

      // Set the deviceStatus property to the sorted array of device objects
      deviceStatus.value = devicesWithStatus;

      // Set the outputText property to an array of device names
      outputText.value = Object.keys(userDevices);
    };

    const removeDevice = async (name) => {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const userDevices = userDoc.data().devices || {};

      // Remove the device from the user's devices object
      delete userDevices[name];

      // Update the document with the updated devices object
      await updateDoc(userDocRef, { devices: userDevices });

      // Call the getStuff method to update the local deviceStatus array
      await getStuff();
    };

    onMounted(() => {
      // Call the getStuff method when the component is mounted to the page
      getStuff();
    });

    const form = ref({
      deviceName: "",
      inputText: "",
      outputText: "",
    });

    return {
      deviceStatus,
      theme,
      outputText,
      form,
      onClick,
      devicesForm,
      getStuff,
      removeDevice,
    };
  },
};
</script>

<style scoped>
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
.control-card {
  background-color: #fff;

  border-radius: 10px;  
  max-width: 300px;
  overflow: hidden;
  padding: 20px;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.control-header {
  border: 5px solid #55a7da;
  border-radius: 10px;
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
  background-color: #55a7da;
  border: none;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  padding: 10px 20px;
  transition: background-color 0.2s ease-in-out;
}
.control-footer button:hover {
  background-color: #55a7da;
}

.status-offline {
  color: red;
  font-weight: bold;
}

.status-online {
  color: green;
  font-weight: bold;
}

ul {
  text-align: center;
}

ul.no-devices {
  font-weight: bold;
  list-style-type: none;
}

.no-devices-message {
  text-align: center;
  font-weight: bold;
}
</style>
