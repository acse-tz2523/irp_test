<!--
Author: Tianzi Zhang
GitHub: acse-tz2523
-->
<template>
  <div>
    <div class="control-panel">
      <div>Choose your scenario:</div>
      <el-checkbox-group v-model="selectedScenarios" @change="handleScenarioChange">
        <el-checkbox v-for="scenario in scenarios" :key="scenario.value" :label="scenario.value">{{ scenario.label }}</el-checkbox>
      </el-checkbox-group>
      <div>Limit scenarios:</div>
      <el-checkbox-group v-model="limitedScenarios" @change="handleLimitScenarioChange">
        <el-checkbox v-for="scenario in limitScenarios" :key="scenario.value" :label="scenario.value">{{ scenario.label }}</el-checkbox>
      </el-checkbox-group>
    </div>
    
    <!-- Map and info card container -->
    <div class="map-info-container">
      <!-- Map container -->
      <div id="map-container">
        <map-chart @country-selected="handleCountrySelected"></map-chart>
      </div>
      
      <!-- Information card -->
      <el-card class="info-card" shadow="always">
        <div>
          <h3>Clickable Countries:</h3>
          <!-- Country list -->
          <ul class="country-list">
            <li v-for="country in countries" :key="country">{{ country }}</li>
          </ul>

          <!-- Tooltip with instructions -->
          <el-tooltip class="item" effect="dark" placement="top">
            <template #content>
              <div>
                <p>Choose one or more scenarios of interest.</p>
                <p>Click on the country you are interested in to display data.</p>
                <p>Click again to hide the country's data.</p>
                <p>For performance reasons, only the last selected country is updated when switching scenarios.</p>
                <p>Therefore, when changing the scenario selection, please re-click the countries of interest to display data, or avoid switching scenarios in the meantime.</p>
                <p>Due to the large amount of dynamically rendered data, please be patient and avoid selecting too many countries at once.</p>
              </div>
            </template>
            <el-button type="info">Instructions</el-button>
          </el-tooltip>

          <!-- Image explaining regions -->
          <img :src="require('@/assets/scatter_scenario.png')" alt="Region explanation" class="info-image" />
        </div>
      </el-card>
    </div>

    <div class="scatter-charts-container">
      <div v-for="(country, index) in countries" :key="index" v-show="scatterVisible[country]">
        <div>
          <span style="font-size: 14px;">Growth Rate:</span>
          <el-slider v-model="xRanges[country]" :min="0" :max="getMaxValues(country).x" style="width: 350px; margin-left: 10px;" @change="updateScatterRange(country)"></el-slider>
          <span style="font-size: 14px;">Storage required [Gt]:</span>
          <el-slider v-model="yRanges[country]" :min="0" :max="getMaxValues(country).y" style="width: 350px; margin-left: 10px;" @input="updateScatterRange(country)"></el-slider>
        </div>
        <div v-if="['US1Gt', 'EUUSChina'].includes(selectedScenarios[0]) || ['US1Gt', 'EUUSChina'].includes(limitedScenarios[0])">
          <span style="font-size: 14px;">Global Storage Rate:</span>
          <el-slider v-model="globalRanges[country]" :min="2" :max="13" :step="0.1" style="width: 350px; margin-left: 10px;" @input="updateScatterRange(country)"></el-slider>
        </div>
        <scatter-chart
          :id="`scatter-chart-${country}`"
          :data="filteredScatterData[country]"
          :maxValues="getMaxValues(country)"
          :style="{ width: '400px', height: '400px' }"
          :selectedScenarios="selectedScenarios"
          :limitedScenarios="limitedScenarios"
          :scenarioCountryMaxValues="scenarioCountryMaxValues"
          :country-name="country"
        ></scatter-chart>
      </div>
    </div>
  </div>
</template>

<script>
import MapChart from '../components/MapChart.vue';
import ScatterChart from '../components/ScatterChart.vue';

export default {
  name: 'GlobalMap',
  components: {
    MapChart,
    ScatterChart
  },
  data() {
    return {
      scatterData: {
        'Canada': [],
        'US': [],
        'Australia': [],
        'EU': [],
        'UK': [],
        'China': [],
        'South Korea': [],
        'Middle East': [],
        'Indonesia': [],
        'Thailand': []
      },
      filteredScatterData: {
        'Canada': [],
        'US': [],
        'Australia': [],
        'EU': [],
        'UK': [],
        'China': [],
        'South Korea': [],
        'Middle East': [],
        'Indonesia': [],
        'Thailand': []
      },
      selectedScenarios: ['R_S1'],
      limitedScenarios: [],
      scenarios: [
        { label: 'Reference', value: 'R_S1' },
        { label: 'Minimum', value: 'R_S2' },
        { label: 'Maximum', value: 'R_S3' },
        { label: 'Growth 10%', value: 'R_S4' }
      ],
      limitScenarios: [
        { label: 'US1Gt', value: 'US1Gt' },
        { label: 'EUUSChina', value: 'EUUSChina' }
      ],
      scenarioCountryMaxValues: {
        'R_S1': {
          'Canada': { x: 20, y: 404 },
          'Australia': { x: 20, y: 502 },
          'US': { x: 20, y: 506 },
          'China': { x: 25, y: 403 },
          'Thailand': { x: 20, y: 10 },
          'Indonesia': { x: 20, y: 16 },
          "UK": { x: 20, y: 78 },
          "South Korea": { x: 20, y: 203 },
          "EU": { x: 20, y: 94 },
          "Middle East": { x: 20, y: 18 }
        },
        'R_S2': {
          'Canada': { x: 10, y: 40 },
          'Australia': { x: 10, y: 50 },
          'US': { x: 10, y: 51 },
          'China': { x: 10, y: 40 },
          'Thailand': { x: 10, y: 1 },
          'Indonesia': { x: 10, y: 2 },
          "UK": { x: 10, y: 8 },
          "South Korea": { x: 10, y: 20 },
          "EU": { x: 10, y: 10 },
          "Middle East": { x: 10, y: 2 }
        },
        'R_S3': {
          'Canada': { x: 20, y: 4040 },
          'Australia': { x: 20, y: 5020 },
          'US': { x: 20, y: 5060 },
          'China': { x: 25, y: 4030 },
          'Thailand': { x: 20, y: 104 },
          'Indonesia': { x: 20, y: 159 },
          "UK": { x: 20, y: 780 },
          "South Korea": { x: 20, y: 2034 },
          "EU": { x: 20, y: 940 },
          "Middle East": { x: 20, y: 177 }
        },
        'R_S4': {
          'Canada': { x: 10, y: 404 },
          'Australia': { x: 10, y: 502 },
          'US': { x: 10, y: 506 },
          'China': { x: 10, y: 403 },
          'Thailand': { x: 10, y: 10 },
          'Indonesia': { x: 10, y: 16 },
          "UK": { x: 10, y: 78 },
          "South Korea": { x: 10, y: 203 },
          "EU": { x: 10, y: 94 },
          "Middle East": { x: 10, y: 18 }
        },
        'US1Gt': {
          'Canada': { x: 20, y: 404 },
          'Australia': { x: 20, y: 502 },
          'US': { x: 20, y: 506 },
          'China': { x: 25, y: 403 },
          'Thailand': { x: 20, y: 10 },
          'Indonesia': { x: 20, y: 16 },
          "UK": { x: 20, y: 78 },
          "South Korea": { x: 20, y: 203 },
          "EU": { x: 20, y: 94 },
          "Middle East": { x: 20, y: 18 }
        },
        'EUUSChina': {
          'Canada': { x: 20, y: 404 },
          'Australia': { x: 20, y: 502 },
          'US': { x: 20, y: 506 },
          'China': { x: 25, y: 403 },
          'Thailand': { x: 20, y: 10 },
          'Indonesia': { x: 20, y: 16 },
          "UK": { x: 20, y: 78 },
          "South Korea": { x: 20, y: 203 },
          "EU": { x: 20, y: 94 },
          "Middle East": { x: 20, y: 18 }
        }
      },
      selectedCountry: null,
      scatterVisible: {
        'Canada': false,
        'US': false,
        'Australia': false,
        'EU': false,
        'UK': false,
        'China': false,
        'South Korea': false,
        'Middle East': false,
        'Indonesia': false,
        'Thailand': false
      },
      countryNameMap: {
        "united states of america": "US",
        "australia": "Australia",
        "canada": "Canada",
        "china": "China",
        "indonesia": "Indonesia",
        'thailand': 'Thailand',
        'south korea': "South Korea",
        "united kingdom": "UK",
      },
      xRanges: {}, // Stores the values of the X-axis slider for each country
      yRanges: {}, // Stores the values of the Y-axis slider for each country
      globalRanges: {}, // Stores the values of the Global slider for each country
      countries: ['Canada', 'US', 'Australia', 'EU', 'UK', 'China', 'South Korea', 'Middle East', 'Indonesia', 'Thailand']
    };
  },
  methods: {
    /**
     * Update the slider values for the selected country.
     * @param {string} country - The selected country.
     */
    updateSliderValues(country) {
      this.xRanges[country] = this.getMaxValues(country).x;
      this.yRanges[country] = this.getMaxValues(country).y;
      this.globalRanges[country] = 13;  // This value may need to be dynamically set based on your logic
    },

    /**
     * Update the scatter chart data based on the selected ranges for X, Y, and Global.
     * @param {string} country - The selected country.
     */
    updateScatterRange(country) {
      console.log(' this.xRanges ', this.xRanges[country]);
      const maxX = this.xRanges[country];
      const maxY = this.yRanges[country];
      const maxGlobal = this.globalRanges[country];
      console.log(" updateScatterRange: ", maxX, maxY, maxGlobal);
      this.filteredScatterData[country] = this.scatterData[country].filter(d => d.Growth <= maxX && d.Storage <= maxY && (maxGlobal ? d.Global <= maxGlobal : true));
      console.log("Filtered data for", country, "with ranges X:", maxX, "Y:", maxY, "Global:", maxGlobal);
    },

    /**
     * Handle changes in the selected scenarios.
     * If a country is selected, reload its scatter data.
     */
    handleScenarioChange() {
      if (this.selectedCountry) {
        console.log("scenario changed:", this.selectedScenarios);
        this.loadScatterData(this.selectedCountry);
      }
    },

    /**
     * Handle changes in the limited scenarios.
     * If a country is selected, reload its scatter data.
     */
    handleLimitScenarioChange() {
      console.log("Limited scenario changed:", this.limitedScenarios);
      if (this.selectedCountry) {
        this.loadScatterData(this.selectedCountry);
      }
    },

    /**
     * Load scatter data for a specific country and update the chart.
     * @param {string} country - The country for which to load scatter data.
     */
    async loadScatterData(country) {
      console.log("Loading scatter data for country:", country);
      this.scatterData[country] = [];
      this.filteredScatterData[country] = []; // Initialize filtered data
      const apiCountryName = this.countryNameMap[country.toLowerCase()] || country;
      console.log("API country name:", apiCountryName);

      const allScenarios = [...this.selectedScenarios, ...this.limitedScenarios];
      await Promise.all(allScenarios.map(async scenario => {
        try {
          const response = await fetch(`http://localhost:8080/data/${scenario}/${apiCountryName}`);
          const data = await response.json();
          if (data) {
            const formattedData = data.map(item => ({
              Growth: item.Growth,
              Storage: item.Storage,
              Rate: item.Rate,
              Global: item.Global,
              Scenario: scenario // Add scenario information
            }));
            this.scatterData[country].push(...formattedData);
            this.filteredScatterData[country].push(...formattedData); // Initial sync
            console.log(`Loaded data for ${scenario} scenario:`, this.scatterData[country]);
          }
        } catch (error) {
          console.error(`Error loading data for scenario ${scenario} and country ${apiCountryName}:`, error);
        }
      }));
      this.$nextTick(() => {
        if (this.$refs.scatterChart) {
          this.$refs.scatterChart.updateChart(); // Ensure chart is updated after data is loaded
        }
      });
    },

    /**
     * Handle the event when a country is selected on the map.
     * Toggle the visibility of the scatter chart for the selected country.
     * @param {string} country - The selected country.
     */
    handleCountrySelected(country) {
      this.selectedCountry = this.countryNameMap[country.toLowerCase()] || country;
      this.scatterVisible[this.selectedCountry] = !this.scatterVisible[this.selectedCountry];
      if (this.scatterVisible[this.selectedCountry]) {
        this.loadScatterData(this.selectedCountry);
      }
      if (country === 'United States of America') {
        country = "US"
      }
      if (country === 'United Kingdom') {
        country = "UK"
      }
      this.xRanges[country] = this.getMaxValues(country).x
      this.yRanges[country] = this.getMaxValues(country).y
      this.globalRanges[country] = 13
    },

    /**
     * Get the maximum values for the X and Y axes for the selected country and scenarios.
     * @param {string} country - The selected country.
     * @returns {Object} An object containing the max X and Y values.
     */
    getMaxValues(country) {
      let maxX = 0, maxY = 0;
      const allScenarios = [...this.selectedScenarios, ...this.limitedScenarios];
      allScenarios.forEach(scenario => {
        if (this.scenarioCountryMaxValues[scenario] && this.scenarioCountryMaxValues[scenario][country]) {
          const values = this.scenarioCountryMaxValues[scenario][country];
          maxX = Math.max(maxX, values.x);
          maxY = Math.max(maxY, values.y);
        } else {
          console.error(`Max values not found for scenario ${scenario} and country ${country}`);
        }
      });
      return { x: maxX, y: maxY };
    }
  },
  watch: {
    /**
     * Watch for changes in the selected scenarios.
     * When the selected scenarios change, clear the limited scenarios and update the scatter data and sliders.
     * @param {Array} val - The updated selected scenarios.
     */
    selectedScenarios(val) {
      if (val.length) {
        this.limitedScenarios = [];
        if (this.selectedCountry) {
          this.updateScatterRange(this.selectedCountry); // Update filtered data
          this.updateSliderValues(this.selectedCountry); // Update slider initial values
        }
      }
    },

    /**
     * Watch for changes in the limited scenarios.
     * When the limited scenarios change, clear the selected scenarios and update the scatter data and sliders.
     * @param {Array} val - The updated limited scenarios.
     */
    limitedScenarios(val) {
      if (val.length) {
        this.selectedScenarios = [];
        if (this.selectedCountry) {
          this.updateScatterRange(this.selectedCountry); // Update filtered data
          this.updateSliderValues(this.selectedCountry); // Update slider initial values
        }
      }
    },

    /**
     * Watch for changes in the selected country.
     * When the selected country changes, update the slider initial values.
     * @param {string} newCountry - The updated selected country.
     */
    selectedCountry(newCountry) {
      if (newCountry) {
        this.updateSliderValues(newCountry); // Update slider initial values
      }
    }
  }
};
</script>

<style scoped>
#map-container {
  width: 100%;
  height: 50vh;
  margin-top: 80px;
}
.control-panel {
  box-shadow: 0 0 1.758vw 0 rgba(154, 143, 113, .2);
  padding: 20px;
  background-color: #fff;
}
.scatter-charts-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}
.map-info-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-top: 20px;
}
.info-card {
  width: 35%;
  margin-left: 10px;
}
.country-list {
  display: flex;
  flex-wrap: wrap;
  list-style: none;
  padding: 0;
}
.country-list li {
  margin-right: 10px;
}
.info-image {
  width: 100%;
  height: auto;
  margin-top: 10px;
}
</style>
