<!--
Author: Tianzi Zhang
GitHub: acse-tz2523
-->
<template>
  <div>
    <!-- Radio button group for selecting a scenario -->
    <el-radio-group v-model="selectedScenario" @change="toggleScenario" class="scenario-selector">
      <el-radio label="R_S1">Reference Scenario</el-radio>
      <el-radio label="R_S2">Minimum Scenario</el-radio>
      <el-radio label="R_S3">Maximum Scenario</el-radio>
      <el-radio label="R_S4">Increase by 10%</el-radio>
      <el-radio label="US1Gt">US1Gt</el-radio>
      <el-radio label="EUUSChina">EUUSChina</el-radio>
    </el-radio-group>

    <!-- Display the selected scenario -->
    <div v-if="selectedScenario" :key="selectedScenario" class="scenario-container">
      <h3>{{ selectedScenario }}</h3>

      <!-- Plotly chart container for the selected scenario -->
      <div :id="`plotlyChart_${selectedScenario}`" class="plotly-chart"></div>

      <div class="slider-container">
        <!-- Hidden el-slider components based on the scenario -->
        <!-- Slider for R_S2 scenario -->
        <el-slider
          v-if="false && selectedScenario==='R_S2'" 
          v-model="sliderRanges[selectedScenario]"
          :min="sliderRanges[selectedScenario] ? Math.floor(sliderRanges[selectedScenario][0] * 10) / 10 : 0.2" 
          :max="sliderRanges[selectedScenario] ? Math.ceil(sliderRanges[selectedScenario][1] * 10) / 10 : 0.8"
          :step="0.1"
          style="width: 400px; margin-left: 90px;"
          range
          @change="onSliderChange(selectedScenario)"
        >
          <template #prepend>
            <span style="font-size: 14px;">Global storage rate in 2050: </span>
          </template>
          <template #append>
            <span>Gt yr^-1</span>
          </template>
        </el-slider>

        <!-- Slider for R_S4 scenario -->
        <el-slider
          v-else-if="false && selectedScenario==='R_S4'"
          v-model="sliderRanges[selectedScenario]"
          :min="0.2"
          :max="1.1"
          :step="0.1"
          style="width: 400px; margin-left: 90px;"
          range
          @change="onSliderChange(selectedScenario)"
        >
          <template #prepend>
            <span style="font-size: 14px;">Global storage rate in 2050: </span>
          </template>
          <template #append>
            <span>Gt yr^-1</span>
          </template>
        </el-slider>

        <!-- Slider for EUUSChina scenario -->
        <el-slider
          v-else-if="false && selectedScenario==='EUUSChina'"
          v-model="sliderRanges[selectedScenario]"
          :min="2"
          :max="4"
          :step="1"
          style="width: 400px; margin-left: 90px;"
          range
          @change="onSliderChange(selectedScenario)"
        >
          <template #prepend>
            <span style="font-size: 14px;">Global storage rate in 2050: </span>
          </template>
          <template #append>
            <span>Gt yr^-1</span>
          </template>
        </el-slider>

        <!-- Slider for US1Gt scenario -->
        <el-slider
          v-else-if="false && selectedScenario==='US1Gt'"
          v-model="sliderRanges[selectedScenario]"
          :min="2"
          :max="6"
          :step="1"
          style="width: 400px; margin-left: 90px;"
          range
          @change="onSliderChange(selectedScenario)"
        >
          <template #prepend>
            <span style="font-size: 14px;">Global storage rate in 2050: </span>
          </template>
          <template #append>
            <span>Gt yr^-1</span>
          </template>
        </el-slider>

        <!-- Slider for other scenarios -->
        <el-slider
          v-else-if="false && selectedScenario" 
          v-model="sliderRanges[selectedScenario]"
          :min="2"
          :max="13"
          :step="1"
          style="width: 400px; margin-left: 90px;"
          range
          @change="onSliderChange(selectedScenario)"
        >
          <template #prepend>
            <span style="font-size: 14px;">Global storage rate in 2050: </span>
          </template>
          <template #append>
            <span>Gt yr^-1</span>
          </template>
        </el-slider>
      </div>
    </div>
  </div>
</template>


<script>
import Plotly from 'plotly.js-dist';
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const RS2Value = reactive([0.1, 0.9]); // Initial value range for the R_S2 scenario
    const selectedScenario = ref(''); // Selected scenario value
    const sliderRanges = reactive({}); // Object to store slider ranges for each scenario
    const allCountries = ['Australia', 'Canada', 'China', 'EU', 'Indonesia', 'Middle East', 'South Korea', 'Thailand', 'UK', 'US']; // List of countries
    const colors = ['#FF6347', '#4682B4', '#2E8B57', '#DAA520', '#8A2BE2', '#FF69B4', '#FFD700', '#A52A2A', '#D3D3D3', '#00FFFF']; // Color palette for countries

    let globalMaxX = 0; // Global maximum value for x-axis
    let globalMaxY = 0; // Global maximum value for y-axis

    const fetchData = async (scenario) => {
      // Fetch data for the selected scenario from the server
      try {
        const response = await fetch(`http://localhost:8080/data/api/scenario/${scenario}`);
        const data = await response.json();
        console.log(`Fetched data for scenario: ${scenario}`, data);

        // Calculate and set slider ranges based on scenario
        const globalValues = [];
        Object.values(data).forEach(countryData => {
          countryData.forEach(item => {
            globalValues.push(item.Global);
          });
        });

        if (scenario === 'R_S2') {
          sliderRanges[scenario] = [0.1, 0.9];
        } else if (scenario === 'R_S4') {
          sliderRanges[scenario] = [0.2, 1.1];
        } else if (scenario === 'EUUSChina') {
          sliderRanges[scenario] = [2, 4];
        } else if (scenario === 'US1Gt') {
          sliderRanges[scenario] = [2, 6];
        } else {
          sliderRanges[scenario] = [2, 13];
        }

        return data;
      } catch (error) {
        console.error('Error fetching data:', error);
        ElMessage.error('Error fetching data');
      }
    };

    const updateChart = async (scenario, data, range = null) => {
      // Update the chart with new data and configuration
      if (!range) {
        range = sliderRanges[scenario];
      }
      console.log(range);

      const filteredData = filterDataByGlobal(data, range);
      console.log(`Updating chart for ${scenario} with range:`, range);

      // Prepare traces for each country
      const traces = allCountries.map((country, index) => {
        const countryData = filteredData[country] || [];
        return {
          name: country,
          x: countryData.map(item => item.Growth),
          y: countryData.map(item => item.Storage),
          id: countryData.map(() => country),
          text: countryData.map(() => country),
          mode: 'markers',
          marker: {
            size: countryData.map(item => item.Rate * 1000),
            sizemode: 'area',
            sizeref: 10,
            color: colors[index]
          }
        };
      });

      const frames = generateFrames(data); // Generate frames for animation

      // Prepare slider steps for animation
      const sliderSteps = frames.map(frame => ({
        method: 'animate',
        label: (selectedScenario.value === 'R_S2' || selectedScenario.value === 'R_S4')
            ? parseFloat(frame.name).toFixed(1)  // Ensure one decimal place for specific scenarios
            : Math.round(frame.name),  // Ensure integer values for other scenarios
        value: frame.name,
        args: [[frame.name], {
          mode: 'immediate',
          fromcurrent: true,
          transition: { duration: 200 },
          frame: { duration: 200, redraw: false }
        }]
      }));

      const logMaxY = Math.ceil(Math.log10(Math.max(...traces.flatMap(trace => trace.y))));
      const yRange = Array.from({ length: logMaxY * 2 + 1 }, (_, i) => Math.pow(10, i / 2));

      const layout = {
        xaxis: {
          title: 'Growth Rate',
          range: [0, Math.ceil(globalMaxX / 5) * 5],
          dtick: 5
        },
        yaxis: {
          title: 'Storage',
          type: 'log',
          tickvals: yRange,
          ticktext: yRange.map(y => `10^${Math.log10(y).toFixed(1)}`),
          range: [Math.log10(yRange[0]), Math.log10(yRange[yRange.length - 1])]
        },
        hovermode: 'closest',
        updatemenus: [{
          x: 0,
          y: 0,
          yanchor: 'top',
          xanchor: 'left',
          showactive: false,
          direction: 'left',
          type: 'buttons',
          pad: { t: 87, r: 10 },
          buttons: [{
            method: 'animate',
            args: [frames.map(f => f.name), {
              mode: 'immediate',
              fromcurrent: true,
              transition: { duration: 200 },
              frame: { duration: 300, redraw: false }
            }],
            label: 'Play'
          }, {
            method: 'animate',
            args: [[null], {
              mode: 'immediate',
              transition: { duration: 0 },
              frame: { duration: 0, redraw: false }
            }],
            label: 'Pause'
          }]
        }],
        sliders: [{
          pad: { l: 130, t: 55 },
          currentvalue: {
            visible: true,
            prefix: '',
            xanchor: 'left',
            font: { size: 20, color: '#666' },
          },
          steps: sliderSteps
        }]
      };

      // Render the Plotly chart with the updated traces and layout
      Plotly.react(`plotlyChart_${scenario}`, traces, layout);
      Plotly.addFrames(`plotlyChart_${scenario}`, frames);

      console.log(`Chart for ${scenario} updated with range ${range}`);
      document.querySelector('.slider-label').textContent = 'Global storage rate in 2050: ' + range[0];
    };

    const generateFrames = (data) => {
      // Generate frames for the animation based on the selected scenario and slider range
      const range = sliderRanges[selectedScenario.value];
      const frames = [];
      console.log("Generating frame data");
      console.log(range);
      console.log(sliderRanges);
      for (let value = range[0]; value <= range[1]; value += (selectedScenario.value === 'R_S2' || selectedScenario.value === 'R_S4') ? 0.1 : 1) {
        const filteredData = filterDataByGlobal(data, [value, range[1]]);
        const frameData = allCountries.map((country, index) => {
          const countryData = filteredData[country] || [];
          return {
            name: country,
            x: countryData.map(item => item.Growth),
            y: countryData.map(item => item.Storage),
            id: countryData.map(() => country),
            text: countryData.map(() => country),
            mode: 'markers',
            marker: {
              size: countryData.map(item => item.Rate * 1000),
              sizemode: 'area',
              sizeref: 10,
              color: colors[index]
            }
          };
        });
        frames.push({
          name: value.toString(),
          data: frameData
        });
      }
      console.log('Generated frames:', frames);
      return frames;
    };

    const filterDataByGlobal = (data, range) => {
      // Filter data based on the Global value and the selected range
      const filteredData = {};
      
      // Determine the precision for comparison (0.1 for R_S2/R_S4, otherwise integer)
      const precisionFactor = (selectedScenario.value === 'R_S2' || selectedScenario.value === 'R_S4') ? 10 : 1;

      // Round the target values for comparison
      const targetValueStart = Math.round(range[0] * precisionFactor) / precisionFactor;
      const targetValueEnd = Math.round(range[1] * precisionFactor) / precisionFactor;

      for (const country in data) {
        filteredData[country] = data[country].filter(item => {
          const globalValue = Math.round(item.Global * precisionFactor) / precisionFactor;
          return globalValue >= targetValueStart && globalValue <= targetValueEnd;
        });
      }

      console.log('Filtered data by Global range:', range, filteredData);
      return filteredData;
    };

    const onFrameChange = (data, value) => {
      // Handle the frame change event during animation
      const scenario = selectedScenario.value;
      console.log(`Frame changed to ${value} for scenario ${scenario}`);
      const maxRange = sliderRanges[scenario][1];
      updateChart(scenario, data, [value, maxRange]);
    };

    const onSliderChange = async (scenario) => {
      // Handle the slider change event
      try {
        const data = await fetchData(scenario);
        console.log(`Slider changed for ${scenario}`);
        updateChart(scenario, data);
      } catch (error) {
        console.error("Promise was rejected", error);
      }
    };

    const initBubbleChart = async (scenario) => {
      // Initialize the bubble chart for the selected scenario
      const data = await fetchData(scenario);

      // Calculate global maximum values for axes
      allCountries.forEach(country => {
        const countryData = data[country] || [];
        globalMaxX = Math.max(globalMaxX, ...countryData.map(item => item.Growth));
        globalMaxY = Math.max(globalMaxY, ...countryData.map(item => item.Storage));
      });

      updateChart(scenario, data);

      // Add event listener for the Plotly slider change event
      const chartElement = document.getElementById(`plotlyChart_${scenario}`);
      chartElement.on('plotly_sliderchange', (e) => {
        const value = e.step.label;
        console.log(`Slider changed to ${value} for scenario ${scenario}`);
        onFrameChange(data, value);
      });
    };

    const toggleScenario = () => {
      // Handle scenario change event
      if (!sliderRanges[selectedScenario.value]) {
        sliderRanges[selectedScenario.value] = [2, 13];
      }
      console.log('Toggled scenario:', selectedScenario.value);
      initBubbleChart(selectedScenario.value);
    };

    onMounted(() => {
      // Initialize the chart when the component is mounted
      if (selectedScenario.value) {
        initBubbleChart(selectedScenario.value);
      }
      console.log('Mounted component with selected scenario:', selectedScenario.value);
    });

    return {
      selectedScenario,
      sliderRanges,
      toggleScenario,
      onSliderChange,
      RS2Value,
    };
  },
};
</script>

<style>
.scenario-container {
  margin-top: 20px;
  background: #fff;
  padding: 20px;
}
.plotly-chart {
  width: 100%;
  height: 550px;
}
.scenario-selector{
  top: 20px;
  box-shadow: 0 0 1.758vw 0 rgba(154, 143, 113, .2);
  padding: 20px;
  background-color: #fff;
}
.slider-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
</style>
