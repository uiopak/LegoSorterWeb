import { Component, createEffect, createResource, createSignal, Suspense } from 'solid-js';
import { useRouteData } from 'solid-app-router';
import { useConection, http } from '../contexts/connectionContext';

export default function ConfigServer() {
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

    async function startServer() {
        await http(`http://${address()}:${serverApiPort()}/start/`)
    }
    async function restartServer() {
        await http(`http://${address()}:${serverApiPort()}/restart/`)
    }
    async function stopServer() {
        await http(`http://${address()}:${serverApiPort()}/stop/`)
    }
    return (
        <section class="bg-base-300 text-base-800 p-8">
            <h1 class="text-2xl font-bold">Lego sorter server config</h1>

            <p class="mt-4">Server connection data:</p>
            <div class="flex flex-wrap">
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl m-4">
                    <div class="card-body">


                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">GRPC server1 thread max workers</span>
                            </label>
                            <input type="text" placeholder="grpc_max_workers_1" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={server_grpc_max_workers_1()}
                                onChange={(e) => { set_server_grpc_max_workers_1(e.currentTarget.value) }} />
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">GRPC server2 thread max workers</span>
                            </label>
                            <input type="text" placeholder="grpc_max_workers_2" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={server_grpc_max_workers_2()}
                                onChange={(e) => { set_server_grpc_max_workers_2(e.currentTarget.value) }} />
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">storageFastRunerExecutor max workers</span>
                            </label>
                            <input type="text" placeholder="storage_max_workers" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={storageFastRunerExecutor_max_workers()}
                                onChange={(e) => { set_storageFastRunerExecutor_max_workers(e.currentTarget.value) }} />
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">analyzerFastRunerExecutor max(2) workers</span>
                            </label>
                            <input type="text" placeholder="analyzer_max_workers" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={analyzerFastRunerExecutor_max_workers()}
                                onChange={(e) => { set_analyzerFastRunerExecutor_max_workers(e.currentTarget.value) }} />
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">annotationFastRunerExecutor max workers</span>
                            </label>
                            <input type="text" placeholder="annotation_max_workers" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={annotationFastRunerExecutor_max_workers()}
                                onChange={(e) => { set_annotationFastRunerExecutor_max_workers(e.currentTarget.value) }} />
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl m-4">
                    <div class="card-body">

                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Server GRPC Port1</span>
                            </label>
                            <input type="text" placeholder="GRPC Port1" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={grpcPort1()}
                                onChange={(e) => { setGrpcPort1(e.currentTarget.value) }} />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Server GRPC Port2</span>
                            </label>
                            <input type="text" placeholder="GRPC Port2" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={grpcPort2()}
                                onChange={(e) => { setGrpcPort2(e.currentTarget.value) }} />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Server API port</span>
                            </label>
                            <input type="text" placeholder="API port" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={apiPort()}
                                onChange={(e) => { setApiPort(e.currentTarget.value) }} />
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Web server address</span>
                            </label>
                            <input type="text" placeholder="Web Address" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={webAddress()}
                                onChange={(e) => { setWebAddress(e.currentTarget.value) }} />
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl m-4">
                    <div class="card-body">
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Server Fiftyone port</span>
                            </label>
                            <input type="text" placeholder="Fiftyone port" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={serverFiftyonePort()}
                                onChange={(e) => { setServerFiftyonePort(e.currentTarget.value) }} />
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Server Fiftyone address</span>
                            </label>
                            <input type="text" placeholder="Fiftyone address" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={serverFiftyoneAddress()}
                                onChange={(e) => { setServerFiftyoneAddress(e.currentTarget.value) }} />
                            <label class="label">
                                <span class="label-text"></span>
                            </label>
                        </div>
                        <div class="card-body">
                            <div class="form-control w-full max-w-xs">
                                <div class="flex flex-row">
                                    <div class="basis-full justify-items-center grid ">
                                        <button class="btn w-24" disabled={!serverConfigRecived()} innerText="Save" onClick={() => saveServerConfigs()} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="card-body">
                            <div class="form-control w-full max-w-xs">
                                <div class="flex flex-row">
                                    <div class="basis-1/3 justify-items-center grid ">
                                        <button class="btn" disabled={!serverConfigRecived()}  innerText="Start" onClick={() => startServer()} />
                                    </div>
                                    <div class="basis-1/3 justify-items-center grid ">
                                        <button class="btn" disabled={!serverConfigRecived()}  innerText="Stop" onClick={() => stopServer()} />
                                    </div>
                                    <div class="basis-1/3 justify-items-center grid ">
                                        <button class="btn" disabled={!serverConfigRecived()}  innerText="Restart" onClick={() => restartServer()} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </section>
    );
}
