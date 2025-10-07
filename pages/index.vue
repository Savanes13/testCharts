<script lang="ts" setup>
import DefaultButton from '~/components/ui/DefaultButton.vue'
import type { TSalesArr } from '~/types/sales'
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

const salesDataArr = ref<TSalesArr | null>(null);

const nowDate: string = new Date().toISOString().split('T')[0]!;
const weekAheadDate: string = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]!;
const monthAheadDate: string = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0]!;

//calendar
const range = ref<any>([new Date(), new Date()])
const formatDate = (date: Date | string | null) => {
  if (!date) return ''
  if (typeof date === 'string') return date.split('T')[0]
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getStartEnd = () => {
  if (Array.isArray(range.value)) return range.value;
  if (range.value && range.value.start && range.value.end) return [range.value.start, range.value.end];
  return [null, null];
};

watch(range, () => {
  const startStr = formatDate(getStartEnd()[0]);
  const endStr = formatDate(getStartEnd()[1]);
  if(startStr && endStr) getSales(startStr, endStr);
});

//chart
ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale)
const categories: Category[] = ["Электроника", "Одежда", "Книги"]
const colors = ['#4f46e5', '#6366f1', '#8b5cf6', '#a78bfa']
const chartData = computed(() => {
  const labels = salesDataArr.value?.map(d => d.date) || [];
  const datasets = categories.map((cat: Category, index) => ({
    label: cat,
    data: salesDataArr.value?.map(d => d.categories[cat] || 0) || [],
    borderColor: colors[index % colors.length],
    backgroundColor: colors[index % colors.length],
    tension: 0.3,
    fill: false
  }));
  return { labels, datasets };
});

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
//-------

const getSales = async (startDate: string, endDate: string) => {
  try { 
    const response = await getSalesByDate(startDate, endDate);
    salesDataArr.value = response.data
    console.log(response)
  } catch (error) {
    console.log(error)
  };
};
getSales(nowDate, monthAheadDate);
</script>

<template>
  <div 
    class="chart"
    v-if="salesDataArr"
  >
    <div class="chart__header">
      <h2>Динамика продаж по категориям</h2>
      <div class="legend-chart">
        <span v-for="(cat, index) in categories" :key="cat" class="legend-chart__item" :style="{ color: colors[index % colors.length] }">
          ● {{ cat }}
        </span>
      </div>
    </div>

    <div class="calendar-wrap" style="margin-bottom:16px;">
      <v-date-picker
        v-model="range"
        is-range
        :popover="{ placement: 'bottom' }"
        :masks="{ input: 'YYYY-MM-DD' }"
      />
    </div>

    <p>
  {{ formatDate(getStartEnd()[0]) }} — {{ formatDate(getStartEnd()[1]) }}
</p>

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

<style lang="scss" scoped>
@use "@/style/variables/color.scss" as color;

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
  background: color.$steel_gray_4; 
  overflow: hidden;
  cursor: default !important;
}

.chart__scroll-wrap::-webkit-scrollbar-thumb {
  background-color: color.$main_purple;
  cursor: default !important;
}

.chart-inner {
  min-width: calc(100px * 31);
  height: 70vh;
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
