<style>
  /* Opening / Start */
  #opening-image {
    position: absolute;
    background: url("https://e-flowerpark.com/gallery/assets_c/2016/11/2016fuyu02-thumb-800x530-3843.jpg");
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(2px);
  }
  h1,p {
    position: relative;
    color: white;
    text-shadow: 2px 2px 5px #000;
  }

  /* InGame */
  #ingame-map {
    position: relative;
    margin: auto;
    width: 676px;
    height: 490px;
  }
  .v-content__wrap {
    overflow-x: auto;
  }
  .quiz {
    position: absolute;
  }
  .quiz img,
  .quiz .v-btn--icon.v-size--default {
    width: 60px;
    height: 60px;
    border-radius: 60px;
  }
  .notice {
    position: absolute;
    top: 5px;
    left: 5px;
    background: white;
  }
  .fadeIn2s {
    animation: fadeIn 2s ease 0s 1 normal;
    -webkit-animation: fadeIn 2s ease 0s 1 normal;
  }
  .fadeIn5s {
    animation: fadeIn 5s ease 0s 1 normal;
    -webkit-animation: fadeIn 5s ease 0s 1 normal;
  }
  @keyframes fadeIn {
    0% {opacity: 0}
    100% {opacity: 1}
  }
  @-webkit-keyframes fadeIn {
    0% {opacity: 0}
    100% {opacity: 1}
  }
  .fuwafuwa {
    -webkit-animation:fuwafuwa 2s infinite linear alternate;
    animation:fuwafuwa 2s infinite linear alternate;
  }
  @-webkit-keyframes fuwafuwa {
    0% {-webkit-transform:translate(0, 0) rotate(0deg);}
    50% {-webkit-transform:translate(0, 5px) rotate(0deg);}
    100% {-webkit-transform:translate(0, 0)rotate(0deg);}
  }
  @keyframes fuwafuwa {
    0% {transform:translate(0, 0) rotate(0deg);}
    50% {transform:translate(0, 5px) rotate(0deg);}
    100% {transform:translate(0, 0)rotate(0deg);}
  }
</style>

<template>
  <v-container>

    <!-- 背景画像 -->
    <img id ="opening-image" alt="opening-image"/>

    <!-- タイトル -->
    <h1 class="display-2 font-weight-bold mb-3">べジハンター</h1>

    <!-- 難易度選択 -->
    <p>むずかしさをえらんでね！</p>
    <v-row>
      <v-col col="12">
        <v-btn color="primary" :to="{ name: 'opening', params: { level: 1 }}">
          か ん た ん
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" :to="{ name: 'opening', params: { level: 2 }}">
          むずかしい
        </v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>
