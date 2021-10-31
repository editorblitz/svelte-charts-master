
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function (echarts) {
    'use strict';

    function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

    var echarts__default = /*#__PURE__*/_interopDefaultLegacy(echarts);

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.43.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src\Chart.svelte generated by Svelte v3.43.2 */

    const { console: console_1 } = globals;
    const file$1 = "src\\Chart.svelte";

    function create_fragment$1(ctx) {
    	let main;
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "id", "main");
    			attr_dev(div0, "class", "mt-10 mx-auto");
    			set_style(div0, "width", /*width*/ ctx[0] + "px");
    			set_style(div0, "height", /*height*/ ctx[1] + "px");
    			add_location(div0, file$1, 194, 4, 4233);
    			attr_dev(div1, "id", "graph");
    			attr_dev(div1, "class", "mt-2 z-10");
    			add_location(div1, file$1, 193, 2, 4194);
    			add_location(main, file$1, 192, 0, 4185);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			/*div0_binding*/ ctx[15](div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*width*/ 1) {
    				set_style(div0, "width", /*width*/ ctx[0] + "px");
    			}

    			if (dirty & /*height*/ 2) {
    				set_style(div0, "height", /*height*/ ctx[1] + "px");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			/*div0_binding*/ ctx[15](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let length;
    	let series;
    	let option;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Chart', slots, []);
    	let { text } = $$props;
    	let { title } = $$props;
    	let { left } = $$props;
    	let { width } = $$props;
    	let { height } = $$props;
    	let { gridTop } = $$props;
    	let { dashed } = $$props;
    	let { x_axis } = $$props;
    	let { y_axis } = $$props;
    	let chart;
    	let myChart;
    	let xAxisData = [];

    	onMount(() => {
    		$$invalidate(10, myChart = echarts__default["default"].init(chart, null, { renderer: "svg" }));
    		myChart.setOption(option);
    	});

    	afterUpdate(() => myChart.resize());

    	const writable_props = [
    		'text',
    		'title',
    		'left',
    		'width',
    		'height',
    		'gridTop',
    		'dashed',
    		'x_axis',
    		'y_axis'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Chart> was created with unknown prop '${key}'`);
    	});

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			chart = $$value;
    			$$invalidate(2, chart);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('title' in $$props) $$invalidate(4, title = $$props.title);
    		if ('left' in $$props) $$invalidate(5, left = $$props.left);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('gridTop' in $$props) $$invalidate(6, gridTop = $$props.gridTop);
    		if ('dashed' in $$props) $$invalidate(7, dashed = $$props.dashed);
    		if ('x_axis' in $$props) $$invalidate(8, x_axis = $$props.x_axis);
    		if ('y_axis' in $$props) $$invalidate(9, y_axis = $$props.y_axis);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		afterUpdate,
    		echarts: echarts__default["default"],
    		text,
    		title,
    		left,
    		width,
    		height,
    		gridTop,
    		dashed,
    		x_axis,
    		y_axis,
    		chart,
    		myChart,
    		xAxisData,
    		option,
    		series,
    		length
    	});

    	$$self.$inject_state = $$props => {
    		if ('text' in $$props) $$invalidate(3, text = $$props.text);
    		if ('title' in $$props) $$invalidate(4, title = $$props.title);
    		if ('left' in $$props) $$invalidate(5, left = $$props.left);
    		if ('width' in $$props) $$invalidate(0, width = $$props.width);
    		if ('height' in $$props) $$invalidate(1, height = $$props.height);
    		if ('gridTop' in $$props) $$invalidate(6, gridTop = $$props.gridTop);
    		if ('dashed' in $$props) $$invalidate(7, dashed = $$props.dashed);
    		if ('x_axis' in $$props) $$invalidate(8, x_axis = $$props.x_axis);
    		if ('y_axis' in $$props) $$invalidate(9, y_axis = $$props.y_axis);
    		if ('chart' in $$props) $$invalidate(2, chart = $$props.chart);
    		if ('myChart' in $$props) $$invalidate(10, myChart = $$props.myChart);
    		if ('xAxisData' in $$props) $$invalidate(11, xAxisData = $$props.xAxisData);
    		if ('option' in $$props) $$invalidate(12, option = $$props.option);
    		if ('series' in $$props) $$invalidate(13, series = $$props.series);
    		if ('length' in $$props) $$invalidate(14, length = $$props.length);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*text*/ 8) {
    			/* Reset Y interval when checked 
    $: if (y_axis.checked) {
      y_axis.interval = null;
    } else {
      y_axis.interval = y_axis.interval;
    }
    */
    			/* Calculate series data */
    			$$invalidate(14, length = text.replace(/^\s*[\r\n]/gm, "").split("\n")[0].split("\t").length - 1);
    		}

    		if ($$self.$$.dirty & /*x_axis, text, xAxisData, y_axis*/ 2824) {
    			//    $: xAxisData = text.replace(/^\s*[\r\n]/gm , "").split("\n").map((entry) => entry.split("\t")[0]);
    			if (x_axis.checked) {
    				$$invalidate(11, xAxisData = text.replace(/^\s*[\r\n]/gm, "").split("\n").map(entry => entry.split("\t")[0]));
    			} else {
    				$$invalidate(11, xAxisData = text.replace(/^\s*[\r\n]/gm, "").split("\n").map(entry => entry.split("\t")[0]).map((e, i) => {
    					return i % x_axis.interval == 0 ? e : "";
    				}));

    				console.log(xAxisData, x_axis.interval, y_axis.interval);
    			}
    		}

    		if ($$self.$$.dirty & /*length, dashed, text*/ 16520) {
    			$$invalidate(13, series = [...new Array(length)].map((e, i) => {
    				return {
    					name: dashed[i].name,
    					type: "line",
    					symbol: "line",
    					lineStyle: {
    						width: 2.5,
    						type: dashed[i].dashed ? "dashed" : "solid"
    					},
    					data: text.replace(/^\s*[\r\n]/gm, "").split("\n").map(entry => entry.split("\t")[i + 1])
    				};
    			}));
    		}

    		if ($$self.$$.dirty & /*title, left, gridTop, xAxisData, x_axis, y_axis, series*/ 11120) {
    			$$invalidate(12, option = {
    				color: [
    					"#0033A0",
    					"#6CACE4",
    					"#6D6E71",
    					"#000000",
    					"#890000",
    					"#620000",
    					"#ff4d4d"
    				],
    				toolbox: {
    					show: true,
    					feature: {
    						dataView: { readOnly: true },
    						saveAsImage: {}
    					}
    				},
    				textStyle: { fontFamily: "Trebuchet MS" },
    				title: {
    					text: title,
    					textStyle: {
    						fontSize: 20,
    						fontWeight: "bold",
    						color: "#3776be"
    					},
    					left: `${left}px`
    				},
    				tooltip: { show: true },
    				grid: { top: `${gridTop}px`, containLabel: true },
    				legend: {
    					orient: "vertical",
    					top: "10%",
    					padding: [1, 1, 1, 1],
    					textStyle: { fontSize: 18, fontWeight: "bolder" },
    					lineStyle: { width: 2.5, type: "inherit" }
    				},
    				xAxis: {
    					type: "category",
    					boundaryGap: false,
    					data: xAxisData,
    					axisLine: {
    						show: true,
    						lineStyle: { width: 1.5, color: "black" }
    					},
    					axisTick: {
    						alignWithLabel: true,
    						show: true,
    						length: 12,
    						lineStyle: { width: 1.5 }
    					},
    					axisLabel: {
    						color: "black",
    						margin: 16,
    						fontSize: 17,
    						fontWeight: "bolder",
    						interval: x_axis.checked ? null : (idx, v) => v != ""
    					}, //showMaxLabel: true,
    					min: 0
    				},
    				yAxis: {
    					min: y_axis.min,
    					max: y_axis.max,
    					interval: y_axis.interval == null
    					? y_axis.interval
    					: y_axis.checked == true
    						? null
    						: parseInt(y_axis.interval),
    					// if the interval is null, then use it as is, else if the auto interval box is checked, make the interval null, else the interval is the integer of the input
    					axisLine: {
    						show: true,
    						lineStyle: { width: 1.5, color: "black" }
    					},
    					axisLabel: {
    						color: "black",
    						margin: 16,
    						fontSize: 18,
    						fontWeight: "bolder"
    					},
    					axisTick: {
    						show: true,
    						length: 12,
    						lineStyle: { width: 1.5 }
    					},
    					splitLine: { show: false }
    				},
    				series
    			});
    		}

    		if ($$self.$$.dirty & /*option, myChart, chart*/ 5124) {
    			if (option && myChart) {
    				$$invalidate(10, myChart = echarts__default["default"].init(chart, null, { renderer: "svg" }));
    				myChart.setOption(option);
    				myChart.resize();
    			}
    		}
    	};

    	return [
    		width,
    		height,
    		chart,
    		text,
    		title,
    		left,
    		gridTop,
    		dashed,
    		x_axis,
    		y_axis,
    		myChart,
    		xAxisData,
    		option,
    		series,
    		length,
    		div0_binding
    	];
    }

    class Chart extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			text: 3,
    			title: 4,
    			left: 5,
    			width: 0,
    			height: 1,
    			gridTop: 6,
    			dashed: 7,
    			x_axis: 8,
    			y_axis: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Chart",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[3] === undefined && !('text' in props)) {
    			console_1.warn("<Chart> was created without expected prop 'text'");
    		}

    		if (/*title*/ ctx[4] === undefined && !('title' in props)) {
    			console_1.warn("<Chart> was created without expected prop 'title'");
    		}

    		if (/*left*/ ctx[5] === undefined && !('left' in props)) {
    			console_1.warn("<Chart> was created without expected prop 'left'");
    		}

    		if (/*width*/ ctx[0] === undefined && !('width' in props)) {
    			console_1.warn("<Chart> was created without expected prop 'width'");
    		}

    		if (/*height*/ ctx[1] === undefined && !('height' in props)) {
    			console_1.warn("<Chart> was created without expected prop 'height'");
    		}

    		if (/*gridTop*/ ctx[6] === undefined && !('gridTop' in props)) {
    			console_1.warn("<Chart> was created without expected prop 'gridTop'");
    		}

    		if (/*dashed*/ ctx[7] === undefined && !('dashed' in props)) {
    			console_1.warn("<Chart> was created without expected prop 'dashed'");
    		}

    		if (/*x_axis*/ ctx[8] === undefined && !('x_axis' in props)) {
    			console_1.warn("<Chart> was created without expected prop 'x_axis'");
    		}

    		if (/*y_axis*/ ctx[9] === undefined && !('y_axis' in props)) {
    			console_1.warn("<Chart> was created without expected prop 'y_axis'");
    		}
    	}

    	get text() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get left() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set left(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get gridTop() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set gridTop(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dashed() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dashed(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get x_axis() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set x_axis(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get y_axis() {
    		throw new Error("<Chart>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set y_axis(value) {
    		throw new Error("<Chart>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.43.2 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[28] = list[i];
    	child_ctx[29] = list;
    	child_ctx[30] = i;
    	return child_ctx;
    }

    // (492:14) {#each Array(length) as _, i}
    function create_each_block(ctx) {
    	let label;
    	let input0;
    	let t0;
    	let input1;
    	let t1;
    	let mounted;
    	let dispose;

    	function input0_change_handler() {
    		/*input0_change_handler*/ ctx[26].call(input0, /*i*/ ctx[30]);
    	}

    	function input1_input_handler_1() {
    		/*input1_input_handler_1*/ ctx[27].call(input1, /*i*/ ctx[30]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			input0 = element("input");
    			t0 = space();
    			input1 = element("input");
    			t1 = space();
    			attr_dev(input0, "type", "checkbox");
    			attr_dev(input0, "name", "seriesType");
    			attr_dev(input0, "class", "form-tick h-5 w-5 rounded-md focus:outline-none ");
    			add_location(input0, file, 493, 18, 13905);
    			attr_dev(input1, "type", "text");
    			attr_dev(input1, "name", "seriesName");
    			attr_dev(input1, "class", "w-52 px-2 py-1 text-lg text-gray-700 rounded-r-lg border text-center");
    			add_location(input1, file, 499, 18, 14154);
    			attr_dev(label, "id", "dashLine1");
    			attr_dev(label, "class", "flex items-center space-x-3");
    			add_location(label, file, 492, 16, 13828);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, input0);
    			input0.checked = /*dashed*/ ctx[6][/*i*/ ctx[30]].dashed;
    			append_dev(label, t0);
    			append_dev(label, input1);
    			set_input_value(input1, /*dashed*/ ctx[6][/*i*/ ctx[30]].name);
    			append_dev(label, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "change", input0_change_handler),
    					listen_dev(input1, "input", input1_input_handler_1)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*dashed*/ 64) {
    				input0.checked = /*dashed*/ ctx[6][/*i*/ ctx[30]].dashed;
    			}

    			if (dirty & /*dashed*/ 64 && input1.value !== /*dashed*/ ctx[6][/*i*/ ctx[30]].name) {
    				set_input_value(input1, /*dashed*/ ctx[6][/*i*/ ctx[30]].name);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(492:14) {#each Array(length) as _, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div0;
    	let t1;
    	let div1;
    	let button;
    	let t3;
    	let div2;
    	let div2_class_value;
    	let t4;
    	let div5;
    	let div3;
    	let t6;
    	let div4;
    	let svg;
    	let path;
    	let t7;
    	let textarea;
    	let div5_class_value;
    	let t8;
    	let chart;
    	let t9;
    	let div41;
    	let div6;
    	let t11;
    	let div40;
    	let div26;
    	let div9;
    	let div7;
    	let t13;
    	let div8;
    	let input0;
    	let t14;
    	let div13;
    	let div10;
    	let t16;
    	let div12;
    	let input1;
    	let t17;
    	let div11;
    	let t19;
    	let div17;
    	let div14;
    	let t21;
    	let div16;
    	let input2;
    	let t22;
    	let div15;
    	let t24;
    	let div21;
    	let div18;
    	let t26;
    	let div20;
    	let input3;
    	let t27;
    	let div19;
    	let t29;
    	let div25;
    	let div22;
    	let t31;
    	let div24;
    	let input4;
    	let t32;
    	let div23;
    	let t34;
    	let div39;
    	let div38;
    	let div35;
    	let div30;
    	let div27;
    	let t36;
    	let div29;
    	let label0;
    	let input5;
    	let t37;
    	let span0;
    	let t39;
    	let div28;
    	let t41;
    	let input6;
    	let input6_disabled_value;
    	let t42;
    	let div34;
    	let div31;
    	let t44;
    	let div32;
    	let label1;
    	let input7;
    	let t45;
    	let span1;
    	let t47;
    	let input8;
    	let t48;
    	let input9;
    	let input9_disabled_value;
    	let t49;
    	let input10;
    	let t50;
    	let div33;
    	let p0;
    	let t51;
    	let p1;
    	let t52;
    	let p2;
    	let t53;
    	let p3;
    	let t54;
    	let p4;
    	let t56;
    	let p5;
    	let t58;
    	let p6;
    	let t60;
    	let p7;
    	let t61;
    	let br0;
    	let t62;
    	let div37;
    	let p8;
    	let t64;
    	let div36;
    	let t65;
    	let br1;
    	let current;
    	let mounted;
    	let dispose;

    	chart = new Chart({
    			props: {
    				text: /*text*/ ctx[0],
    				title: /*title*/ ctx[1],
    				left: /*left*/ ctx[2],
    				width: /*width*/ ctx[3],
    				height: /*height*/ ctx[4],
    				gridTop: /*gridTop*/ ctx[5],
    				dashed: /*dashed*/ ctx[6],
    				x_axis: /*x_axis*/ ctx[7],
    				y_axis: /*y_axis*/ ctx[8]
    			},
    			$$inline: true
    		});

    	let each_value = Array(/*length*/ ctx[10]);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div0 = element("div");
    			div0.textContent = "Line Chart Maker";
    			t1 = space();
    			div1 = element("div");
    			button = element("button");
    			button.textContent = "Change Data (up to eight series)";
    			t3 = space();
    			div2 = element("div");
    			t4 = space();
    			div5 = element("div");
    			div3 = element("div");
    			div3.textContent = "Chart Data";
    			t6 = space();
    			div4 = element("div");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			t7 = space();
    			textarea = element("textarea");
    			t8 = space();
    			create_component(chart.$$.fragment);
    			t9 = space();
    			div41 = element("div");
    			div6 = element("div");
    			div6.textContent = "Chart Options";
    			t11 = space();
    			div40 = element("div");
    			div26 = element("div");
    			div9 = element("div");
    			div7 = element("div");
    			div7.textContent = "Title";
    			t13 = space();
    			div8 = element("div");
    			input0 = element("input");
    			t14 = space();
    			div13 = element("div");
    			div10 = element("div");
    			div10.textContent = "Left";
    			t16 = space();
    			div12 = element("div");
    			input1 = element("input");
    			t17 = space();
    			div11 = element("div");
    			div11.textContent = "px";
    			t19 = space();
    			div17 = element("div");
    			div14 = element("div");
    			div14.textContent = "Width";
    			t21 = space();
    			div16 = element("div");
    			input2 = element("input");
    			t22 = space();
    			div15 = element("div");
    			div15.textContent = "px";
    			t24 = space();
    			div21 = element("div");
    			div18 = element("div");
    			div18.textContent = "Height";
    			t26 = space();
    			div20 = element("div");
    			input3 = element("input");
    			t27 = space();
    			div19 = element("div");
    			div19.textContent = "px";
    			t29 = space();
    			div25 = element("div");
    			div22 = element("div");
    			div22.textContent = "Grid Top";
    			t31 = space();
    			div24 = element("div");
    			input4 = element("input");
    			t32 = space();
    			div23 = element("div");
    			div23.textContent = "px";
    			t34 = space();
    			div39 = element("div");
    			div38 = element("div");
    			div35 = element("div");
    			div30 = element("div");
    			div27 = element("div");
    			div27.textContent = "X Axis";
    			t36 = space();
    			div29 = element("div");
    			label0 = element("label");
    			input5 = element("input");
    			t37 = space();
    			span0 = element("span");
    			span0.textContent = "Auto interval";
    			t39 = space();
    			div28 = element("div");
    			div28.textContent = "Interval:";
    			t41 = space();
    			input6 = element("input");
    			t42 = space();
    			div34 = element("div");
    			div31 = element("div");
    			div31.textContent = "Y Axis";
    			t44 = space();
    			div32 = element("div");
    			label1 = element("label");
    			input7 = element("input");
    			t45 = space();
    			span1 = element("span");
    			span1.textContent = "Auto interval";
    			t47 = space();
    			input8 = element("input");
    			t48 = space();
    			input9 = element("input");
    			t49 = space();
    			input10 = element("input");
    			t50 = space();
    			div33 = element("div");
    			p0 = element("p");
    			t51 = space();
    			p1 = element("p");
    			t52 = space();
    			p2 = element("p");
    			t53 = space();
    			p3 = element("p");
    			t54 = space();
    			p4 = element("p");
    			p4.textContent = "Min";
    			t56 = space();
    			p5 = element("p");
    			p5.textContent = "Interval";
    			t58 = space();
    			p6 = element("p");
    			p6.textContent = "Max";
    			t60 = space();
    			p7 = element("p");
    			t61 = space();
    			br0 = element("br");
    			t62 = space();
    			div37 = element("div");
    			p8 = element("p");
    			p8.textContent = "Series Dashed and Names";
    			t64 = space();
    			div36 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t65 = space();
    			br1 = element("br");
    			attr_dev(div0, "class", "text-gray-700 text-3xl text-center mt-6 pb-6 border-b-2");
    			add_location(div0, file, 273, 2, 6137);
    			attr_dev(button, "class", "w-full bg-blue-500 hover:bg-blue-700 text-white text-sm py-1 px-10 rounded");
    			add_location(button, file, 277, 4, 6290);
    			attr_dev(div1, "class", "mx-auto content-center pl-5 mt-2");
    			add_location(div1, file, 276, 2, 6239);

    			attr_dev(div2, "class", div2_class_value = /*showModal*/ ctx[9] == false
    			? "invisible absolute top-0 w-full h-full bg-black opacity-50"
    			: "absolute top-0 w-full h-full bg-black opacity-50");

    			add_location(div2, file, 284, 2, 6495);
    			attr_dev(div3, "class", "flex-1 text-2xl font-bold mt-2");
    			add_location(div3, file, 296, 4, 7052);
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M6 18L18 6M6 6l12 12");
    			add_location(path, file, 308, 8, 7428);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "h-6 w-6");
    			attr_dev(svg, "fill", "none");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			add_location(svg, file, 301, 6, 7262);
    			attr_dev(div4, "class", "text-2xl font-bold text-gray-600 cursor-pointer absolute top-3 right-3");
    			add_location(div4, file, 297, 4, 7117);
    			attr_dev(textarea, "id", "inputText");
    			attr_dev(textarea, "class", "w-11/12 mt-4 p-4 border h-4/5");
    			add_location(textarea, file, 316, 4, 7602);

    			attr_dev(div5, "class", div5_class_value = /*showModal*/ ctx[9] == false
    			? "invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white px-30 py-2 rounded text-center z-20"
    			: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white px-30 py-2 rounded text-center z-20");

    			add_location(div5, file, 291, 2, 6724);
    			attr_dev(div6, "class", "flex-1 text-2xl font-bold py-3 text-center");
    			add_location(div6, file, 336, 4, 7896);
    			attr_dev(div7, "for", "inputTitle");
    			attr_dev(div7, "class", "mb-4 ml-2 font-bold");
    			add_location(div7, file, 340, 10, 8098);
    			attr_dev(input0, "class", "w-full px-2 py-1 text-lg text-gray-700 rounded-lg border");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "placeholder", "Chart title");
    			add_location(input0, file, 342, 12, 8208);
    			attr_dev(div8, "class", "inline-flex");
    			add_location(div8, file, 341, 10, 8170);
    			attr_dev(div9, "class", "text-lg");
    			add_location(div9, file, 339, 8, 8066);
    			attr_dev(div10, "for", "inputLeftTitle");
    			attr_dev(div10, "class", "mb-4 font-bold");
    			add_location(div10, file, 351, 10, 8473);
    			attr_dev(input1, "class", "w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center");
    			attr_dev(input1, "type", "text");
    			add_location(input1, file, 353, 12, 8581);
    			attr_dev(div11, "class", "text-lg px-2 pt-1 bg-gray-100 border rounded-r-lg font-light");
    			add_location(div11, file, 358, 12, 8764);
    			attr_dev(div12, "class", "inline-flex");
    			add_location(div12, file, 352, 10, 8543);
    			attr_dev(div13, "class", "");
    			add_location(div13, file, 350, 8, 8448);
    			attr_dev(div14, "for", "inputWidth");
    			attr_dev(div14, "class", "mb-4 font-bold");
    			add_location(div14, file, 366, 10, 8967);
    			attr_dev(input2, "class", "w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center");
    			attr_dev(input2, "type", "text");
    			add_location(input2, file, 368, 12, 9072);
    			attr_dev(div15, "class", "text-lg px-2 pt-1 bg-gray-100 border rounded-r-lg font-light");
    			add_location(div15, file, 373, 12, 9256);
    			attr_dev(div16, "class", "inline-flex");
    			add_location(div16, file, 367, 10, 9034);
    			attr_dev(div17, "class", "");
    			add_location(div17, file, 365, 8, 8942);
    			attr_dev(div18, "for", "inputHeight");
    			attr_dev(div18, "class", "mb-4 font-bold");
    			add_location(div18, file, 381, 10, 9460);
    			attr_dev(input3, "class", "w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center");
    			attr_dev(input3, "type", "text");
    			add_location(input3, file, 383, 12, 9567);
    			attr_dev(div19, "class", "text-lg px-2 pt-1 bg-gray-100 border rounded-r-lg font-light");
    			add_location(div19, file, 388, 12, 9752);
    			attr_dev(div20, "class", "inline-flex");
    			add_location(div20, file, 382, 10, 9529);
    			attr_dev(div21, "class", "");
    			add_location(div21, file, 380, 8, 9435);
    			attr_dev(div22, "for", "inputGridGap");
    			attr_dev(div22, "class", "mb-4 font-bold");
    			add_location(div22, file, 396, 10, 9955);
    			attr_dev(input4, "class", "w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center");
    			attr_dev(input4, "type", "text");
    			add_location(input4, file, 398, 12, 10065);
    			attr_dev(div23, "class", "text-lg px-2 pt-1 bg-gray-100 border rounded-r-lg font-light");
    			add_location(div23, file, 403, 12, 10251);
    			attr_dev(div24, "class", "inline-flex");
    			add_location(div24, file, 397, 10, 10027);
    			attr_dev(div25, "class", "");
    			add_location(div25, file, 395, 8, 9930);
    			attr_dev(div26, "class", "grid grid-cols-5 gap-3");
    			add_location(div26, file, 338, 6, 8021);
    			attr_dev(div27, "class", "mb-4 font-bold");
    			add_location(div27, file, 415, 14, 10614);
    			attr_dev(input5, "type", "checkbox");
    			attr_dev(input5, "name", "autoIntervalX");
    			attr_dev(input5, "class", "form-tick h-5 w-5 rounded-md focus:outline-none");
    			add_location(input5, file, 421, 18, 10874);
    			attr_dev(span0, "class", "text-gray-900 font-medium");
    			add_location(span0, file, 427, 18, 11123);
    			attr_dev(label0, "id", "autoIntervalX");
    			attr_dev(label0, "class", "flex items-center space-x-3 mr-24");
    			add_location(label0, file, 417, 16, 10734);
    			attr_dev(div28, "class", "flex-1 text-sm");
    			add_location(div28, file, 429, 16, 11225);
    			attr_dev(input6, "class", "w-14 px-2 py-1 text-lg text-gray-700 text-center rounded-lg border");
    			attr_dev(input6, "type", "text");
    			input6.disabled = input6_disabled_value = /*x_axis*/ ctx[7].checked;
    			add_location(input6, file, 430, 16, 11285);
    			attr_dev(div29, "class", "items-center inline-flex space-x-8");
    			add_location(div29, file, 416, 14, 10669);
    			attr_dev(div30, "class", "pl-3");
    			add_location(div30, file, 414, 12, 10581);
    			attr_dev(div31, "class", "mb-4 font-bold ");
    			add_location(div31, file, 439, 14, 11642);
    			attr_dev(input7, "type", "checkbox");
    			attr_dev(input7, "name", "autoIntervalY");
    			attr_dev(input7, "class", "form-tick h-5 w-5 rounded-md focus:outline-none");
    			add_location(input7, file, 445, 18, 11881);
    			attr_dev(span1, "class", "text-gray-900 font-medium");
    			add_location(span1, file, 451, 18, 12130);
    			attr_dev(label1, "id", "autoIntervalY");
    			attr_dev(label1, "class", "flex items-center space-x-3 mr-24");
    			add_location(label1, file, 441, 16, 11741);
    			attr_dev(input8, "id", "yAxisMin");
    			attr_dev(input8, "class", "w-14 px-2 py-1 text-lg text-gray-700 rounded-l-lg border text-center");
    			attr_dev(input8, "type", "text");
    			add_location(input8, file, 453, 16, 12232);
    			attr_dev(input9, "id", "yAxisInterval");
    			attr_dev(input9, "class", "w-14 px-2 py-1 text-lg text-gray-700 text-center border-t border-b");
    			attr_dev(input9, "type", "text");
    			input9.disabled = input9_disabled_value = /*y_axis*/ ctx[8].checked;
    			add_location(input9, file, 459, 16, 12473);
    			attr_dev(input10, "id", "yAxisMax");
    			attr_dev(input10, "class", "w-14 px-2 py-1 text-lg text-gray-700 rounded-r-lg border text-center");
    			attr_dev(input10, "type", "text");
    			add_location(input10, file, 466, 16, 12766);
    			attr_dev(div32, "class", "inline-flex ");
    			add_location(div32, file, 440, 14, 11698);
    			attr_dev(p0, "class", "flex-1 text-sm");
    			add_location(p0, file, 474, 16, 13079);
    			attr_dev(p1, "class", "flex-1 text-sm");
    			add_location(p1, file, 475, 16, 13124);
    			attr_dev(p2, "class", "flex-1 text-sm");
    			add_location(p2, file, 476, 16, 13169);
    			attr_dev(p3, "class", "flex-1 text-sm");
    			add_location(p3, file, 477, 16, 13214);
    			attr_dev(p4, "class", "flex-1 text-sm text-right");
    			add_location(p4, file, 478, 16, 13259);
    			attr_dev(p5, "class", "flex-1 text-sm text-center");
    			add_location(p5, file, 479, 16, 13320);
    			attr_dev(p6, "class", "flex-1 text-sm text-left");
    			add_location(p6, file, 480, 16, 13387);
    			attr_dev(p7, "class", "flex-1 text-sm");
    			add_location(p7, file, 481, 16, 13447);
    			attr_dev(div33, "class", "flex mt-2 items-center");
    			add_location(div33, file, 473, 14, 13026);
    			attr_dev(div34, "class", "mt-10 pt-6 border-t pl-3 text-center");
    			add_location(div34, file, 438, 12, 11577);
    			add_location(br0, file, 484, 12, 13528);
    			attr_dev(div35, "class", "text-center");
    			add_location(div35, file, 413, 10, 10543);
    			attr_dev(p8, "class", "text-lg mb-4 font-bold text-gray-700 text-center");
    			add_location(p8, file, 487, 12, 13603);
    			attr_dev(div36, "class", "grid grid-cols-2 gap-3");
    			add_location(div36, file, 490, 12, 13731);
    			add_location(br1, file, 508, 12, 14475);
    			attr_dev(div37, "class", "border-l pl-3");
    			add_location(div37, file, 486, 10, 13562);
    			attr_dev(div38, "class", "grid grid-cols-2 gap-3 border-r");
    			add_location(div38, file, 412, 8, 10487);
    			attr_dev(div39, "class", "mt-10 pt-6 border-t pl-5");
    			add_location(div39, file, 411, 6, 10440);
    			attr_dev(div40, "class", "mt-10 pt-6 border-t pl-5");
    			add_location(div40, file, 337, 4, 7976);
    			attr_dev(div41, "class", "container mx-auto bg-purple-50");
    			add_location(div41, file, 335, 2, 7847);
    			add_location(main, file, 272, 0, 6128);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div0);
    			append_dev(main, t1);
    			append_dev(main, div1);
    			append_dev(div1, button);
    			append_dev(main, t3);
    			append_dev(main, div2);
    			append_dev(main, t4);
    			append_dev(main, div5);
    			append_dev(div5, div3);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, svg);
    			append_dev(svg, path);
    			append_dev(div5, t7);
    			append_dev(div5, textarea);
    			set_input_value(textarea, /*text*/ ctx[0]);
    			append_dev(main, t8);
    			mount_component(chart, main, null);
    			append_dev(main, t9);
    			append_dev(main, div41);
    			append_dev(div41, div6);
    			append_dev(div41, t11);
    			append_dev(div41, div40);
    			append_dev(div40, div26);
    			append_dev(div26, div9);
    			append_dev(div9, div7);
    			append_dev(div9, t13);
    			append_dev(div9, div8);
    			append_dev(div8, input0);
    			set_input_value(input0, /*title*/ ctx[1]);
    			append_dev(div26, t14);
    			append_dev(div26, div13);
    			append_dev(div13, div10);
    			append_dev(div13, t16);
    			append_dev(div13, div12);
    			append_dev(div12, input1);
    			set_input_value(input1, /*left*/ ctx[2]);
    			append_dev(div12, t17);
    			append_dev(div12, div11);
    			append_dev(div26, t19);
    			append_dev(div26, div17);
    			append_dev(div17, div14);
    			append_dev(div17, t21);
    			append_dev(div17, div16);
    			append_dev(div16, input2);
    			set_input_value(input2, /*width*/ ctx[3]);
    			append_dev(div16, t22);
    			append_dev(div16, div15);
    			append_dev(div26, t24);
    			append_dev(div26, div21);
    			append_dev(div21, div18);
    			append_dev(div21, t26);
    			append_dev(div21, div20);
    			append_dev(div20, input3);
    			set_input_value(input3, /*height*/ ctx[4]);
    			append_dev(div20, t27);
    			append_dev(div20, div19);
    			append_dev(div26, t29);
    			append_dev(div26, div25);
    			append_dev(div25, div22);
    			append_dev(div25, t31);
    			append_dev(div25, div24);
    			append_dev(div24, input4);
    			set_input_value(input4, /*gridTop*/ ctx[5]);
    			append_dev(div24, t32);
    			append_dev(div24, div23);
    			append_dev(div40, t34);
    			append_dev(div40, div39);
    			append_dev(div39, div38);
    			append_dev(div38, div35);
    			append_dev(div35, div30);
    			append_dev(div30, div27);
    			append_dev(div30, t36);
    			append_dev(div30, div29);
    			append_dev(div29, label0);
    			append_dev(label0, input5);
    			input5.checked = /*x_axis*/ ctx[7].checked;
    			append_dev(label0, t37);
    			append_dev(label0, span0);
    			append_dev(div29, t39);
    			append_dev(div29, div28);
    			append_dev(div29, t41);
    			append_dev(div29, input6);
    			set_input_value(input6, /*x_axis*/ ctx[7].interval);
    			append_dev(div35, t42);
    			append_dev(div35, div34);
    			append_dev(div34, div31);
    			append_dev(div34, t44);
    			append_dev(div34, div32);
    			append_dev(div32, label1);
    			append_dev(label1, input7);
    			input7.checked = /*y_axis*/ ctx[8].checked;
    			append_dev(label1, t45);
    			append_dev(label1, span1);
    			append_dev(div32, t47);
    			append_dev(div32, input8);
    			set_input_value(input8, /*y_axis*/ ctx[8].min);
    			append_dev(div32, t48);
    			append_dev(div32, input9);
    			set_input_value(input9, /*y_axis*/ ctx[8].interval);
    			append_dev(div32, t49);
    			append_dev(div32, input10);
    			set_input_value(input10, /*y_axis*/ ctx[8].max);
    			append_dev(div34, t50);
    			append_dev(div34, div33);
    			append_dev(div33, p0);
    			append_dev(div33, t51);
    			append_dev(div33, p1);
    			append_dev(div33, t52);
    			append_dev(div33, p2);
    			append_dev(div33, t53);
    			append_dev(div33, p3);
    			append_dev(div33, t54);
    			append_dev(div33, p4);
    			append_dev(div33, t56);
    			append_dev(div33, p5);
    			append_dev(div33, t58);
    			append_dev(div33, p6);
    			append_dev(div33, t60);
    			append_dev(div33, p7);
    			append_dev(div35, t61);
    			append_dev(div35, br0);
    			append_dev(div38, t62);
    			append_dev(div38, div37);
    			append_dev(div37, p8);
    			append_dev(div37, t64);
    			append_dev(div37, div36);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div36, null);
    			}

    			append_dev(div37, t65);
    			append_dev(div37, br1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*click_handler*/ ctx[11], false, false, false),
    					listen_dev(div2, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(div4, "click", /*click_handler_2*/ ctx[13], false, false, false),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[14]),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[15]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[16]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[17]),
    					listen_dev(input3, "input", /*input3_input_handler*/ ctx[18]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[19]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[20]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[21]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[22]),
    					listen_dev(input8, "input", /*input8_input_handler*/ ctx[23]),
    					listen_dev(input9, "input", /*input9_input_handler*/ ctx[24]),
    					listen_dev(input10, "input", /*input10_input_handler*/ ctx[25])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*showModal*/ 512 && div2_class_value !== (div2_class_value = /*showModal*/ ctx[9] == false
    			? "invisible absolute top-0 w-full h-full bg-black opacity-50"
    			: "absolute top-0 w-full h-full bg-black opacity-50")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*text*/ 1) {
    				set_input_value(textarea, /*text*/ ctx[0]);
    			}

    			if (!current || dirty & /*showModal*/ 512 && div5_class_value !== (div5_class_value = /*showModal*/ ctx[9] == false
    			? "invisible absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white px-30 py-2 rounded text-center z-20"
    			: "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-white px-30 py-2 rounded text-center z-20")) {
    				attr_dev(div5, "class", div5_class_value);
    			}

    			const chart_changes = {};
    			if (dirty & /*text*/ 1) chart_changes.text = /*text*/ ctx[0];
    			if (dirty & /*title*/ 2) chart_changes.title = /*title*/ ctx[1];
    			if (dirty & /*left*/ 4) chart_changes.left = /*left*/ ctx[2];
    			if (dirty & /*width*/ 8) chart_changes.width = /*width*/ ctx[3];
    			if (dirty & /*height*/ 16) chart_changes.height = /*height*/ ctx[4];
    			if (dirty & /*gridTop*/ 32) chart_changes.gridTop = /*gridTop*/ ctx[5];
    			if (dirty & /*dashed*/ 64) chart_changes.dashed = /*dashed*/ ctx[6];
    			if (dirty & /*x_axis*/ 128) chart_changes.x_axis = /*x_axis*/ ctx[7];
    			if (dirty & /*y_axis*/ 256) chart_changes.y_axis = /*y_axis*/ ctx[8];
    			chart.$set(chart_changes);

    			if (dirty & /*title*/ 2 && input0.value !== /*title*/ ctx[1]) {
    				set_input_value(input0, /*title*/ ctx[1]);
    			}

    			if (dirty & /*left*/ 4 && input1.value !== /*left*/ ctx[2]) {
    				set_input_value(input1, /*left*/ ctx[2]);
    			}

    			if (dirty & /*width*/ 8 && input2.value !== /*width*/ ctx[3]) {
    				set_input_value(input2, /*width*/ ctx[3]);
    			}

    			if (dirty & /*height*/ 16 && input3.value !== /*height*/ ctx[4]) {
    				set_input_value(input3, /*height*/ ctx[4]);
    			}

    			if (dirty & /*gridTop*/ 32 && input4.value !== /*gridTop*/ ctx[5]) {
    				set_input_value(input4, /*gridTop*/ ctx[5]);
    			}

    			if (dirty & /*x_axis*/ 128) {
    				input5.checked = /*x_axis*/ ctx[7].checked;
    			}

    			if (!current || dirty & /*x_axis*/ 128 && input6_disabled_value !== (input6_disabled_value = /*x_axis*/ ctx[7].checked)) {
    				prop_dev(input6, "disabled", input6_disabled_value);
    			}

    			if (dirty & /*x_axis*/ 128 && input6.value !== /*x_axis*/ ctx[7].interval) {
    				set_input_value(input6, /*x_axis*/ ctx[7].interval);
    			}

    			if (dirty & /*y_axis*/ 256) {
    				input7.checked = /*y_axis*/ ctx[8].checked;
    			}

    			if (dirty & /*y_axis*/ 256 && input8.value !== /*y_axis*/ ctx[8].min) {
    				set_input_value(input8, /*y_axis*/ ctx[8].min);
    			}

    			if (!current || dirty & /*y_axis*/ 256 && input9_disabled_value !== (input9_disabled_value = /*y_axis*/ ctx[8].checked)) {
    				prop_dev(input9, "disabled", input9_disabled_value);
    			}

    			if (dirty & /*y_axis*/ 256 && input9.value !== /*y_axis*/ ctx[8].interval) {
    				set_input_value(input9, /*y_axis*/ ctx[8].interval);
    			}

    			if (dirty & /*y_axis*/ 256 && input10.value !== /*y_axis*/ ctx[8].max) {
    				set_input_value(input10, /*y_axis*/ ctx[8].max);
    			}

    			if (dirty & /*dashed, length*/ 1088) {
    				each_value = Array(/*length*/ ctx[10]);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div36, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(chart.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(chart.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(chart);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let length;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let title = "[ Insert title ]";
    	let left = 10;
    	let width = 600;
    	let height = 400;
    	let gridTop = 80;

    	let dashed = [...new Array(8)].map((e, i) => {
    		return { dashed: false, name: `Series ${i + 1}` };
    	});

    	let x_axis = { checked: true, interval: 10 };

    	let y_axis = {
    		checked: true,
    		interval: null,
    		min: 75,
    		max: 250
    	};

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

    	let showModal = false;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => $$invalidate(9, showModal = true);
    	const click_handler_1 = () => $$invalidate(9, showModal = false);
    	const click_handler_2 = () => $$invalidate(9, showModal = false);

    	function textarea_input_handler() {
    		text = this.value;
    		$$invalidate(0, text);
    	}

    	function input0_input_handler() {
    		title = this.value;
    		$$invalidate(1, title);
    	}

    	function input1_input_handler() {
    		left = this.value;
    		$$invalidate(2, left);
    	}

    	function input2_input_handler() {
    		width = this.value;
    		$$invalidate(3, width);
    	}

    	function input3_input_handler() {
    		height = this.value;
    		$$invalidate(4, height);
    	}

    	function input4_input_handler() {
    		gridTop = this.value;
    		$$invalidate(5, gridTop);
    	}

    	function input5_change_handler() {
    		x_axis.checked = this.checked;
    		$$invalidate(7, x_axis);
    	}

    	function input6_input_handler() {
    		x_axis.interval = this.value;
    		$$invalidate(7, x_axis);
    	}

    	function input7_change_handler() {
    		y_axis.checked = this.checked;
    		$$invalidate(8, y_axis);
    	}

    	function input8_input_handler() {
    		y_axis.min = this.value;
    		$$invalidate(8, y_axis);
    	}

    	function input9_input_handler() {
    		y_axis.interval = this.value;
    		$$invalidate(8, y_axis);
    	}

    	function input10_input_handler() {
    		y_axis.max = this.value;
    		$$invalidate(8, y_axis);
    	}

    	function input0_change_handler(i) {
    		dashed[i].dashed = this.checked;
    		$$invalidate(6, dashed);
    	}

    	function input1_input_handler_1(i) {
    		dashed[i].name = this.value;
    		$$invalidate(6, dashed);
    	}

    	$$self.$capture_state = () => ({
    		Chart,
    		title,
    		left,
    		width,
    		height,
    		gridTop,
    		dashed,
    		x_axis,
    		y_axis,
    		text,
    		showModal,
    		length
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('left' in $$props) $$invalidate(2, left = $$props.left);
    		if ('width' in $$props) $$invalidate(3, width = $$props.width);
    		if ('height' in $$props) $$invalidate(4, height = $$props.height);
    		if ('gridTop' in $$props) $$invalidate(5, gridTop = $$props.gridTop);
    		if ('dashed' in $$props) $$invalidate(6, dashed = $$props.dashed);
    		if ('x_axis' in $$props) $$invalidate(7, x_axis = $$props.x_axis);
    		if ('y_axis' in $$props) $$invalidate(8, y_axis = $$props.y_axis);
    		if ('text' in $$props) $$invalidate(0, text = $$props.text);
    		if ('showModal' in $$props) $$invalidate(9, showModal = $$props.showModal);
    		if ('length' in $$props) $$invalidate(10, length = $$props.length);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*text*/ 1) {
    			$$invalidate(10, length = text.replace(/^\s*[\r\n]/gm, "").split("\n")[0].split("\t").length - 1);
    		}
    	};

    	return [
    		text,
    		title,
    		left,
    		width,
    		height,
    		gridTop,
    		dashed,
    		x_axis,
    		y_axis,
    		showModal,
    		length,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		textarea_input_handler,
    		input0_input_handler,
    		input1_input_handler,
    		input2_input_handler,
    		input3_input_handler,
    		input4_input_handler,
    		input5_change_handler,
    		input6_input_handler,
    		input7_change_handler,
    		input8_input_handler,
    		input9_input_handler,
    		input10_input_handler,
    		input0_change_handler,
    		input1_input_handler_1
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	}
    });

    return app;

})(echarts);
//# sourceMappingURL=bundle.js.map
