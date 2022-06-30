<template>
  <table class="table text-center">
    <thead>
      <tr>
        <div style="padding:10px;">
          <span class="title">Need Help?</span>
        </div>
      </tr>
    </thead>
    <tbody>
      <tr>
        <div style="padding:5px;">
          <router-link to="/faq#installation">How to get the Odin Chart plugin?</router-link>
        </div>
      </tr>
      <tr>
        <div style="padding:5px;">
          <!-- <router-link to="/">Download the example spreadsheets</router-link> -->
          <a href="../../static/downloads/odin-sample-data.zip">Download example spreadsheets</a>
        </div>
      </tr>
      <tr>
        <div style="padding:5px;">
          <router-link to="/faq">Check out the FAQ</router-link>
        </div>
      </tr>
    </tbody>
  </table>
</template>
<script>
export default {
  methods: {
    // faq() {
    //   this.$router.push('/faq');
    // },
  },
};
</script>