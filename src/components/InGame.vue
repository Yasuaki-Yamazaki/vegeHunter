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
          <!-- 回答済 -->
          <v-btn icon v-if="item.answer" class="fuwafuwa">
            <img src="https://www.silhouette-illust.com/wp-content/uploads/2017/05/treasure_takarabako_30144-300x300.jpg" alt="open" />
          </v-btn>
          <!-- 未回答 -->
          <v-btn icon v-if="!item.answer">
            <img src="https://www.silhouette-illust.com/wp-content/uploads/2017/05/coin_takarabako_30193-300x300.jpg" alt="close" />
          </v-btn>
        </div>
      </div>

      <!-- メモ -->
      <span class="notice">
        Level:{{ $route.params.level }}
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

  </v-container>

</template>

<script>
  export default {
    data: () => ({
      items: [
        /* クイズの回答状況(answer)・表示位置(top,left) */
        { id: '1' , answer: true , top: '125' , left: '110' },
        { id: '2' , answer: false , top: '135' , left: '460' },
        { id: '3' , answer: false , top: '255' , left: '130' },
        { id: '4' , answer: false , top: '335' , left: '480' },
        { id: '5' , answer: true , top: '415' , left: '250' },
      ],
      snackbarInfo: false,
    }),
    created: function(){
      setTimeout(function(){
        this.snackbarInfo = true;
      }.bind(this), 3000);
    }
  }
</script>
