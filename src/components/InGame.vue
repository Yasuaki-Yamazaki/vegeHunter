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
        <div class="quiz" v-for="(item, index) in items" :key="item.quiz" v-bind:style="{ top: item.top + 'px', left: item.left + 'px' }">
          
          <v-btn icon v-show="!item.successes" class="fuwafuwa" @click="onClickQuiz(index,item)">
            <!-- 未回答はここを表示 -->
            <img src="https://www.silhouette-illust.com/wp-content/uploads/2017/05/treasure_takarabako_30144-300x300.jpg" alt="open" />
          </v-btn>
          
          <v-btn icon v-show="item.successes" @click="onClickQuiz(index,item)">
            <!-- 回答済はここを表示 -->
            <img src="https://www.silhouette-illust.com/wp-content/uploads/2017/05/coin_takarabako_30193-300x300.jpg" alt="close" />
          </v-btn>

        </div>
      </div>

      <span class="notice">
        Level : {{ $root.$quizLevel }} / User : {{ userData.name }}
        <v-btn color="primary" text @click="debugDialog=true">デバッグ操作</v-btn>
        <v-btn v-show="gameClear" color="primary" text @click="gotoEndGame()">ゴール</v-btn>
      </span>

    </div>

    <!-- スナックバー通知 -->
    <div class="text-center ma-2">
      <v-snackbar top v-model="snackbarInfo">
        {{ snackbarText }}
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
            <span v-show="judge">判定：{{this.judge}}</span>
            <br >
            <span>得点（精度）：{{ currentItem.scores }}</span>
            <br >
            ※前回の判定結果も含めた最高得点を表示しています。
            <br >
            <span v-show="currentItem.successes">豆知識：{{ currentItem.study }}</span>
            <br >
            <span>Status: {{ status }}</span>
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
          <v-btn color="green darken-1" text @click="closeQuizDialog()">とじる</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <!-- インフォメーション（ダイアログ） -->
    <v-dialog v-model="infoDialog" width="90%" max-width="600px">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          ご案内
        </v-card-title>
        <v-card-text>
          <span>
            <br>
            [ゲームの流れ]
            <br>
            宝箱を選んでクイズに答えます。
            <br>
            回答後も得点アップを目指してクイズにリトライできます。
            <br>
            全て正解すると「ゴール」ボタンが表示されます。
            <br >
            ゴールボタンを押すとランキングページに遷移します。
            <br><br>
            [ 開発者向け ]
            <br>
            ゲーム画面左上に「デバッグ操作」ボタンを設けました。ご自由に使ってください。
            <br><br>
            できること
            <br>
            ●データ照会
            <br>
            ブラウザコンソールへ「クイズ参加者の情報＋クイズの結果」を出力します（PC推奨）。
            <br><br>
            ●データクリア
            <br>
            ログインユーザーのクイズ結果を全てクリアし、ゲームをリスタートさせます。
            <br>
            ※クリアされるのはログインしているユーザーのクイズ結果のみです。
            <br><br>
            このメッセージは本番では表示されません。
          </span>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="infoDialog = false">閉じる</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    
    <!-- デバッグ用（ダイアログ）※ゲーム本番では表示しない -->
    <v-dialog v-model="debugDialog" width="90%" max-width="600px">
      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          デバッグ操作
        </v-card-title>
        <v-card-text>
          <v-btn color="primary" text @click="displayResults()">データ照会</v-btn>
          <v-btn color="primary" text @click="dataReset()">データリセット</v-btn>
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
  import { Storage } from 'aws-amplify'                               // 画像アップロードに必要なライブラリ
  import axios from 'axios'                                           // API叩くため
  import { API, graphqlOperation } from "aws-amplify"                 // API:AppSync用 Auth:Cognito用 graphqlOperation:AppSyncのGraphQL用
  import { createResult, updateResult } from "../graphql/mutations"   // AppSync更新系
  import { listResults, getResult } from "../graphql/queries"         // AppSync取得系
  export default {
    data: () => ({
      items: "",
      /* クイズリスト ※出題しないクイズはコメント化すること */
      quizLv1:[
        /* かんたん */
        { quiz: 'lv1「Tulip」を探そう！' , answer: 'Tulip' , study:'Tulipは赤色だよ' , hint1: '「Tulip」のヒント１'  ,  hint2: '「Tulip」のヒント２' ,  hint3: '「Tulip」のヒント３'  , top: '125' , left: '110' , scores: null , successes : null },
        { quiz: 'lv1「Potato」を探そう！' , answer: 'Potato' , study:'Potatoは茶色だよ' , hint1: '「Potato」のヒント１'  ,  hint2: '「Potato」のヒント２' ,  hint3: '「Potato」のヒント３'  , top: '255' , left: '130' , scores: null , successes : null },
        { quiz: 'lv1「Rose」を探そう！'   , answer: 'Rose'   , study:'Roseは赤色だよ' , hint1: '「Rose」のヒント１'    ,  hint2: '「Rose」のヒント２'   ,  hint3: '「Rose」のヒント３'    , top: '335' , left: '480' , scores: null , successes : null },
      ],
      quizLv2:[
        /* むずかしい */
        { quiz: 'lv2「Tulip」を探そう！' , answer: 'Tulip' , study:'Tulipは赤色だよ' , hint1: '「Tulip」のヒント１'  ,  hint2: '「Tulip」のヒント２' ,  hint3: '「Tulip」のヒント３'  , top: '125' , left: '110' , scores: null , successes : null },
        { quiz: 'lv2「Tomato」を探そう！' , answer: 'Tomato' , study:'Tomatoは赤色だよ' , hint1: '「Tomato」のヒント１'  ,  hint2: '「Tomato」のヒント２' ,  hint3: '「Tomato」のヒント３'  , top: '135' , left: '460' , scores: null , successes : null },
        { quiz: 'lv2「Potato」を探そう！' , answer: 'Potato' , study:'Potatoは茶色だよ' , hint1: '「Potato」のヒント１'  ,  hint2: '「Potato」のヒント２' ,  hint3: '「Potato」のヒント３'  , top: '255' , left: '130' , scores: null , successes : null },
        { quiz: 'lv2「Rose」を探そう！'   , answer: 'Rose'   , study:'Roseは赤色だよ' , hint1: '「Rose」のヒント１'    ,  hint2: '「Rose」のヒント２'   ,  hint3: '「Rose」のヒント３'    , top: '335' , left: '480' , scores: null , successes : null },
        { quiz: 'lv2「Carrot」を探そう！' , answer: 'Carrot' , study:'Carrot橙色だよ' , hint1: '「Carrot」のヒント１'  ,  hint2: '「Carrot」のヒント２' ,  hint3: '「Carrot」のヒント３'  , top: '415' , left: '250' , scores: null , successes : null },
      ],
      snackbarInfo      : false,  /* スナックバー表示/非表示フラグ */
      snackbarText      : null,   /* スナックバー通知テキスト */
      currentItemIndex  : null,   /* 選択したクイズの配列番号（quizLv#の上から0,1,2...）*/
      currentItem       : null,   /* 選択したクイズの配列データ */
      quizDialog        : false,  /* クイズダイアログ表示/非表示フラグ */
      hint1Show         : false,  /* ヒント1の表示/非表示フラグ */
      hint2Show         : false,  /* ヒント2の表示/非表示フラグ*/
      hint3Show         : false,  /* ヒント3の表示/非表示フラグ */
      filename          : null,   /* アップロード画像のファイル名 */
      status            : null,   /* 画像判定認識結果（exist,confidence） */
      judge             : null,
      userData          : [],     /* クイズ回答データ（ログインユーザーのデータのみ） */
      limit             : 2 ** 31 - 1,
      infoDialog        : false,
      gameClear         : false,  /* クイズ全問正解で表示。ランキングページへ遷移する為のボタン */
      /* デバッグ用 */
      debugDialog       : false,  /* デバッグダイアログ表示/非表示フラグ */

    }),
    // 起動時の処理
    created: function(){
      this.setQuizCount();
      this.quizAllClear2ranking();  // ゲーム全クリ判定
      this.loadQuiz();
      this.singleResult();
      this.showSnackbar('「たからばこ」をえらんでクイズにちょうせんだ！' , null , 2000);
    },
    mounted : function(){
      this.infoDialog = true;
    },
    methods: {
      setQuizCount(){
        // クイズ数を覚えておく（ランキングページで使用）※無理やり感あり過ぎて申し訳m(__)m
        this.$root.$quizLv1Count = this.quizLv1.length;
        this.$root.$quizLv2Count = this.quizLv2.length;
      },
      // レベル毎にクイズを分ける
      loadQuiz(){
        if (this.$root.$quizLevel == 1) {
          this.items = this.quizLv1;
        }else{
          this.items = this.quizLv2;
        }

      },
      // クイズをクリックした時のイベント
      onClickQuiz(index,item) {
        this.currentItemIndex = index   
        this.currentItem = item;
        this.quizDialog = true;
        this.hint1Show = false;
        this.hint2Show = false;
        this.hint3Show = false;
        this.filename = null;
        this.status = null;
        this.judge = null;
        document.getElementById("file").value = "";
      },
      // 全問正解か判定
      quizAllClear2ranking: async function () {
        let result = await API.graphql(graphqlOperation(
          getResult, { id: this.$root.$userDataID }
        ))
        result = result.data.getResult;
        
        let allClear = true;
        for (const idx in result.successes) {
          if ( result.successes[idx] == 0 ) {
            allClear = false;
            break;
          }
        }
        if ( allClear ) {
          // 全問正解 → ゴールボタン表示
          this.gameClear = true;
        }
        
      },
      // 全問正解で操作可能。ランキングページ遷移
      gotoEndGame(){
        this.$router.push('end-game');
      },
      // クイズダイアログを閉じた時のイベント
      closeQuizDialog() {
        this.quizDialog = false;
        this.quizAllClear2ranking();
      },
      // スコア更新
      updateResult: async function () {
        let scores = this.userData.scores;
        let successes = this.userData.successes;

        if ( this.status.exist == 1 ){
          // 写真判定OK
          // ※confidenceの閾値による合否判定はとりあえず対応保留
          if ( scores[this.currentItemIndex] < this.status.confidence ) {
            // 前回のスコアを上回ったら上書き更新
            scores[this.currentItemIndex] = this.status.confidence;
          }

          // 正解フラグを立てる
          successes[this.currentItemIndex] = 1;   
          
          let result = { 
            scores: scores,
            successes: successes,
            id: this.userData.id
          }
          try {
            await API.graphql(graphqlOperation(updateResult, {input: result}));
            this.singleResult();
            this.judge = 'せいかい！';
          } catch (err) {
            this.showSnackbar('もういっかい、とってね（error:updateResult）' , err , 0);
          }
        }else{
          // 写真判定NG
          this.judge = 'ざんねん！';
        }

      },
      // クイズと回答結果のデータマッピング
      dataMapping: async function () {
        let scores = this.userData.scores;
        let successes = this.userData.successes;
        for ( let $i=0; $i < this.items.length; $i++ ) {
          this.items[$i].scores = scores[$i];
          this.items[$i].successes = successes[$i];
        }

      },
      // クイズ回答データ取得
      singleResult: async function () {
        let result = await API.graphql(graphqlOperation(
          getResult, { id: this.$root.$userDataID }
        ))

        // 初回起動時のみ実行：クイズの数分、Scores、successes列へ配列を格納しておく。
        let scores = result.data.getResult.scores;
        if ( !scores.length ) {
          let initArray = new Array( this.items.length );
          initArray.fill(0);
          const addInitArray = {
            scores    : initArray,
            successes : initArray,
            id        : result.data.getResult.id
          }
          try {
            await API.graphql(graphqlOperation(updateResult, {input: addInitArray}));
          } catch (err) {
            this.showSnackbar('error:addInitArray' , err , 0);
            console.log(err);
          }
          result = await API.graphql(graphqlOperation(
            getResult, { id: this.$root.$userDataID }
          ))
        }

        this.userData = result.data.getResult;

        // クイズと回答結果のデータマッピング
        this.dataMapping();

        // クイズダイアログも再読み込み
        if ( this.currentItemIndex ) {
          this.currentItem = this.items[this.currentItemIndex];
        }

      },
      // 画像アップロード
      upload: async function (e) {
        var files = e.target.files;                  //ファイルオブジェクトを格納
        this.status = "画像判定中...( ･`д･´)+";
        var date = new Date().getTime();
        Storage.put(date + files[0].name, files[0]) //ファイル名にタイムスタンプくっ付けてファイルアップロード
        .then (result => {
          document.getElementById("file").value = "";
          this.filename = result['key'];
          this.status = "uploaded:" + this.filename;
          this.analize();
        }).catch(err => {
          this.showSnackbar('もういっかい、とってね（error:upload）' , err , 0);
        })

      },
      // 画像判定
      analize: async function () {
        const instance = axios.create({
          baseURL: 'https://9b8odilpwf.execute-api.ap-northeast-1.amazonaws.com'
        })
        instance.post('/default/photoAnalize',{
          filename: this.filename ,
          target: this.currentItem.answer
        },).then(response => {
          this.filename = null;
          this.status = response.data.body
          this.updateResult()
        }).catch(err => {
          this.showSnackbar('もういっかい、とってね（error:analize）' , err , 0);
        })

      },
      // スナックバー通知
      showSnackbar(text, err , showTime) {
        setTimeout(
          function() {
            this.status = err;
            this.snackbarText = text;
            this.snackbarInfo = true;
          }.bind(this),
          showTime
        );

      },
      /*-----------------------------------
       ここから下はデバッグ用メソッド
      -----------------------------------*/
      displayResults: async function () {
        // データ一覧取得（全ユーザー対象）
        let results = await API.graphql(graphqlOperation(
          listResults, { limit: this.limit }
        ))
        console.log(results.data.listResults.items);
        this.snackbarText = 'コンソールへデータ出力しました。';
        this.snackbarInfo = true;

      },
      dataReset: async function () {
        // ゲームリセット（ログインユーザーのみ対象）
        const result = { scores: [], successes: [], id: this.userData.id }
        try {
          await API.graphql(graphqlOperation(updateResult, {input: result}))
          this.snackbarText = 'データをリセットしました。ホームに戻ります。';
          this.snackbarInfo = true;
          setTimeout(
            function() {
              this.$router.push({'name':'start'});
            }.bind(this),
            3000
          );
        } catch (error) {
          this.snackbarText = 'error:dataReset';
          this.snackbarInfo = true;
        }

      },
      createResult: async function () {
        // テストデータ作成
        // ※ゲーム本番では既にデータが入っている為、本機能はデバッグ用として使用する。
        let newName = 'unknown';
        const result = { name: newName, scores: [], successes: [] }
        try {
          await API.graphql(graphqlOperation(createResult, {input: result}))
        } catch (error) {
          this.snackbarText = 'error:createResult';
          this.snackbarInfo = true;
        }

      },
    }
  }
</script>
