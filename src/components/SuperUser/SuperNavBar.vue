<template>


        <v-card>
          <v-card-title class="bg-homebanner d-flex justify-space-between">
            <v-spacer></v-spacer>
            <span class="text-center">Super User</span>

            <v-spacer></v-spacer>

            <v-menu>

              <template v-slot:activator="{ props }">
                <v-btn variant= "text" v-bind="props" to="/modifclass">Class</v-btn>
              </template>

              <!-- <v-list>
                <v-list-item
                title="Add"
                value="addclass"
                @click="openModal"
                ></v-list-item>
                <v-list-item
                title="Modify"
                value="modclass"
                to="/modifclass"
                ></v-list-item>
              </v-list> -->
            </v-menu>
             <v-menu>
              <template v-slot:activator="{ props }">
                <v-btn variant= "text" v-bind="props" to="/modifuser">User</v-btn>
              </template>
                 <!-- <v-list>
                <v-list-item
                title="Add"
                value="adduser"
                @click="openUserModal"
                ></v-list-item>
                <v-list-item
                title="Modify"
                value="moduser"
                to="/modifuser"
                ></v-list-item>
              </v-list> -->
            </v-menu>
            <v-btn variant= "text" to="/reports" >Review reports</v-btn>
          </v-card-title>
        </v-card>
\
    

  </template>


<style>
.text-center {
  margin-left: 23%;
}
</style>
//done terribly by Melanie Bazgan, goodluck fixing this mess
//melaniebazgan@gmail.com