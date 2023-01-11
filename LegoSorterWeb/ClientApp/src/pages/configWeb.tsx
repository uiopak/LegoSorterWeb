import { Component, createEffect, createResource, createSignal, Suspense } from 'solid-js';
import { useRouteData } from '@solidjs/router';
import { useConection } from '../contexts/connectionContext';

export default function ConfigWeb() {
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
        <section class="bg-base-300 text-base-800 pl-8 pr-8 pb-8 pt-2">
            <h1 class="text-2xl font-bold m-2">Web server config</h1>
            <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                <div class="card-body">
                    <h2 class="card-title">Server connection data</h2>
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
                        <Suspense fallback={<input type="number" min="1" max="65535" step="1" placeholder="port" class="input input-bordered w-full max-w-xs" />}>
                            <input type="number" min="1" max="65535" step="1" placeholder="port" class="input input-bordered w-full max-w-xs" value={serverGrpcPort()}
                                onChange={(e) => {
                                    var prev = serverGrpcPort()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1 && res <= 65535) {
                                        setServerGrpcPort(parseInt(e.currentTarget.value).toString())
                                    }
                                    else {
                                        e.currentTarget.value = serverGrpcPort()
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = serverGrpcPort()
                                    }
                                }} />
                        </Suspense>
                    </div>

                    <div class="form-control w-full max-w-xs">
                        <label class="label">
                            <span class="label-text">Server API port</span>
                        </label>
                        <Suspense fallback={<input type="number" min="1" max="65535" step="1" placeholder="port" class="input input-bordered w-full max-w-xs" />}>
                            <input type="number" min="1" max="65535" step="1" placeholder="port" class="input input-bordered w-full max-w-xs" value={serverApiPort()}
                                onChange={(e) => {
                                    var prev = serverApiPort()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1 && res <= 65535) {
                                        setServerApiPort(parseInt(e.currentTarget.value).toString())
                                    }
                                    else {
                                        e.currentTarget.value = serverApiPort()
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = serverApiPort()
                                    }
                                }} />
                        </Suspense>
                    </div>

                    <button class="btn" innerText="Save" onClick={() => saveWebConfigs()} />
                </div>
            </div>
        </section>
    );
}
