import { Component, createEffect, createResource, createSignal, onCleanup, onMount, Suspense } from 'solid-js';
import { useRouteData } from 'solid-app-router';
import * as signalR from "@microsoft/signalr";

export default function Control() {
    //const serverName = useRouteData<{ address: () => string, port: () => string }>();
    const [address, setAddress] = createSignal("");
    const [port, setPort] = createSignal("");
    const [capture_mode_preference, setCapture_mode_preference] = createSignal("0");
    const [capture_resolution_value, setCapture_resolution_value] = createSignal("0");
    const [analysis_resolution_value, setAnalysis_resolution_value] = createSignal("0");
    const [exposure_compensation_value, setExposure_compensation_value] = createSignal("0");
    const [manual_settings, setManual_settings] = createSignal(false);
    const [sensor_exposure_time, setSensor_exposure_time] = createSignal("");
    const frequency = () => {
        if (sensor_exposure_time() != "") {
            var val = parseFloat(sensor_exposure_time())
            return val != 0 ? (1000 / val).toString() : "NaN"
        }
        else {
            return "NaN"
        }
    }
    const [sensor_sensitivity, setSensor_sensitivity] = createSignal("");
    const [sorter_conveyor_speed_value, setSorter_conveyor_speed_value] = createSignal(50);
    const [sorter_mode_preference, setSorter_mode_preference] = createSignal("0");
    const [run_conveyor_time_value, setRun_conveyor_time_value] = createSignal("500");

    const [cameraCompensationRangeMin, setCameraCompensationRangeMin] = createSignal(0);
    const [cameraCompensationRangeMax, setCameraCompensationRangeMax] = createSignal(0);
    const [exposureTimeRangeMin, setExposureTimeRangeMin] = createSignal(0.0);
    const [exposureTimeRangeMax, setExposureTimeRangeMax] = createSignal(0.0);
    const [sensitivityRangeMin, setSensitivityRangeMin] = createSignal(0);
    const [sensitivityRangeMax, setSensitivityRangeMax] = createSignal(0);

    function getBoolean(value: any) {
        switch (value) {
            case true:
            case "true":
            case 1:
            case "1":
            case "on":
            case "yes":
                return true;
            default:
                return false;
        }
    }

    const connectionControl = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/control')
        .build();

    onCleanup(() => {
        console.log("cleanup");
        connectionControl.stop().catch((err: string) => console.log(err))
    });

    type Configs = {
        capture_mode_preference: string,
        capture_resolution_value: string,
        analysis_resolution_value: string,
        exposure_compensation_value: string,
        manual_settings: boolean,
        sensor_exposure_time: string,
        sensor_sensitivity: string,
        sorter_conveyor_speed_value: number,
        sorter_mode_preference: string,
        run_conveyor_time_value: string,
    };
    type ConfigsConstraints = {
        cameraCompensationRangeMin: number,
        cameraCompensationRangeMax: number,
        exposureTimeRangeMin: number,
        exposureTimeRangeMax: number,
        sensitivityRangeMin: number,
        sensitivityRangeMax: number,
    };

    //const [config, setConfig] = createSignal<Configs>({
    //    capture_mode_preference: "0",
    //    capture_resolution_value: "0",
    //    analysis_resolution_value: "0",
    //    exposure_compensation_value: "0",
    //    manual_settings: false,
    //    sensor_exposure_time: "",
    //    sensor_sensitivity: "",
    //    sorter_conveyor_speed_value: 50,
    //    sorter_mode_preference: "0",
    //    run_conveyor_time_value: "500",
    //});

    //const [configsConstraints, setConfigsConstraints] = createSignal<ConfigsConstraints>({
    //    cameraCompensationRangeMin: 0,
    //    cameraCompensationRangeMax: 0,
    //    exposureTimeRangeMin: 0.0,
    //    exposureTimeRangeMax: 0.0,
    //    sensitivityRangeMin: 0,
    //    sensitivityRangeMax: 0,
    //});

    connectionControl.start().catch((err: string) => console.log(err));


    connectionControl.on("sendConfigs", conf => {
        var config2 = conf as Configs
        setCapture_mode_preference(config2.capture_mode_preference)
        setCapture_resolution_value(config2.capture_resolution_value)
        setAnalysis_resolution_value(config2.analysis_resolution_value)
        setExposure_compensation_value(config2.exposure_compensation_value)
        setManual_settings(config2.manual_settings)
        setSensor_exposure_time(config2.sensor_exposure_time)
        setSensor_sensitivity(config2.sensor_sensitivity)
        setSorter_conveyor_speed_value(config2.sorter_conveyor_speed_value)
        setSorter_mode_preference(config2.sorter_mode_preference)
        setRun_conveyor_time_value(config2.run_conveyor_time_value)
        //setConfig(config2)
    })

    connectionControl.on("sendConfigsConstraints", conf => {
        var configsConstraints2 = conf as ConfigsConstraints
        setCameraCompensationRangeMin(configsConstraints2.cameraCompensationRangeMin)
        setCameraCompensationRangeMax(configsConstraints2.cameraCompensationRangeMax)
        setExposureTimeRangeMin(configsConstraints2.exposureTimeRangeMin)
        setExposureTimeRangeMax(configsConstraints2.exposureTimeRangeMax)
        setSensitivityRangeMin(configsConstraints2.sensitivityRangeMin)
        setSensitivityRangeMax(configsConstraints2.sensitivityRangeMax)
        //setConfigsConstraints(configsConstraints2)
    })



    //createEffect(() => {
    //    //setCAPTURE_MODE_PREFERENCE(config().capture_mode_preference)
    //    //setCAPTURE_RESOLUTION_VALUE(config().capture_resolution_value)
    //    //setANALYSIS_RESOLUTION_VALUE(config().analysis_resolution_value)
    //    //setEXPOSURE_COMPENSATION_VALUE(config().exposure_compensation_value)
    //    //setMANUAL_SETTINGS(config().manual_settings)
    //    //setSENSOR_EXPOSURE_TIME(config().sensor_exposure_time)
    //    //setSENSOR_SENSITIVITY(config().sensor_sensitivity)
    //    //setSORTER_CONVEYOR_SPEED_VALUE(config().sorter_conveyor_speed_value)
    //    //setSORTER_MODE_PREFERENCE(config().sorter_mode_preference)
    //    //setRUN_CONVEYOR_TIME_VALUE(config().run_conveyor_time_value)

    //    setCameraCompensationRangeMin(configsConstraints().cameraCompensationRangeMin)
    //    setCameraCompensationRangeMax(configsConstraints().cameraCompensationRangeMax)
    //    setExposureTimeRangeMin(configsConstraints().exposureTimeRangeMin)
    //    setExposureTimeRangeMax(configsConstraints().exposureTimeRangeMax)
    //    setSensitivityRangeMin(configsConstraints().sensitivityRangeMin)
    //    setSensitivityRangeMax(configsConstraints().sensitivityRangeMax)
    //})

    function getConfig() {
        connectionControl.send("getConfigs")
    }
    function getConfigsConstraints() {
        connectionControl.send("getConfigsConstraints")
    }

    function setConfig() {
        var conf: Configs={
            capture_mode_preference: capture_mode_preference(),
            capture_resolution_value: capture_resolution_value(),
            analysis_resolution_value: analysis_resolution_value(),
            exposure_compensation_value: exposure_compensation_value(),
            manual_settings: manual_settings(),
            sensor_exposure_time: sensor_exposure_time(),
            sensor_sensitivity: sensor_sensitivity(),
            sorter_conveyor_speed_value: sorter_conveyor_speed_value(),
            sorter_mode_preference: sorter_mode_preference(),
            run_conveyor_time_value: run_conveyor_time_value()
        }
        connectionControl.send("setConfigs", conf)
    }

    //onMount(() => {
    //    getConfig()
    //})

    return (
        <div class="bg-base-300  p-8 grid gap-4">
            <button class="btn  w-96" innerText="test" onClick={() => getConfig()} />
            <button class="btn  w-96" innerText="test2" onClick={() => getConfigsConstraints()} />
            <section class="text-base-800 flex flex-wrap gap-4">
                {/*<h1 class="text-2xl font-bold">Config</h1>*/}
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">Camera settings</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Sorter server connection address:</span>
                            </label>
                            <Suspense fallback={<input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" />}>
                                <input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" value={address()} />
                            </Suspense>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Web GUI server connection address:</span>
                            </label>
                            <Suspense fallback={<input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" />}>
                                <input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" value={address()} />
                            </Suspense>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Capture mode:</span>
                            </label>
                            <select class="select select-bordered w-full max-w-xs" onChange={(e) => setCapture_mode_preference((e.currentTarget.selectedIndex - 1).toString())}>
                                <option disabled selected>Capture mode</option>
                                <option selected={capture_mode_preference() == "0"}>Maximize Quality</option>
                                <option selected={capture_mode_preference() == "1"}>Minimize Latency</option>
                            </select>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Capture resolution:</span>
                            </label>
                            <select class="select select-bordered w-full max-w-xs" onChange={(e) => setCapture_resolution_value((e.currentTarget.selectedIndex - 1).toString())}>
                                <option disabled selected>Capture resolution</option>
                                <option selected={capture_resolution_value() == "0"}>480 x 640 (SD)</option>
                                <option selected={capture_resolution_value() == "1"}>720 x 1280 (HD)</option>
                                <option selected={capture_resolution_value() == "2"}>1080 x 1920 (FHD)</option>
                                <option selected={capture_resolution_value() == "3"}>1152 x 2048 (2K)</option>
                                <option selected={capture_resolution_value() == "4"}>2160 x 3840 (UHD)</option>
                                <option selected={capture_resolution_value() == "5"}>Highest possible</option>
                            </select>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Analysis resolution:</span>
                            </label>
                            <select class="select select-bordered w-full max-w-xs" onChange={(e) => setAnalysis_resolution_value((e.currentTarget.selectedIndex - 1).toString())}>
                                <option disabled selected>Analysis resolution</option>
                                <option selected={analysis_resolution_value() == "0"}>240 x 320 </option>
                                <option selected={analysis_resolution_value() == "1"}>480 x 640 (SD)</option>
                                <option selected={analysis_resolution_value() == "2"}>720 x 1280 (HD)</option>
                                <option selected={analysis_resolution_value() == "3"}>1080 x 1920 (FHD)</option>
                            </select>
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Camera compensation value</span>
                            </label>
                            <input type="number" min={cameraCompensationRangeMin()} max={cameraCompensationRangeMax()} placeholder="Type here" class="input input-bordered w-full max-w-xs" value={exposure_compensation_value()}
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= cameraCompensationRangeMin() && parseInt(e.currentTarget.value) <= cameraCompensationRangeMax())
                                            setExposure_compensation_value(e.currentTarget.value)
                                        else {
                                            e.currentTarget.value = exposure_compensation_value()
                                        }
                                    }} />
                            <label class="label">
                                <span class="label-text-alt">Min {cameraCompensationRangeMin()}</span>
                                <span class="label-text-alt">Max {cameraCompensationRangeMax()}</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl">
                    <div class="card-body">
                        <div class="form-control  w-full max-w-xs">
                            <label class="label cursor-pointer">
                                <span class="label-text">Custom exposure settings</span>
                                <input type="checkbox" class="toggle" checked={manual_settings()} onChange={(e) => setManual_settings(e.currentTarget.checked)} />
                                {/*<input type="checkbox" class="toggle" checked={manual_settings()} onChange={(e) => setConfig(c => { c.manual_settings = e.currentTarget.checked; return c})} />*/}
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Sensor exposure time (ms)</span>
                                <span class="label-text-alt">{frequency()} Hz</span>
                            </label>
                            <input type="number" step="0.000001" min={exposureTimeRangeMin()} max={exposureTimeRangeMax()} placeholder="Not set" class="input input-bordered w-full max-w-xs" value={sensor_exposure_time()} disabled={!manual_settings()}
                                onChange={
                                    (e) => {
                                        if (parseFloat(e.currentTarget.value) >= exposureTimeRangeMin() && parseFloat(e.currentTarget.value) <= exposureTimeRangeMax())
                                            setSensor_exposure_time(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = sensor_exposure_time()
                                            else
                                                setSensor_exposure_time(e.currentTarget.value)
                                        }

                                    }} />
                            <label class="label">
                                <span class="label-text-alt">Min {exposureTimeRangeMin()} ms</span>
                                <span class="label-text-alt">Max {exposureTimeRangeMax()} ms</span>
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Sensor sensitivity</span>
                                <span class="label-text-alt">ISO</span>
                            </label>
                            <input type="number" step="1" min={sensitivityRangeMin()} max={sensitivityRangeMax()} placeholder="Not set" class="input input-bordered w-full max-w-xs" value={sensor_sensitivity()} disabled={!manual_settings()}
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= sensitivityRangeMin() && parseInt(e.currentTarget.value) <= sensitivityRangeMax())
                                            setSensor_sensitivity(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = sensor_exposure_time()
                                            else
                                                setSensor_sensitivity(e.currentTarget.value)
                                        }

                                    }} />
                            <label class="label">
                                <span class="label-text-alt">Min {sensitivityRangeMin()}</span>
                                <span class="label-text-alt">Max {sensitivityRangeMax()}</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl">
                    <div class="card-body">
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Conveyor speed</span>
                            </label>
                            <input type="number" placeholder="Type here" min="0" step="1" max="100" class="input input-bordered w-full max-w-xs" value={sorter_conveyor_speed_value()}
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 0 && parseInt(e.currentTarget.value) <= 100)
                                            setSorter_conveyor_speed_value(parseInt(e.currentTarget.value))
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = sorter_conveyor_speed_value().toString()
                                            else
                                                setSorter_conveyor_speed_value(parseInt(e.currentTarget.value))
                                        }

                                    }} />
                            <label class="label">
                                <span class="label-text-alt">Min 0</span>
                                <span class="label-text-alt">Max 100</span>
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Sorting mode:</span>
                            </label>
                            <select class="select select-bordered w-full max-w-xs" onChange={(e) => setSorter_mode_preference((e.currentTarget.selectedIndex - 1).toString())}>
                                <option disabled selected>Sorting mode</option>
                                <option selected={sorter_mode_preference() == "0"}>Stop - Capture - Run</option>
                                <option selected={sorter_mode_preference() == "1"}>Continuous move</option>
                            </select>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">How long run conveyor between capture requests (ms)</span>
                            </label>
                            <input type="number" placeholder="Type here" min="1" step="1" class="input input-bordered w-full max-w-xs" value={run_conveyor_time_value()} />
                        </div>
                    </div>

                </div>
            </section>
            {/*<div class="card card-compact w-96 bg-base-100 max-h-64 shadow-xl">*/}
            {/*    <div class="card-body max-h-20">*/}
            {/*        <h2 class="text-2xl font-bold p-4">test</h2>*/}
            {/*    </div>*/}

            {/*</div>*/}

            <button class="btn w-96" innerText="Save" onClick={() => setConfig() } />
        </div>
    );
}

