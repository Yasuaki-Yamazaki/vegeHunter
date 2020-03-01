<template>
  <v-container>

    <!-- 背景画像 -->
    <img id ="opening-image" alt="opening-image"/>

    <div class="fadeIn2s">
      <!-- タイトル -->
      <h1 class="display-2 font-weight-bold mb-3">さぁ！ぼうけんのはじまりだ！</h1>

      <!-- メモ -->
      <span class="notice">
        Level:{{ $route.params.level }}
      </span>
    </div>

  </v-container>
</template>

<script>
  export default {
    created: function(){
      setTimeout( () => this.$router.push({ name: 'in-game', params: { level: this.$route.params.level } }), 4000);
    }
  }
</script>
