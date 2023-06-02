<template>
  <div class="background-container">
    <!-- Heaer for out landing page -->
    <section class="header">
      <h1>WolfCampus</h1>
    </section>

    <!-- This is a pop up modal when the sign up button is pressed. -->
    <SignUp @close="toggleModal" :modalActive="modalActive">
      <v-card class="signupcard">
        <div class="modal-content">
          <form class="signupform">
            <v-row>
              <!--Text input for entering first name and trim any whitespace-->
              <v-text-field
                class="rounded-xl mt-5"
                label="First Name"
                v-model.trim="signup.firstname"
              ></v-text-field>

              <!--Text input for entering last name and trim any whitespace-->
              <v-text-field
                class="rounded-xl mt-5"
                label="Last Name"
                v-model.trim="signup.lastname"
              ></v-text-field>
            </v-row>

            <!--Text input for selecting a majors-->

            <v-row>
              <!-- sign up email input -->
              <v-text-field
                class="rounded-xl"
                v-model.trim="signup.email"
                :readonly="loading"
                prepend-inner-icon="mdi-email-outline"
                :rules="[required]"
                label="Email"
              ></v-text-field>

              <v-text-field
                class="rounded-xl"
                v-model.trim="signup.retryemail"
                :readonly="loading"
                prepend-inner-icon="mdi-email-outline"
                :rules="[required]"
                label="Re-enter email"
              ></v-text-field>
            </v-row>

            <v-hover>
              <v-row>
                <!-- sign up password input -->
                <v-text-field
                  class="rounded-xl"
                  type="password"
                  v-model="signup.password"
                  :rules="[required]"
                  label="Password"
                  prepend-inner-icon="mdi-lock-outline"
                  placeholder="Enter your password"
                ></v-text-field>

                <v-text-field
                  class="rounded-xl"
                  type="password"
                  v-model="signup.retrypassword"
                  prepend-inner-icon="mdi-lock-outline"
                  label="Re-enter password"
                  placeholder="re-enter your password"
                ></v-text-field>
              </v-row>
              <v-autocomplete
                class="rounded-xl"
                label="majors"
                :items="majors"
                v-model="signup.majors"
              >
              </v-autocomplete>
            </v-hover>

            <!-- button to save form -->
            <v-btn
              class="saveNewButton rounded-pill"
              :disabled="!passwordsMatch || !emailsMatch || !unrEmail"
              type="submit"
              @click.prevent="saveNew"
            >
              Submit
            </v-btn>
          </form>
        </div>
      </v-card>
    </SignUp>
    <!-- log in card with a form to enter email and password -->
    <v-card class="logincard">
      <v-form class="formdetail">
        <!-- Input for log in email -->
        <v-text-field
          v-model="auth.email"
          class="rounded-xl"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          placeholder="NetID@nevada.unr.edu"
        ></v-text-field>

        <!-- input for login password -->

        <v-text-field
          type="password"
          v-model="auth.password"
          :rules="[required]"
          prepend-inner-icon="mdi-lock-outline"
          label="Password"
          class="rounded-xl"
          placeholder="Enter your password"
        ></v-text-field>

        <br />

        <!-- button to submit log in information -->
        <v-btn
          class="rounded-t-xl text-black"
          size="large"
          type="submit"
          variant="elevated"
          @click.prevent="authuser"
          margin-t
        >
          Log In
        </v-btn>

        <!-- button to bring up sign up form -->
        <v-btn
          class="signupbutton rounded-b-xl text-black"
          size="large"
          variant="elevated"
          @click.prevent="toggleModal"
        >
          Sign Up
        </v-btn>
        <!--  -->
        <span>
        <v-btn @click.prevent="googleSignIn">Sign in with Google</v-btn>
      </span>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import SignUp from "./SignUp.vue";
import { ref } from "vue";
// import axios from "axios";
import { useRouter } from "vue-router";
// import { db } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  getAuth,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { db, auth } from "@/firebase/index";
import {
  serverTimestamp,
  doc,
  collection,
  writeBatch,
} from "@firebase/firestore";

export default {
  name: "LogIn",
  components: {
    SignUp,
  },
  setup() {
    const modalActive = ref(false);
    const router = useRouter();

    const toggleModal = () => {
      modalActive.value = !modalActive.value;
    };
    console.log(auth);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        // ...
      } else {
        // User is signed out
        // ...
      }
    });

    return { modalActive, toggleModal, router };
  },
  data: () => {
    return {
      // Data properties for authentication
      auth: {
        email: null,
        password: null,
      },
      // Data properties for sign up
      signup: {
        firstname: "",
        lastname: "",
        majors: "",
        email: "",
        retryemail: "",
        password: null,
        retrypassword: null,
        matchingPw: null,
      },

      loading: false,
      required: true,
    };
  },
  computed: {
    passwordsMatch() {
      return this.signup.password === this.signup.retrypassword;
    },
    emailsMatch() {
      return this.signup.email === this.signup.retryemail;
    },
    unrEmail() {
      return this.signup.email.endsWith("@nevada.unr.edu");
    },
  },
  methods: {
    saveNew() {
      var formdata = {
        firstname: this.signup.firstname,
        lastname: this.signup.lastname,
        majors: this.signup.majors.id,
        email: this.signup.email,
        password: this.signup.password,
      };

      createUserWithEmailAndPassword(auth, formdata.email, formdata.password, formdata.firstname, formdata.lastname)
        .then((response) => {
          let signUpDate = serverTimestamp();
          const user = response.user
          console.log(user.uid)
          // Get the ID of the new document
          const userDocID = user.uid;
          const userRef = doc(collection(db, "users"), userDocID);
          const accountRef = doc(collection(db, "accounts"), formdata.email);
          const username = formdata.email.split("@")[0];

          let batch = writeBatch(db);
          batch.set(
            userRef,
            {
              CreatedDate: signUpDate,
              FirstName: formdata.firstname,
              LastName: formdata.lastname,
              uid: userDocID,
              username: username,
              classes: [],
              following: [],
              followers: [],
              profilePicture: "",
              blocked: [],
              blockedBy: []
            },
            { merge: true }
          );
          batch.set(
            accountRef,
            {
              CreatedDate: signUpDate,
              LastLogin: serverTimestamp(),
              FirstName: formdata.firstname,
              LastName: formdata.lastname,
              uid: userDocID,
              AcctEmail: formdata.email,
              username: username,
            },
            { merge: true }
          );
          batch.commit();

          console.log("Successfully registered!");
          console.log(response.message);
        })
        .catch((error) => {
          console.log(error.code);
          alert(error.message);
        });
    },
    // capturing data from log in form
    authuser() {
      var authdata = {
        email: this.auth.email,
        password: this.auth.password,
      };
      signInWithEmailAndPassword(auth, authdata.email, authdata.password)
        .then((response) => {
          // Signed in
          console.log("Successful Sign In!");
          console.log(response.message);
          this.router.push("/home");
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message);
        });
    },

    googleSignIn() {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        hd: "nevada.unr.edu",
      });
      signInWithPopup(getAuth(), provider)
        .then(async (result) => {
          console.log(result);

          const email = result.user.email;
          const domain = email.split("@")[1]; // Declare the domain variable

          // If the domain is not a nevada.unr.edu email, sign the user out
          if (domain !== "nevada.unr.edu") {
            alert("Please use your UNR student email to sign in.");
            signOut(getAuth());
            await result.user.delete();
            return;
          }

          let fullName = result.user.displayName.split(" ");
          (this.firstname = fullName[0]), (this.lastname = fullName[1]);
          const userUID = result.user.uid;
          const user = auth.currentUser;
          const username = result.user.email.split("@")[0];

          let signUpDate = new Date(user.metadata.creationTime);

          const userRef = doc(collection(db, "users"), userUID);
          const accountRef = doc(collection(db, "accounts"), email);

          this.router.push("/home");
          let batch = writeBatch(db);
          batch.set(
            userRef,
            {
              CreatedDate: signUpDate,
              FirstName: this.firstname,
              LastName: this.lastname,
              uid: userUID,
              username: username,
            },
            { merge: true }
          );
          batch.set(
            accountRef,
            {
              CreatedDate: signUpDate,
              LastLogin: serverTimestamp(),
              FirstName: this.firstname,
              LastName: this.lastname,
              AcctEmail: email,
              uid: userUID,
              username: username,
            },
            { merge: true }
          );
          batch.commit();
        })
        .catch((error) => {
          alert(error.message);
        });
    },
  },
};
</script>

<style scoped>
p,
a {
  margin: 5px;
  padding: 0;
}

h1 {
  font-size: 2.8em;
  padding: 10px 0;
  font-weight: 800;
}

.v-text-field {
  background-color: #e0e1dd;
  /* border-radius: 15px; */
  font-size: 12px;
  display: block;
  line-height: 1.5;
  margin: 5%;
  padding: 0;
}

.v-btn {
  background-color: #55a7da;
  margin: 0 5% 5% 5%;
  width: 80%;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url("https://s3.amazonaws.com/utep-uploads/wp-content/uploads/unr/2019/10/29141118/UNR-Campus-Home-Page-1.jpg");
  background-size: cover;
  background-position: center;
}

/* .submitsignup,
.signupbutton:hover,
.signinbutton:hover {
  scale: 1.1;
  background-color: #649fc4;
} */

.submitsignup {
  width: 8%;
}

p {
  font-size: 1.1em;
  font-weight: 100;
  letter-spacing: 5px;
}

.header {
  width: 100%;
  /* padding: 60px 0; */
  text-align: center;
  background: #354f77;
  color: #e0e1dd;
}

.v-card {
  box-shadow: 0px 0px 12px 0px #000;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  margin: 10%;
  width: 396px;
}

.logincard {
  width: 36%;
  margin-inline: 32%;
  text-align: center;

  background-color: #ffffff;
}

.formdetail {
  /* margin: 5%; */
  /* color: #FDF0D5; */
  /* background: #fff; */
  color: #1c1e21;
  direction: ltr;
  line-height: 1.34;
  margin: 0;
  padding: 0;
  unicode-bidi: embed;
}

.v-row {
  margin-inline: 5%;
  margin-top: 1%;
}

.forgotpassword {
  color: black;
}

.submitsignup {
  width: 70%;
  margin-inline: 15%;
}

.signupcard {
  width: 90%;
  margin-inline: 5%;
  height: 80%;
  background-color: #4a6fa5;
  align-items: center;
  margin-top: 10%;
}

.saveNewButton {
  width: 80%;
  margin-inline: 10%;
}

.forgotpassword:hover {
  font-size: large;
  color: green;
}

.error {
  color: red;
  margin-top: 0.5rem;
  position: absolute;
  z-index: auto;
}

.signuptextinput {
  margin-inline: 15%;
  width: 70%;
}

.background-container {
  background-image: url("https://s3.amazonaws.com/utep-uploads/wp-content/uploads/unr/2019/10/29141118/UNR-Campus-Home-Page-1.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  height: 100vh;
}
</style>
