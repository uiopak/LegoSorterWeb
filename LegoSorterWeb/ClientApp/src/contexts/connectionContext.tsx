import { createSignal, createContext, useContext, from, onMount, createEffect } from "solid-js";
import * as signalR from "@microsoft/signalr";

// https://www.solidjs.com/guides/typescript#context

export type Configs = {
    capture_mode_preference: string,
    capture_resolution_value: string,
    analysis_resolution_value: string,
    exposure_compensation_value: string,
    manual_settings: boolean,
    sensor_exposure_time: string,
    sensor_sensitivity: string,
    sorter_conveyor_speed_value: number,
    sorter_mode_preference: string,
    run_conveyor_time_value: string,
    analysis_minimum_delay: string,
    render_belt_speed: string,
    render_belt_opacity: string,
    render_belt_camera_view: boolean
};

export type ConfigsConstraints = {
    cameraCompensationRangeMin: number,
    cameraCompensationRangeMax: number,
    exposureTimeRangeMin: number,
    exposureTimeRangeMax: number,
    sensitivityRangeMin: number,
    sensitivityRangeMax: number,
};

export interface ConfigServerType {
    option: string,
    value: string,
};

export async function http<T>(
    request: RequestInfo
): Promise<T> {
    const response = await fetch(request);
    const body = await response.json();
    return body;
}


export const makeConnectionContext = (connected = false) => {
    const [conection, setConection] = createSignal(connected);
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
    //const [connectedInterval, setConnectedInterval] = signal
    console.log("conectionContext");
    const t = setInterval(
        () => {
            if (connectionControl.state == signalR.HubConnectionState.Connected) {
                connectionControl.send("sendPing");
                clearInterval(t);
                console.log("timerend");
            }
        }, 1000);
    //const clock = from((set) => {
    //    const t = setInterval(() => set(1), 1000);
    //    return () => clearInterval(t);
    //});
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
        await fetch(`/api/Configuration/server_port/`, {
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
    const [storageFastRunerExecutor_max_workers, set_storageFastRunerExecutor_max_workers] = createSignal("");//storageFastRunerExecutor_max_workers
    const [analyzerFastRunerExecutor_max_workers, set_analyzerFastRunerExecutor_max_workers] = createSignal("");//analyzerFastRunerExecutor_max_workers
    const [annotationFastRunerExecutor_max_workers, set_annotationFastRunerExecutor_max_workers] = createSignal("");//annotationFastRunerExecutor_max_wor
    const [serverConfigRecived, setServerConfigRecived] = createSignal(false);

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
                case "storageFastRunerExecutor_max_workers":
                    set_storageFastRunerExecutor_max_workers(config.value)
                    break;
                case "analyzerFastRunerExecutor_max_workers":
                    set_analyzerFastRunerExecutor_max_workers(config.value)
                    break;
                case "annotationFastRunerExecutor_max_workers":
                    set_annotationFastRunerExecutor_max_workers(config.value)
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
        await saveServerConfig("storageFastRunerExecutor_max_workers", storageFastRunerExecutor_max_workers());
        await saveServerConfig("analyzerFastRunerExecutor_max_workers", analyzerFastRunerExecutor_max_workers());
        await saveServerConfig("annotationFastRunerExecutor_max_workers", annotationFastRunerExecutor_max_workers());

        await fetchServerConfigs();
    }

    return [
        conection,
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
        { storageFastRunerExecutor_max_workers, set_storageFastRunerExecutor_max_workers },
        { analyzerFastRunerExecutor_max_workers, set_analyzerFastRunerExecutor_max_workers },
        { annotationFastRunerExecutor_max_workers, set_annotationFastRunerExecutor_max_workers },
        { serverConfigRecived, setServerConfigRecived },
        { fetchServerConfigs, saveServerConfigs },
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
