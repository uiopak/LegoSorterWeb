import { createEffect, createResource, createSignal, onMount, Show, Switch } from 'solid-js';
import { useConection } from '../contexts/connectionContext';
import { MessageItem } from './types';



export function CameraPicWithResults(props: any) {
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
    const [imageId, setImageId] = createSignal("");
    const [selectedMessage, setSelectedMessage] = createSignal<MessageItem>();
    const [messages, setMessages] = createSignal<MessageItem[]>();

    const fetchData = async (message: MessageItem) =>
        await fetch(`http://${address()}:${serverApiPort()}/static/${message.session}/${message.id}.jpg`)


    const [camera_width, set_camera_width] = createSignal(props.camera_width);
    const [camera_heigth, set_camera_heigth] = createSignal(props.camera_heigth);
    const [camera_rotate90, set_camera_rotate90] = createSignal(props.camera_rotate90);
    const [camera_rotate180, set_camera_rotate180] = createSignal(props.camera_rotate180);

    createEffect(() => {
        set_camera_width(props.camera_width)
    })
    createEffect(() => {
        set_camera_heigth(props.camera_heigth)
    })
    createEffect(() => {
        set_camera_rotate90(props.camera_rotate90)
    })
    createEffect(() => {
        set_camera_rotate180(props.camera_rotate180)
    })

    const [data, { mutate, refetch }] = createResource(() => props.selectedMessage, fetchData);//TODO zatrzymaæ ³¹dowanie odrazu
    const [image, setImage] = createSignal("");

    createEffect(() => {
        setSelectedMessage(props.selectedMessage)
    })
    createEffect(() => {
        setMessages(props.propsMessages)
    })

    createEffect(async () => {
        var id = selectedMessage()?.id;
        if (id != undefined && id != imageId() && selectedMessage()?.session != undefined && data.state == "ready") {
            setImageId(id);
            var response = data()
            if (response != undefined && response?.status != 500) {
                const responseBlob = await response.blob()
                if (responseBlob.size > 0) {
                    if (response.status != 404) {
                        setImage(URL.createObjectURL(responseBlob))
                    }
                    else {
                        setImage("")
                    }

                    var cnvs = document.getElementById("myCanvas") as HTMLCanvasElement | null;
                    if (cnvs != null) {
                        var ctx = cnvs.getContext("2d");
                        if (ctx != null) {
                            ctx.clearRect(0, 0, cnvs.width, cnvs.height); // clear canvas
                            if (messages() != undefined) {
                                drawBoxes(messages()!, id)
                            }
                        }
                    }
                }
            }
        }
    })

    async function drawBoxes(messages: MessageItem[], id: string) {
        for (var message of messages) {
            if (message.id == id) {
                drawBox(message.xmin, message.ymin, message.xmax, message.ymax, `${message.label} (${(message.score * 100).toFixed(2)})`)
            }
        }
    }

    async function drawBox(xmin: number, ymin: number, xmax: number, ymax: number, txt: string) {
        var x = xmin;
        var y = ymin;
        var w = xmax - xmin;
        var h = ymax - ymin;
        var cnvs = document.getElementById("myCanvas") as HTMLCanvasElement | null;
        if (cnvs != null) {
            var ctx = cnvs.getContext("2d");
            if (ctx != null) {
                ctx.beginPath();
                ctx.rect(x, y, w, h);
                ctx.lineWidth = 3;
                ctx.strokeStyle = '#00ff00';
                ctx.stroke();
                ctx.font = "48px Segoe UI Semibold";
                var width = ctx.measureText(txt).width;
                var diffMaxWidth = camera_width() - (x + width + 10);
                if (diffMaxWidth < 0) {
                    x += diffMaxWidth;
                }
                var height = parseInt(ctx.font, 10);
                /// color for background
                ctx.fillStyle = '#fff';
                /// draw background rect assuming height of font
                var rectY = ymax;
                var diffMaxHeight = camera_heigth() - (rectY + height);
                if (diffMaxHeight < 0) {
                    rectY += diffMaxHeight;
                }
                ctx.fillRect(x, rectY, width + 10, height);

                /// text color
                ctx.fillStyle = '#000';

                ctx.fillText(txt, x + 5, rectY + height - 5)
            }
        }
    }

    return (
        <div class="" >
            {/*<span>{props.selectedMessageId}</span>*/}
            {/*<span>{props.selectedMessageSession}</span>*/}
            <div class="relative w-[480px] h-[854px]" >
                <Show when={image() != "" || data.state == "ready"} fallback={<><span>Loading...</span></>}>
                    <Show when={image() != ""} fallback={<></>}>
                        {/*<img src={image()} class="w-[480px] h-[854px] max-w-none absolute " />*/}
                        <Show when={camera_rotate90()} fallback={
                            <Show when={camera_rotate180()} fallback={
                                <img src={image()} class="w-[480px] h-[854px] max-w-none absolute" />
                            }>
                                <img src={image()} class="w-[480px] h-[854px] max-w-none rotate-180 absolute" />
                            </Show>
                        }>
                            <img src={image()} class="w-[854px] h-[480px] max-w-none origin-top-left translate-x-[480px] rotate-90 absolute" />
                        </Show>
                    </Show>
                </Show>
                {/*<img src={"http://localhost:5005/static/Session_1/0184d232-9f70-7a3a-84d7-cc81087f8c68.jpg"} class="w-[480px] h-[854px] max-w-none absolute " />*/}
                <canvas id='myCanvas' width={`${camera_width()}px`} height={`${camera_heigth()}px`} class="w-[480px] h-[854px] absolute"></canvas>
            </div>
        </div>
    )
}