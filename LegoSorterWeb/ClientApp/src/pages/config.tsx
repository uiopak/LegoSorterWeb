import { Component, createEffect, createResource, createSignal, Suspense } from 'solid-js';
import { useRouteData } from '@solidjs/router';
import { useConection } from '../contexts/connectionContext';

export default function Config() {
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

    return (
        <section class="bg-base-300 text-base-800 p-8">
            <h1 class="text-2xl font-bold">Web server config</h1>

            <p class="mt-4">Server connection data:</p>

            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">Server address</span>
                </label>
                <Suspense fallback={<input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" />}>
                    <input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" value={address()}
                        onChange={(e) => { setAddress(e.currentTarget.value) }} />
                </Suspense>
            </div>

            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">Server GRPC port</span>
                </label>
                <Suspense fallback={<input type="text" placeholder="port" class="input input-bordered w-full max-w-xs" />}>
                    <input type="text" placeholder="port" class="input input-bordered w-full max-w-xs" value={serverGrpcPort()}
                        onChange={(e) => { setServerGrpcPort(e.currentTarget.value) }} />
                </Suspense>
                <label class="label">
                    <span class="label-text"></span>
                </label>
            </div>

            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">Server API port</span>
                </label>
                <Suspense fallback={<input type="text" placeholder="port" class="input input-bordered w-full max-w-xs" />}>
                    <input type="text" placeholder="port" class="input input-bordered w-full max-w-xs" value={serverApiPort()}
                        onChange={(e) => { setServerApiPort(e.currentTarget.value) }} />
                </Suspense>
                <label class="label">
                    <span class="label-text"></span>
                </label>
            </div>

            <button class="btn" innerText="Save" onClick={() => saveWebConfigs()} />

        </section>
    );
}
