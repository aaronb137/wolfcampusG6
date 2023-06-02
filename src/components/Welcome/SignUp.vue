<template>
  <!-- Wrap the modal content with a transition for smooth animations -->
  <Transition name="modal-animation">
    <!-- Display the modal only when modalActive is true -->
    <div v-show="modalActive" class="modal">
      <!-- Wrap the modal inner content with another transition for smooth animations -->
      <Transition name="modal-animation-inner">
        <!-- Display the modal inner content only when modalActive is true -->
        <div v-show="modalActive" class="modal-inner">
          <!-- Add a close button to close the modal and emit the close event -->
          <v-btn
            @click="$emit('close')"
            append-icon="mdi-close-box-outline"
            variant="flat"
            color="error"
          ></v-btn>
          <!-- Insert the content of the slot (from login.vue) -->
          <slot />
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script>
export default {
  name: "SignUp",
  props: ["modalActive"],

  setup(props, { emit }) {
    // Define a close function that emits the close event
    const close = () => {
      emit("close");
    };

    // Expose the close function to the template
    return { close };
  },
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 99;
  background-color: rgba(255, 255, 255, 0.5); /* set a semi-transparent white background */
  backdrop-filter: blur(10px); /* apply a blur effect */
  opacity: 1; /* set the overall opacity */
  
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-inner {

  width: 60%;
  border: none;
  height: 98%;
  /* margin: 20%; */
  align-items: center;
}

button {
  position: fixed;
  margin-left: 50%;
  margin-top: 5%;
  transform: scale(1.5);

  z-index: 100;


} 

</style>
