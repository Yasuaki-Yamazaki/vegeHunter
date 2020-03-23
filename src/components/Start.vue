<template>
  <v-container>

    <!-- 背景画像 -->
    <img id ="opening-image" alt="opening-image"/>

    <!-- タイトル -->
    <h1 class="display-2 font-weight-bold mb-3">べジハンター</h1>
    
    <!-- 新規ユーザー登録 -->
    <v-row class="select-user">
      <v-col class="d-flex" cols="12" sm="6" offset-sm="3">
        <v-text-field
          v-model="userName"
          label="①ユーザー名を入力し、新規登録をして下さい。"
        ></v-text-field>
      </v-col>

      <v-col class="d-flex" cols="12" sm="6" offset-sm="3">
        <v-btn
          @click="createResult()"
        >
          ②新規登録
        </v-btn>
      </v-col>
    </v-row>
    
    <!-- ユーザー選択 -->
    <v-row class="select-user">
      <v-col class="d-flex" sm="6" offset-sm="3">
        <v-select
          :items="items"
          label="登録済の方：ご自身で登録したユーザーを選んで下さい"
          item-text="name"
          item-value="id"
          v-on:change="changeUser"
        ></v-select>
      </v-col>
    </v-row>

    <!-- 難易度選択 -->
    <p>むずかしさをえらんでね！</p>
    <v-row>
      <v-col cols="12">
        <v-btn color="primary" v-on:click="routerPush(1)">
          か ん た ん
        </v-btn>
      </v-col>
      <v-col cols="12">
        <v-btn color="primary" v-on:click="routerPush(2)">
          むずかしい
        </v-btn>
      </v-col>
    </v-row>

    <!-- スナックバー通知 -->
    <div class="text-center ma-2">
      <v-snackbar top v-model="snackbarInfo">
        {{ snackbarText }}
        <v-btn color="pink" text @click="snackbarInfo = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    </div>

  </v-container>
</template>

<script>
  import { API, graphqlOperation } from "aws-amplify"//API:AppSync用 Auth:Cognito用 graphqlOperation:AppSyncのGraphQL用
  import { listResults } from "../graphql/queries"//AppSync取得系
  import { createResult } from "../graphql/mutations"   // AppSync更新系
  export default {
    data: () => ({
      snackbarInfo: false,
      snackbarText: null,
      items: [],
      userName: null,
      //userDataID: null,
      limit: 2 ** 31 - 1,
    }),
    created: function(){
      // 起動時の処理
      this.getUser();
    },
    methods: {
      getUser: async function () {
        // ユーザー取得
        let results = await API.graphql(graphqlOperation(
          listResults, {limit: this.limit}
        ))
        this.items = results.data.listResults.items;
      },
      changeUser(id){
        // ユーザー選択
        this.$root.$userDataID = id;
      },
      createResult: async function () {
        // 新規ユーザー登録
        const result = { name: this.userName, scores: [], successes: [] }
        try {
          await API.graphql(graphqlOperation(createResult, {input: result}))
          this.getUser();
          this.snackbarText = "ユーザー登録が完了しました。引き続きユーザーを選択して下さい。";
          this.snackbarInfo = true;
        } catch (error) {
          this.snackbarInfo = true;
        }

      },
      routerPush(level) {
        // ページ遷移
        this.$root.$quizLevel = level;
        this.$router.push('opening');
      }
    }
  }
</script>

<style>
  /* Opening / Start */
  #opening-image {
    position: absolute;
    background: url("https://e-flowerpark.com/gallery/assets_c/2015/11/fuji01-thumb-1000x662-2530.jpg");
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
  h1,h2,p,ul {
    position: relative;
    color: white;
    text-shadow: 2px 2px 5px #000;
  }
  .select-user .v-application .primary--text,
  .select-user .theme--light.v-label,
  .select-user .theme--light.v-select .v-select__selections,
  .select-user .theme--light.v-input:not(.v-input--is-disabled) input,
  .select-user .theme--light.v-input:not(.v-input--is-disabled) textarea {
    color: #fff !important;
  }

  /* InGame */
  #ingame-map {
    position: relative;
    margin: auto;
    width: 676px;
    height: 490px;
  }
  .v-card__title {
    justify-content: center;
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