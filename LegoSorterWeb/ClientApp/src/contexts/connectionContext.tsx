import { createSignal, createContext, useContext, from, onMount, createEffect } from "solid-js";
import * as signalR from "@microsoft/signalr";
import { Configs, ConfigsConstraints, ConfigServerType } from "../components/types"

// https://www.solidjs.com/guides/typescript#context

export async function http<T>(
    request: RequestInfo
): Promise<T> {
    const response = await fetch(request);
    const body = await response.json();
    return body;
}


export const makeConnectionContext = (connected = false) => {
    const [connection, setConection] = createSignal(connected);
    const connectionControl = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/control')
        .build();
    connectionControl.on("sendPong", () => {
        setConection(true)
        connectionControl.send("getConfigs")
        connectionControl.send("getConfigsConstraints")
        connectionControl.send("getConnectionConfigs")
        connectionControl.send("getState")
        connectionControl.send("getSession")
    });
    connectionControl.on("sendEndPong", () => {
        setConection(false)
    });
    const [capture_mode_preference, setCapture_mode_preference] = createSignal("0");
    const [capture_resolution_value, setCapture_resolution_value] = createSignal("0");
    const [analysis_resolution_value, setAnalysis_resolution_value] = createSignal("0");
    const [exposure_compensation_value, setExposure_compensation_value] = createSignal("0");
    const [manual_settings, setManual_settings] = createSignal(false);
    const [sensor_exposure_time, setSensor_exposure_time] = createSignal("");

    const [sensor_sensitivity, setSensor_sensitivity] = createSignal("");
    const [sorter_conveyor_speed_value, setSorter_conveyor_speed_value] = createSignal(50);
    const [sorter_mode_preference, setSorter_mode_preference] = createSignal("0");
    const [run_conveyor_time_value, setRun_conveyor_time_value] = createSignal("500");
    const [analysis_minimum_delay, set_analysis_minimum_delay] = createSignal("0");
    const [render_belt_speed, set_render_belt_speed] = createSignal("1");
    const [render_belt_opacity, setRender_belt_opacity] = createSignal("75");
    const [render_belt_camera_view, setRender_belt_camera_view] = createSignal(false);

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
        set_analysis_minimum_delay(config2.analysis_minimum_delay)
        set_render_belt_speed(config2.render_belt_speed)
        setRender_belt_opacity(config2.render_belt_opacity)
        setRender_belt_camera_view(config2.render_belt_camera_view)
    })

    const [cameraCompensationRangeMin, setCameraCompensationRangeMin] = createSignal(0);
    const [cameraCompensationRangeMax, setCameraCompensationRangeMax] = createSignal(0);
    const [exposureTimeRangeMin, setExposureTimeRangeMin] = createSignal(0.0);
    const [exposureTimeRangeMax, setExposureTimeRangeMax] = createSignal(0.0);
    const [sensitivityRangeMin, setSensitivityRangeMin] = createSignal(0);
    const [sensitivityRangeMax, setSensitivityRangeMax] = createSignal(0);

    connectionControl.on("sendConfigsConstraints", conf => {
        var configsConstraints2 = conf as ConfigsConstraints
        setCameraCompensationRangeMin(configsConstraints2.cameraCompensationRangeMin)
        setCameraCompensationRangeMax(configsConstraints2.cameraCompensationRangeMax)
        setExposureTimeRangeMin(configsConstraints2.exposureTimeRangeMin)
        setExposureTimeRangeMax(configsConstraints2.exposureTimeRangeMax)
        setSensitivityRangeMin(configsConstraints2.sensitivityRangeMin)
        setSensitivityRangeMax(configsConstraints2.sensitivityRangeMax)
    })

    const [savedAddr, setSavedAddr] = createSignal("");
    const [savedWebAddr, setSavedWebAddr] = createSignal("");
    connectionControl.on("sendConnectionConfigs", (savedAddr: string, savedWebAddr: string) => {
        setSavedAddr(savedAddr)
        setSavedWebAddr(savedWebAddr)
    });
    const [state, setState] = createSignal("startFragment");
    connectionControl.on("returnState", (restState: string) => {
        setState(restState)
    });

    const [saveImgSwitchVal, setSaveImgSwitchVal] = createSignal(false);
    const [savedSession, setSavedSession] = createSignal("Session_1");
    connectionControl.on("sendSession", (saveImgSwitchVal: boolean, savedSession: string) => {
        setSaveImgSwitchVal(saveImgSwitchVal)
        setSavedSession(savedSession)
    })

    connectionControl.start().catch((err: string) => console.log(err));

    console.log("conectionContext");
    const t = setInterval(
        () => {
            if (connectionControl.state == signalR.HubConnectionState.Connected) {
                connectionControl.send("sendPing");
                clearInterval(t);
                console.log("timerend");
            }
        }, 1000);

    const fetchWebConfigOption = async (option: any) =>
        (await fetch(`/api/Configuration/${option}/`)).json();

    function fetchServerAddress(): Promise<any> {
        return fetchWebConfigOption("server_address");
    }

    function fetchServerGrpcPort(): Promise<any> {
        return fetchWebConfigOption("server_grpc_port");
    }

    function fetchServerApiPort(): Promise<any> {
        return fetchWebConfigOption("server_api_port");
    }


    const [serverGrpcPort, setServerGrpcPort] = createSignal("");
    const [serverApiPort, setServerApiPort] = createSignal("");
    const [address, setAddress] = createSignal("");
    const [webConfigRecived, setWebConfigRecived] = createSignal(false);

    async function fetchWebConfigs() {
        setAddress(await fetchServerAddress())
        setServerGrpcPort(await fetchServerGrpcPort())
        setServerApiPort(await fetchServerApiPort())
        setWebConfigRecived(true)
    }

    onMount(async () => {
        await fetchWebConfigs()
    })

    async function saveWebConfigs() {
        await fetch(`/api/Configuration/server_address/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify({ "Option": "server_address", "Value": address() })
        });
        await fetch(`/api/Configuration/server_grpc_port/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify({ "Option": "server_grpc_port", "Value": serverGrpcPort() })
        });
        await fetch(`/api/Configuration/server_api_port/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify({ "Option": "server_api_port", "Value": serverApiPort() })
        });

        await fetchWebConfigs();

        await fetch(`/api/Sorter/?` + new URLSearchParams({
            address: address(),
            port: serverGrpcPort(),
        }), {
            method: "PATCH",
        });
    }

    const [grpcPort1, setGrpcPort1] = createSignal("");//server_grpc_port_1
    const [grpcPort2, setGrpcPort2] = createSignal("");//server_grpc_port_2
    const [apiPort, setApiPort] = createSignal("");//server_fastapi_port
    const [webAddress, setWebAddress] = createSignal("");//web_address
    const [serverFiftyonePort, setServerFiftyonePort] = createSignal("");//server_fiftyone_port
    const [serverFiftyoneAddress, setServerFiftyoneAddress] = createSignal("");//server_fiftyone_address
    const [server_grpc_max_workers_1, set_server_grpc_max_workers_1] = createSignal("");//server_grpc_max_workers_1
    const [server_grpc_max_workers_2, set_server_grpc_max_workers_2] = createSignal("");//server_grpc_max_workers_2
    const [storage_fast_runer_executor_max_workers, set_storage_fast_runer_executor_max_workers] = createSignal("");//storage_fast_runer_executor_max_workers
    const [analyzer_fast_runer_executor_max_workers, set_analyzer_fast_runer_executor_max_workers] = createSignal("");//analyzer_fast_runer_executor_max_workers
    const [annotation_fast_runer_executor_max_workers, set_annotation_fast_runer_executor_max_workers] = createSignal("");//annotation_fast_runer_executor_max_workers
    const [serverConfigRecived, setServerConfigRecived] = createSignal(false);
    const [conveyor_local_address, set_conveyor_local_address] = createSignal("");//conveyor_local_address
    const [sorter_local_address, set_sorter_local_address] = createSignal("");//sorter_local_address
    const [camera_conveyor_duty_cycle, set_camera_conveyor_duty_cycle] = createSignal("");//camera_conveyor_duty_cycle
    const [camera_conveyor_frequency, set_camera_conveyor_frequency] = createSignal("");//camera_conveyor_frequency
    const [camera_conveyor_active_time, set_camera_conveyor_active_time] = createSignal("");//camera_conveyor_active_time
    const [camera_conveyor_wait_time, set_camera_conveyor_wait_time] = createSignal("");//camera_conveyor_wait_time
    const [splitting_conveyor_duty_cycle, set_splitting_conveyor_duty_cycle] = createSignal("");//splitting_conveyor_duty_cycle
    const [splitting_conveyor_frequency, set_splitting_conveyor_frequency] = createSignal("");//splitting_conveyor_frequency
    const [sort, set_sort] = createSignal("");//sort
    const [crop, set_crop] = createSignal("");//crop
    const [storage_queue_limit, set_storage_queue_limit] = createSignal("");//storage_queue_limit
    const [processing_queue_limit, set_processing_queue_limit] = createSignal("");//processing_queue_limit
    const [sort_queue_limit, set_sort_queue_limit] = createSignal("");//sort_queue_limit
    const [annotation_queue_limit, set_annotation_queue_limit] = createSignal("");//annotation_queue_limit
    const [crops_queue_limit, set_crops_queue_limit] = createSignal("");//crops_queue_limit
    const [last_images_limit, set_last_images_limit] = createSignal("");//last_images_limit
    const [lego_sorter_classifier, set_lego_sorter_classifier] = createSignal("");//lego_sorter_classifier
    const [lego_sorter_detector, set_lego_sorter_detector] = createSignal("");//lego_sorter_detector
    const [store_img_override, set_store_img_override] = createSignal("");//store_img_override
    const [store_img_session, set_store_img_session] = createSignal("");//store_img_session
    const [yolov5_model_path, set_yolov5_model_path] = createSignal("");//yolov5_model_path
    const [keras_model_path, set_keras_model_path] = createSignal("");//keras_model_path
    const [tinyvit_model_path, set_tinyvit_model_path] = createSignal("");//tinyvit_model_path

    function procesServerConfigs(conf: ConfigServerType[]) {
        for (var config of conf) {
            switch (config.option) {
                case "server_grpc_port_1":
                    setGrpcPort1(config.value)
                    break;
                case "server_grpc_port_2":
                    setGrpcPort2(config.value)
                    break;
                case "server_fastapi_port":
                    setApiPort(config.value)
                    break;
                case "server_fiftyone_port":
                    setServerFiftyonePort(config.value)
                    break;
                case "server_fiftyone_address":
                    setServerFiftyoneAddress(config.value)
                    break;
                case "web_address":
                    setWebAddress(config.value)
                    break;
                case "server_grpc_max_workers_1":
                    set_server_grpc_max_workers_1(config.value)
                    break;
                case "server_grpc_max_workers_2":
                    set_server_grpc_max_workers_2(config.value)
                    break;
                case "storage_fast_runer_executor_max_workers":
                    set_storage_fast_runer_executor_max_workers(config.value)
                    break;
                case "analyzer_fast_runer_executor_max_workers":
                    set_analyzer_fast_runer_executor_max_workers(config.value)
                    break;
                case "annotation_fast_runer_executor_max_workers":
                    set_annotation_fast_runer_executor_max_workers(config.value)
                    break;
                case "conveyor_local_address":
                    set_conveyor_local_address(config.value)
                    break;
                case "sorter_local_address":
                    set_sorter_local_address(config.value)
                    break;
                case "camera_conveyor_duty_cycle":
                    set_camera_conveyor_duty_cycle(config.value)
                    break;
                case "camera_conveyor_frequency":
                    set_camera_conveyor_frequency(config.value)
                    break;
                case "camera_conveyor_active_time":
                    set_camera_conveyor_active_time(config.value)
                    break;
                case "camera_conveyor_wait_time":
                    set_camera_conveyor_wait_time(config.value)
                    break;
                case "splitting_conveyor_duty_cycle":
                    set_splitting_conveyor_duty_cycle(config.value)
                    break;
                case "splitting_conveyor_frequency":
                    set_splitting_conveyor_frequency(config.value)
                    break;
                case "sort":
                    set_sort(config.value)
                    break;
                case "crop":
                    set_crop(config.value)
                    break;
                case "storage_queue_limit":
                    set_storage_queue_limit(config.value)
                    break;
                case "processing_queue_limit":
                    set_processing_queue_limit(config.value)
                    break;
                case "sort_queue_limit":
                    set_sort_queue_limit(config.value)
                    break;
                case "annotation_queue_limit":
                    set_annotation_queue_limit(config.value)
                    break;
                case "crops_queue_limit":
                    set_crops_queue_limit(config.value)
                    break;
                case "last_images_limit":
                    set_last_images_limit(config.value)
                    break;
                case "lego_sorter_classifier":
                    set_lego_sorter_classifier(config.value)
                    break;
                case "lego_sorter_detector":
                    set_lego_sorter_detector(config.value)
                    break;
                case "store_img_override":
                    set_store_img_override(config.value)
                    break;
                case "store_img_session":
                    set_store_img_session(config.value)
                    break;
                case "yolov5_model_path":
                    set_yolov5_model_path(config.value)
                    break;
                case "keras_model_path":
                    set_keras_model_path(config.value)
                    break;
                case "tinyvit_model_path":
                    set_tinyvit_model_path(config.value)
                    break;
            }
        }
    }

    async function fetchServerConfigs(request = `http://${address()}:${serverApiPort()}/configurations/`) {
        var conf = await http<ConfigServerType[]>(request)
        procesServerConfigs(conf)
        setServerConfigRecived(true)
    }

    createEffect(async () => {
        if (address() != "" && serverApiPort() != "")
            await fetchServerConfigs(`http://${address()}:${serverApiPort()}/configurations/`)
    })

    async function saveServerConfig(option: string, value: string) {
        return await fetch(`http://${address()}:${serverApiPort()}/configurations/`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify({ "option": option, "value": value })
        });
    }

    async function saveServerConfigs() {
        await saveServerConfig("server_grpc_port_1", grpcPort1());
        await saveServerConfig("server_grpc_port_2", grpcPort2());
        await saveServerConfig("server_fastapi_port", apiPort());
        await saveServerConfig("server_fiftyone_port", serverFiftyonePort());
        await saveServerConfig("server_fiftyone_address", serverFiftyoneAddress());
        await saveServerConfig("web_address", webAddress());
        await saveServerConfig("server_grpc_max_workers_1", server_grpc_max_workers_1());
        await saveServerConfig("server_grpc_max_workers_2", server_grpc_max_workers_2());
        await saveServerConfig("storage_fast_runer_executor_max_workers", storage_fast_runer_executor_max_workers());
        await saveServerConfig("analyzer_fast_runer_executor_max_workers", analyzer_fast_runer_executor_max_workers());
        await saveServerConfig("annotation_fast_runer_executor_max_workers", annotation_fast_runer_executor_max_workers());
        await saveServerConfig("conveyor_local_address", conveyor_local_address());
        await saveServerConfig("sorter_local_address", sorter_local_address());
        await saveServerConfig("camera_conveyor_duty_cycle", camera_conveyor_duty_cycle());
        await saveServerConfig("camera_conveyor_frequency", camera_conveyor_frequency());
        await saveServerConfig("splitting_conveyor_duty_cycle", splitting_conveyor_duty_cycle());
        await saveServerConfig("splitting_conveyor_frequency", splitting_conveyor_frequency());
        await saveServerConfig("camera_conveyor_active_time", camera_conveyor_active_time());
        await saveServerConfig("camera_conveyor_wait_time", camera_conveyor_wait_time());
        await saveServerConfig("sort", sort());
        await saveServerConfig("crop", crop());
        await saveServerConfig("processing_queue_limit", processing_queue_limit());
        await saveServerConfig("annotation_queue_limit", annotation_queue_limit());
        await saveServerConfig("storage_queue_limit", storage_queue_limit());
        await saveServerConfig("crops_queue_limit", crops_queue_limit());
        await saveServerConfig("last_images_limit", last_images_limit());
        await saveServerConfig("sort_queue_limit", sort_queue_limit());
        await saveServerConfig("lego_sorter_classifier", lego_sorter_classifier());
        await saveServerConfig("lego_sorter_detector", lego_sorter_detector());
        await saveServerConfig("store_img_override", store_img_override());
        await saveServerConfig("store_img_session", store_img_session());
        await saveServerConfig("yolov5_model_path", yolov5_model_path());
        await saveServerConfig("keras_model_path", keras_model_path());
        await saveServerConfig("tinyvit_model_path", tinyvit_model_path());

        await fetchServerConfigs();
    }

    async function saveServerCameraConveyorConfigs() {
        await saveServerConfig("camera_conveyor_duty_cycle", camera_conveyor_duty_cycle());
        await saveServerConfig("camera_conveyor_frequency", camera_conveyor_frequency());
        await fetchServerConfigs();
    }

    async function saveServerCameraConveyorTimes() {
        await saveServerConfig("camera_conveyor_active_time", camera_conveyor_active_time());
        await saveServerConfig("camera_conveyor_wait_time", camera_conveyor_wait_time());
        await fetchServerConfigs();
    }

    async function saveSort() {
        await saveServerConfig("sort", sort());
        await fetchServerConfigs();
    }

    async function saveCrop() {
        await saveServerConfig("crop", crop());
        await fetchServerConfigs();
    }

    async function save_store_img_override() {
        await saveServerConfig("store_img_override", store_img_override());
        await fetchServerConfigs();
    }

    async function save_store_img_session() {
        await saveServerConfig("store_img_session", store_img_session());
        await fetchServerConfigs();
    }


    async function saveServerSplittingConveyorConfigs() {
        await saveServerConfig("splitting_conveyor_frequency", splitting_conveyor_frequency());
        await saveServerConfig("splitting_conveyor_duty_cycle", splitting_conveyor_duty_cycle());
        await fetchServerConfigs();
    }

    return [
        connection,
        connectionControl,
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
        {
            conected() {
                setConection(true)
            },
            disconected() {
                setConection(false)
            }
        }] as const;
    // `as const` forces tuple type inference
};
export type ConnectionContextType = ReturnType<typeof makeConnectionContext>;
export const ConectionContext = createContext<ConnectionContextType>(); // makeConnectionContext(false) is required here or it will have | undefined
export const useConection = () => useContext(ConectionContext)!; // '!' asserts that the context is always provided (so no | undefined), 
// because I use ConectionProvider definied below it will be true

export function ConectionProvider(props: any) {
    return (
        <ConectionContext.Provider value={makeConnectionContext(props.conection || false)}>
            {props.children}
        </ConectionContext.Provider>
    );
}
