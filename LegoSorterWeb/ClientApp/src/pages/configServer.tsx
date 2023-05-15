import { Component, createEffect, createResource, createSignal, Suspense } from 'solid-js';
import { useRouteData } from '@solidjs/router';
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
        <section class="bg-base-300 text-base-800 pl-8 pr-8 pb-8 pt-2">
            <div class="flex flex-wrap ml-2 mr-2 mb-1.5">
                <h1 class="text-2xl font-bold">Lego sorter server config</h1>
                <div class="alert alert-info shadow-lg max-w-md w-auto p-1 ml-2">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Require server restart (Restart button in Server control)</span>
                    </div>
                </div>
                <div class="alert alert-warning shadow-lg max-w-xs w-auto p-1 ml-2">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        <span>Require manual server restart</span>
                    </div>
                </div>
            </div>
            <div class="columns-xs">
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Queue limits</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">processing_queue_limit</span>
                            </label>
                            <input type="number" min="2" disabled={!serverConfigRecived()} placeholder="processing_queue_limit" value={camera_conveyor_active_time()} class="input input-warning input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 2)
                                            set_processing_queue_limit(parseInt(e.currentTarget.value).toString())
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = processing_queue_limit()
                                            else
                                                set_processing_queue_limit(parseInt(e.currentTarget.value).toString())
                                        }

                                    }}
                            />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">annotation_queue_limit</span>
                            </label>
                            <input type="number" min="2" disabled={!serverConfigRecived()} placeholder="annotation_queue_limit" value={annotation_queue_limit()} class="input input-warning input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 2)
                                            set_annotation_queue_limit(parseInt(e.currentTarget.value).toString())
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = annotation_queue_limit()
                                            else
                                                set_annotation_queue_limit(parseInt(e.currentTarget.value).toString())
                                        }

                                    }}
                            />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">storage_queue_limit</span>
                            </label>
                            <input type="number" min="2" disabled={!serverConfigRecived()} placeholder="storage_queue_limit" value={storage_queue_limit()} class="input input-warning input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 2)
                                            set_storage_queue_limit(parseInt(e.currentTarget.value).toString())
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = storage_queue_limit()
                                            else
                                                set_storage_queue_limit(parseInt(e.currentTarget.value).toString())
                                        }

                                    }}
                            />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">crops_queue_limit</span>
                            </label>
                            <input type="number" min="2" disabled={!serverConfigRecived()} placeholder="crops_queue_limit" value={crops_queue_limit()} class="input input-warning input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 2)
                                            set_crops_queue_limit(parseInt(e.currentTarget.value).toString())
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = crops_queue_limit()
                                            else
                                                set_crops_queue_limit(parseInt(e.currentTarget.value).toString())
                                        }

                                    }}
                            />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">last_images_limit</span>
                            </label>
                            <input type="number" min="2" disabled={!serverConfigRecived()} placeholder="last_images_limit" value={last_images_limit()} class="input input-warning input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 2)
                                            set_last_images_limit(parseInt(e.currentTarget.value).toString())
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = last_images_limit()
                                            else
                                                set_last_images_limit(parseInt(e.currentTarget.value).toString())
                                        }

                                    }}
                            />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">sort_queue_limit</span>
                            </label>
                            <input type="number" min="2" disabled={!serverConfigRecived()} placeholder="sort_queue_limit" value={sort_queue_limit()} class="input input-warning input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 2)
                                            set_sort_queue_limit(parseInt(e.currentTarget.value).toString())
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = sort_queue_limit()
                                            else
                                                set_sort_queue_limit(parseInt(e.currentTarget.value).toString())
                                        }

                                    }}
                            />
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Server settings</h2>
                        <div class="form-control  w-full max-w-xs">
                            <label class="label cursor-pointer pt-0">
                                <span class="label-text">Save crop of incoming images</span>
                                <input type="checkbox" class="toggle" disabled={!serverConfigRecived()} checked={crop() == "true"} onChange={(e) => set_crop((e.currentTarget.checked).toString())} />
                            </label>
                        </div>

                        <div class="form-control  w-full max-w-xs">
                            <label class="label cursor-pointer pt-0">
                                <span class="label-text">Sort lego</span>
                                <input type="checkbox" class="toggle" disabled={!serverConfigRecived()} checked={sort() == "true"} onChange={(e) => set_sort((e.currentTarget.checked).toString())} />
                            </label>
                        </div>

                        <div class="form-control  w-full max-w-xs">
                            <label class="label cursor-pointer pt-0">
                                <span class="label-text">Override image session</span>
                                <input type="checkbox" class="toggle" disabled={!serverConfigRecived()} checked={store_img_override() == "true"} onChange={(e) => set_store_img_override((e.currentTarget.checked).toString())} />
                            </label>
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">Session name when override</span>
                            </label>
                            <input type="text" placeholder="Session name (Empty - won't save)" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={store_img_session()}
                                onChange={(e) => { set_store_img_session(e.currentTarget.value) }} />
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Models settings</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">lego_sorter_classifier:</span>
                            </label>
                            <select class="select select-bordered select-warning w-full max-w-xs" disabled={!serverConfigRecived()} onChange={(e) => set_lego_sorter_classifier((e.currentTarget.selectedIndex - 1).toString())}>
                                <option disabled selected>lego_sorter_classifier</option>
                                <option selected={lego_sorter_classifier() == "0"}>Keras Model</option>
                                <option selected={lego_sorter_classifier() == "1"}>TinyVit Model</option>
                            </select>
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">Keras model path</span>
                            </label>
                            <input type="text" placeholder="Keras model path (Empty - default)" disabled={!serverConfigRecived()} class="input input-bordered input-warning w-full max-w-xs" value={keras_model_path()}
                                onChange={(e) => { set_keras_model_path(e.currentTarget.value) }} />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">TinyVit model path</span>
                            </label>
                            <input type="text" placeholder="TinyVit model path (Empty - default)" disabled={!serverConfigRecived()} class="input input-bordered input-warning w-full max-w-xs" value={tinyvit_model_path()}
                                onChange={(e) => { set_tinyvit_model_path(e.currentTarget.value) }} />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">lego_sorter_detector{lego_sorter_detector()}</span>
                            </label>
                            <select class="select select-bordered select-warning w-full max-w-xs" disabled={!serverConfigRecived()} onChange={(e) => set_lego_sorter_detector((e.currentTarget.selectedIndex - 1).toString())}>
                                <option disabled selected>lego_sorter_detector</option>
                                <option selected={lego_sorter_detector() == "0"}>YOLOv5 normal</option>
                                <option disabled selected={lego_sorter_detector() == "1"}>YOLOv5 run in DeepSparse</option>
                                <option disabled selected={lego_sorter_detector() == "2"}>YOLOv5 Google Coral Edge TPU classify 3 parts of scaled image</option>
                                <option disabled selected={lego_sorter_detector() == "3"}>YOLOv5 run in Onnx</option>
                                <option disabled selected={lego_sorter_detector() == "4"}>YOLOv5 Google Coral Edge TPU classify 3 parts of scaled and cropped image</option>
                            </select>
                            <div class="form-control w-full max-w-xs">
                                <label class="label">
                                    <span class="label-text">YOLOv5 model path</span>
                                </label>
                                <input type="text" placeholder="YOLOv5 model path (Empty - won't save)" disabled={!serverConfigRecived()} class="input input-bordered input-warning w-full max-w-xs" value={yolov5_model_path()}
                                    onChange={(e) => { set_yolov5_model_path(e.currentTarget.value) }} />
                            </div>
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Conveyor settings</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">Splitting and Camera conveyor Server</span>
                            </label>
                            <input type="text" placeholder="http://ip:port" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={conveyor_local_address()}
                                onChange={(e) => { set_conveyor_local_address(e.currentTarget.value) }} />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">Sorter conveyor Server</span>
                            </label>
                            <input type="text" placeholder="http://ip:port" disabled={!serverConfigRecived()} class="input input-bordered w-full max-w-xs" value={sorter_local_address()}
                                onChange={(e) => { set_sorter_local_address(e.currentTarget.value) }} />
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Camera conveyor settings</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">camera_conveyor_duty_cycle</span>
                                <span class="label-text">Duty time</span>
                            </label>
                            <input type="number" min="1" max="100" disabled={!serverConfigRecived()} placeholder="Camera conveyor Duty time" value={camera_conveyor_duty_cycle()} class="input input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= 100)
                                            set_camera_conveyor_duty_cycle(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = camera_conveyor_duty_cycle()
                                            else
                                                set_camera_conveyor_duty_cycle(e.currentTarget.value)
                                        }

                                    }}
                            />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">camera_conveyor_frequency</span>
                                <span class="label-text">Frequency</span>
                            </label>
                            <input type="number" min="1" max="500" disabled={!serverConfigRecived()} placeholder="Camera conveyor Frequency" value={camera_conveyor_frequency()} class="input input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= 500)
                                            set_camera_conveyor_frequency(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = camera_conveyor_frequency()
                                            else
                                                set_camera_conveyor_frequency(e.currentTarget.value)
                                        }

                                    }}
                            />
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Sorting conveyor settings</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">camera_conveyor_active_time</span>
                                <span class="label-text">[ms]</span>
                            </label>
                            <input type="number" min="1" max="15000" disabled={!serverConfigRecived()} placeholder="Active time" value={camera_conveyor_active_time()} class="input input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= 15000)
                                            set_camera_conveyor_active_time(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = camera_conveyor_active_time()
                                            else
                                                set_camera_conveyor_active_time(e.currentTarget.value)
                                        }

                                    }}
                            />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">camera_conveyor_wait_time</span>
                                <span class="label-text">[ms]</span>
                            </label>
                            <input type="number" min="0" max="15000" disabled={!serverConfigRecived()} placeholder="Wait time" value={camera_conveyor_wait_time()} class="input input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 0 && parseInt(e.currentTarget.value) <= 15000)
                                            set_camera_conveyor_wait_time(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = camera_conveyor_wait_time()
                                            else
                                                set_camera_conveyor_wait_time(e.currentTarget.value)
                                        }

                                    }}
                            />
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Splitting conveyor settings</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">splitting_conveyor_duty_cycle</span>
                                <span class="label-text">Duty time</span>
                            </label>
                            <input type="number" min="1" max="100" disabled={!serverConfigRecived()} placeholder="Duty time" value={splitting_conveyor_duty_cycle()} class="input input-bordered w-full max-w-xs"
                                onchange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= 100)
                                            set_splitting_conveyor_duty_cycle(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = splitting_conveyor_duty_cycle()
                                            else
                                                set_splitting_conveyor_duty_cycle(e.currentTarget.value)
                                        }

                                    }}
                            />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">splitting_conveyor_frequency</span>
                                <span class="label-text">Frequency</span>
                            </label>
                            <input type="number" min="1" max="500" placeholder="Frequency" disabled={!serverConfigRecived()} value={splitting_conveyor_frequency()} class="input input-bordered w-full max-w-xs"
                                onchange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= 500)
                                            set_splitting_conveyor_frequency(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = splitting_conveyor_frequency()
                                            else
                                                set_splitting_conveyor_frequency(e.currentTarget.value)
                                        }

                                    }}
                            />
                        </div>
                    </div>
                </div>

                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Max workers threads</h2>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">GRPC server1 thread max workers</span>
                            </label>
                            <input type="number" min="1" step="1" placeholder="grpc_max_workers_1" disabled={!serverConfigRecived()} class="input input-info input-bordered w-full max-w-xs" value={server_grpc_max_workers_1()}
                                onChange={(e) => {
                                    var prev = server_grpc_max_workers_1()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1) {
                                        set_server_grpc_max_workers_1(parseInt(e.currentTarget.value).toString())
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = server_grpc_max_workers_1()
                                    }
                                }} />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">GRPC server2 thread max workers</span>
                            </label>
                            <input type="number" min="1" step="1" placeholder="grpc_max_workers_2" disabled={!serverConfigRecived()} class="input input-info input-bordered w-full max-w-xs" value={server_grpc_max_workers_2()}
                                onChange={(e) => {
                                    var prev = server_grpc_max_workers_2()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1) {
                                        set_server_grpc_max_workers_2(parseInt(e.currentTarget.value).toString())
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = server_grpc_max_workers_2()
                                    }
                                }} />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">storageFastRunerExecutor max workers</span>
                            </label>
                            <input type="number" min="1" step="1" placeholder="storage_max_workers" disabled={!serverConfigRecived()} class="input input-info input-bordered w-full max-w-xs" value={storage_fast_runer_executor_max_workers()}
                                onChange={(e) => {
                                    var prev = storage_fast_runer_executor_max_workers()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1) {
                                        set_storage_fast_runer_executor_max_workers(parseInt(e.currentTarget.value).toString())
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = storage_fast_runer_executor_max_workers()
                                    }
                                }} />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">analyzerFastRunerExecutor max(2) workers</span>
                            </label>
                            <input type="number" min="1" max="2" step="1" placeholder="analyzer_max_workers" disabled={!serverConfigRecived()} class="input input-info input-bordered w-full max-w-xs" value={analyzer_fast_runer_executor_max_workers()}
                                onChange={(e) => {
                                    var prev = analyzer_fast_runer_executor_max_workers()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1 && res <= 2) {
                                        set_analyzer_fast_runer_executor_max_workers(parseInt(e.currentTarget.value).toString())
                                    }
                                    else {
                                        e.currentTarget.value = analyzer_fast_runer_executor_max_workers()
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = analyzer_fast_runer_executor_max_workers()
                                    }
                                }} />
                        </div>

                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">annotationFastRunerExecutor max workers</span>
                            </label>
                            <input type="number" min="1" step="1" placeholder="annotation_max_workers" disabled={!serverConfigRecived()} class="input input-info input-bordered w-full max-w-xs" value={annotation_fast_runer_executor_max_workers()}
                                onChange={(e) => {
                                    var prev = annotation_fast_runer_executor_max_workers()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1) {
                                        set_annotation_fast_runer_executor_max_workers(parseInt(e.currentTarget.value).toString())
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = annotation_fast_runer_executor_max_workers()
                                    }
                                }} />
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Fiftyone config</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">Server Fiftyone port</span>
                            </label>
                            <input type="number" min="1" max="65535" step="1" placeholder="Fiftyone port (5151)" disabled={!serverConfigRecived()} class="input input-bordered input-warning w-full max-w-xs" value={serverFiftyonePort()}
                                onChange={(e) => {
                                    var prev = serverFiftyonePort()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1 && res <= 65535) {
                                        setServerFiftyonePort(parseInt(e.currentTarget.value).toString())
                                    }
                                    else {
                                        e.currentTarget.value = serverFiftyonePort()
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = serverFiftyonePort()
                                    }
                                }} />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">Server Fiftyone address</span>
                            </label>
                            <input type="text" placeholder="0.0.0.0" disabled={!serverConfigRecived()} class="input input-bordered input-warning w-full max-w-xs" value={serverFiftyoneAddress()}
                                onChange={(e) => { setServerFiftyoneAddress(e.currentTarget.value) }} />
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <h2 class="card-title">Server connection data</h2>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">Server GRPC Port1</span>
                            </label>
                            <input type="number" min="1" max="65535" step="1" placeholder="GRPC Port1" disabled={!serverConfigRecived()} class="input input-info input-bordered w-full max-w-xs" value={grpcPort1()}
                                onChange={(e) => {
                                    var prev = grpcPort1()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1 && res <= 65535) {
                                        setGrpcPort1(parseInt(e.currentTarget.value).toString())
                                    }
                                    else {
                                        e.currentTarget.value = grpcPort1()
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = grpcPort1()
                                    }
                                }} />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">Server GRPC Port2</span>
                            </label>
                            <input type="number" min="1" max="65535" step="1" placeholder="GRPC Port2" disabled={!serverConfigRecived()} class="input input-info input-bordered w-full max-w-xs" value={grpcPort2()}
                                onChange={(e) => {
                                    var prev = grpcPort2()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1 && res <= 65535) {
                                        setGrpcPort2(parseInt(e.currentTarget.value).toString())
                                    }
                                    else {
                                        e.currentTarget.value = grpcPort2()
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = grpcPort2()
                                    }
                                }} />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">Server API port</span>
                            </label>
                            <input type="number" min="1" max="65535" step="1" placeholder="API port" disabled={!serverConfigRecived()} class="input input-warning input-bordered w-full max-w-xs" value={apiPort()}
                                onChange={(e) => {
                                    var prev = apiPort()
                                    var res = parseInt(e.currentTarget.value)
                                    if (res >= 1 && res <= 65535) {
                                        setApiPort(parseInt(e.currentTarget.value).toString())
                                    }
                                    else {
                                        e.currentTarget.value = apiPort()
                                    }
                                    // need to manualy update if parseInt is same, but user typed float, becouse value doesn't change so solidjs doen't update value
                                    if (res.toString() == prev) {
                                        e.currentTarget.value = apiPort()
                                    }
                                }} />
                        </div>
                        <div class="form-control w-full max-w-xs">
                            <label class="label pt-0">
                                <span class="label-text">This website server address</span>
                            </label>
                            <input type="text" placeholder="http://ip:port" disabled={!serverConfigRecived()} class="input input-info input-bordered w-full max-w-xs" value={webAddress()}
                                onChange={(e) => { setWebAddress(e.currentTarget.value) }} />
                        </div>
                    </div>
                </div>
                <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl ml-4 mr-4 mb-4 break-inside-avoid-column">
                    <div class="card-body">
                        <div class="card-body !p-0">
                            <div class="form-control w-full max-w-xs">
                                <div class="flex flex-row">
                                    <div class="basis-full justify-items-center grid ">
                                        <button class="btn w-30" disabled={!serverConfigRecived()} innerText="Save config" onClick={() => saveServerConfigs()} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="divider m-0"></div>
                        <div class="card-body !p-0">
                            <h2 class="card-title">Server control</h2>
                            <div class="form-control w-full max-w-xs">
                                <div class="flex flex-row">
                                    <div class="basis-1/3 justify-items-center grid ">
                                        <button class="btn" disabled={!serverConfigRecived()} innerText="Start" onClick={() => startServer()} />
                                    </div>
                                    <div class="basis-1/3 justify-items-center grid ">
                                        <button class="btn" disabled={!serverConfigRecived()} innerText="Stop" onClick={() => stopServer()} />
                                    </div>
                                    <div class="basis-1/3 justify-items-center grid ">
                                        <button class="btn" disabled={!serverConfigRecived()} innerText="Restart" onClick={() => restartServer()} />
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
