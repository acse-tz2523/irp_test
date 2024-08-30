<!--
Author: Tianzi Zhang
GitHub: acse-tz2523
-->
<template>
  <!-- The container for the map chart -->
  <div ref="mapContainer" style="height: 100%;"></div>
</template>

<script>
import * as echarts from 'echarts';
import worldMapData from '@/assets/newgeo.json';

export default {
  name: 'MapChart',
  mounted() {
    // Initialize the map when the component is mounted
    this.initMap();
  },
  methods: {
    initMap() {
      console.log("Initializing map");

      // Sample data for the map
      const data = [
        { name: 'Canada', value: 71 },
        { name: 'United States of America', value: 70 },
        { name: 'Australia', value: 60 },
        { name: 'EU', value: 63 },
        { name: 'United Kingdom', value: 65 },
        { name: 'China', value: 53 },
        { name: 'South Korea', value: 37 },
        { name: 'Middle East', value: 36 },
        { name: 'Indonesia', value: 31 },
        { name: 'Thailand', value: 21 },
      ];

      // ECharts map options configuration
      const mapOptions = {
        tooltip: {
          trigger: 'item', // Show tooltip when hovering over an item
        },
        
        visualMap: {
            type: 'piecewise',
            pieces: [
              {min: 57, label: 'High', color: '#2C71C1'},  // High readiness level, represented by a specific color
              {min: 50, max: 57, label: 'Medium', color: '#36A2EB'},  // Medium readiness level
              {max: 50, label: 'Low', color: '#4BC0C0'}  // Low readiness level
            ],
            align: 'left',  // Align visual map to the left
            left: '25%',  // Position visual map with 25% left margin
            bottom: 35,  // Position visual map slightly above the bottom
            text: ['CCS Readiness:'],  // Title text for visual map
            textStyle: {
              color: '#000',  // Text color
              fontSize: 12,  // Text size
              fontWeight: 'bold'  // Text boldness
            },
            calculable: true // Allows dragging to adjust the range of the visual map
          },

        series: [
          {
            name: 'CCS Readiness',
            type: 'map',
            map: 'world', // Use the registered world map data
            roam: false, // Disable zooming and panning
            itemStyle: {
              emphasis: {
                label: { show: true } // Highlight label when hovering
              }
            },
            data: data // Data to be displayed on the map
          }
        ]
      };

      // Initialize the ECharts instance with the specified container
      const chart = echarts.init(this.$refs.mapContainer);
      // Register the world map data
      echarts.registerMap('world', worldMapData);
      // Set the options for the map chart
      chart.setOption(mapOptions);

      // Add an event listener for clicks on the map
      chart.on('click', (params) => {
        console.log("Country clicked:", params.name);
        // Emit an event when a country is selected, passing the country's name
        this.$emit('country-selected', params.name);
      });
    }
  }
};
</script>

<style scoped>
#mapContainer {
  width: 100%;
  height: 100%;
}
</style>
