<template>
  <v-container>

    <!-- 背景画像 -->
    <img id ="opening-image" alt="opening-image"/>
    
    <!-- マップ -->
    <div class="fadeIn5s">
      
      <div id="ingame-map">

        <!-- 園内画像 -->
        <img src="https://e-flowerpark.com/guide/images/map.jpg" alt="ingame-map"/>

        <!-- クイズ選択アイコン -->
        <div class="quiz" v-for="item in items" :key="item.id" v-bind:style="{ top: item.top + 'px', left: item.left + 'px' }">
          
          <v-btn icon v-show="!item.result" class="fuwafuwa" @click="onClickQuiz(item)">
            <!-- 未回答はここを表示 -->
            <img src="https://www.silhouette-illust.com/wp-content/uploads/2017/05/treasure_takarabako_30144-300x300.jpg" alt="open" />
          </v-btn>
          
          <v-btn icon v-show="item.result" @click="onClickQuiz(item)">
            <!-- 回答済はここを表示 -->
            <img src="https://www.silhouette-illust.com/wp-content/uploads/2017/05/coin_takarabako_30193-300x300.jpg" alt="close" />
          </v-btn>

        </div>
      </div>

      <!-- デバッグ情報 ※ゲーム本番では表示しない -->
      <span class="notice">
        Level : {{ $route.params.level }} / User : {{ userData.name }}
        <!--<v-btn color="primary" text @click="debugDialog=true">デバッグ操作</v-btn>-->
      </span>

    </div>

    <!-- スナックバー通知 -->
    <div class="text-center ma-2">
      <v-snackbar top v-model="snackbarInfo">
        「たからばこ」をえらんでクイズにちょうせんだ！
        <v-btn color="pink" text @click="snackbarInfo = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    </div>

    <!-- クイズ（ダイアログ） -->
    <v-dialog v-model="quizDialog" persistent width="90%" max-width="600px" v-if="currentItem">
      <v-card>

        <!-- クイズ内容 -->
        <v-card-title class="headline">{{ currentItem.quiz }}</v-card-title>
        
        <v-card-text style="max-height: calc(100vh / 1.5);overflow: auto;">

          <!-- カメラ起動 -->
          <div class="text-center">
            <span>みつけたらカメラでとってみよう！</span>
          </div>
          <label for="file" style="cursor: pointer;">
            <input type="file" @change="upload" id="file" style="display:none;" accept="image/*" capture="environment">
            <div class="text-center">
              <img src="https://image.freepik.com/free-icon/_318-1953.jpg" width="150px" alt="カメラ起動">
            </div>
          </label>

          <!-- 判定結果 -->
          <div>
            <span>Status: {{ message }}</span>
          </div>
   
          <!-- ヒント -->
          <v-row class="text-center">
            <v-col cols="12">
              <v-btn color="primary" width="100%" max-width="300px" @click="hint1Show=true" v-if="!hint1Show">ヒント１</v-btn>
              <div v-if="hint1Show" style="min-height:36px;">{{ currentItem.hint1 }}</div>
            </v-col>
            <v-col cols="12">
              <v-btn color="primary" width="100%" max-width="300px" @click="hint2Show=true" v-if="!hint2Show">ヒント２</v-btn>
              <div v-if="hint2Show" style="min-height:36px;">{{ currentItem.hint2 }}</div>
            </v-col>
            <v-col cols="12">
              <v-btn color="primary" width="100%" max-width="300px" @click="hint3Show=true" v-if="!hint3Show">ヒント３</v-btn>
              <div v-if="hint3Show" style="min-height:36px;">{{ currentItem.hint3 }}</div>
            </v-col>
          </v-row>

        </v-card-text>

        <!-- クイズ（ダイアログ）の閉じるボタン -->
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="quizDialog = false">とじる</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <!-- デバッグ用（ダイアログ）※ゲーム本番では表示しない -->
    <v-dialog v-model="debugDialog" persistent width="90%" max-width="600px">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          デバッグ操作
        </v-card-title>
        <v-card-text>
          <v-btn color="primary" text @click="displayResults()">Select</v-btn>
          <v-btn color="primary" text @click="createResult()">Insert</v-btn>
          <v-btn color="primary" text @click="updateResult()">Update</v-btn>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="debugDialog = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>


<script>
  import { Storage } from 'aws-amplify'//画像アップロードに必要なライブラリ
  import axios from 'axios'//API叩くため
  import { API, Auth, graphqlOperation } from "aws-amplify"//API:AppSync用 Auth:Cognito用 graphqlOperation:AppSyncのGraphQL用
  import { createResult, updateResult } from "../graphql/mutations"//AppSync更新系
  import { listResults, getResult } from "../graphql/queries"//AppSync取得系
  import { onCreateResult, onUpdateResult } from "../graphql/subscriptions"//AppSyncリアルタイム取得(GraphQLのSubscriptions:WebSocket使ってる)系

  export default {
    data: () => ({
      items: "",
      quizLv1:[
        // クイズリスト ※出題しないクイズはコメント化。
        { id: '1' , quiz: 'lv1「Tulips」を探そう！' , answer: 'Tulips' , study:'Tulips豆知識' , hint1: '「Tulips」のヒント１'  ,  hint2: '「Tulips」のヒント２' ,  hint3: '「Tulips」のヒント３'  , top: '125' , left: '110' , result: 90 },
        { id: '2' , quiz: 'lv1「Tomato」を探そう！' , answer: 'Tomato' , study:'Tomato豆知識' , hint1: '「Tomato」のヒント１'  ,  hint2: '「Tomato」のヒント２' ,  hint3: '「Tomato」のヒント３'  , top: '135' , left: '460' , result: null },
        { id: '3' , quiz: 'lv1「Potato」を探そう！' , answer: 'Potato' , study:'Potato豆知識' , hint1: '「Potato」のヒント１'  ,  hint2: '「Potato」のヒント２' ,  hint3: '「Potato」のヒント３'  , top: '255' , left: '130' , result: null },
        { id: '4' , quiz: 'lv1「Rose」を探そう！'   , answer: 'Rose'   , study:'Rose豆知識' , hint1: '「Rose」のヒント１'    ,  hint2: '「Rose」のヒント２'   ,  hint3: '「Rose」のヒント３'    , top: '335' , left: '480' , result: null },
        { id: '5' , quiz: 'lv1「Carrot」を探そう！' , answer: 'Carrot' , study:'Carrot豆知識' , hint1: '「Carrot」のヒント１'  ,  hint2: '「Carrot」のヒント２' ,  hint3: '「Carrot」のヒント３'  , top: '415' , left: '250' , result: 80 },
      ],
      quizLv2:[
        // クイズリスト ※出題しないクイズはコメント化。
        { id: '1' , quiz: 'lv2「Tulips」を探そう！' , answer: 'Tulips' , study:'Tulips豆知識' , hint1: '「Tulips」のヒント１'  ,  hint2: '「Tulips」のヒント２' ,  hint3: '「Tulips」のヒント３'  , top: '125' , left: '110' , result: 90 },
        { id: '2' , quiz: 'lv2「Tomato」を探そう！' , answer: 'Tomato' , study:'Tomato豆知識' , hint1: '「Tomato」のヒント１'  ,  hint2: '「Tomato」のヒント２' ,  hint3: '「Tomato」のヒント３'  , top: '135' , left: '460' , result: 95 },
        { id: '3' , quiz: 'lv2「Potato」を探そう！' , answer: 'Potato' , study:'Potato豆知識' , hint1: '「Potato」のヒント１'  ,  hint2: '「Potato」のヒント２' ,  hint3: '「Potato」のヒント３'  , top: '255' , left: '130' , result: 85 },
        { id: '4' , quiz: 'lv2「Rose」を探そう！'   , answer: 'Rose'   , study:'Rose豆知識' , hint1: '「Rose」のヒント１'    ,  hint2: '「Rose」のヒント２'   ,  hint3: '「Rose」のヒント３'    , top: '335' , left: '480' , result: null },
        { id: '5' , quiz: 'lv2「Carrot」を探そう！' , answer: 'Carrot' , study:'Carrot豆知識' , hint1: '「Carrot」のヒント１'  ,  hint2: '「Carrot」のヒント２' ,  hint3: '「Carrot」のヒント３'  , top: '415' , left: '250' , result: 80 },
      ],
      snackbarInfo: false,
      currentItem: null,
      quizDialog: false,
      debugDialog: false,
      hint1Show: false,
      hint2Show: false,
      hint3Show: false,
      message: null,
      filename: null,
      result: null,
      userData:[],
      limit: 2 ** 31 - 1,
    }),
    created: function(){
      // 起動時の処理
      this.singleResult();
      this.loadQuiz();
      this.showSnackBar();
    },
    methods: {
      loadQuiz(){
        // レベル毎にクイズを分ける
        if (this.$route.params.level == 1) {
          this.items = this.quizLv1;
        }else{
          this.items = this.quizLv2;
        }
      },
      showSnackBar(){
        // 案内通知
        setTimeout(function(){
          this.snackbarInfo = true;
        }.bind(this), 3000);
      },
      onClickQuiz(item) {
        // クイズをクリックした時のイベント → ダイアログ表示
        this.currentItem = item
        this.quizDialog = true
        this.hint1Show = false
        this.hint2Show = false
        this.hint3Show = false
        this.message = ""
        this.filename = ""
        this.result = ""
      },
      setOwner: async function () {//Cognitoユーザー情報取得
        this.user = await Auth.currentUserPoolUser(this.user)
        this.owner = this.user.username
      },
      /* dev */
      createResult: async function () {
        // テストデータ作成
        // ※ゲーム本番では既にデータが入っている為、本機能はデバッグ用として使用する。
        let newName = 'unknown';
        const result = { name: newName, scores: [0, 0, 0, 0, 0], successes: [0, 0, 0, 0, 0] }
        try {
          await API.graphql(graphqlOperation(createResult, {input: result}))
        } catch (error) {
          error
        }
      },
      updateResult: async function () {
        //既存のResult更新
        
        let pk = "";
        pk = '3dcdb5c7-c1b7-432c-ab39-dd4421aa793d'; // ベジ太郎
        pk = '732eaae4-397a-44fd-ba3a-959e4941f3cb'; // ベジ子
        pk = 'c175f24f-22eb-498d-aa0d-991fcefc50e2'; // ベジータ
        pk = '7a0246fa-082e-42ea-b224-87ad9289889e'; // Mr.Vege
        const result = { scores: [111.111, 222.222, 333.333, 444.444, 555.555], successes: [1, 0, 0, 1, 1], id: pk }
        try {
          this.scores = []//フォーム入力想定して、投稿するときにリセット
          this.scores = []//↑と同じ
          this.successes = []//↑と同じ
          await API.graphql(graphqlOperation(updateResult, {input: result}))//Result更新API叩く
        } catch (error) {
          error
        }
      },
      displayResults: async function () {
        //一覧表示メソッド
        let results = await API.graphql(graphqlOperation(//読み込み1発目の一覧取得
          listResults, {limit: this.limit}//limit与えているが、実質的に全件取得
        ))
        console.log(results);
        
        
        results = results.data.listResults.items//レスポンスから必要な部分抽出
        results.forEach(result => {//合計値計算
          result['sum'] = result['scores'].reduce((a,x) => a+=x,0)//'sum'というキーで結果に追加
        })
        //this.results = _.orderBy(results, 'sum', 'desc').slice(0, 100)//合計値で並び替え
        if (!this.rank) {this.results = this.results.filter(result => result['owner'] == this.owner)}//ランクじゃなかったら、自分のResultだけ絞り込み
        
        API.graphql(
          graphqlOperation(onCreateResult, {limit: this.limit, owner: this.owner})//新規作成リアルタイム取得(多分ここでWebSocketのセッション張ってるイメージ)
        ).subscribe({
          next: (eventData) => {
            const result = eventData.value.data.onCreateResult//新しく追加されたResultを取得
            const results = [...this.results, result]//現状のResult一覧に取得した新規Resultを追加
            results.forEach(result => {//合計値計算
              result['sum'] = result['scores'].reduce((a,x) => a+=x,0)//'sum'というキーで結果に追加
            })
            //this.results = _.orderBy(results, 'sum', 'desc').slice(0, 100)//合計値で並び替え
            if (!this.rank) {this.results = this.results.filter(result => result['owner'] == this.owner)}//ランクじゃなかったら、自分のResultだけ絞り込み
          }
        })
        API.graphql(
          graphqlOperation(onUpdateResult, {limit: this.limit, owner: this.owner})//更新リアルタイム取得(多分ここでWebSocketのセッション張ってるイメージ)
        ).subscribe({
          next: (eventData) => {
            const result = eventData.value.data.onUpdateResult//更新されたResultを取得
            const results = [...this.results, result]//現状のResult一覧に取得した更新Resultを追加
            results.forEach(result => {//合計値計算
              result['sum'] = result['scores'].reduce((a,x) => a+=x,0)//'sum'というキーで結果に追加
            })
            //this.results = _.orderBy(results, 'sum', 'desc').slice(0, 100)//合計値で並び替え
            if (!this.rank) {this.results = this.results.filter(result => result['owner'] == this.owner)}//ランクじゃなかったら、自分のResultだけ絞り込み
            this.results = this.deduplicate(this.results)//単純に追加しちゃってるので重複排除
          }
        })
      },
      singleResult: async function () {
        //id指定で1件取得(使ってない)
        let result = await API.graphql(graphqlOperation(
          getResult, { id: this.$route.params.userDataID }
        ))
        this.userData = result.data.getResult;
      },
      /* dev */
      upload: async function (e) {
        //ファイルアップロードメソッド
        var files = e.target.files//ファイルオブジェクトを格納
        var date = new Date().getTime()//タイムスタンプ取得
        Storage.put(date + files[0].name, files[0])//タファイル名にイムスタンプくっ付けてファイルアップロード
        .then (result => {
          this.message = "uploaded:" + (this.filename = result['key'])//アップロード結果を表示用変数に格納
          this.analize()//Rekognition解析のLambdaのAPIを呼ぶ
        }).catch(err => this.message = err)//エラー処理
      },
      analize: async function () {
        //Rekognition解析のLambdaのAPIを呼ぶメソッド
        const instance = axios.create({//axiosインスタンス生成
          baseURL: 'https://9b8odilpwf.execute-api.ap-northeast-1.amazonaws.com'//APIのベースURL設定
        })
        instance.post('/default/photoAnalize',{//APIのパスを設定
          filename: this.filename , //S3にアップロードしたファイル名
          target: this.currentItem.answer
        },).then(response => {
          this.message = response.data.body
        }).catch(error => {
          this.result = error//エラー処理
        }).finally()//どのみちなんかやりたい場合はここに書く
      }
    }

  }
</script>
