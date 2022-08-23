import { Outlet } from "solid-app-router";
import { Show, Switch } from "solid-js";
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
        { storageFastRunerExecutor_max_workers, set_storageFastRunerExecutor_max_workers },
        { analyzerFastRunerExecutor_max_workers, set_analyzerFastRunerExecutor_max_workers },
        { annotationFastRunerExecutor_max_workers, set_annotationFastRunerExecutor_max_workers },
        { serverConfigRecived, setServerConfigRecived },
        { fetchServerConfigs, saveServerConfigs },
        { conected, disconected }] = useConection();
    return (
        <>
            <div class="navbar bg-base-200 gap-1">
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/">
                        Home
                    </a>
                </div>
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/belt">
                        Belt
                    </a>
                </div>
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/control">
                        App Conf
                    </a>
                </div>
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/config">
                        Web Conf
                    </a>
                </div>
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/configServer">
                        Server Conf
                    </a>
                </div>
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/sessions">
                        Sessions
                    </a>
                </div>
                <div class="flex-1">
                    <a class="btn btn-ghost normal-case text-xl" href="/about">
                        About
                    </a>
                </div>
                {/*<div class="flex-1">*/}
                {/*    <a class="btn btn-ghost normal-case text-xl" href="/error">*/}
                {/*        Error*/}
                {/*    </a>*/}
                {/*</div>*/}
                <div class="gap-1">
                    <div class="tooltip tooltip-bottom flex-none" data-tip="Check conection state">
                        <button class="btn btn-ghost  bg-base-100 normal-case text-xl" onClick={() => {
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
                <Outlet/>
            </main>
        </>
    );
}
