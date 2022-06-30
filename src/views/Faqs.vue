<template>
  <div>
    <el-row type="flex" justify="center">
      <el-col :lg="12" :md="12" :sm="12">
        <div class="faq-title">Odin Chart FAQ</div>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center" id="installation">
      <el-col :lg="12" :md="12" :sm="12">
        <h1>How do I get the Odin Chart plugin?</h1>
        <p>Instructions below pertain to Odin Chart for Adobe XD.</p>
        <p>
          First, you'll need the latest version of Adobe XD installed. If you don't have Adobe XD, you can get it for free from Adobe here:
          <a
            target="_blank"
            href="https://www.adobe.com/products/xd.html"
          >https://www.adobe.com/products/xd.html</a>
        </p>
        <p>Next, if you don't have the Odin Chart plugin already, you can download it through the Adobe XD Plugin Manager by following these steps:</p>
        <ol>
          <li class="italics">Open Adobe XD</li>
          <li class="italics">Click on the "Plugins" menu item</li>
          <li class="italics">Click On "Discover Plugins..."</li>
          <li class="italics">Find the Odin Chart plugin in the list and click "Install"</li>
        </ol>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center" id="forSketch">
      <el-col :lg="12" :md="12" :sm="12">
        <br>
        <h1>Is Odin Chart available for Sketch?</h1>
        <p>Odin Chart is not currently available for Sketch. Odin Chart for Sketch is expected to be released sometime before the end of 2018.</p>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center" id="dataFormat">
      <el-col :lg="12" :md="12" :sm="12">
        <br>
        <h1>What is the Odin Chart fata format?</h1>
        <p>The Odin Chart plugin converts your spreadsheet data into editable charts. Currently, Odin only converts .csv spreadsheet formats. Additional spreadsheet formats will work in future releases.</p>

        <h3>Formating your data for Odin</h3>
        <p>The data format specified in the plugin indicates how your data should be formatted in order to work with Odin. The top value (gray background) is what the corresponding column in your spreadsheet represents (ex. 'Series X' corresponds to the x value of the data point in the series). Header cells are optional. The bottom value (white background) is the type of value Odin will process in that column. The value types are as follows:</p>
        <ul class="value-type-list">
          <li>
            <span class="bold">number +/-</span> : Any number, positive or negative
          </li>
          <li>
            <span class="bold">number +</span> : Only positive numbers. Negative numbers will be removed
          </li>
          <li>
            <span class="bold">anything</span> : Any number or string of characters will do
          </li>
          <li>
            <span class="bold">degrees</span> : Any number between -180 and 180. Numbers outside this range will likely give unexpected results
          </li>
        </ul>
        <p>If you repeat the column structure in the same spreadsheet, multiple charts or series will be placed. For example, 3 columns will produce 3 bar charts. The behavior of each chart is listed below:</p>
        <ul class="value-type-list">
          <li>
            <span class="bold">Line Chart</span> : Each column produces a new line chart
          </li>
          <li>
            <span class="bold">Bar Chart</span> : Each column producees a new bar chart
          </li>
          <li>
            <span class="bold">Pie Chart</span> : Each column produces a new pie chart
          </li>
          <li>
            <span class="bold">Table</span> : The table will be reflected as it is in the spreadsheet
          </li>
          <li>
            <span class="bold">Scatter Chart</span> : Each pair of columns (x-y) will produce a series on the same chart. The color of the series corresponds to its order in the selected color scheme.
          </li>
          <li>
            <span class="bold">Map</span> : Each set of columns (latitude, longitude, value) will produce a series on the same map. The color of the series corresponds to its order in the selected color scheme.
          </li>
        </ul>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center" id="isItFree">
      <el-col :lg="12" :md="12" :sm="12">
        <br>
        <h1>Is Odin Chart free?</h1>

        <p>Right now, all Odin Chart users have free trial access to all Odin Chart features. Eventually, this will not be the case. When paid functionality is introduced, all free trial users will be automatically subscribed to the free tier unless they actively opt-in to subscribe to paid features. The release of paid functionality is expected sometime in 2019.</p>
      </el-col>
    </el-row>

    <el-row type="flex" justify="center" id="contact">
      <el-col :lg="12" :md="12" :sm="12">
        <br>
        <h1>My question isn't answered here. Where can I go for help?</h1>

        <p>
          If you have additional questions, feel free to ask us at
          <a href="mailto:hello@odinchart.com">hello@odinchart.com</a>
        </p>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'faq',
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.centered {
  text-align: center;
}

.activation-key {
  background-color: #eee;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 20px;
}

.faq-title {
  font-size: 36px;
  color: #101010;
  margin: 20px 0 30px;
}

.bold {
  font-weight: 700;
}

.italics {
  font-style: italic;
}

h1,
h2,
h3 {
  font-weight: normal;
  color: #101010;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin: 10px 10px;
}
</style>
