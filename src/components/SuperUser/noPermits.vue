<template>
    <div class = "permission-denied-container">
    <div class = "permission-denied">
      <h1 class="display-1">Permission Denied</h1>
      <p class="lead">You do not have the necessary permissions to access this page.</p>
      <div class="extra-space"></div>
      <v-btn color="indigo" to="/">Go to Homepage</v-btn>
      </div>
    </div>
</template>
  
<style>
   .permission-denied-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.permission-denied {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  padding: 20px;
  margin: 0 auto; /* add this line */
}
.extra-space {
  margin-top: 20px;
}
  
</style>