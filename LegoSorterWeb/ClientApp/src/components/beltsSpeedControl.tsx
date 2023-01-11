import { onMount } from 'solid-js';
import { useConection } from '../contexts/connectionContext';

export default function BeltsSpeedControl() {
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

    async function sendStartCameraConveyor() {
        await fetch(`http://${address()}:${serverApiPort()}/start_camera_conveyor/`)
    }
    async function sendStopCameraConveyor() {
        await fetch(`http://${address()}:${serverApiPort()}/stop_camera_conveyor/`)
    }

    async function sendStartSplittingConveyor() {
        await fetch(`http://${address()}:${serverApiPort()}/start_splitting_conveyor/`)
    }
    async function sendStopSplittingConveyor() {
        await fetch(`http://${address()}:${serverApiPort()}/stop_splitting_conveyor/`)
    }

    return (
        <div>
            {/*<div class="flex gap-2 flex-wrap w-fit max-w-2xl m-1">*/}
            {/*Machine server control both conveyor*/}
            {/*<div class="flex form-control w-96 max-w-xl">*/}
            {/*    <label class="label">*/}
            {/*        <span class="label-text">Splitting conveyor</span>*/}
            {/*    </label>*/}
            {/*    <div class="gap-2 flex w-full max-w-2xl">*/}
            {/*        <div class="gap-2 w-full max-w-xs">*/}
            {/*            <label class="label">*/}
            {/*                <span class="label-text"></span>*/}
            {/*                <span class="label-text">Active time</span>*/}
            {/*            </label>*/}
            {/*            <input type="number" min="1" max="500" disabled={!serverConfigRecived()} placeholder="Active time" value={splitting_conveyor_active_time()} class="input input-bordered w-full max-w-xs"*/}
            {/*                onChange={*/}
            {/*                    (e) => {*/}
            {/*                        if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= 500)*/}
            {/*                            set_splitting_conveyor_active_time(e.currentTarget.value)*/}
            {/*                        else {*/}
            {/*                            if (e.currentTarget.value != "")*/}
            {/*                                e.currentTarget.value = splitting_conveyor_active_time()*/}
            {/*                            else*/}
            {/*                                set_splitting_conveyor_active_time(e.currentTarget.value)*/}
            {/*                        }*/}

            {/*                    }}*/}
            {/*            />*/}
            {/*            <label class="label">*/}
            {/*                <input type="range" min="1" max="500" disabled={!serverConfigRecived()} value={splitting_conveyor_active_time()} class="range"*/}
            {/*                    onChange={(e) => { set_splitting_conveyor_active_time(e.currentTarget.value) }} />*/}
            {/*            </label>*/}
            {/*        </div>*/}
            {/*        <div class="gap-2 w-full max-w-xs">*/}
            {/*            <label class="label">*/}
            {/*                <span class="label-text"></span>*/}
            {/*                <span class="label-text">Break time</span>*/}
            {/*            </label>*/}
            {/*            <input type="number" min="1" max="500" placeholder="Stop time" disabled={!serverConfigRecived()} value={splitting_conveyor_break_time()} class="input input-bordered w-full max-w-xs"*/}
            {/*                onChange={*/}
            {/*                    (e) => {*/}
            {/*                        if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= 500)*/}
            {/*                            set_splitting_conveyor_break_time(e.currentTarget.value)*/}
            {/*                        else {*/}
            {/*                            if (e.currentTarget.value != "")*/}
            {/*                                e.currentTarget.value = splitting_conveyor_break_time()*/}
            {/*                            else*/}
            {/*                                set_splitting_conveyor_break_time(e.currentTarget.value)*/}
            {/*                        }*/}

            {/*                    }}*/}
            {/*            />*/}
            {/*            <label class="label">*/}
            {/*                <input type="range" min="1" max="500" disabled={!serverConfigRecived()} value={splitting_conveyor_break_time()} class="range"*/}
            {/*                    onChange={(e) => { set_splitting_conveyor_break_time(e.currentTarget.value) }} />*/}
            {/*            </label>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div class="flex gap-2">*/}
            {/*        <button disabled class="btn btn-ghost btn-square">*/}
            {/*            Start*/}
            {/*        </button>*/}
            {/*        <button disabled class="btn btn-ghost btn-square">*/}
            {/*            Stop*/}
            {/*        </button>*/}
            {/*        <button class="btn btn-ghost btn-square" disabled={!serverConfigRecived()} onClick={() => saveServerSplittingConveyorConfigs()}>*/}
            {/*            Save*/}
            {/*        </button>*/}
            {/*    </div>*/}
            {/*</div>*/}

            <div class="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box shrink m-1">
                <input type="checkbox" class="peer" />
                <div class="collapse-title text-xl font-medium">
                    Conveyors control
                </div>
                <div class="collapse-content">
                    <div class="gap-2 flex w-full max-w-2xl">
                        <div class="gap-2 w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Splitting conveyor</span>
                                <span class="label-text">Duty time</span>
                            </label>
                            <input type="number" min="1" max="500" disabled={!serverConfigRecived()} placeholder="Duty time" value={splitting_conveyor_duty_cycle()} class="input input-bordered w-full max-w-xs"
                                onchange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= 500)
                                            set_splitting_conveyor_duty_cycle(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = splitting_conveyor_duty_cycle()
                                            else
                                                set_splitting_conveyor_duty_cycle(e.currentTarget.value)
                                        }

                                    }}
                            />
                            <label class="label">
                                <input type="range" min="1" max="500" disabled={!serverConfigRecived()} value={splitting_conveyor_duty_cycle()} class="range"
                                    onchange={(e) => { set_splitting_conveyor_duty_cycle(e.currentTarget.value) }} />
                            </label>
                        </div>
                        <div class="gap-2 w-full max-w-xs">
                            <label class="label">
                                <span class="label-text">Splitting conveyor</span>
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
                            <label class="label">
                                <input type="range" min="1" max="500" disabled={!serverConfigRecived()} value={splitting_conveyor_frequency()} class="range"
                                    onchange={(e) => { set_splitting_conveyor_frequency(e.currentTarget.value) }} />
                            </label>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-square flex-auto" disabled={!serverConfigRecived()} onClick={() => sendStartSplittingConveyor()}>
                            Start Conveyor
                        </button>
                        <button class="btn btn-square flex-auto" disabled={!serverConfigRecived()} onClick={() => sendStopSplittingConveyor()}>
                            Stop Conveyor
                        </button>
                        <button class="btn btn-square flex-auto" disabled={!serverConfigRecived()} onclick={() => saveServerSplittingConveyorConfigs()}>
                            Save
                        </button>
                    </div>
                    <div class="divider"></div>
                    <div class="gap-2 flex w-fit max-w-3xl">
                        <div class="gap-2 w-48 max-w-xl">
                            <label class="label">
                                <span class="label-text">Camera conveyor</span>
                                <span class="label-text">Duty time</span>
                            </label>
                            <input type="number" min="1" max="500" disabled={!serverConfigRecived()} placeholder="Duty time" value={camera_conveyor_duty_cycle()} class="input input-bordered w-full max-w-xs"
                                onChange={
                                    (e) => {
                                        if (parseInt(e.currentTarget.value) >= 1 && parseInt(e.currentTarget.value) <= 500)
                                            set_camera_conveyor_duty_cycle(e.currentTarget.value)
                                        else {
                                            if (e.currentTarget.value != "")
                                                e.currentTarget.value = camera_conveyor_duty_cycle()
                                            else
                                                set_camera_conveyor_duty_cycle(e.currentTarget.value)
                                        }

                                    }}
                            />
                            <label class="label">
                                <input type="range" min="1" max="500" disabled={!serverConfigRecived()} value={camera_conveyor_duty_cycle()} class="range"
                                    onChange={(e) => { set_camera_conveyor_duty_cycle(e.currentTarget.value) }} />
                            </label>
                        </div>
                        <div class="gap-2 w-48 max-w-xl">
                            <label class="label">
                                <span class="label-text">Camera conveyor</span>
                                <span class="label-text">Frequency</span>
                            </label>
                            <input type="number" min="1" max="500" disabled={!serverConfigRecived()} placeholder="Frequency" value={camera_conveyor_frequency()} class="input input-bordered w-full max-w-xs"
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
                            <label class="label">
                                <input type="range" min="1" max="500" disabled={!serverConfigRecived()} value={camera_conveyor_frequency()} class="range"
                                    onChange={(e) => { set_camera_conveyor_frequency(e.currentTarget.value) }} />
                            </label>
                        </div>
                    </div>
                    <div class="gap-2 flex w-fit max-w-3xl">
                        <div class="gap-2 w-48 max-w-xl">
                            <label class="label">
                                <span class="label-text"></span>
                                <span class="label-text">Active time after 3/4 of conveyor detection</span>
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
                            <label class="label">
                                <input type="range" min="1" max="15000" disabled={!serverConfigRecived()} value={camera_conveyor_active_time()} class="range"
                                    onChange={(e) => { set_camera_conveyor_active_time(e.currentTarget.value) }} />
                            </label>
                        </div>
                        <div class="gap-2 w-48 max-w-xl">
                            <label class="label">
                                <span class="label-text"></span>
                                <span class="label-text"><br />Wait time after active time</span>
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
                            <label class="label">
                                <input type="range" min="0" max="15000" disabled={!serverConfigRecived()} value={camera_conveyor_wait_time()} class="range"
                                    onChange={(e) => { set_camera_conveyor_wait_time(e.currentTarget.value) }} />
                            </label>
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button class="btn btn-square flex-auto" disabled={!serverConfigRecived()} onClick={() => sendStartCameraConveyor()}>
                            Start Conveyor
                        </button>
                        <button class="btn btn-square flex-auto" disabled={!serverConfigRecived()} onClick={() => sendStopCameraConveyor()}>
                            Stop Conveyor
                        </button>
                        <button class="btn btn-square flex-auto" disabled={!serverConfigRecived()} onClick={() => saveServerCameraConveyorConfigs()}>
                            Save
                        </button>
                    </div>
                </div>

                {/*</div>*/}
            </div>
        </div>
    )
}