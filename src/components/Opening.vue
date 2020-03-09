<template>
  <v-container>

    <!-- 背景画像 -->
    <img id ="opening-image" alt="opening-image"/>

    <!-- オープニングメッセージ -->
    <div class="fadeIn2s">
      <h1 class="display-2 font-weight-bold mb-3">さぁ！ぼうけんのはじまりだ！</h1>
    </div>

  </v-container>
</template>

<script>
  export default {
    created: function(){
      // 起動時の処理
      let lazyTime = 500; // InGameページ遷移までの時間（ms）※開発フェーズなので一時的に「500ms」にしていますが、良い感じに変えちゃって下さい。
      setTimeout(this.routerPush, lazyTime);
    },
    methods: {
      routerPush(){
        // ページ遷移
        let route = {
          name: 'in-game',
          params: {
            userDataID: this.$route.params.userDataID,
            level: this.$route.params.level
          }
        };
        this.$router.push(route);
      }
    }

  }
</script>
