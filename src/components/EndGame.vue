<template>
  <v-container>

    <!-- 背景画像 -->
    <img id ="opening-image" alt="opening-image"/>

    <div class="fadeIn5s">
      <h1>
        ゲームクリア！おめでとう！
        <br >
        ランキング＆サンクスページ（開発中）
      </h1>

      <span class="notice">
        <v-btn color="primary" text @click="backToHome()">ホームに戻る (クイズの回答結果が全てクリアされます)</v-btn>
      </span>
    </div>
    
  </v-container>
</template>

<script>
  import { API, graphqlOperation } from "aws-amplify"                 // API:AppSync用 Auth:Cognito用 graphqlOperation:AppSyncのGraphQL用
  import { updateResult } from "../graphql/mutations"   // AppSync更新系
  export default {
    data: () => ({
    }),
    created: function(){
      console.log(this.$route.params.userDataID);
    },
    methods: {
      backToHome() {
        this.dataReset();
      },
      dataReset: async function () {
        // ゲームリセット（ログインユーザーのみ対象）
        const result = { scores: [], successes: [], id: this.$route.params.userDataID }
        try {
          await API.graphql(graphqlOperation(updateResult, {input: result}))
          this.$router.push({'name':'start'});
        } catch (error) {
          console.log(error);
        }
      },

    }
  }
</script>