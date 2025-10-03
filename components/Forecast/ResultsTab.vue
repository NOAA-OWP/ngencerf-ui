<template>
  <div class="col-span-2">
    <h1 class="pt-3 mb-8 text-3xl font-bold inline-block">
      <span id="tab-title">Forecast Run Results</span>
    </h1>

    <table aria-describedby="tab-title">
      <tbody>
        <tr height="30px" :aria-label="'Calibration Job ID is ' + calibrationJobId"
          :title="'Calibration Job ID is ' + calibrationJobId">
          <th class="text-right font-bold">
            <div style="width: 140px;">Calibration Job ID</div>
          </th>
          <td class="pl-5" nowrap>{{ calibrationJobId }}</td>
          <th class="text-right font-bold" :aria-label="'Status is ' + overallForcingDownloadForecastStatus"
            :title="'Status is ' + overallForcingDownloadForecastStatus">
            <div style="width: 140px;">Status</div>
          </th>
          <td class="pl-5" nowrap>{{ overallForcingDownloadForecastStatus }}</td>
        </tr>
        <tr height="30px">
          <th class="text-right font-bold" :aria-label="'Forecast Job ID is ' + forecastJobId"
            :title="'Forecast Job ID is ' + forecastJobId">
            <div style="width: 140px;">Forecast Job ID</div>
          </th>
          <td class="pl-5" nowrap>{{ forecastJobId }}</td>
          <th class="text-right font-bold" :aria-label="'Elapsed Time is ' + elapsedTime"
            :title="'Elapsed Time is ' + elapsedTime">
            <div style="width: 140px;">Elapsed Time</div>
          </th>
          <td class="pl-5" nowrap>{{ elapsedTime ?? '-'.repeat(15) }}</td>
        </tr>
        <tr height="30px">
          <th class="text-right font-bold" :aria-label="'Configuration is ' + forecastConfigurationName"
            :title="'Configuration is ' + forecastConfigurationName">
            <div style="width: 140px;">Configuration</div>
          </th>
          <td class="pl-5" nowrap>{{ forecastConfigurationName }}</td>
          <th class="text-right font-bold" style="width: 140px;">
            <label class="text-right" for="resultsPathname" style="width: 140px;">Results Pathname</label>
          </th>
          <td class="pl-5" style="width: 100%;" :aria-label="'Job Data Directory is ' + resultsPathname"
            :title="'Job Data Directory is ' + resultsPathname">
            <InputText id="resultsPathname" v-model="resultsPathname" placeholder="Job Data Directory" disabled />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div>
    <div class="text-center" id="GraphArea" aria-label="Graph display area" title="Graph display area">
      <div id="PlotGraphArea" ref="plotGraphArea" v-if="!plotGraphCheckboxesEmpty()">
        <div id="PlotGraphSVG" ref="plotGraphSVG" class="flex flex-row justify-center"></div>
        <div id="PlotGraphSliderContainer" class="flex flex-row justify-center" :class="plotGraphSliderCursor">
          <div id="PlotGraphSlider" ref="plotGraphSlider" @mousedown="sliderDragStart" @mousemove="sliderDragChange"
            @mouseup="sliderDragEnd" @mouseleave="sliderDragCancel">
            <div id="PlotGraphSliderBox" ref="plotGraphSliderBox"></div>
          </div>
        </div>
        <div id="PlotGraphSliderDateRange">
          <div class="flex flex-row justify-center">
            {{ formatDateString(plotGraphDateRange.start) }} - {{ formatDateString(plotGraphDateRange.end) }}
          </div>
        </div>
        <div id="PlotGraphSliderHelp">
          <div class="flex flex-row justify-center">
            {{ plotGraphSliderHelpDisplay }}
          </div>
        </div>
      </div>
      <div id="PlotGraphControls">
        <a v-if="showPlotGraph" href="#" class="inline-block p-1 c-blue underline mt-1 pb-2"
          @click="toggleCustomizePlot">
          Customize Viewer
        </a>
        <div v-if="plotGraphLines.length > 0">
          <div v-for="item in plotGraphLines" :key="item.id">
            <input v-if="plotGraphLines.length > 1" type="checkbox" :id="`plotGraphCheckbox-${item.id}`"
              v-model="item.checked" @change="drawInteractivePlot(); drawInteractiveSlider();" class="align-top">
            <label :for="`plotGraphCheckbox-${item.id}`" :style="`color: ${item.color}`">{{ item.name }}</label>
          </div>
        </div>
        <div v-if="plotGraphCheckboxesEmpty()">
          Check at least one box to generate an interactive plot.
        </div>
        <div id="CustomizePlotWindow" v-if="showCustomizePlot">
          <div class="text-right sticky top-0">
            <img title="Close" aria-label="Close" src="@/assets/styles/img/xclose.png" width="40"
              class="absolute cursor-pointer right-0 mt-1 mr-1" @click="toggleCustomizePlot" alt="Close" />
          </div>
          <h2 class="mt-5" aria-label="Customize Viewer" title="Customize Viewer">
            Customize Viewer
          </h2>
          <div v-if="plotGraphLines.length > 0">
            <div v-for="item in plotGraphLines" :key="item.id" class="text-nowrap">
              <div>
                <label :for="`plotGraphColor-${item.id}`" :style="`color: ${item.color}`">{{ item.name }}</label>
              </div>
              <Select class="select150" :id="`plotGraphColor-${item.id}`" v-model="item.color"
                :options="plotGraphColorList" optionLabel="name" optionValue="name" @change="drawInteractivePlot">
              </Select>
              <Select class="select150" :id="`plotGraphSymbol-${item.id}`" v-model="item.symbol"
                :options="plotGraphSymbolList" optionLabel="name" optionValue="name" @change="drawInteractivePlot">
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToast } from 'primevue/usetoast';

import type { ToastMessageOptions } from "primevue/toast";

import { useForecastStore } from '@/stores/forecast/ForecastStore';
import { generalStore } from '~/stores/common/GeneralStore';

import { hilightTab } from '@/composables/TabHilight';

import { convertISOStringOrDateToDateTime } from '@/utils/TimeHelpers';
import * as Plot from "@observablehq/plot";

const { calibrationJobId } = storeToRefs(generalStore());
const { addToastRecord } = generalStore();

const {
  calibrationRunForForecast,
  forecastJobId,
  forecastConfigurationName,
  resultsPathname,
  forecastPlot,
  elapsedTime,
  overallForcingDownloadForecastStatus
} = storeToRefs(useForecastStore());

const {
  loadForecastResultsTabData,
} = useForecastStore();

const toast = useToast();

const plotGraphArea = ref<HTMLElement>();
const plotGraphSVG = ref<HTMLElement>();
const plotGraphDataRaw = ref<any[]>([]);
const plotGraphData = ref<any[]>([]);
const plotGraphColumns = ref<any[]>([]);
const plotGraphOptions = ref<DynamicObject>({});
const plotGraphLines = ref<any[]>([]);
const plotGraphDateLimits = ref<DynamicObject>({});
const plotGraphDateRange = ref<DynamicObject>({});
const plotGraphSlider = ref<HTMLElement>();
const plotGraphSliderData = ref<any[]>([]);
const plotGraphSliderOptions = ref<DynamicObject>({});
const plotGraphSliderBox = ref(null);
const plotGraphSliderCursor = ref<string>('cursor-grab');
const plotGraphSliderHelpDisplay = ref<string>('');
const sliderBoxPosition = ref<DynamicObject>({});
const sliderDragPosition = ref<DynamicObject>({});
const sliderDragType = ref<string>('');
const showPlotGraph = ref<Boolean>(false);
const showCustomizePlot = ref<Boolean>(false);

const ptColumn = ref({
  columnHeaderContent: { style: { "justify-content": "center" } },
  bodyCell: { style: { "text-align": "right", "padding-right": "10px !important" } }
});

const plotGraphColors = ref<any[]>([
  'grey', 'blue', 'gold', 'green', 'teal', 'black', 'orange', 'pink', 'purple', 'red', 'yellow'
]);
const plotGraphColorList = ref<any[]>([]);
for (let c = 0; c < plotGraphColors.value.toSorted().length; c++) {
  plotGraphColorList.value.push({ name: plotGraphColors.value.toSorted()[c] });
}
const plotGraphSymbols = ref<any[]>([
  'line', 'circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'
]);
const plotGraphSymbolList = ref<any[]>([]);;
for (let s = 0; s < plotGraphSymbols.value.toSorted().length; s++) {
  plotGraphSymbolList.value.push({ name: plotGraphSymbols.value.toSorted()[s] });
}
const plotGraphSliderHelpText = [
  'Click and drag within the slider to change the date range.',
  'Drag left or right to change the Start Date.',
  'Drag left or right to change the End Date.',
  'Drag left or right to move the Start and End Dates.',
  'Click inside the highlighted date range or on its edges to make changes.'
]

function formatDateString(str: string) {
  let date = new Date(str);
  let date_str = date.toLocaleString('en-US', {month: 'short', day: 'numeric', year: 'numeric'}).replace(',','');
  date_str += ' ' + date.toLocaleString('en-US', {hour: '2-digit', minute: '2-digit', hour12: false}); 
  return date_str;
}

onMounted(async () => {
  toast.removeAllGroups();
  let ele = document.getElementById("MainLeftDataArea") as HTMLElement;
  if (ele) { ele.scrollTo(0, 0); }

  hilightTab(ForecastTabs.tab_results);

  resetUserPlotRefs([]);

  // load Results tab data
  const errorMessages: string[] = await loadForecastResultsTabData();
  errorMessages.forEach((msg: string) => {
    const tMsg: ToastMessageOptions = { severity: 'error', summary: 'Error', detail: msg, life: ToastTimeout.timeoutError };
    toast.add(tMsg); addToastRecord(tMsg);
  });
});

// Reset refs when selectedPlotName changes
const resetUserPlotRefs = (exceptions: any): void => {
  if (!Array.isArray(exceptions)) {
    exceptions = [];
  }

  // plot graph refs
  // plotGraphArea.value = null;
  // plotGraphSVG.value = null;
  plotGraphDataRaw.value = [];
  plotGraphData.value = [];
  plotGraphColumns.value = [];
  plotGraphOptions.value = [];
  plotGraphLines.value = [];
  plotGraphDateLimits.value = {};
  plotGraphDateRange.value = {};
  // plotGraphSlider.value = null;
  plotGraphSliderData.value = [];
  plotGraphSliderOptions.value = [];
  plotGraphSliderBox.value = null;
  plotGraphSliderCursor.value = 'cursor-grab';
  plotGraphSliderHelpDisplay.value = '';
  sliderBoxPosition.value = {};
  sliderDragPosition.value = {};
  sliderDragType.value = '';
  showPlotGraph.value = false;
  showCustomizePlot.value = false;
}

watch(forecastPlot, async () => {
  if (forecastPlot.value.plot_data && forecastPlot.value.plot_data.length > 0) {
    showForecastPlot();
  }
});

const showForecastPlot = async () => {
  if (!plotGraphData.value || plotGraphData.value.length === 0) {
    // standard interactive plot logic
    if (forecastPlot.value.plot_data) {
      plotGraphDataRaw.value = forecastPlot.value.plot_data;
      adjustPlotGraphColumns();
    }
    // setting min/max dates will trigger the date filter below
    plotGraphDateLimits.value = {
      start: plotGraphDataRaw.value[0][plotGraphColumns.value[0].value],
      end: plotGraphDataRaw.value[plotGraphDataRaw.value.length - 1][plotGraphColumns.value[0].value],
      span: Math.ceil((new Date(plotGraphDataRaw.value[plotGraphDataRaw.value.length - 1][plotGraphColumns.value[0].value]).getTime() - new Date(plotGraphDataRaw.value[0][plotGraphColumns.value[0].value]).getTime()) / (1000 * 3600))
    }
    plotGraphDateRange.value = {
      start: plotGraphDateLimits.value.start,
      end: plotGraphDateLimits.value.end,
    };
  }
  showPlotGraph.value = true;
  updatePlotGraphDates();
  if (plotGraphData.value.length > 0) {
    nextTick(() => {
      drawInteractiveSlider();
    })
  } else {
    showPlotGraph.value = false;
  }
};

// Handle plotGraphData changes
watch(plotGraphData, async () => {
  if (plotGraphData.value.length > 0) {
    if (plotGraphLines.value.length === 0) {
      for (let c = 1; c < plotGraphColumns.value.length; c++) {
        let strokeColor = c < plotGraphColors.value.length ? plotGraphColors.value[c - 1] : plotGraphColors.value[0];
        plotGraphLines.value.push({
          id: c,
          name: plotGraphColumns.value[c].header,
          color: strokeColor,
          symbol: 'line',
          checked: true
        });
      }
    }
    nextTick(() => {
      drawInteractivePlot();
    })
  } else {
    showPlotGraph.value = false;
  }
});

function adjustPlotGraphColumns() {
  if (plotGraphDataRaw.value.length > 0) {
    Object.keys(plotGraphDataRaw.value[0]).forEach(key => {
      let column_header_words = key.split("_");
      for (let w = 0; w < column_header_words.length; w++) {
        let word = column_header_words[w]
        column_header_words[w] = word.charAt(0).toUpperCase() + word.slice(1);
      }
      let column_header = column_header_words.join(" ");
      plotGraphColumns.value.push({ header: column_header, value: key });
    });
    for (let d = 0; d < plotGraphDataRaw.value.length; d++) {
      Object.keys(plotGraphDataRaw.value[d]).forEach(key => {
        if (plotGraphDataRaw.value[d][key] && (plotGraphDataRaw.value[d][key] === null || plotGraphDataRaw.value[d][key] === '')) {
          plotGraphDataRaw.value[d][key] = 'N/A';
        } else if (!isNaN(parseFloat(plotGraphDataRaw.value[d][key])) && isFinite(plotGraphDataRaw.value[d][key]) && plotGraphDataRaw.value[d][key].toString().indexOf('.') > 0) {
          // attempt to round to 5 digits - just display as is if there are any problems doing this
          try {
            plotGraphDataRaw.value[d][key] = Number(plotGraphDataRaw.value[d][key]).toFixed(5);
          } catch (error) {
            console.error('Error rounding value ' + plotGraphDataRaw.value[d][key] + ': ', error);
          }
        }
      });
    }
  }
}

// draw interactive plot when plot graph data is first loaded, and also when checkboxes are clicked
const drawInteractivePlot = () => {
  let plotLineData = [];
  let plotDotData = [];
  if (!plotGraphCheckboxesEmpty()) {
    plotGraphOptions.value = {
      x: { grid: true },
      y: { grid: true, labelAnchor: 'center', labelArrow: 'none' },
      marks: [],
      width: (plotGraphArea.value as HTMLElement).offsetWidth - 50,
      height: ((document.getElementById('MainLeftDataParent') as HTMLElement).getBoundingClientRect().bottom
        - (document.getElementById('PlotGraphArea') as HTMLElement).getBoundingClientRect().top) - 100
    };
    plotGraphOptions.value.y.label = 'Streamflow (m^3/s)';
    plotGraphOptions.value.y.labelOffset = -10;
    plotGraphOptions.value.marginLeft = 50;

    for (let c = 1; c < plotGraphColumns.value.length; c++) {
      if (plotGraphLines.value.length === 1 || (document?.getElementById('plotGraphCheckbox-' + c) as HTMLInputElement).checked) {
        for (let d = 0; d < plotGraphData.value.length; d++) {
          if (plotGraphLines.value[c - 1].symbol === 'line') {
            plotLineData.push({
              'time': convertISOStringOrDateToDateTime(plotGraphData.value[d][plotGraphColumns.value[0].value].replace(" ","T") + "Z").toJSDate(),
              'measurement': parseFloat(plotGraphData.value[d][plotGraphColumns.value[c].value]),
              'color': plotGraphLines.value[c - 1].color,
              'name': plotGraphLines.value[c - 1].name
            });
          } else {
            plotDotData.push({
              'time': convertISOStringOrDateToDateTime(plotGraphData.value[d][plotGraphColumns.value[0].value].replace(" ","T") + "Z").toJSDate(),
              'measurement': parseFloat(plotGraphData.value[d][plotGraphColumns.value[c].value]),
              'color': plotGraphLines.value[c - 1].color,
              'symbol': plotGraphLines.value[c - 1].symbol,
              'name': plotGraphLines.value[c - 1].name
            });
          }
        }
      }
    }
  }

  interface DotTipData {
    name: string;
    color: string;
    symbol: string;
    time: Date;
    measurement: string;
  }

  let plotGraphLeftEdge = convertISOStringOrDateToDateTime(plotGraphDateRange.value.start.replace(" ","T") + "Z").toJSDate();
  let plotGraphRightEdge = convertISOStringOrDateToDateTime(plotGraphDateRange.value.end.replace(" ","T") + "Z").toJSDate();
  let lineOptions = {
    x: { value: 'time', label: 'Time' },
    y: { value: 'measurement', label: 'Measurement' },
    stroke: 'color'
  }
  let lineTipOptions = {
    x: { value: 'time', label: 'Time' },
    y: { value: 'measurement', label: 'Measurement' },
    title: (d: DotTipData) => `${d.name} (${d.color})`,
    fontSize: 14
  }
  let dotOptions = {
    x: { value: 'time', label: 'Time' },
    y: { value: 'measurement', label: 'Measurement' },
    stroke: 'color',
    symbol: 'symbol'
  }
  let dotTipOptions = {
    x: { value: 'time', label: 'Time' },
    y: { value: 'measurement', label: 'Measurement' },
    title: (d: DotTipData) => `${d.name} (${d.color} ${d.symbol})`,
    fontSize: 14
  }
  lineOptions.y.label = 'Flow (m^3/s)';
  lineTipOptions.y.label = 'Flow';
  lineTipOptions.title = (d) => `${d.name} (${d.color})\nTime: ${d.time.toISOString().split("T")[0]} ${d.time.toISOString().split("T")[1].split(":").slice(0, 2).join(":")}\nStreamflow: ${d.measurement} m^3/s`;
  dotOptions.y.label = 'Flow (m^3/s)';
  dotTipOptions.y.label = 'Flow';
  dotTipOptions.title = (d) => `${d.name} (${d.color} ${d.symbol})\nTime: ${d.time.toISOString().split("T")[0]} ${d.time.toISOString().split("T")[1].split(":").slice(0, 2).join(":")}\nStreamflow: ${d.measurement} m^3/s`;
  if (plotLineData.length > 0) {
    plotGraphLeftEdge = plotLineData[0].time;
    plotGraphOptions.value.marks.push(
      Plot.lineY(plotLineData, lineOptions)
    );
    plotGraphOptions.value.marks.push(
      Plot.tip(plotLineData, Plot.pointer(lineTipOptions))
    );
  }
  if (plotDotData.length > 0) {
    plotGraphLeftEdge = plotDotData[0].time;
    plotGraphOptions.value.marks.push(
      Plot.dot(plotDotData, dotOptions)
    );
    plotGraphOptions.value.marks.push(
      Plot.tip(plotDotData, Plot.pointer(dotTipOptions))
    );
  }
  plotGraphOptions.value.marks.push(Plot.ruleX([plotGraphLeftEdge]));
  plotGraphOptions.value.marks.push(Plot.ruleY([0]));
  (plotGraphSVG.value as HTMLElement).innerHTML = '';
  const plot = Plot.plot(plotGraphOptions.value);
  (plotGraphSVG.value as HTMLElement).append(plot);
  nextTick(() => {
    if (plotGraphArea.value) {
      plotGraphOptions.value.width = plotGraphArea.value.offsetWidth - 50;
      plotGraphSliderOptions.value.width = plotGraphArea.value.offsetWidth - 100;
    };
  })
}


const getSliderWidth = () => {
  return (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().right
    - (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().left;
}

const plotGraphCheckboxesEmpty = () => {
  if (plotGraphLines.value.length > 1) {
    for (let c = 0; c < plotGraphLines.value.length; c++) {
      if (!(document?.getElementById('plotGraphCheckbox-' + (c + 1)))) {
        return false;
      } else if ((document?.getElementById('plotGraphCheckbox-' + (c + 1)) as HTMLInputElement).checked) {
        return false;
      }
    }
    return true;
  }
  return false;
};

// Create slider as a mini-plot of just the first plot line
const drawInteractiveSlider = () => {
  if (!plotGraphCheckboxesEmpty()) {
    plotGraphSliderData.value = [];
    let rowSkip = plotGraphDataRaw.value.length / 1000;
    for (let c = 1; c < plotGraphColumns.value.length; c++) {
      if (plotGraphLines.value.length === 1 || (document?.getElementById('plotGraphCheckbox-' + c) as HTMLInputElement).checked) {
        for (let d = 0; d < plotGraphDataRaw.value.length; d += rowSkip) {
          let dataPoint = {
            time: convertISOStringOrDateToDateTime((plotGraphDataRaw.value[Math.floor(d)][plotGraphColumns.value[0].value]).replace(" ","T") + "Z").toJSDate(),
            measurement: parseFloat(plotGraphDataRaw.value[Math.floor(d)][plotGraphColumns.value[c].value])
          };
          plotGraphSliderData.value.push(dataPoint);
        }
        break;
      }
    }
    let lineOptions = {
      x: 'time',
      y: 'measurement'
    }
    plotGraphSliderOptions.value = {
      x: { tickSize: 0, inset: 0 },
      y: { axis: null },
      marks: [
        Plot.lineY(plotGraphSliderData.value, lineOptions)
      ],
      width: (plotGraphArea.value as HTMLElement).offsetWidth - 100,
      height: 100,
      marginLeft: 0,
      marginRight: 0
    };
    while (plotGraphSlider.value && plotGraphSlider.value.children.length > 1) {
      plotGraphSlider.value.removeChild(plotGraphSlider.value.children[1]);
    }

    plotGraphSlider?.value?.append(Plot.plot(plotGraphSliderOptions.value));

    if (!sliderBoxPosition.value || Object.keys(sliderBoxPosition.value).length !== 2) {
      // we don't have a previous position to remember
      // start with the entire available range
      sliderBoxPosition.value = {
        start: 0,
        end: getSliderWidth()
      }
    }
    (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.left = sliderBoxPosition.value.start + 'px';
    (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.right = (getSliderWidth() - sliderBoxPosition.value.end) + 'px';
    setSliderDateRange();
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[0];
  }
}

// Filter interactive plot when date range is changed
const updatePlotGraphDates = () => {
  interactivePlotDateFilter();
}

watch(plotGraphDateRange, async () => {
  if (plotGraphDataRaw.value && plotGraphDataRaw.value.length > 0) {
    interactivePlotDateFilter();
  }
});

const interactivePlotDateFilter = () => {
  let tempPlotGraphData = [];

  if (plotGraphDateRange.value.start > plotGraphDateRange.value.end) {
    plotGraphDateRange.value = {
      start: plotGraphDateRange.value.end,
      end: plotGraphDateRange.value.start
    }
  }
  if (plotGraphDateRange.value.start < plotGraphDateLimits.value.start) {
    plotGraphDateRange.value.start = plotGraphDateLimits.value.start;
  }
  if (plotGraphDateRange.value.end > plotGraphDateLimits.value.end) {
    plotGraphDateRange.value.end = plotGraphDateLimits.value.end;
  }
  let startDate = plotGraphDateRange.value.start;
  let endDate = plotGraphDateRange.value.end;
  for (let r = 0; r < plotGraphDataRaw.value.length; r++) {
    let currentDate = plotGraphDataRaw.value[r][plotGraphColumns.value[0].value];
    if (currentDate >= startDate && currentDate <= endDate) {
      tempPlotGraphData.push(plotGraphDataRaw.value[r]);
    }
  }
  let tempPlotGraphDataFiltered = [];
  if (tempPlotGraphData.length > 1000) {
    // only plot 1,000 data points at a time
    let rowSkip = tempPlotGraphData.length / 1000;
    for (let r = 0; r < tempPlotGraphData.length; r += rowSkip) {
      if (tempPlotGraphDataFiltered.length < 1000) {
        tempPlotGraphDataFiltered.push(tempPlotGraphData[Math.floor(r)]);
      }
    }
    plotGraphData.value = tempPlotGraphDataFiltered;
  } else {
    plotGraphData.value = tempPlotGraphData;
  }
}

const sliderDragStart = (event: MouseEvent) => {
  const x = event.clientX - (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().left;
  sliderDragPosition.value.start = x;
  sliderDragPosition.value.current = x;
  sliderBoxPosition.value = {
    start: (document.getElementById('PlotGraphSliderBox') as HTMLElement).getBoundingClientRect().left - (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().left,
    end: (document.getElementById('PlotGraphSliderBox') as HTMLElement).getBoundingClientRect().right - (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().left
  }
  plotGraphSliderCursor.value = 'cursor-ew-resize';
  if (Math.abs(sliderBoxPosition.value.start - sliderDragPosition.value.start) <= 10) {
    sliderDragType.value = 'left';
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[1];
  } else if (Math.abs(sliderBoxPosition.value.end - sliderDragPosition.value.start) <= 10) {
    sliderDragType.value = 'right';
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[2];
  } else if (sliderBoxPosition.value.start < sliderDragPosition.value.start && sliderDragPosition.value.start < sliderBoxPosition.value.end) {
    sliderDragType.value = 'middle';
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[3];
    plotGraphSliderCursor.value = 'cursor-grabbing';
  } else {
    sliderDragType.value = '';
    plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[4];
    plotGraphSliderCursor.value = 'cursor-not-allowed';
  }
}

const sliderDragChange = (event: MouseEvent) => {
  const x = event.clientX - (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().left;
  sliderBoxPosition.value = {
    start: (document.getElementById('PlotGraphSliderBox') as HTMLElement).getBoundingClientRect().left - (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().left,
    end: (document.getElementById('PlotGraphSliderBox') as HTMLElement).getBoundingClientRect().right - (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().left
  }
  if (!sliderDragType.value) {
    if (Math.abs(sliderBoxPosition.value.start - x) <= 10) {
      plotGraphSliderCursor.value = 'cursor-ew-resize';
      plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[1];
    } else if (Math.abs(sliderBoxPosition.value.end - x) <= 10) {
      plotGraphSliderCursor.value = 'cursor-ew-resize';
      plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[2];
    } else if (sliderBoxPosition.value.start < x && x < sliderBoxPosition.value.end) {
      plotGraphSliderCursor.value = 'cursor-grab';
      plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[3];
    } else {
      plotGraphSliderCursor.value = 'cursor-not-allowed';
      plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[4];
    }
  } else {
    switch (sliderDragType.value) {
      // imitate "dragging" of the box, but don't reset the plot dates yet
      case 'left':
        // only drag the left side of the box
        (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.left = x + 'px';
        break;
      case 'right':
        // only drag the right side of the box
        (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.right = (getSliderWidth() - x) + 'px';
        break;
      case 'middle':
        // drag both ends of the box by the same distance
        let xd = x - sliderDragPosition.value.current;
        (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.left = (sliderBoxPosition.value.start + xd) + 'px';
        (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.right = (getSliderWidth() - (sliderBoxPosition.value.end + xd)) + 'px';
    }
  }
  // have to keep track of the previous drag position every time this is triggered
  // (otherwise dragging the whole box by a relative distance doesn't work properly)
  sliderDragPosition.value.current = x;
}

const sliderDragCancel = (event: MouseEvent) => {
  plotGraphSliderCursor.value = 'cursor-grab';
  plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[0];
  const x = event.clientX - (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().left;
  if (sliderDragType.value) {
    if (x < 0) {
      (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.left = '0px';
      sliderBoxPosition.value.start = 0;
    } else if (x > getSliderWidth()) {
      (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.right = '0px';
      sliderBoxPosition.value.end = getSliderWidth();
    }
    sliderDragEnd(event);
  }
}

const sliderDragEnd = (event: MouseEvent) => {
  const x = event.clientX - (document.getElementById('PlotGraphSlider') as HTMLElement).getBoundingClientRect().left;
  sliderDragPosition.value.end = x;
  setSliderDateRange();
  sliderDragType.value = '';
  plotGraphSliderCursor.value = 'cursor-grab';
  plotGraphSliderHelpDisplay.value = plotGraphSliderHelpText[0];
}

const setSliderDateRange = () => {
  if (sliderBoxPosition.value.start < 0) {
    sliderBoxPosition.value.start = 0;
  }
  if (sliderBoxPosition.value.end > getSliderWidth()) {
    sliderBoxPosition.value.end = getSliderWidth();
  }
  if (sliderBoxPosition.value.start > sliderBoxPosition.value.end) {
    sliderBoxPosition.value = {
      start: sliderBoxPosition.value.end,
      end: sliderBoxPosition.value.start
    };
  }

  let hoursFromStart = Math.ceil(sliderBoxPosition.value.start * (plotGraphDateLimits.value.span / getSliderWidth()));
  let newStartDate = convertISOStringOrDateToDateTime((plotGraphDateLimits.value.start).replace(" ","T") + "Z").toJSDate();
  newStartDate.setHours(newStartDate.getHours() + hoursFromStart);

  let hoursFromEnd = Math.ceil((getSliderWidth() - sliderBoxPosition.value.end) * (plotGraphDateLimits.value.span / getSliderWidth()));
  let newEndDate = convertISOStringOrDateToDateTime((plotGraphDateLimits.value.end.replace(" ","T") + "Z")).toJSDate();
  newEndDate.setHours(newEndDate.getHours() - hoursFromEnd);

  (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.left = sliderBoxPosition.value.start + 'px';
  plotGraphDateRange.value.start = (newStartDate.toISOString()).replace("T"," ").split(".")[0];
  (document.getElementById('PlotGraphSliderBox') as HTMLElement).style.right = (getSliderWidth() - sliderBoxPosition.value.end) + 'px';
  plotGraphDateRange.value.end = (newEndDate.toISOString()).replace("T"," ").split(".")[0];
  
  updatePlotGraphDates();
}

const toggleCustomizePlot = async () => {
  if (showCustomizePlot.value) {
    showCustomizePlot.value = false;
  } else {
    showCustomizePlot.value = true;
  }
}

onUnmounted(async() => {
  resetUserPlotRefs([]);
})
</script>

<style lang="scss" scoped>
@use "@/assets/styles/global.scss";
@use "@/assets/styles/styles.scss";

#resultsPathname {
  background-color: #fff;
  border: 0px solid #fff;
  border-left: 0;
  border-right: 0;
  color: black;
  box-shadow: none;
}

#PlotGraphArea {
  width: 100%;
}

#PlotGraphArea label {
  padding-left: 12px;
}

#PlotGraphSVG {
  width: 100%;
}

#PlotGraphSliderContainer {
  position: relative;
  user-select: none;
}

#PlotGraphSlider {
  position: absolute;
  background-color: #cccccc;
  padding: 0;
  margin: 0;
  height: 75px;
}

#PlotGraphSliderBox {
  position: absolute;
  border: 1px solid #000000;
  background-color: #ffffff;
  opacity: 0.5;
  z-index: 2;
  left: 0px;
  right: 0px;
  height: 100%;
}

#PlotGraphSliderDateRange {
  position: relative;
  top: 95px;
  font-weight: bold;
  font-size: 14px;
}

#PlotGraphSliderHelp {
  position: relative;
  top: 100px;
  font-size: 12px;
}
</style>