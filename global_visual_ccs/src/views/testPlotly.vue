<!--
Author: Tianzi Zhang
GitHub: acse-tz2523
-->
<template>
  <div class="container">
    <!-- Scenario and country selection box -->
    <div class="select-container">
      <el-row :gutter="20">
        <el-col :span="12">
          <div>Reference Scenario</div>
          <el-select
            v-model="selectedOptions['R_S1']"
            multiple
            clearable
            collapse-tags
            placeholder="Select Reference scenario countries"
            popper-class="custom-header"
            :max-collapse-tags="1"
            @change="handleSelectionChange('R_S1')"
            style="width: 100%;"
          >
            <template #header>
              <el-checkbox
                v-model="checkAll['R_S1']"
                :indeterminate="indeterminate['R_S1']"
                @change="handleCheckAll('R_S1')"
              >
                All
              </el-checkbox>
            </template>
            <el-option
              v-for="item in countries"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <div>Minimum Scenario</div>
          <el-select
            v-model="selectedOptions['R_S2']"
            multiple
            clearable
            collapse-tags
            placeholder="Select Minimum scenario countries"
            popper-class="custom-header"
            :max-collapse-tags="1"
            @change="handleSelectionChange('R_S2')"
            style="width: 100%;"
          >
            <template #header>
              <el-checkbox
                v-model="checkAll['R_S2']"
                :indeterminate="indeterminate['R_S2']"
                @change="handleCheckAll('R_S2')"
              >
                All
              </el-checkbox>
            </template>
            <el-option
              v-for="item in countries"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div>Maximum Scenario</div>
          <el-select
            v-model="selectedOptions['R_S3']"
            multiple
            clearable
            collapse-tags
            placeholder="Select Maximum scenario countries"
            popper-class="custom-header"
            :max-collapse-tags="1"
            @change="handleSelectionChange('R_S3')"
            style="width: 100%;"
          >
            <template #header>
              <el-checkbox
                v-model="checkAll['R_S3']"
                :indeterminate="indeterminate['R_S3']"
                @change="handleCheckAll('R_S3')"
              >
                All
              </el-checkbox>
            </template>
            <el-option
              v-for="item in countries"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <div>Growth 10% Scenario</div>
          <el-select
            v-model="selectedOptions['R_S4']"
            multiple
            clearable
            collapse-tags
            placeholder="Select Growth 10% scenario countries"
            popper-class="custom-header"
            :max-collapse-tags="1"
            @change="handleSelectionChange('R_S4')"
            style="width: 100%;"
          >
            <template #header>
              <el-checkbox
                v-model="checkAll['R_S4']"
                :indeterminate="indeterminate['R_S4']"
                @change="handleCheckAll('R_S4')"
              >
                All
              </el-checkbox>
            </template>
            <el-option
              v-for="item in countries"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>

      <el-row :gutter="20" style="margin-top: 20px;">
        <el-col :span="12">
          <div>US1Gt Scenario</div>
          <el-select
            v-model="selectedOptions['US1Gt']"
            multiple
            clearable
            collapse-tags
            placeholder="Select US1Gt scenario countries"
            popper-class="custom-header"
            :max-collapse-tags="1"
            @change="handleSelectionChange('US1Gt')"
            style="width: 100%;"
          >
            <template #header>
              <el-checkbox
                v-model="checkAll['US1Gt']"
                :indeterminate="indeterminate['US1Gt']"
                @change="handleCheckAll('US1Gt')"
              >
                All
              </el-checkbox>
            </template>
            <el-option
              v-for="item in countries"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
        <el-col :span="12">
          <div>EUUSChina Scenario</div>
          <el-select
            v-model="selectedOptions['EUUSChina']"
            multiple
            clearable
            collapse-tags
            placeholder="Select EUUSChina scenario countries"
            popper-class="custom-header"
            :max-collapse-tags="1"
            @change="handleSelectionChange('EUUSChina')"
            style="width: 100%;"
          >
            <template #header>
              <el-checkbox
                v-model="checkAll['EUUSChina']"
                :indeterminate="indeterminate['EUUSChina']"
                @change="handleCheckAll('EUUSChina')"
              >
                All
              </el-checkbox>
            </template>
            <el-option
              v-for="item in countries"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-col>
      </el-row>
    </div>
    <!-- Charts corresponding to scenarios -->
    <div class="chart-container">
      <div v-for="scenario in Object.keys(scenarios)" :key="scenario">
        <div v-if="selectedOptions[scenario] && selectedOptions[scenario].length > 0" :id="'chart-' + scenario" style="width: 100%; height: 600px;"></div>
        <div v-if="scenario === 'US1Gt' && selectedOptions['US1Gt'].length" class="slider-container">
          <label for="us1gt-slider">Range of Global Storage Rate:</label>
          <el-slider
            v-model="us1gtRange"
            range
            :max="13.0"
            :min="2.0"
            :step="0.1"
            style="width: 300px"
            show-input
            @change="handleThresholdChange('US1Gt')"
          ></el-slider>
          <span>{{ us1gtRange[0].toFixed(1) }} Gt - {{ us1gtRange[1].toFixed(1) }} Gt</span>
        </div>
        <div v-if="scenario === 'EUUSChina' && selectedOptions['EUUSChina'].length" class="slider-container">
          <label for="euuschina-slider">Range of Global Storage Rate:</label>
          <el-slider
            v-model="euuschinaRange"
            range
            :max="13.0"
            :min="2.0"
            :step="0.1"
            style="width: 300px"
            show-input
            @change="handleThresholdChange('EUUSChina')"
          ></el-slider>
          <span>{{ euuschinaRange[0].toFixed(1) }} Gt - {{ euuschinaRange[1].toFixed(1) }} Gt</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Plotly from 'plotly.js-dist';
import { ElSlider } from 'element-plus';

export default {
  components: {
    ElSlider,
  },
  data() {
    return {
      selectedOptions: {
        R_S1: [],
        R_S2: [],
        R_S3: [],
        R_S4: [],
        US1Gt: [],
        EUUSChina: []
      },
      scatterData: {}, // Stores scatter plot data
      euuschinaRange: [2.0, 13.0], // Range for EUUSChina scenario
      us1gtRange: [2.0, 13.0], // Range for US1Gt scenario
      scenarios: {
        R_S1: {
          label: 'Reference',
          countries: [
            'Australia',
            'Canada',
            'China',
            'EU',
            'Indonesia',
            'Middle East',
            'South Korea',
            'Thailand',
            'UK',
            'US',
          ],
        },
        R_S2: {
          label: 'Minimum',
          countries: [
            'Australia',
            'Canada',
            'China',
            'EU',
            'Indonesia',
            'Middle East',
            'South Korea',
            'Thailand',
            'UK',
            'US',
          ],
        },
        R_S3: {
          label: 'Maximum',
          countries: [
            'Australia',
            'Canada',
            'China',
            'EU',
            'Indonesia',
            'Middle East',
            'South Korea',
            'Thailand',
            'UK',
            'US',
          ],
        },
        R_S4: {
          label: 'Growth 10%',
          countries: [
            'Australia',
            'Canada',
            'China',
            'EU',
            'Indonesia',
            'Middle East',
            'South Korea',
            'Thailand',
            'UK',
            'US',
          ],
        },
        US1Gt: {
          label: 'US1Gt',
          countries: [
            'Australia',
            'Canada',
            'China',
            'EU',
            'Indonesia',
            'Middle East',
            'South Korea',
            'Thailand',
            'UK',
            'US',
          ],
        },
        EUUSChina: {
          label: 'EUUSChina',
          countries: [
            'Australia',
            'Canada',
            'China',
            'EU',
            'Indonesia',
            'Middle East',
            'South Korea',
            'Thailand',
            'UK',
            'US',
          ],
        },
      },
      countries: [
        { value: 'Australia', label: 'Australia' },
        { value: 'Canada', label: 'Canada' },
        { value: 'China', label: 'China' },
        { value: 'EU', label: 'EU' },
        { value: 'Indonesia', label: 'Indonesia' },
        { value: 'Middle East', label: 'Middle East' },
        { value: 'South Korea', label: 'South Korea' },
        { value: 'Thailand', label: 'Thailand' },
        { value: 'UK', label: 'UK' },
        { value: 'US', label: 'US' },
      ],
      charts: {}, // Stores chart instances
      checkAll: {
        R_S1: false,
        R_S2: false,
        R_S3: false,
        R_S4: false,
        US1Gt: false,
        EUUSChina: false,
      },
      indeterminate: {
        R_S1: false,
        R_S2: false,
        R_S3: false,
        R_S4: false,
        US1Gt: false,
        EUUSChina: false,
      },
    };
  },
  methods: {
    /**
     * Handles changes in the selection of countries for a given scenario.
     * @param {string} scenario - The scenario for which the selection changed.
     */
    handleSelectionChange(scenario) {
      console.log('Selected Options:', this.selectedOptions[scenario], this.selectedOptions[scenario].length);
      if (this.selectedOptions[scenario].length === this.scenarios[scenario].countries.length) {
        this.checkAll[scenario] = true;
      } else {
        this.checkAll[scenario] = false;
      }
      this.updateCharts();
    },

    /**
     * Handles changes in the slider thresholds for scenarios.
     * @param {string} scenario - The scenario for which the threshold changed.
     */
    handleThresholdChange(scenario) {
      console.log('Slider value changed');
      console.log(`Threshold changed for ${scenario}: ${this[`${scenario.toLowerCase()}Range`][0].toFixed(1)} Gt - ${this[`${scenario.toLowerCase()}Range`][1].toFixed(1)} Gt`);
      
      this.updateCharts();
    },

    /**
     * Handles the selection of all countries in a scenario.
     * @param {string} scenario - The scenario for which to select all countries.
     */
    handleCheckAll(scenario) {
      this.indeterminate[scenario] = false;
      if (this.checkAll[scenario]) {
        this.selectedOptions[scenario] = this.scenarios[scenario].countries.slice();
      } else {
        this.selectedOptions[scenario] = [];
      }
      console.log('Check All:', this.checkAll[scenario]);
      this.updateCharts();
    },

    /**
     * Fetches data for a given scenario and country.
     * @param {string} scenario - The scenario for which to fetch data.
     * @param {string} country - The country for which to fetch data.
     * @returns {Promise<Array>} The fetched data for the scenario and country.
     */
    async fetchData(scenario, country) {
      try {
        console.log(`Fetching data for scenario: ${scenario}, country: ${country}`);
        const response = await fetch(`http://localhost:8080/data/${scenario}/${country}`);
        const data = await response.json();
        if (data) {
          this.scatterData[country] = this.scatterData[country] || [];
          this.scatterData[country] = data.map((item) => ({
            Growth: item.Growth,
            Storage: item.Storage,
            Rate: item.Rate,
            Global: item.Global,
            Scenario: scenario,
            Country: country,
          }));
          console.log(`Loaded data for ${scenario} scenario:`, this.scatterData[country]);
          return this.scatterData[country];
        }
      } catch (error) {
        console.error(`Error loading data for scenario ${scenario} and country ${country}:`, error);
        return [];
      }
    },

    /**
     * Updates the charts based on the selected options and thresholds.
     */
    async updateCharts() {
      console.log('Updating charts');

      // Clear existing charts
      for (const key in this.charts) {
        Plotly.purge(this.charts[key]);
      }
      this.charts = {};

      for (const scenario of Object.keys(this.scenarios)) {
        let scatterData = [];

        const countries = this.selectedOptions[scenario] || [];
        for (const country of countries) {
          const data = await this.fetchData(scenario, country);
          scatterData.push(...data);
        }

        if (scenario === 'EUUSChina') {
          const [min, max] = this.euuschinaRange;
          scatterData = scatterData.filter((d) => {
            if (['EU', 'US', 'China'].includes(d.Country)) {
              return true;
            }
            const roundedGlobal = Math.round(d.Global * 10) / 10;
            return roundedGlobal >= min && roundedGlobal <= max;
          });
        } else if (scenario === 'US1Gt') {
          const [min, max] = this.us1gtRange;
          scatterData = scatterData.filter((d) => {
            if (d.Country === 'US') {
              return true;
            }
            const roundedGlobal = Math.round(d.Global * 10) / 10;
            return roundedGlobal >= min && roundedGlobal <= max;
          });
        }

        const dataset = scatterData.reduce((acc, d) => {
          if (!acc[d.Country]) {
            acc[d.Country] = { country: d.Country, rates: [] };
          }
          acc[d.Country].rates.push(d.Rate);
          return acc;
        }, {});

        const chartDom = document.getElementById(`chart-${scenario}`);
        if (chartDom) {
          this.charts[scenario] = chartDom;
          const option = this.getChartOption(scenario, Object.values(dataset), scatterData);
          Plotly.newPlot(chartDom, option.data, option.layout);
        }
      }
    },

    /**
     * Generates the options for a Plotly chart based on the given data.
     * @param {string} scenario - The scenario for which the chart is generated.
     * @param {Array} dataset - The dataset to be displayed in the chart.
     * @param {Array} scatterData - The scatter data to be displayed in the chart.
     * @returns {Object} The chart options including data and layout.
     */
    getChartOption(scenario, dataset, scatterData) {
      const colors = {
        Australia: '#778899',
        Canada: '#00CED1',
        China: '#BC8F8F',
        EU: '#808000',
        Indonesia: '#73C0DE',
        'Middle East': '#3BA272',
        'South Korea': '#FC8452',
        Thailand: '#9A60B4',
        UK: '#EA7CCC',
        US: '#DB7093',
      };

      const referenceData = {
        Australia: { low: 5.56e-7, high: 0.176073774, target: null, min: 0.3517, max: 0.5861 },
        Canada: { low: 5.69e-7, high: 0.580942411, target: null, min: 0.1387, max: 1.0034 },
        China: { low: 0.152669235, high: 6.7, target: null, min: 0.0556, max: 0.1938 },
        EU: { low: null, high: null, target: 0.33, min: 0.0225, max: 0.9193 },
        Indonesia: { low: 0.01571998, high: 1.689776567, target: null, min: 0.0225, max: 0.0959 },
        'Middle East': { low: null, high: null, target: null, min: 0.0461, max: 0.3711 },
        'South Korea': { low: 1.3e-7, high: 0.224998395, target: null, min: 0.0014, max: 0.0171 },
        UK: { low: null, high: null, target: 0.175, min: 0.3329, max: 1.0686 },
        US: { low: 0.085993294, high: 3.682933378, target: 1, min: 0.6091, max: 8.4277 },
        Thailand: { low: null, high: null, target: null, min: 0.0212, max: 0.0155 },
      };

      const data = [];
      const layout = {
        title: `${scenario} Scenario`,
        xaxis: {
          title: 'Country',
          type: 'category',
          categoryorder: 'array',
          categoryarray: dataset.map((d) => d.country),
        },
        yaxis: {
          title: 'CO2 Storage Rate (GtCO2/yr)',
        },
        boxmode: 'group',
      };

      if (scenario === 'EUUSChina') {
        const [min, max] = this.euuschinaRange;
        layout.title = max === 13.0
          ? `EUUSChina Scenario - exceeding ${min.toFixed(1)} Gt`
          : `EUUSChina Scenario - between ${min.toFixed(1)} Gt and ${max.toFixed(1)} Gt`;
      } else if (scenario === 'US1Gt') {
        const [min, max] = this.us1gtRange;
        layout.title = max === 13.0
          ? `US1Gt Scenario - exceeding ${min.toFixed(1)} Gt`
          : `US1Gt Scenario - between ${min.toFixed(1)} Gt and ${max.toFixed(1)} Gt`;
      }

      dataset.forEach((d) => {
        data.push({
          y: d.rates,
          x: Array(d.rates.length).fill(d.country),
          type: 'box',
          name: d.country,
          marker: { color: colors[d.country] },
          boxpoints: 'all',
          jitter: 0.5,
          pointpos: 0,
          width: 0.6, // Increased box width to twice the original
        });
      });

      scatterData.forEach((d) => {
        data.push({
          x: d.Country,
          y: d.Rate,
          mode: 'markers',
          type: 'scatter',
          name: d.Country,
          marker: {
            color: colors[d.Country],
            size: 5,
            opacity: 0.6,
          },
          text: `Global: ${d.Global}`,
        });
      });

      // Add reference data markers
      if (scenario === 'R_S1') {
        const ipccRanges = [];
        const modelledRanges = [];
        const publishedTargets = [];

        dataset.forEach((d) => {
          const refData = referenceData[d.country];
          if (refData) {
            if (refData.low !== null && refData.high !== null) {
              ipccRanges.push({
                x: [d.country, d.country],
                y: [refData.low, refData.high],
                mode: 'lines+markers',
                type: 'scatter',
                marker: {
                  color: 'red',
                  symbol: 'square',
                },
                line: {
                  color: 'red',
                },
                showlegend: false, // Do not show legend
              });
            }
            if (refData.min !== null && refData.max !== null) {
              modelledRanges.push({
                x: [d.country, d.country],
                y: [refData.min, refData.max],
                mode: 'lines+markers',
                type: 'scatter',
                marker: {
                  color: 'green',
                  symbol: 'circle',
                },
                line: {
                  color: 'green',
                },
                showlegend: false, // Do not show legend
              });
            }
            if (refData.target !== null) {
              publishedTargets.push({
                x: [d.country],
                y: [refData.target],
                mode: 'markers',
                type: 'scatter',
                marker: {
                  color: 'blue',
                  symbol: 'diamond',
                },
                showlegend: false, // Do not show legend
              });
            }
          }
        });

        // Add country-specific reference lines and target points
        ipccRanges.forEach((range) => data.push(range));
        modelledRanges.forEach((range) => data.push(range));
        publishedTargets.forEach((target) => data.push(target));

        // Add transparent legend items
        data.push({
          x: [null],
          y: [null],
          mode: 'lines+markers',
          type: 'scatter',
          name: 'IPCC Range',
          marker: {
            color: 'red',
            symbol: 'square',
          },
          line: {
            color: 'red',
          },
          showlegend: true, // Show legend
        });

        data.push({
          x: [null],
          y: [null],
          mode: 'lines+markers',
          type: 'scatter',
          name: 'Modelled Range',
          marker: {
            color: 'green',
            symbol: 'circle',
          },
          line: {
            color: 'green',
          },
          showlegend: true, // Show legend
        });

        data.push({
          x: [null],
          y: [null],
          mode: 'markers',
          type: 'scatter',
          name: 'Published Target',
          marker: {
            color: 'blue',
            symbol: 'diamond',
          },
          showlegend: true, // Show legend
        });
      }

      return { data, layout };
    },
  },
  mounted() {
    this.updateCharts();
  },
};
</script>

<style scoped>
.custom-header {
  .el-checkbox {
    display: flex;
    height: unset;
  }
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
}

.select-container {
  box-shadow: 0 0 1.758vw 0 rgba(154, 143, 113, .2);
  padding: 20px;
  background-color: #fff;
}

.chart-container {
  padding-bottom: 20px;
  margin-top: 20px;
  height: calc(100% - 220px);
  width: 100%;
  overflow: auto;
}

.chart-container::-webkit-scrollbar {
  display: none; /* Chrome Safari */
}

.slider-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
