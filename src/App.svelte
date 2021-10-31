<script>
  import Chart from "./Chart.svelte";
  let title = "[ Insert title ]";
  let left = 10;
  let width = 600;
  let height = 400;
  let gridTop = 80;
  let dashed = [...new Array(8)].map((e, i) => {
    return { dashed: false, name: `Series ${i + 1}` };
  });
  let x_axis = { checked: true, interval: 10 };
  let y_axis = { checked: true, interval: null, min: 75, max: 250 };

  let text = `13-Jul-20	113.9	111
14-Jul-20	113.4	112.4
15-Jul-20	111.35	112.15
16-Jul-20	109.8	110.6
17-Jul-20	109.95	110.5
20-Jul-20	110.1	108.95
21-Jul-20	110.55	110.5
22-Jul-20	111.15	110.3
23-Jul-20	111.3	110.25
24-Jul-20	111.3	108.5
27-Jul-20	111.5	107.25
28-Jul-20	111.6	106.75
29-Jul-20	111.65	110
30-Jul-20	111.3	110.4
03-Aug-20	111.15	115.6
04-Aug-20	107.5	117.45
05-Aug-20	107.4	117.8
06-Aug-20	107.2	121.1
07-Aug-20	106.1	119.35
11-Aug-20	105	120.6
12-Aug-20	105	121.9
13-Aug-20	105.95	121.65
14-Aug-20	106.15	121.9
17-Aug-20	106	121.75
18-Aug-20	106	127.6
19-Aug-20	106	128.2
20-Aug-20	106	128.6
21-Aug-20	106.25	125.9
24-Aug-20	106.5	124.55
25-Aug-20	106.7	121.8
26-Aug-20	107.15	123.5
27-Aug-20	107.85	121.7
28-Aug-20	108	123.45
31-Aug-20	108.15	124.25
01-Sep-20	108.55	125.05
02-Sep-20	109	128
03-Sep-20	109.15	130.55
04-Sep-20	111.55	129.2
07-Sep-20	112.2	129.9
08-Sep-20	113.3	129.7
09-Sep-20	114.45	127.3
10-Sep-20	114.4	126.1
11-Sep-20	114.45	128.7
14-Sep-20	115.15	130.4
15-Sep-20	119.15	128.95
16-Sep-20	122.4	124.3
17-Sep-20	122.6	122.3
18-Sep-20	124.55	124.8
21-Sep-20	129.4	120.15
22-Sep-20	129.7	116.4
23-Sep-20	133.95	114.45
24-Sep-20	134.95	115.7
25-Sep-20	135.7	116.05
28-Sep-20	135.8	117.15
29-Sep-20	135.75	118.9
30-Sep-20	136	123.05
01-Oct-20	136	123.05
02-Oct-20	136	123.05
05-Oct-20	136	123.05
06-Oct-20	136	123.05
07-Oct-20	136.4	123.05
08-Oct-20	134.55	123.05
09-Oct-20	134.5	125.7
12-Oct-20	133.5	123.65
13-Oct-20	125.15	121.1
14-Oct-20	123.4	119.2
15-Oct-20	123.1	118.7
16-Oct-20	121.25	118.95
19-Oct-20	120.25	119.15
20-Oct-20	117	119.2
21-Oct-20	116.2	120.55
22-Oct-20	109.25	119.75
23-Oct-20	109	115.85
26-Oct-20	107.5	115.15
27-Oct-20	112	115.75
28-Oct-20	111.8	116.8
29-Oct-20	107.5	116.25
30-Oct-20	107.85	117.45
02-Nov-20	108.4	119.15
03-Nov-20	108.75	117.65
04-Nov-20	108.4	117.5
05-Nov-20	108.15	117.35
06-Nov-20	108.55	117.95
09-Nov-20	107.95	121.7
10-Nov-20	107	122.55
11-Nov-20	105.85	124.8
12-Nov-20	100.8	123.45
13-Nov-20	99.4	122.7
16-Nov-20	99	123.95
17-Nov-20	99	126.2
18-Nov-20	98.75	126.9
19-Nov-20	98.5	127.4
20-Nov-20	98.75	129.45
23-Nov-20	98.75	126.65
24-Nov-20	103.2	127.4
25-Nov-20	103.45	127.85
26-Nov-20	102.45	129.85
27-Nov-20	101.95	130.4
30-Nov-20	102	132.5
01-Dec-20	102	133.3
02-Dec-20	102	137
03-Dec-20	102.55	138.5
04-Dec-20	102.6	145.25
07-Dec-20	102.9	147.45
08-Dec-20	103.35	149.15
09-Dec-20	103.5	150.15
10-Dec-20	102.25	157.5
11-Dec-20	101.9	160.3
14-Dec-20	101.9	154.6
15-Dec-20	101	155.25
16-Dec-20	101.05	156.75
17-Dec-20	101.25	159.75
18-Dec-20	101.15	163
21-Dec-20	101.05	175.4
22-Dec-20	100.95	165.85
23-Dec-20	101.4	163.3
24-Dec-20	102	165.15
28-Dec-20	102.7	164.05
29-Dec-20	103.25	163.2
30-Dec-20	103.5	159.85
31-Dec-20	103.5	159.9
04-Jan-21	103.65	165.3
05-Jan-21	103.85	167.4
06-Jan-21	103.75	168.4
07-Jan-21	103.5	171.35
08-Jan-21	103.5	172.05
11-Jan-21	103.15	171.3
12-Jan-21	103.4	171.3
13-Jan-21	107.8	168.7
14-Jan-21	111.75	171.65
15-Jan-21	117.6	172.3
18-Jan-21	124.2	173.45
19-Jan-21	124.9	169.95
20-Jan-21	127.85	169.4
21-Jan-21	132.25	170.25
22-Jan-21	134	169.5
25-Jan-21	139.55	169.2
26-Jan-21	148.65	165.05
27-Jan-21	152.05	166.2
28-Jan-21	152.8	156.05
29-Jan-21	157	158.9
01-Feb-21	157.25	157.45
02-Feb-21	157.35	149.85
03-Feb-21	155.5	152.1
04-Feb-21	155	158.2
05-Feb-21	155.15	157.05
08-Feb-21	155.25	159.6
09-Feb-21	155	162.5
10-Feb-21	154.65	165.25
11-Feb-21	144.5	165.25
15-Feb-21	140	165.25
16-Feb-21	140.35	165.25
17-Feb-21	140.15	165.25
18-Feb-21	139.85	174
19-Feb-21	139.3	172.7
22-Feb-21	136.7	175.7
23-Feb-21	136.9	172.85
24-Feb-21	137.4	172.65
25-Feb-21	128.95	174.75
26-Feb-21	127.5	176.25
01-Mar-21	126.65	174.7
02-Mar-21	126	176.35
03-Mar-21	125.65	178
04-Mar-21	123.8	179.4
05-Mar-21	122.75	174.4
08-Mar-21	119.85	174
09-Mar-21	117.95	164.25
10-Mar-21	118	164.35
11-Mar-21	118.75	170.55
12-Mar-21	119	165.35
15-Mar-21	116	162.45
16-Mar-21	114.25	166.35
17-Mar-21	113.75	165.9
18-Mar-21	113.5	165.75
19-Mar-21	112.35	159.9
22-Mar-21	112	155.85
23-Mar-21	111.1	160.65
24-Mar-21	110.5	160.15
25-Mar-21	110.6	160.85
26-Mar-21	111.2	161.4
29-Mar-21	111.5	168
30-Mar-21	112	165.15
31-Mar-21	112	165
01-Apr-21	112.65	167.45
05-Apr-21	113.9	167.45
06-Apr-21	113.7	171.2
07-Apr-21	114	172.5
08-Apr-21	113.1	172.55
09-Apr-21	112.5	172.45
12-Apr-21	111.75	173
13-Apr-21	111.05	172.4
14-Apr-21	111.05	173
15-Apr-21	111	176.55
16-Apr-21	110.75	177.45
19-Apr-21	111.1	181.05
20-Apr-21	110.75	188.7
21-Apr-21	110.25	185.6
22-Apr-21	110.2	183.95
23-Apr-21	110.2	185.95
26-Apr-21	110.25	192.05
27-Apr-21	109.95	193.5
28-Apr-21	109.5	192.75
29-Apr-21	108.6	190.9
30-Apr-21	107.15	186.35
03-May-21	107.75	186.35
04-May-21	108.9	186.35
05-May-21	109.35	186.6
06-May-21	109.2	202.5
07-May-21	109	212
10-May-21	109.25	230.05
11-May-21	110.95	228.6
12-May-21	116.25	235.55
14-May-21	121.5	209.05
17-May-21	121.65	214.6
18-May-21	124.5	223.85
19-May-21	126.9	215.45
20-May-21	131.85	210.15
21-May-21	136.5	200.9
24-May-21	137.4	191.55
25-May-21	137.8	191.3
27-May-21	148.05	188.55
28-May-21	150.85	189.4
31-May-21	151.6	199.25
01-Jun-21	152.4	209.3
02-Jun-21	153	209.55
03-Jun-21	153.3	210.65
04-Jun-21	153.5	208.2
07-Jun-21	155.65	202.8
08-Jun-21	162.05	210.9
09-Jun-21	165	213.85
10-Jun-21	164.25	217.55
11-Jun-21	164.9	219.9
14-Jun-21	170.5	220.8
15-Jun-21	173	223
16-Jun-21	173.4	215.65
17-Jun-21	174.5	221.4
18-Jun-21	176.15	219.6
21-Jun-21	177	205.75
22-Jun-21	177.4	212.75
23-Jun-21	180.15	216.2
24-Jun-21	181.5	214.85
25-Jun-21	182.5	217.75
28-Jun-21	183	219.6
29-Jun-21	183.8	213.45
30-Jun-21	189	218
01-Jul-21	190.4	220.7
02-Jul-21	194.9	217.55
05-Jul-21	199.35	220.35
06-Jul-21	200	223.35`;

  $: length =
    text
      .replace(/^\s*[\r\n]/gm, "")
      .split("\n")[0]
      .split("\t").length - 1;

  let showModal = false;
</script>

<main>
  <div class="text-gray-700 text-3xl text-center mt-6 pb-6 border-b-2">
    Line Chart Maker
  </div>
  <div class="mx-auto content-center pl-5 mt-2">
    <button
      on:click={() => (showModal = true)}
      class="w-full bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-10 rounded"
      >Change Data (up to eight series)</button
    >
  </div>

  <div
    on:click={() => (showModal = false)}
    class={showModal == false
      ? "invisible absolute top-0 w-full h-full bg-black opacity-50"
      : "absolute top-0 w-full h-full bg-black opacity-50"}
  />
  <!-- Modal -->
  <div
    class={showModal == false
      ? "invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white px-30 py-2 rounded text-center z-20"
      : "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white px-30 py-2 rounded text-center z-20"}
  >
    <div class="flex-1 text-2xl font-bold mt-2">Chart Data</div>
    <div
      on:click={() => (showModal = false)}
      class="text-2xl font-bold text-gray-600 cursor-pointer absolute top-3 right-3"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </div>
    <textarea
      id="inputText"
      class="w-11/12 mt-4 p-4 border h-4/5"
      bind:value={text}
    />
  </div>

  <Chart
    {text}
    {title}
    {left}
    {width}
    {height}
    {gridTop}
    {dashed}
    {x_axis}
    {y_axis}
  />

  <div class="container mx-auto bg-purple-50">
    <div class="flex-1 text-2xl font-bold py-3 text-center">Chart Options</div>
    <div class="mt-10 pt-6 border-t pl-5">
      <div class="grid grid-cols-5 gap-3">
        <div class="text-lg">
          <div for="inputTitle" class="mb-4 ml-2 font-bold">Title</div>
          <div class="inline-flex">
            <input
              class="w-full px-2 py-1 text-lg text-gray-700 rounded-lg border"
              type="text"
              bind:value={title}
              placeholder="Chart title"
            />
          </div>
        </div>
        <div class="">
          <div for="inputLeftTitle" class="mb-4 font-bold">Left</div>
          <div class="inline-flex">
            <input
              class="w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center"
              type="text"
              bind:value={left}
            />
            <div
              class="text-lg px-2 pt-1 bg-gray-100 border rounded-r-lg font-light"
            >
              px
            </div>
          </div>
        </div>
        <div class="">
          <div for="inputWidth" class="mb-4 font-bold">Width</div>
          <div class="inline-flex">
            <input
              class="w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center"
              type="text"
              bind:value={width}
            />
            <div
              class="text-lg px-2 pt-1  bg-gray-100 border rounded-r-lg font-light"
            >
              px
            </div>
          </div>
        </div>
        <div class="">
          <div for="inputHeight" class="mb-4 font-bold">Height</div>
          <div class="inline-flex">
            <input
              class="w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center"
              type="text"
              bind:value={height}
            />
            <div
              class="text-lg px-2 pt-1 bg-gray-100 border rounded-r-lg font-light"
            >
              px
            </div>
          </div>
        </div>
        <div class="">
          <div for="inputGridGap" class="mb-4 font-bold">Grid Top</div>
          <div class="inline-flex">
            <input
              class="w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center"
              type="text"
              bind:value={gridTop}
            />
            <div
              class="text-lg px-2 pt-1 bg-gray-100 border rounded-r-lg font-light"
            >
              px
            </div>
          </div>
        </div>
      </div>
      <div class="mt-10 pt-6 border-t pl-5">
        <div class="grid grid-cols-2 gap-3 border-r">
          <div class="text-center">
            <div class="pl-3">
              <div class="mb-4 font-bold">X Axis</div>
              <div class="items-center inline-flex space-x-8">
                <label
                  id="autoIntervalX"
                  class="flex items-center space-x-3 mr-24"
                >
                  <input
                    type="checkbox"
                    name="autoIntervalX"
                    class="form-tick h-5 w-5 rounded-md focus:outline-none"
                    bind:checked={x_axis.checked}
                  />
                  <span class="text-gray-900 font-medium">Auto interval</span>
                </label>
                <div class="flex-1 text-sm">Interval:</div>
                <input
                  class="w-14 px-2 py-1 text-lg text-gray-700 text-center rounded-lg border"
                  type="text"
                  bind:value={x_axis.interval}
                  disabled={x_axis.checked}
                />
              </div>
            </div>
            <div class="mt-10 pt-6 border-t pl-3 text-center">
              <div class="mb-4 font-bold ">Y Axis</div>
              <div class="inline-flex ">
                <label
                  id="autoIntervalY"
                  class="flex items-center space-x-3 mr-24"
                >
                  <input
                    type="checkbox"
                    name="autoIntervalY"
                    class="form-tick h-5 w-5 rounded-md focus:outline-none"
                    bind:checked={y_axis.checked}
                  />
                  <span class="text-gray-900 font-medium">Auto interval</span>
                </label>
                <input
                  id="yAxisMin"
                  class="w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center"
                  type="text"
                  bind:value={y_axis.min}
                />
                <input
                  id="yAxisInterval"
                  class="w-14 px-2 py-1 text-lg text-gray-700 text-center border-t border-b"
                  type="text"
                  bind:value={y_axis.interval}
                  disabled={y_axis.checked}
                />
                <input
                  id="yAxisMax"
                  class="w-14 px-2 py-1 text-lg text-gray-700 rounded-r-lg border text-center"
                  type="text"
                  bind:value={y_axis.max}
                />
              </div>
              <div class="flex mt-2 items-center">
                <p class="flex-1 text-sm" />
                <p class="flex-1 text-sm" />
                <p class="flex-1 text-sm" />
                <p class="flex-1 text-sm" />
                <p class="flex-1 text-sm text-right">Min</p>
                <p class="flex-1 text-sm text-center">Interval</p>
                <p class="flex-1 text-sm text-left">Max</p>
                <p class="flex-1 text-sm" />
              </div>
            </div>
            <br />
          </div>
          <div class=" border-l pl-3">
            <p class="text-lg mb-4 font-bold text-gray-700 text-center">
              Series Dashed and Names
            </p>
            <div class="grid grid-cols-2 gap-3">
              {#each Array(length) as _, i}
                <label id="dashLine1" class="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    name="seriesType"
                    bind:checked={dashed[i].dashed}
                    class="form-tick h-5 w-5 rounded-md focus:outline-none "
                  />
                  <input
                    type="text"
                    name="seriesName"
                    bind:value={dashed[i].name}
                    class="w-52 px-2 py-1 text-lg text-gray-700 rounded-r-lg border text-center"
                  />
                </label>
              {/each}
            </div>
            <br />
          </div>
        </div>
      </div>
    </div>
  </div>
</main>

<style>
</style>
