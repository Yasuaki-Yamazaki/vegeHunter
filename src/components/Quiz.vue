<template>
  <div>
    <v-container class="grey lighten-5">

    <v-row>
      <!-- 1問目 -->
      <v-col cols="12" md="4" sm="6" xs="12">
        <v-card class="mx-auto" max-width="344">
          <v-img
            src="@/imgs/quiz/quiz.png"
            height="200px"
          ></v-img>

          <v-card-title>
            野菜に関する問題
          </v-card-title>

          <v-card-subtitle>
            ナス科の茶色い野菜
          </v-card-subtitle>

          <v-card-actions>
            <v-btn text>クイズを開始！</v-btn>
            <v-spacer></v-spacer>
            <v-btn icon
              @click="quiz01 = !quiz01"
            >
              <v-icon>{{ quiz01 ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="quiz01">
              <v-divider></v-divider>
              <v-card-text>
                ナスやトマトと同じナス科に属する野菜で、マクドナルドやファミレスで手頃に食べられる、茶色い土の中の野菜はな〜んだ？
              </v-card-text>
              <v-btn class="mb-5" color="primary">
                <label for="file">
                  写真を撮る
                  <input type="file" @change="upload" id="file" style="display:none;" accept="image/*" capture="environment">
                </label>
              </v-btn>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>

      <!-- 2問目 -->
      <v-col cols="12" md="4" sm="6" xs="12">
        <v-card class="mx-auto" max-width="344">
          <v-img
            src="@/imgs/quiz/quiz.png"
            height="200px"
          ></v-img>

          <v-card-title>
            花に関する問題
          </v-card-title>

          <v-card-subtitle>
            梅雨を彩る鮮やかな花
          </v-card-subtitle>

          <v-card-actions>
            <v-btn text>クイズを開始！</v-btn>
            <v-spacer></v-spacer>
            <v-btn icon
              @click="quiz02 = !quiz02"
            >
              <v-icon>{{ quiz02 ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="quiz02">
              <v-divider></v-divider>
              <v-card-text>
                みんなが「花」だと思っている部分は、じつは「がく」が大きくなった、鮮やかな花で梅雨時期に色とりどりの姿で楽しませてくれる花はな〜んだ？
              </v-card-text>
              <v-btn class="mb-5" color="primary">
                <label for="file">
                  写真を撮る
                  <input type="file" @change="upload" id="file" style="display:none;" accept="image/*" capture="environment">
                </label>
              </v-btn>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>

      <!-- 3問目 -->
      <v-col cols="12" md="4" sm="6" xs="12">
        <v-card class="mx-auto" max-width="344">
          <v-img
            src="@/imgs/quiz/quiz03.jpg"
            height="200px"
          ></v-img>

          <v-card-title>
            野菜に関する問題
          </v-card-title>

          <v-card-subtitle>
            ビタミンCが豊富
          </v-card-subtitle>

          <v-card-actions>
            <v-btn text>正解済み</v-btn>
            <v-spacer></v-spacer>
            <v-btn icon
              @click="quiz03 = !quiz03"
            >
              <v-icon>{{ quiz03 ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-card-actions>

          <v-expand-transition>
            <div v-show="quiz03">
              <v-divider></v-divider>
              <v-card-text>
                年中、収穫できる野菜で、ビタミンCが豊富な緑色の野菜はな〜んだ？
                ちなみに、夏よりも冬の方が、ビタミンCが３倍多いといわれています。いろいろなビタミンの中でも、特にビタミンCは季節によってかなり変化するといわれていますが、ダントツで変化する野菜です。
              </v-card-text>
              <v-btn class="mb-5" color="primary">
                <label for="file">
                  写真を撮る
                  <input type="file" @change="upload" id="file" style="display:none;" accept="image/*" capture="environment">
                </label>
              </v-btn>
            </div>
          </v-expand-transition>
        </v-card>
      </v-col>

    </v-row>
    </v-container>

  </div>
</template>

<script>
  import { Storage } from 'aws-amplify';
  //import axios from 'axios'
  export default {
    data: () => ({
      quiz01: false,
      quiz02: false,
      quiz03: false,
      quiz04: false,
      show: false,
      filename: "",
    }),
    methods: {
      upload: async function (e) {
        var files = e.target.files
        var date = new Date().getTime()
        Storage.put(date + files[0].name, files[0])
        .then (result => {
          this.filename = result['key']
        }).catch(err => this.message = err)
      },
    }
  }
</script>
