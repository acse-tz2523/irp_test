<!--
Author: Tianzi Zhang
GitHub: acse-tz2523
-->
<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12">
        <h1>Introduction</h1>
        <p>This project is part of the Global CCS (Carbon Capture and Storage) initiative, focused on analyzing and visualizing CO2 storage data across different scenarios and countries.</p>

        <h1>Scenario Overview</h1>
        <p>The project includes multiple scenarios such as Reference, Minimum, Maximum, and region-specific scenarios like US1Gt and EUUSChina, offering insights into potential CO2 storage outcomes.</p>

        <el-button type="primary" @click="goToPaper">Read the Paper</el-button>
      </el-col>

      <el-col :span="12">
        <img src="@/assets/table.png" alt="Scenario Overview" class="image" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'IntroductionPage',
  methods: {
    goToPaper() {
      window.open('https://www.researchsquare.com/article/rs-4011559/v1', '_blank');
    },
  },
};
</script>

<style scoped>
h1, h2 {
  font-weight: bold;
  color: #333;
}

p {
  font-size: 16px;
  color: #666;
  margin-bottom: 16px;
}

.image {
  width: 100%;
  max-width: 100%;
}

.el-button {
  margin-top: 20px;
}
</style>
