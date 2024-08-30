<!--
Author: Tianzi Zhang
GitHub: acse-tz2523
-->
<template>
  <div ref="scatterChart" :style="style"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'ScatterChart',
  props: {
    data: Array, // The data to be displayed in the scatter chart
    maxValues: Object, // Maximum values for the x and y axes
    style: Object, // Style object to control the chart container's appearance
    selectedScenarios: Array, // List of selected scenarios
    limitedScenarios: Array, // List of limited scenarios
    scenarioCountryMaxValues: Object, // Maximum values for each scenario and country
    countryName: String // Name of the country being displayed
  },
  data() {
    return {
      chart: null, // Reference to the ECharts instance
    };
  },
  methods: {
    initChart() {
      // Initialize the chart
      if (this.$refs.scatterChart) {
        this.chart = echarts.init(this.$refs.scatterChart);
        this.updateChart();
      }
    },
    updateChart() {
      // Update the chart with new data and configuration
      //console.log("Updating scatter chart with data:", this.data);
      if (!this.chart || !this.data || !this.data.length || !this.maxValues || typeof this.maxValues.x !== 'number' || typeof this.maxValues.y !== 'number') {
        //console.warn("Chart has not been initialized, no data available, or maxValues are invalid.");
        return;
      }

      // Extract y-axis values for logging
      //const yValues = this.data.map(item => item.Storage);
      //console.log("Current y-axis values for", this.countryName, ":", yValues);
      // Log the maximum value set for the y-axis
     // console.log("Set y-axis max value for", this.countryName, ":", this.maxValues.y);

      const option = {
        title: {
          text: this.countryName,
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: (params) => `Growth: ${params.value[0]}<br>Storage: ${params.value[1]}<br>Modelled Rate: ${params.value[2]}<br>Global: ${params.value[3]}<br>Scenario: ${params.value[4]}`
        },
        grid: {
          // You can adjust the grid configuration here if needed
        },
        xAxis: {
          type: 'value',
          name: 'Growth Rate',
          nameLocation: 'middle',
          max: this.maxValues.x,
          axisLabel: {
            formatter: '{value}'
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        yAxis: {
          type: 'log',
          name: 'Storage (Gt)',
          max: this.maxValues.y,
          axisLabel: {
            formatter: (value) => `10^${Math.round(Math.log10(value))}`
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        visualMap: {
          itemWidth: 15,
          itemHeight: 80,
          left: 3,
          bottom: 10,
          type: 'continuous',
          orient:'horizontal',
          dimension: 3,
          min: Math.min(...this.data.map(item => item.Global)),
          max: Math.max(...this.data.map(item => item.Global)),
          inRange: {
            color: ['#50a3ba', '#eac736', '#d94e5d'] // Color gradient for the visual map
          }
        },
        series: [{
          name: 'Data Points',
          type: 'scatter',
          symbolSize: 5,
          data: this.data
            .filter(item => item.Storage > 0) // Filter out data with Storage <= 0
            .map(item => [item.Growth, item.Storage, item.Rate, item.Global, item.Scenario]),
          encode: {
            x: 0,
            y: 1,
            tooltip: [0, 1, 2, 3, 4]
          },
          markLine: {
            silent: true,
            data: this.getScenarioLines() // Apply scenario lines to the chart
          },
          markArea: {
            silent: true,
            data: this.generateMarkAreas(), // Generate marked areas for the chart
            itemStyle: {
              color: 'rgba(200, 200, 200, 0)', // Background color for marked areas
              borderColor: '#000', // Border color for marked areas
              borderWidth: 1 // Border width for marked areas
            },
            label: {
              show: true,
              position: 'insideTopLeft', // Display label inside the area
              color: '#496C88', // Font color for the label
              fontSize: 14, // Font size for the label
              formatter: (params) => {
                const region = params.data.coord;
               // console.log("MarkArea region:", region); // Log the region details
                return this.calculateDominantScenario(region); // Calculate and display the dominant scenario
              }
            }
          }

        }],
      };

      this.chart.setOption(option, true);
      this.applyMarkLines();
    },
    applyMarkLines() {
      // Apply the generated scenario lines to the chart
      const lines = this.getScenarioLines();
      this.chart.setOption({
        series: [{
          markLine: {
            silent: true,
            data: lines
          }
        }]
      });
    },
    getScenarioLines() {
      // Generate the lines for different scenarios based on max values
      const lines = [];
      this.selectedScenarios.concat(this.limitedScenarios).forEach(scenario => {
        if (this.scenarioCountryMaxValues[scenario] && this.scenarioCountryMaxValues[scenario][this.countryName]) {
          const values = this.scenarioCountryMaxValues[scenario][this.countryName];
          lines.push({
            yAxis: values.y,
            label: {
              show: true,
              position: 'insideEndTop',
              formatter: `${values.y}`
            }
          });
          lines.push({
            xAxis: values.x,
            label: {
              show: true,
              position: 'insideEndTop',
              formatter: `${values.x}`
            }
          });
        }
      });
      // console.log("Generated scenario lines:", lines);
      return lines;
    },
    generateMarkAreas() {
      // Generate marked areas based on the scenario lines
      const areas = [];
      const lines = this.getScenarioLines();

      // Get unique x and y axis division points and sort them
      const xLines = [...new Set(lines.filter(line => line.xAxis !== undefined).map(line => line.xAxis))].sort((a, b) => a - b);
      const yLines = [...new Set(lines.filter(line => line.yAxis !== undefined).map(line => line.yAxis))].sort((a, b) => a - b);

      // console.log("xLines:", xLines);
      // console.log("yLines:", yLines);

      // Iterate over x and y axis division points to generate all possible regions
      for (let i = 0; i < xLines.length; i++) {
        for (let j = 0; j < yLines.length; j++) {
          const xMin = i === 0 ? 0 : xLines[i - 1];
          const xMax = xLines[i];
          const yMin = j === 0 ? 0 : yLines[j - 1];
          const yMax = yLines[j];

          // Only generate sub-regions that do not include the maximum value
          if (xMax <= this.maxValues.x && yMax <= this.maxValues.y) {
            areas.push([
              { xAxis: xMin, yAxis: yMin },
              { xAxis: xMax, yAxis: yMax }
            ]);
          }
        }
      }

      console.log("Generated mark areas:", areas);
      return areas;
    },

    calculateDominantScenario(region) {
      // Calculate the dominant scenario within a specific region
      const { data } = this;
      const [start, end] = region;
      const xMin = start[0];
      const yMin = start[1];
      const xMax = end[0];
      const yMax = end[1];

      // console.log('Calculating dominant scenario');
      // console.log('Processing region:', region);
      // console.log('Region boundaries:', `x: [${xMin}, ${xMax}], y: [${yMin}, ${yMax}]`);

      const scenarioCounts = {};
      let totalCount = 0;

      data.forEach(item => {
        const x = item.Growth;
        const y = item.Storage;
        const scenario = item.Scenario;
        if (x >= xMin && x <= xMax && y >= yMin && y <= yMax) {
          scenarioCounts[scenario] = (scenarioCounts[scenario] || 0) + 1;
          totalCount++;
        }
      });
      // console.log('Scenario counts in region:', scenarioCounts);
      // console.log('Total count in region:', totalCount);

      const scenarios = Object.keys(scenarioCounts);
      if (scenarios.length === 1) {
        return `${scenarios[0]} only`;
      }

      if (scenarios.length === 0) {
        return '';
      }

      const dominantScenario = scenarios.reduce((a, b) => scenarioCounts[a] > scenarioCounts[b] ? a : b, scenarios[0]);
      const dominantCount = scenarioCounts[dominantScenario];
      // console.log(`Dominant scenario in region: ${dominantScenario} with count: ${dominantCount}`);

      if (dominantCount / totalCount > 0.5) {
        return `${dominantScenario} dominated`;
      }

      return '';
    },
  },
  watch: {
    data: {
      handler(newData) {
        // Watch for changes in the data and update the chart accordingly
        console.log("Scatter chart data changed:", newData);
        this.updateChart();
      },
      deep: true, // Deep watch to handle changes within the data array
      immediate: true // Immediate update when the component is mounted
    }
  },
  mounted() {
    // Initialize the chart when the component is mounted
    this.initChart();
  },
  beforeUnmount() {
    // Dispose of the chart instance when the component is about to be destroyed
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>

<style scoped>
/* Additional styles can be placed here */
</style>
