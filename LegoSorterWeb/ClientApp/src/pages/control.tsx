import { Component, createContext, createEffect, createResource, createSignal, onCleanup, onMount, Suspense, useContext } from 'solid-js';
import { useRouteData } from '@solidjs/router';
import * as signalR from "@microsoft/signalr";
import { Configs, useConection } from "../contexts/connectionContext"

export default function Control() {
    const [connection, connectionControl,
        { capture_mode_preference, setCapture_mode_preference },
        { capture_resolution_value, setCapture_resolution_value },
        { analysis_resolution_value, setAnalysis_resolution_value },
        { exposure_compensation_value, setExposure_compensation_value },
        { manual_settings, setManual_settings },
        { sensor_exposure_time, setSensor_exposure_time },
        { sensor_sensitivity, setSensor_sensitivity },
        { sorter_conveyor_speed_value, setSorter_conveyor_speed_value },
        { sorter_mode_preference, setSorter_mode_preference },
        { run_conveyor_time_value, setRun_conveyor_time_value },
        { analysis_minimum_delay, set_analysis_minimum_delay },
        { render_belt_speed, set_render_belt_speed },
        { render_belt_opacity, setRender_belt_opacity },
        { render_belt_camera_view, setRender_belt_camera_view },
        { cameraCompensationRangeMin, setCameraCompensationRangeMin },
        { cameraCompensationRangeMax, setCameraCompensationRangeMax },
        { exposureTimeRangeMin, setExposureTimeRangeMin },
        { exposureTimeRangeMax, setExposureTimeRangeMax },
        { sensitivityRangeMin, setSensitivityRangeMin },
        { sensitivityRangeMax, setSensitivityRangeMax },
        { savedAddr, setSavedAddr },
        { savedWebAddr, setSavedWebAddr },
        { state, setState },
        { saveImgSwitchVal, setSaveImgSwitchVal },
        { savedSession, setSavedSession },
        { serverGrpcPort, setServerGrpcPort },
        { serverApiPort, setServerApiPort },
        { serverFiftyonePort, setServerFiftyonePort },
        { serverFiftyoneAddress, setServerFiftyoneAddress },
        { address, setAddress },
        { webConfigRecived, setWebConfigRecived },
        { fetchWebConfigs, saveWebConfigs },
        { grpcPort1, setGrpcPort1 },
        { grpcPort2, setGrpcPort2 },
        { apiPort, setApiPort },
        { webAddress, setWebAddress },
        { server_grpc_max_workers_1, set_server_grpc_max_workers_1 },
        { server_grpc_max_workers_2, set_server_grpc_max_workers_2 },
        { storageFastRunerExecutor_max_workers, set_storageFastRunerExecutor_max_workers },
        { analyzerFastRunerExecutor_max_workers, set_analyzerFastRunerExecutor_max_workers },
        { annotationFastRunerExecutor_max_workers, set_annotationFastRunerExecutor_max_workers },
        { serverConfigRecived, setServerConfigRecived },
        { fetchServerConfigs, saveServerConfigs },
        { conected, disconected }] = useConection();

    const frequency = () => {
        if (sensor_exposure_time() != "") {
            var val = parseFloat(sensor_exposure_time())
            return val != 0 ? (1000 / val).toString() : "NaN"
        }
        else {
            return "NaN"
        }
    }
    
    onCleanup(() => {
        console.log("cleanup");
    });

    function getConfig() {
        connectionControl.send("getConfigs")
    }

    function getConnectionConfigs() {
        connectionControl.send("getConnectionConfigs")
    }

    function setConnectionConfigs() {
        connectionControl.send("setConnectionConfigs",savedAddr(),savedWebAddr())
    }

    function getConfigsConstraints() {
        connectionControl.send("getConfigsConstraints")
    }

    function getConfigAndConstraints() {
        getConfig()
        getConfigsConstraints()
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
            run_conveyor_time_value: run_conveyor_time_value(),
            analysis_minimum_delay: analysis_minimum_delay(),
            render_belt_speed: render_belt_speed(),
            render_belt_opacity: render_belt_opacity(),
            render_belt_camera_view: render_belt_camera_view()
        }
        connectionControl.send("setConfigs", conf)
    }

    return (
        <div class="bg-base-300  p-8 grid gap-4">
            
            <section class="text-base-800 flex flex-wrap gap-4">
                {/*<h1 class="text-2xl font-bold">Config</h1>*/}
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">Phone servers configs:</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Sorter server connection address:</span>
                            </label>
                            {/*<Suspense fallback={<input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" />}>*/}
                                <input type="text" placeholder="address" disabled={!connection()} class="input input-bordered w-full max-w-xs" value={savedAddr()}
                                    onChange={(e) => {setSavedAddr(e.currentTarget.value)}} />
                            {/*</Suspense>*/}
                            <label class="label">
                                <span class="label-text-alt">Wrong adress will cause app crash (out of memory)</span>
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Web GUI server connection address:</span>
                            </label>
                            {/*<Suspense fallback={<input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" />}>*/}
                                <input type="text" placeholder="address" disabled={!connection()} class="input input-bordered w-full max-w-xs" value={savedWebAddr()}
                                    onChange={(e) => { setSavedWebAddr(e.currentTarget.value) }} />
                            {/*</Suspense>*/}
                            <label class="label">
                                <span class="label-text-alt">Wrong adress will disconect app</span>
                            </label>
                        </div>
                        <div class="flex flex-row">
                            <div class="basis-1/2 justify-items-center grid ">
                                <button class="btn w-24" innerText="Refresh" disabled={!connection()} onClick={() => getConnectionConfigs()} />
                                </div>
                            <div class="basis-1/2 justify-items-center grid ">
                                <button class="btn w-24" innerText="Save" disabled={!connection()} onClick={() => setConnectionConfigs()} />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl">
                    <div class="card-body">
                        <h2 class="card-title">Camera settings</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Capture mode:</span>
                            </label>
                            <select class="select select-bordered w-full max-w-xs" disabled={!connection()} onChange={(e) => setCapture_mode_preference((e.currentTarget.selectedIndex - 1).toString())}>
                                <option disabled selected>Capture mode</option>
                                <option selected={capture_mode_preference() == "0"}>Maximize Quality</option>
                                <option selected={capture_mode_preference() == "1"}>Minimize Latency</option>
                            </select>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Capture resolution:</span>
                            </label>
                            <select class="select select-bordered w-full max-w-xs" disabled={!connection()} onChange={(e) => setCapture_resolution_value((e.currentTarget.selectedIndex - 1).toString())}>
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
                            <select class="select select-bordered w-full max-w-xs" disabled={!connection()} onChange={(e) => setAnalysis_resolution_value((e.currentTarget.selectedIndex - 1).toString())}>
                                <option disabled selected>Analysis resolution</option>
                                <option selected={analysis_resolution_value() == "0"}>240 x 320 </option>
                                <option selected={analysis_resolution_value() == "1"}>480 x 640 (SD)</option>
                                <option selected={analysis_resolution_value() == "2"}>720 x 1280 (HD)</option>
                                <option selected={analysis_resolution_value() == "3"}>1080 x 1920 (FHD)</option>
                                <option selected={analysis_resolution_value() == "4"}>1152 x 2048 (2K)</option>
                                <option selected={analysis_resolution_value() == "5"}>2160 x 3840 (UHD)</option>
                            </select>
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Minimum time delay:</span>
                            </label>
                            <input disabled={!connection()} type="number" min="0" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={analysis_minimum_delay()}
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 0)
                                            set_analysis_minimum_delay(e.currentTarget.value)
                                        else {
                                            e.currentTarget.value = analysis_minimum_delay()
                                        }
                                    }} />
                            <label class="label">
                                <span class="label-text-alt">Minimum time between image processing in ms (0 - ignore))</span>
                            </label>
                        </div>
                        <div class="form-control  w-full max-w-xs">
                            <label class="label cursor-pointer">
                                <span class="label-text">Render belt like camera</span>
                                <input type="checkbox" class="toggle" disabled={!connection()} checked={render_belt_camera_view()} onChange={(e) => setRender_belt_camera_view(e.currentTarget.checked)} />
                                {/*<input type="checkbox" class="toggle" checked={manual_settings()} onChange={(e) => setConfig(c => { c.manual_settings = e.currentTarget.checked; return c})} />*/}
                            </label>
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Render belt speed multiplier:</span>
                            </label>
                            <input disabled={!connection()} type="number" step="0.01" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={render_belt_speed()}
                                onChange={
                                    (e) => {
                                        if (isNaN(parseFloat(e.currentTarget.value)))
                                            e.currentTarget.value = render_belt_speed()
                                        else {
                                            set_render_belt_speed(e.currentTarget.value)
                                        }
                                    }} />

                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Render belt opacity:</span>
                            </label>
                            <input disabled={!connection()} type="number" min="0" max="100" step="1" placeholder="Type here" class="input input-bordered w-full max-w-xs" value={render_belt_opacity()}
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 0 && parseInt(e.currentTarget.value) <= 100)
                                            setRender_belt_opacity(e.currentTarget.value)
                                        else {
                                            e.currentTarget.value = render_belt_opacity()
                                        }
                                    }} />

                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Camera compensation value</span>
                            </label>
                            <input disabled={!connection()} type="number" min={cameraCompensationRangeMin()} max={cameraCompensationRangeMax()} placeholder="Type here" class="input input-bordered w-full max-w-xs" value={exposure_compensation_value()}
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
                                <input type="checkbox" class="toggle" disabled={!connection()} checked={manual_settings()} onChange={(e) => setManual_settings(e.currentTarget.checked)} />
                                {/*<input type="checkbox" class="toggle" checked={manual_settings()} onChange={(e) => setConfig(c => { c.manual_settings = e.currentTarget.checked; return c})} />*/}
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Sensor exposure time (ms)</span>
                                <span class="label-text-alt">{frequency()} Hz</span>
                            </label>
                            <input type="number" step="0.000001" min={exposureTimeRangeMin()} max={exposureTimeRangeMax()} placeholder="Not set" class="input input-bordered w-full max-w-xs" value={sensor_exposure_time()} disabled={!manual_settings()||!connection()}
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
                            <input type="number" step="1" min={sensitivityRangeMin()} max={sensitivityRangeMax()} placeholder="Not set" class="input input-bordered w-full max-w-xs" value={sensor_sensitivity()} disabled={!manual_settings() || !connection()}
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= sensitivityRangeMin() && parseInt(e.currentTarget.value) <= sensitivityRangeMax())
                                            setSensor_sensitivity(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = sensor_sensitivity()
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
                            <input type="number" disabled={!connection()} placeholder="Type here" min="0" step="1" max="100" class="input input-bordered w-full max-w-xs" value={sorter_conveyor_speed_value()}
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
                            <select class="select select-bordered w-full max-w-xs" disabled={!connection()} onChange={(e) => setSorter_mode_preference((e.currentTarget.selectedIndex - 1).toString())}>
                                <option disabled selected>Sorting mode</option>
                                <option selected={sorter_mode_preference() == "0"}>Stop - Capture - Run</option>
                                <option selected={sorter_mode_preference() == "1"}>Continuous move</option>
                            </select>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">How long run conveyor between capture requests (ms)</span>
                            </label>
                            <input type="number" disabled={!connection()} placeholder="Type here" min="1" step="1" class="input input-bordered w-full max-w-xs" value={run_conveyor_time_value()}
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 1)
                                            setRun_conveyor_time_value(e.currentTarget.value)
                                        else {
                                            e.currentTarget.value = run_conveyor_time_value()
                                        }
                                    }
                                }/>
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl">
                    <div class="card-body items-center">
                        <button class="btn w-48" disabled={!connection()}  innerText="Save settings" onClick={() => setConfig()} />
                        <button class="btn w-48" disabled={!connection()}  innerText="Refresh settings" onClick={() => getConfigAndConstraints()} />
                    </div>
                </div>
            </section>
            
        </div>
    );
}

