<template>
  <div id ="noUser" class="p-d-flex p-jc-center">
    <div class="p-d-flex p-flex-column">
      <div class="txt-center p-mb-2">
        <h1>Yetkisiz kullanıcı...</h1>
      </div>
      <div class="txt-center p-mb-2">
        <img src="assets/layout/images/page404.jpg" alt="no user" />
      </div>
      <div class="txt-center">Yoyuncak @Oyun Alanı Yönetim Sistemi</div>
    </div>
    <!-- <div class="p-field">
        <h1>Yetkisiz kullanıcı...</h1>
    </div>
    <div class="p-field">
        
    </div> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
    };
  },
};
</script>
<style scoped>
.txt-center{
    text-align: center;
}
</style>

