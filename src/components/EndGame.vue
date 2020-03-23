<template>
  <v-container>
    
    <!-- 背景画像 -->
    <img id ="opening-image" alt="opening-image"/>

    <div class="fadeIn5s">
      <h1>
        ゲームクリア！おめでとう！
      </h1>

      <h2>
        ランキング
      </h2>

      <!-- ランキング：かんたん -->
      <v-card class="mx-auto" tile>
        <v-list disabled>
          <v-subheader>かんたん</v-subheader>
          <v-list-item-group v-model="RankGrpLv1" color="primary">
            <v-list-item v-for="(item, i) in orderRankGrpLv1" :key="i">
              <v-list-item-content>
                <v-list-item-title v-text="(i + 1) + '位：' + item.name + '：' + item.score + '点'"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>
      
      <!-- ランキング：むずかしい -->
      <v-card class="mx-auto" tile>
        <v-list disabled>
          <v-subheader>むずかしい</v-subheader>
          <v-list-item-group v-model="RankGrpLv2" color="primary">
            <v-list-item v-for="(item, i) in orderRankGrpLv2" :key="i">
              <v-list-item-content>
                <v-list-item-title v-text="(i + 1) + '位：' + item.name + '：' + item.score + '点'"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-card>

      <span class="notice">
        <v-btn color="primary" text @click="backToHome()">ホームに戻る (クイズの回答結果が全てクリアされます)</v-btn>
        <v-btn color="primary" text @click="backToInGame()">ゲームに戻る</v-btn>
      </span>
    </div>
    
  </v-container>
</template>

<script>
  import { API, graphqlOperation } from "aws-amplify"      // API:AppSync用 Auth:Cognito用 graphqlOperation:AppSyncのGraphQL用
  import { updateResult } from "../graphql/mutations"      // AppSync更新系
  import { listResults } from "../graphql/queries"         // AppSync取得系
  export default {
    data: () => ({
      limit: 2 ** 31 - 1,
      RankGrpLv1: [],
      RankGrpLv2: [],
    }),
    created: function(){
      // データ取得
      this.displayResults();
    },
    computed: {
      orderRankGrpLv1(){
        // ランキング並び替え
        return this.RankGrpLv1.slice().sort((a, b) => {
          return (a.score > b.score) ? -1 : (a.score < b.score) ? 1 : 0;
        });
      },
      orderRankGrpLv2(){
        // ランキング並び替え
        return this.RankGrpLv2.slice().sort((a, b) => {
          return (a.score > b.score) ? -1 : (a.score < b.score) ? 1 : 0;
        });
      }
    },
    methods: {
      backToHome() {
        // ホームへ遷移
        this.dataReset();
      },
      backToInGame(){
        // ゲームへ遷移
        this.$router.push('in-game');
      },
      dataReset: async function () {
        // ゲームリセット（ログインユーザーのみ対象）
        const result = { scores: [], successes: [], id: this.$root.$userDataID }
        try {
          await API.graphql(graphqlOperation(updateResult, {input: result}))
          this.$router.push({'name':'start'});
        } catch (error) {
          console.log(error);
        }
      },
      displayResults: async function () {
        // データ一覧取得（全ユーザー対象）
        let results = await API.graphql(graphqlOperation(
          listResults, { limit: this.limit }
        ))

        // 難易度別にユーザー仕訳、スコア集計
        let items = results.data.listResults.items;
        for (let i=0; i < items.length; i++){
          let item  = items[i];

          // 全問正解したか判定
          let allClear = true;
          if ( item.successes.length == 0 ) { continue; }
          for (let j=0; j < item.successes.length; j++) {
            if ( Number(item.successes[j]) != 1 ) {
              allClear = false;
              break;
            }
          }
          if ( !allClear ) { continue; }

          // 全問正解者の処理
          let tmpArray = [];
          let scoreSummary = 0;
          tmpArray["name"] = item.name;
          for (let k=0; k < item.scores.length; k++){
            scoreSummary += Number(item.scores[k]);
          }
          tmpArray["score"] = scoreSummary;
          if ( item.scores.length == this.$root.$quizLv1Count ){
            // かんたん
            this.RankGrpLv1.push(tmpArray);
          }else{
            // むずかしい
            this.RankGrpLv2.push(tmpArray);
          }
        }

      },

    }
  }
</script>