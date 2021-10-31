<script>
  import { onMount, afterUpdate } from "svelte";
  import echarts from "echarts";

  /* Component exports */
  export let text;
  export let title;
  export let left;
  export let width;
  export let height;
  export let gridTop;
  export let dashed;
  export let x_axis;
  export let y_axis;

  let chart;
  let myChart;
  let xAxisData = [];

  /* Reset Y interval when checked 
  $: if (y_axis.checked) {
    y_axis.interval = null;
  } else {
    y_axis.interval = y_axis.interval;
  }
  */

  /* Calculate series data */
  $: length =
    text
      .replace(/^\s*[\r\n]/gm, "")
      .split("\n")[0]
      .split("\t").length - 1;
  //    $: xAxisData = text.replace(/^\s*[\r\n]/gm , "").split("\n").map((entry) => entry.split("\t")[0]);
  $: if (x_axis.checked) {
    xAxisData = text
      .replace(/^\s*[\r\n]/gm, "")
      .split("\n")
      .map((entry) => entry.split("\t")[0]);
  } else {
    xAxisData = text
      .replace(/^\s*[\r\n]/gm, "")
      .split("\n")
      .map((entry) => entry.split("\t")[0])
      .map((e, i) => {
        return i % x_axis.interval == 0 ? e : "";
      });
    console.log(xAxisData, x_axis.interval, y_axis.interval);
  }
  $: series = [...new Array(length)].map((e, i) => {
    return {
      name: dashed[i].name,
      type: "line",
      symbol: "line",
      lineStyle: { width: 2.5, type: dashed[i].dashed ? "dashed" : "solid" },
      data: text
        .replace(/^\s*[\r\n]/gm, "")
        .split("\n")
        .map((entry) => entry.split("\t")[i + 1]),
    };
  });

  $: option = {
    color: [
      "#0033A0",
      "#6CACE4",
      "#6D6E71",
      "#000000",
      "#890000",
      "#620000",
      "#ff4d4d",
    ],
    toolbox: {
      show: true,
      feature: {
        dataView: {
          readOnly: true,
        },
        saveAsImage: {},
      },
    },
    textStyle: {
      fontFamily: "Trebuchet MS",
    },
    title: {
      text: title,
      textStyle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#3776be",
      },
      left: `${left}px`,
    },
    tooltip: {
      show: true,
    },
    grid: {
      top: `${gridTop}px`,
      containLabel: true,
    },
    legend: {
      orient: "vertical",
      top: "10%",
      padding: [1, 1, 1, 1],
      textStyle: {
        fontSize: 18,
        fontWeight: "bolder",
      },
      lineStyle: {
        width: 2.5,
        type: "inherit",
      },
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: xAxisData,
      axisLine: {
        show: true,
        lineStyle: {
          width: 1.5,
          color: "black",
        },
      },
      axisTick: {
        alignWithLabel: true,
        show: true,
        length: 12,
        lineStyle: {
          width: 1.5,
        },
      },
      axisLabel: {
        color: "black",
        margin: 16,
        fontSize: 17,
        fontWeight: "bolder",
        interval: x_axis.checked ? null : (idx, v) => v != "",
        //showMaxLabel: true,
      },
      min: 0,
    },
    yAxis: {
      min: y_axis.min,
      max: y_axis.max,
      interval:
        y_axis.interval == null
          ? y_axis.interval
          : y_axis.checked == true
          ? null
          : parseInt(y_axis.interval),
      // if the interval is null, then use it as is, else if the auto interval box is checked, make the interval null, else the interval is the integer of the input
      axisLine: {
        show: true,
        lineStyle: {
          width: 1.5,
          color: "black",
        },
      },
      axisLabel: {
        color: "black",
        margin: 16,
        fontSize: 18,
        fontWeight: "bolder",
      },
      axisTick: {
        show: true,
        length: 12,
        lineStyle: {
          width: 1.5,
        },
      },
      splitLine: {
        show: false,
      },
    },
    series: series,
  };

  onMount(() => {
    myChart = echarts.init(chart, null, { renderer: "svg" });
    myChart.setOption(option);
  });

  $: if (option && myChart) {
    myChart = echarts.init(chart, null, { renderer: "svg" });
    myChart.setOption(option);
    myChart.resize();
  }
  afterUpdate(() => myChart.resize());
</script>

<main>
  <div id="graph" class="mt-2 z-10">
    <div
      id="main"
      class="mt-10 mx-auto"
      style="width: {width}px; height: {height}px"
      bind:this={chart}
    />
  </div>
</main>

<style>
</style>
