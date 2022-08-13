import { createSignal, createContext, useContext, from } from "solid-js";
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
};

export type ConfigsConstraints = {
    cameraCompensationRangeMin: number,
    cameraCompensationRangeMax: number,
    exposureTimeRangeMin: number,
    exposureTimeRangeMax: number,
    sensitivityRangeMin: number,
    sensitivityRangeMax: number,
};

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
