import { A, Navigate, Outlet, Route, useMatch } from "@solidjs/router";
import { createEffect, Show, Switch } from "solid-js";
import Tc from "../components/tc";
import { useConection } from "../contexts/connectionContext";



export default function PageWrapper() {
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
        { storage_fast_runer_executor_max_workers, set_storage_fast_runer_executor_max_workers },
        { analyzer_fast_runer_executor_max_workers, set_analyzer_fast_runer_executor_max_workers },
        { annotation_fast_runer_executor_max_workers, set_annotation_fast_runer_executor_max_workers },
        { serverConfigRecived, setServerConfigRecived },
        { fetchServerConfigs, saveServerConfigs },
        { conveyor_local_address, set_conveyor_local_address },
        { sorter_local_address, set_sorter_local_address },
        { camera_conveyor_duty_cycle, set_camera_conveyor_duty_cycle },
        { camera_conveyor_frequency, set_camera_conveyor_frequency },
        { splitting_conveyor_duty_cycle, set_splitting_conveyor_duty_cycle },
        { splitting_conveyor_frequency, set_splitting_conveyor_frequency },
        { saveServerCameraConveyorConfigs, saveServerSplittingConveyorConfigs },
        { camera_conveyor_active_time, set_camera_conveyor_active_time },
        { camera_conveyor_wait_time, set_camera_conveyor_wait_time },
        { sort, set_sort },
        { saveSort, saveServerCameraConveyorTimes },
        { crop, set_crop },
        { saveCrop },
        { processing_queue_limit, set_processing_queue_limit },
        { annotation_queue_limit, set_annotation_queue_limit },
        { storage_queue_limit, set_storage_queue_limit },
        { crops_queue_limit, set_crops_queue_limit },
        { last_images_limit, set_last_images_limit },
        { sort_queue_limit, set_sort_queue_limit },
        { lego_sorter_classifier, set_lego_sorter_classifier },
        { lego_sorter_detector, set_lego_sorter_detector },
        { store_img_override, set_store_img_override },
        { store_img_session, set_store_img_session },
        { save_store_img_override, save_store_img_session },
        { yolov5_model_path, set_yolov5_model_path },
        { keras_model_path, set_keras_model_path },
        { tinyvit_model_path, set_tinyvit_model_path },
        { conected, disconected }] = useConection();
    return (
        <>
            <div class="navbar bg-base-100">
                <div class="navbar-start">
                    <div class="dropdown">
                        <label tabindex="0" class="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            <li>
                                <A class="normal-case font-medium" href="/" end={true}>
                                    Home
                                </A>
                            </li>
                            <li>
                                <A class="normal-case font-medium" href="/controlApp">
                                    Control App
                                </A>
                            </li>
                            <li>
                                <A class="normal-case font-medium" href="/sessions">
                                    Sessions
                                </A>
                            </li>
                            <li tabindex="0">
                                <a class="justify-between normal-case font-medium" classList={{ active: Boolean(useMatch(() => "/configApp")() || useMatch(() => "/configWeb")() || useMatch(() => "/configServer")()) }}>
                                    Config
                                    <svg class="fill-current" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" /></svg>
                                </a>
                                <ul class="p-1 rounded-box bg-base-200 z-50">
                                    <li class="m-0.5">
                                        <A class="normal-case font-medium" href="/configApp" end={true}>
                                            App Conf
                                        </A>
                                    </li>
                                    <li class="m-0.5">
                                        <A class="normal-case font-medium" href="/configWeb" end={true}>
                                            Web Conf
                                        </A>
                                    </li>
                                    <li class="m-0.5">
                                        <A class="normal-case font-medium" href="/configServer" end={true}>
                                            Server Conf
                                        </A>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <A class="normal-case font-medium" href="/about">
                                    About
                                </A>
                            </li>
                        </ul>
                    </div>
                    {/*<a class="btn btn-ghost normal-case text-xl">Sorter</a>*/}
                </div>
                <div class="navbar-center hidden lg:flex">
                    <ul class="menu menu-horizontal rounded-box">
                        <li>
                            <A class="normal-case text-xl font-medium" href="/" end={true}>
                                Home
                            </A>
                        </li>
                        <li>
                            <A class="normal-case text-xl font-medium" href="/controlApp">
                                Control App
                            </A>
                        </li>
                        <li>
                            <A class="normal-case text-xl font-medium" href="/sessions">
                                Sessions
                            </A>
                        </li>
                        <li tabindex="0">
                            <span class="normal-case text-xl font-medium" classList={{ active: Boolean(useMatch(() => "/configApp")() || useMatch(() => "/configWeb")() || useMatch(() => "/configServer")()) }}>Config</span>
                            <ul tabindex="0" class="rounded-box bg-base-200 z-50">
                                <li>
                                    <A class="normal-case text-xl font-medium" href="/configApp" end={true}>
                                        App Conf
                                    </A>
                                </li>
                                <li>
                                    <A class="normal-case text-xl font-medium" href="/configWeb" end={true}>
                                        Web Conf
                                    </A>
                                </li>
                                <li>
                                    <A class="normal-case text-xl font-medium" href="/configServer" end={true}>
                                        Server Conf
                                    </A>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <A class="normal-case text-xl font-medium" href="/about">
                                About
                            </A>
                        </li>
                    </ul>
                </div>
                <div class="navbar-end gap-1">
                    <div class="tooltip tooltip-bottom flex-none" data-tip="Check conection state">
                        <button class="btn btn-ghost  bg-base-100 font-medium normal-case text-xl mt-0.5 mb-0.5" onClick={() => {
                            disconected();
                            connectionControl.send("sendPing")
                        }}>
                            <Show when={connection()} fallback={<span>Disconnected</span>}>
                                <span>Connected</span>
                            </Show>
                        </button>
                    </div>
                    <div class="flex-none">
                        <Tc />
                    </div>
                </div>
            </div>
            <main>
                <Outlet />
            </main>
        </>
    );
}
