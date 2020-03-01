<template>
  <v-list dense>
    <!-- Home -->
    <v-list-item link to="/">
      <v-list-item-action>
        <v-icon>mdi-home</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Home</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- Sign in -->
    <v-list-item link to="/signin">
      <v-list-item-action>
        <v-icon>security</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>ログアウト</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- about -->
    <v-list-item link to="/about">
      <v-list-item-action>
        <v-icon>mdi-tennis</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>about</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- Map point -->
    <v-list-item link to="/mappoint">
      <v-list-item-action>
        <v-icon>map</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>mappoint</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- Quiz -->
    <v-list-item link to="/quiz">
      <v-list-item-action>
        <v-icon>games</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Quiz</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <!-- UI-Test -->
    <v-list-item link to="/start">
      <v-list-item-action>
        <v-icon>play_arrow</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>Start</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

  </v-list>
</template>
