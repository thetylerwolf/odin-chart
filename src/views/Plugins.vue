<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th colspan="2">
            <span class="title">Get Plugins</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="text-center">
          <td style="padding:3% 0px;">
            <div>
              <img src="static/logo-adobe-xd.png" style="width:100px; border-radius:10px;">
              <p>Odin Charts for Adobe XD</p>
              <p>
                <el-button type="primary" style="width:100%; max-width: 250px;">Download</el-button>
              </p>
            </div>
          </td>
          <td style="padding:3% 0px;">
            <div>
              <img src="static/logo-sketch.png" style="width:100px; border-radius:10px;">
              <p>Odin Charts for Sketch</p>
              <p>
                <el-button type="primary" style="width:100%; max-width: 250px;">Download</el-button>
              </p>
            </div>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <help-menu/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import helpMenu from '../components/Help';

export default {
  components: {
    helpMenu,
  },
};
</script>
