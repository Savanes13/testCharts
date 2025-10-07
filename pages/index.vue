<script lang="ts" setup>
import DefaultButton from '~/components/ui/DefaultButton.vue'
import { ref } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
} from 'chart.js'
import { getSalesByDate } from '~/api/apiChart'

type Category = "Электроника" | "Одежда" | "Книги"

const salesDataByDate = [
  { date: "2024-10-01", categories: { "Электроника": 1200, "Одежда": 800, "Книги": 500 } },
  { date: "2024-10-02", categories: { "Электроника": 1500, "Книги": 600 } },
  { date: "2024-10-03", categories: { "Электроника": 2000, "Одежда": 900 } },
  { date: "2024-10-04", categories: { "Электроника": 1100, "Книги": 700 } },
  { date: "2024-10-05", categories: { "Электроника": 1300, "Одежда": 450, "Книги": 300 } },
  { date: "2024-10-06", categories: { "Электроника": 900, "Одежда": 700, "Книги": 400 } },
  { date: "2024-10-07", categories: { "Электроника": 1600, "Книги": 500 } },
  { date: "2024-10-08", categories: { "Электроника": 1200, "Одежда": 850 } },
  { date: "2024-10-09", categories: { "Электроника": 1400, "Одежда": 600, "Книги": 350 } },
  { date: "2024-10-10", categories: { "Электроника": 1700, "Книги": 450 } },
  { date: "2024-10-11", categories: { "Электроника": 1300, "Одежда": 700 } },
  { date: "2024-10-12", categories: { "Электроника": 1500, "Одежда": 400, "Книги": 500 } },
  { date: "2024-10-13", categories: { "Электроника": 1800, "Книги": 600 } },
  { date: "2024-10-14", categories: { "Электроника": 1200, "Одежда": 500 } },
  { date: "2024-10-15", categories: { "Электроника": 1600, "Одежда": 750, "Книги": 300 } },
  { date: "2024-10-16", categories: { "Электроника": 1400, "Книги": 450 } },
  { date: "2024-10-17", categories: { "Электроника": 1500, "Одежда": 600 } },
  { date: "2024-10-18", categories: { "Электроника": 1700, "Одежда": 500, "Книги": 400 } },
  { date: "2024-10-19", categories: { "Электроника": 1300, "Книги": 550 } },
  { date: "2024-10-20", categories: { "Электроника": 1600, "Одежда": 700 } },
  { date: "2024-10-21", categories: { "Электроника": 1500, "Одежда": 450, "Книги": 500 } },
  { date: "2024-10-22", categories: { "Электроника": 1800, "Книги": 600 } },
  { date: "2024-10-23", categories: { "Электроника": 1400, "Одежда": 500 } },
  { date: "2024-10-24", categories: { "Электроника": 1600, "Одежда": 750, "Книги": 350 } },
  { date: "2024-10-25", categories: { "Электроника": 1500, "Книги": 400 } },
  { date: "2024-10-26", categories: { "Электроника": 1700, "Одежда": 650 } },
  { date: "2024-10-27", categories: { "Электроника": 1300, "Одежда": 500, "Книги": 450 } },
  { date: "2024-10-28", categories: { "Электроника": 1600, "Книги": 600 } },
  { date: "2024-10-29", categories: { "Электроника": 1400, "Одежда": 700 } },
  { date: "2024-10-30", categories: { "Электроника": 1500, "Одежда": 500, "Книги": 300 } },
  { date: "2024-10-31", categories: { "Электроника": 1800, "Книги": 550 } }
]




const nowDate: string = new Date().toISOString().split('T')[0]!;
const weekAheadDate: string = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]!;
const monthAheadDate: string = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]!;



//chart
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)

const categories: Category[] = ["Электроника", "Одежда", "Книги"]

const colors = ['#4f46e5', '#6366f1', '#8b5cf6', '#a78bfa']

const datasets = categories.map((cat: Category, index) => ({
  label: cat,
  data: salesDataByDate.map(d => d.categories[cat] || 0),
  borderColor: colors[index % colors.length],
  backgroundColor: colors[index % colors.length],
  tension: 0.3,
  fill: false
}))

const chartData = ref({
  labels: salesDataByDate.map(d => d.date),
  datasets
})

const chartOptions = ref({
  responsive: true,       
  maintainAspectRatio: false,  
  plugins: {
    legend: { display: false },
    title: { display: false, },
    tooltip: { mode: 'index', intersect: false }
  },
  interaction: { mode: 'nearest' as const, axis: 'x' as const, intersect: false },
  scales: { y: { beginAtZero: true } }
})
//--------



setTimeout(() => {
  getSales('2024-10-01', '2024-10-09')
}, 2000);

const getSales = async (startDate: string, endDate: string) => {
  try { 
    const response = await getSalesByDate(startDate, endDate);
    console.log(response)
  } catch (error) {
    console.log(error)
  };
};
</script>

<template>
  <div class="chart">
    <div class="chart__header">
      <h2>Динамика продаж по категориям</h2>
      <div class="legend-chart">
        <span v-for="(cat, index) in categories" :key="cat" class="legend-chart__item" :style="{ color: colors[index % colors.length] }">
          ● {{ cat }}
        </span>
      </div>
    </div>

    <div class="chart__period">
      <div class="title-period">
        <p>Выбор периода</p>
      </div>
      <div class="buttons-period">
        <DefaultButton
          @click="getSales(nowDate, nowDate)"
        >
          Сегодня
        </DefaultButton>
        <DefaultButton
          @click="getSales(nowDate, weekAheadDate)"
        >
          Неделя
        </DefaultButton>
        <DefaultButton
          @click="getSales(nowDate, monthAheadDate)"
        >
          Месяц
        </DefaultButton>
      </div>
    </div>

    <div class="chart__scroll-wrap">
      <div class="chart-inner">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart__scroll-wrap {
  width: 100%;
  overflow-x: auto;
  padding-bottom: 10px;
}

.chart__scroll-wrap::-webkit-scrollbar {
  height: 12px;
  width: 6px !important;
  cursor: default !important;
}

.chart__scroll-wrap::-webkit-scrollbar-track {
  background: rgb(199, 199, 199);
  overflow: hidden;
  cursor: default !important;
}

.chart__scroll-wrap::-webkit-scrollbar-thumb {
  background-color: rgb(129, 129, 129);
  cursor: default !important;
}

.chart-inner {
  min-width: calc(100px * 31);
  height: 400px;
}

.chart__period {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 24px;
}

.buttons-period {
  display: flex;
  gap: 8px;

}

@media (max-width: 1024px) {
  .chart-wrapper {
    height: 300px; 
  }
}

@media (max-width: 640px) {
  .chart-wrapper {
    height: 250px; 
  }
}
</style>
