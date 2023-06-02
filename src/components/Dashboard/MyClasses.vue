<template>
  <v-card class="classcard" variant="outlined">
    <v-list bg-color="#ffffff">
      <v-list-item-title class="itemtitle">
        <h2 style="padding-bottom: 0.5rem">My Classes</h2>
      </v-list-item-title>

      <v-divider bg-color="#ffffff" thickness="2"></v-divider>

      <v-list bg-color="#ffffff">
        <v-list-item v-for="(item, index) in filteredItems" :key="index">
          <li>
            <v-btn
              class="classButton"
              elevation="0"
              style="cursor: pointer; font-size: medium"
              :to="'/classes/' + item.prefix + item.number"
              >{{ item.prefix }} {{ item.number }}
            </v-btn>
            <v-btn
              icon
              @click="removeClass(index)"
              class="closeIcon"
              v-show="!editbtn"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </li>
        </v-list-item>
        <v-list-item
          v-if="items.length === 1 && items[0] === 'Please add a class'"
        >
          <h3>{{ items[0] }}</h3>
        </v-list-item>
        <v-list-item v-if="addingItem">
          <v-text-field
            v-model="newItem"
            @keydown.enter="addItem"
            label="New Item"
          ></v-text-field>
        </v-list-item>
      </v-list>
    </v-list>

    <VBtn class="addclass" width="50%" rounded="0" @click="$emit('add-class')"
      >Add</VBtn
    >

    <VBtn class="deleteclass" width="50%" rounded="0" @click="editToggle"
      >Delete</VBtn
    >
  </v-card>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { db } from "@/firebase";
import { getAuth } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

export default {
  name: "MyClasses",

  setup() {
    const newItem = ref("");
    const items = ref([]);
    let editbtn = ref(true);

    const auth = getAuth();
    const uid = auth.currentUser.uid;
    const userDocRef = doc(db, "users", uid);

    // Load the initial items from Firebase
    const fetchPosts = async () => {
      try {
        onSnapshot(userDocRef, (doc) => {
          if (!doc.data().classes || doc.data().classes.length === 0) {
            items.value = ["Please add a class"];
          } else {
            items.value = doc.data().classes;
          }
        });
      } catch (err) {
        console.log(err.message);
      }
    };

    async function addItem() {
      if (newItem.value.trim() !== "") {
        // Remove the "Please add a class" placeholder if it exists
        if (items.value.includes("Please add a class")) {
          items.value = [];
        }

        items.value.push(newItem.value);
        newItem.value = "";

        // Update the classes in Firestore
        try {
          await updateDoc(userDocRef, {
            classes: items.value,
          });
        } catch (err) {
          console.error("Error updating document: ", err);
        }
      }
    }

    const filteredItems = computed(() => {
      return items.value.filter((item) => item !== "Please add a class");
    });

    // Add the clickOutside function
    function clickOutside(event) {
      const componentEl = document.querySelector(".classcard");

      if (!componentEl.contains(event.target) && !editbtn.value) {
        editbtn.value = true;
      }
    }

    onMounted(() => {
      fetchPosts();
    });

    async function removeClass(index) {
      items.value.splice(index, 1);

      // Update the classes in Firestore
      try {
        await updateDoc(userDocRef, {
          classes: items.value,
        });
      } catch (err) {
        console.error("Error updating document: ", err);
      }
    }

    function editToggle() {
      editbtn.value = !editbtn.value;
    }

    // Add the click event listener on mount and remove it on unmount
    onMounted(() => {
      fetchPosts();
      document.addEventListener("click", clickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", clickOutside);
    });

    return {
      newItem,
      items,
      addItem,
      removeClass,
      editToggle,
      editbtn,
      filteredItems,
    };
  },
};
</script>

<style scoped>
.classcard {
  position: absolute;
  box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1), 0 12px 12px rgba(0, 0, 0, 0.1),
    0 12px 12px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  right: 1%;
  width: 20%;
  top: 1%;
  color: #ffffff;
  background-color: #ffffff;
  border: none;
  border-radius: 25px;
}

h2,
h3 {
  text-align: center;
}

.classButton {
  background-color: #ffffff;
}

.editbutton {
  background-color: #669bbc;
  width: 100%;
  transition: width 2s, height 2s, transform 2s;
}

.editbutton:hover {
  background-color: #669bbc;

  transform: rotateY(360deg);
}

.addclass {
  left: 0%;
  background-color: #56a0ce;
  color: black;
}
.deleteclass {
  right: 0%;
  background-color: #ce4a53;
}

h2 {
  background-color: #ffffff;
  color: black;
}

.listitem {
  background-color: #ffffff;
  /* color: white; */
  width: 70%;
  margin: 0 15%;
  border: none;
  border-radius: 5px;
  list-style: none;
  margin-top: 3%;
}
a {
  color: rgb(0, 0, 0);
}
v-card {
  background-color: #ffffff;
}
.itemtitle {
  background-color: #ffffff;
}
input {
  color: white;
  width: 70%;
  margin: 0 15%;
  border: none;
  border-radius: 5px;
  list-style: none;
  margin-top: 3%;
}

.listitem:hover {
  scale: 1.2;
}

.closeIcon {
  height: 40%;
  background-color: red;
  width: 10%;
}

.v-card {
  background-color: white;
  color: white;
}
</style>
