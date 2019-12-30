<template>
  <div>
    <div>
      現在位置情報{{errormsg}}
      経度:{{latitude}}緯度:{{longitude}}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      latitude: 0,
      longitude: 0,
      errormsg: ''
    }
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position){
          let coords = position.coords
          this.latitude = coords.latitude
          this.longitude = coords.longitude
        }.bind(this),
        function(error) {
         let errorMessage = {
            0: '原因不明のエラーが発生しました。',
            1: '位置情報が許可されませんでした。',
            2: '位置情報が取得できませんでした。',
            3: 'タイムアウトしました。',
            }
          this.errormsg = errorMessage[error.code]
        }.bind(this)
      )
    } else {
      this.errormsg = '位置情報を利用できない端末です。'
    }
  }
}
</script>
