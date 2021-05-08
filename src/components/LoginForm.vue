<template>
  <Card style="width: 25em; text-align:center;">
    <template #header>
      <img
        src="https://www.primefaces.org/wp-content/uploads/2020/02/primefacesorg-primevue-2020.png"
        style="height: 10rem; width:15rem;"
      />
    </template>
    <template #title> Giriş Formu</template>
    <!-- <template #subtitle> Giriş </template> -->
    <template #content>
     <form class="p-fluid">
        <div class="p-field">
          <div class="p-float-label">
            <InputText id="name" />
            <label for="name">Kullanıcı Adı*</label>
          </div>
        </div>

        <div class="p-field">
          <div class="p-float-label p-mt-4">
            <Password v-model="value3" toggleMask></Password>
            <label for="password">Şifre*</label>
          </div>
        </div>
      </form>
    </template>
    <template #footer>
      <Button icon="pi pi-check" label="Giriş" />
      <Button
        icon="pi pi-times"
        label="İptal"
        class="p-button-secondary"
        style="margin-left: 0.5em"
      />
    </template>
  </Card>
</template>

<script>
//import CountryService from '../service/CountryService';

export default {
  name: "Login",
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
</style>