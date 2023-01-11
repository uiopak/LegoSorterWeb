import { createEffect, createResource, createSignal, onMount, Show, Switch } from 'solid-js';
import { useConection } from '../contexts/connectionContext';
import { QueuesInfoMessageItem } from './types';



export function QueueInfo(props: any) {
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

    const [queuesInfoMessage, setQueuesInfoMessage] = createSignal<QueuesInfoMessageItem>();

    createEffect(() => {
        setQueuesInfoMessage(props.queuesInfoMessage);
    })

    return (
        <div class="" >
            <Show when={queuesInfoMessage() != null}>
                Images:
                <div class="tooltip tooltip-bottom" data-tip="Images in memory for preview">
                    <div class="radial-progress bg-primary text-primary-content border-4 border-primary m-1" style={{ "--value": queuesInfoMessage()!.lastImages_length / parseInt(last_images_limit()) }} >{queuesInfoMessage()!.lastImages_length} / {last_images_limit()}</div>
                </div>
                Storage:
                <div class="tooltip tooltip-bottom" data-tip="Storage queue">
                    <div class="radial-progress bg-primary text-primary-content border-4 border-primary m-1" style={{ "--value": queuesInfoMessage()!.storage_queue_length / parseInt(storage_queue_limit()) }} >{queuesInfoMessage()!.storage_queue_length} / {storage_queue_limit()}</div>
                </div>
                Processing:
                <div class="tooltip tooltip-bottom" data-tip="Processing queue">
                    <div class="radial-progress bg-primary text-primary-content border-4 border-primary m-1" style={{ "--value": queuesInfoMessage()!.processing_length / parseInt(processing_queue_limit()) }} >{queuesInfoMessage()!.processing_length} / {processing_queue_limit()}</div>
                </div>
                Annotation:
                <div class="tooltip tooltip-bottom" data-tip="Annotation queue">
                    <div class="radial-progress bg-primary text-primary-content border-4 border-primary m-1" style={{ "--value": queuesInfoMessage()!.annotation_length / parseInt(annotation_queue_limit()) }} >{queuesInfoMessage()!.annotation_length} / {annotation_queue_limit()}</div>
                </div>
                Sort:
                <div class="tooltip tooltip-bottom" data-tip="Sort queue">
                    <div class="radial-progress bg-primary text-primary-content border-4 border-primary m-1" style={{ "--value": queuesInfoMessage()!.sort_length / parseInt(sort_queue_limit()) }} >{queuesInfoMessage()!.sort_length} / {sort_queue_limit()}</div>
                </div>
                Crops:
                <div class="tooltip tooltip-bottom" data-tip="Crops queue">
                    <div class="radial-progress bg-primary text-primary-content border-4 border-primary m-1" style={{ "--value": queuesInfoMessage()!.crops_length / parseInt(crops_queue_limit()) }} >{queuesInfoMessage()!.crops_length} / {crops_queue_limit()}</div>
                </div>
            </Show>
            <button class="btn" onclick={() => props.refreshQueueInfo()}>Refresh</button>
        </div>
    )
}