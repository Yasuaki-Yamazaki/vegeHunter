<template>
  <v-container>

    <!-- 背景画像 -->
    <img id ="opening-image" alt="opening-image"/>

    <div class="fadeIn5s">

      <div id="ingame-map">
        <!-- 園内マップ -->
        <img src="https://e-flowerpark.com/guide/images/map.jpg" alt="ingame-map"/>
        <!-- クイズ -->
        <div class="quiz" v-for="item in items" :key="item.id" v-bind:style="{ top: item.top + 'px', left: item.left + 'px' }">
          <!-- 未回答 -->
          <v-btn icon v-show="!item.result" class="fuwafuwa" @click="onClickQuiz(item)">
            <img src="https://www.silhouette-illust.com/wp-content/uploads/2017/05/treasure_takarabako_30144-300x300.jpg" alt="open" />
          </v-btn>
          <!-- 回答済 -->
          <v-btn icon v-show="item.result" @click="onClickQuiz(item)">
            <img src="https://www.silhouette-illust.com/wp-content/uploads/2017/05/coin_takarabako_30193-300x300.jpg" alt="close" />
          </v-btn>
        </div>
      </div>

      <!-- メモ -->
      <span class="notice">
        Level:{{ $route.params.level }}
      </span>
    </div>

    <!-- スナックバー：案内通知 -->
    <div class="text-center ma-2">
      <v-snackbar top v-model="snackbarInfo">
        「たからばこ」をえらんでクイズにちょうせんだ！
        <v-btn color="pink" text @click="snackbarInfo = false">
          <v-icon>close</v-icon>
        </v-btn>
      </v-snackbar>
    </div>

    <!-- ダイアログ：クイズ -->
    <v-dialog v-model="quizDialog" persistent width="90%" max-width="600px" v-if="currentItem">
      <v-card>
        <v-card-title class="headline">{{ currentItem.quiz }}</v-card-title>

        <v-card-text style="max-height: calc(100vh / 1.5);overflow: auto;">
          <div class="text-center">
            <span>みつけたらカメラでとってみよう！</span>
          </div>
          <label for="file" style="cursor: pointer;">
            <input type="file" @change="upload" id="file" style="display:none;" accept="image/*" capture="environment">
            <div class="text-center">
              <img src="https://image.freepik.com/free-icon/_318-1953.jpg" width="150px" alt="カメラ起動">
            </div>
          </label>
          <div>
            <span>Status: {{ message }}</span>
          </div>
          <!--
          <table>
              <thead>
                <tr>
                  <th>Entities</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(label, index) in result" v-bind:key="label.id">
                  <td>{{ index }} : {{ label.Name }} : {{ label.Confidence }}</td>
                  <td v-if="label.Instances">
                    <tr v-for="(instance, index) in label.Instances" v-bind:key="instance.id">
                      <td>Instance{{ index }}: {{ instance.Confidence }}</td>
                    </tr>
                  </td>
                </tr>
              </tbody>
          </table>
          -->
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

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="quizDialog = false">とじる</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

  </v-container>
</template>


<script>
  import { Storage } from 'aws-amplify'//画像アップロードに必要なライブラリ
  import axios from 'axios'//API叩くため
  export default {
    data: () => ({
      items: "",
      quizLv1:[
        // クイズリスト ※出題しないクイズはコメント化。
        { id: '1' , quiz: 'lv1「Tulips」を探そう！' , answer: 'Tulips' , hint1: '「Tulips」のヒント１'  ,  hint2: '「Tulips」のヒント２' ,  hint3: '「Tulips」のヒント３'  , top: '125' , left: '110' , result: 90 },
        { id: '2' , quiz: 'lv1「Tomato」を探そう！' , answer: 'Tomato' , hint1: '「Tomato」のヒント１'  ,  hint2: '「Tomato」のヒント１' ,  hint3: '「Tomato」のヒント１'  , top: '135' , left: '460' , result: null },
        { id: '3' , quiz: 'lv1「Potato」を探そう！' , answer: 'Potato' , hint1: '「Potato」のヒント１'  ,  hint2: '「Potato」のヒント１' ,  hint3: '「Potato」のヒント１'  , top: '255' , left: '130' , result: null },
        { id: '4' , quiz: 'lv1「Rose」を探そう！'   , answer: 'Rose'   , hint1: '「Rose」のヒント１'    ,  hint2: '「Rose」のヒント１'   ,  hint3: '「Rose」のヒント１'    , top: '335' , left: '480' , result: null },
        { id: '5' , quiz: 'lv1「Carrot」を探そう！' , answer: 'Carrot' , hint1: '「Carrot」のヒント１'  ,  hint2: '「Carrot」のヒント１' ,  hint3: '「Carrot」のヒント１'  , top: '415' , left: '250' , result: 80 },
      ],
      quizLv2:[
        // クイズリスト ※出題しないクイズはコメント化。
        { id: '1' , quiz: 'lv2「Tulips」を探そう！' , answer: 'Tulips' , hint1: '「Tulips」のヒント１'  ,  hint2: '「Tulips」のヒント２' ,  hint3: '「Tulips」のヒント３'  , top: '125' , left: '110' , result: 90 },
        { id: '2' , quiz: 'lv2「Tomato」を探そう！' , answer: 'Tomato' , hint1: '「Tomato」のヒント１'  ,  hint2: '「Tomato」のヒント１' ,  hint3: '「Tomato」のヒント１'  , top: '135' , left: '460' , result: 95 },
        { id: '3' , quiz: 'lv2「Potato」を探そう！' , answer: 'Potato' , hint1: '「Potato」のヒント１'  ,  hint2: '「Potato」のヒント１' ,  hint3: '「Potato」のヒント１'  , top: '255' , left: '130' , result: 85 },
        { id: '4' , quiz: 'lv2「Rose」を探そう！'   , answer: 'Rose'   , hint1: '「Rose」のヒント１'    ,  hint2: '「Rose」のヒント１'   ,  hint3: '「Rose」のヒント１'    , top: '335' , left: '480' , result: null },
        { id: '5' , quiz: 'lv2「Carrot」を探そう！' , answer: 'Carrot' , hint1: '「Carrot」のヒント１'  ,  hint2: '「Carrot」のヒント１' ,  hint3: '「Carrot」のヒント１'  , top: '415' , left: '250' , result: 80 },
      ],
      snackbarInfo: false,
      currentItem: null,
      quizDialog: false,
      hint1Show: false,
      hint2Show: false,
      hint3Show: false,
      message: "",
      filename: "",
      result: ""
    }),
    created: function(){
      // 起動時の処理
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
      upload: async function (e) {//ファイルアップロードメソッド
        var files = e.target.files//ファイルオブジェクトを格納
        var date = new Date().getTime()//タイムスタンプ取得
        Storage.put(date + files[0].name, files[0])//タファイル名にイムスタンプくっ付けてファイルアップロード
        .then (result => {
          this.message = "uploaded:" + (this.filename = result['key'])//アップロード結果を表示用変数に格納
          this.analize()//Rekognition解析のLambdaのAPIを呼ぶ
        }).catch(err => this.message = err)//エラー処理
      },
      analize: async function () {//Rekognition解析のLambdaのAPIを呼ぶメソッド
        const instance = axios.create({//axiosインスタンス生成
          baseURL: 'https://9b8odilpwf.execute-api.ap-northeast-1.amazonaws.com'//APIのベースURL設定
        })
        instance.post('/default/photoAnalize',{//APIのパスを設定
          filename: this.filename , //S3にアップロードしたファイル名
          target: this.currentItem.answer
        },).then(response => {
          //this.result = response.data.body.Labels//解析結果をresultに格納
          this.message = response.data.body
        }).catch(error => {
          this.result = error//エラー処理
        }).finally()//どのみちなんかやりたい場合はここに書く
      }
    }

  }
</script>
