<template>
  <div>
    <Bar :data="data" />
  </div>
</template>
<script lang="ts">
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default {
  name: "App",
  components: {
    Bar,
  },
  data() {
    return {
      data: {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        datasets: [
          {
            label: "Data One",
            backgroundColor: "#f87979",
            data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11],
          },
        ],
      },
      options: {
        responsive: true,
        animation: {
          onProgress: {
            showChart: showChart(),
          },
        },
      },
    };
  },
};
function showChart() {}
</script>
<style lang="css" scoped>
.show-chart {
  visibility: visible;
  width: 50%;
  margin: 0 auto;
  margin-top: 100px;
  background-color: white;
}
</style>
