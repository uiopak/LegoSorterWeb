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
                    <a class="btn btn-ghost normal-case text-xl" href="/config">
                        Config
                    </a>
                </div>
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/control">
                        Control
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
                    <div class="flex-none">
                        <span> </span>
                    </div>
                    <div class="flex-none">
                        <div class="form-control" >
                            <label class="input-group">
                                <span>URL:</span>
                                <input type="text" readOnly class="input w-24" value={location.pathname} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <main class="bg-base-300">
                <Outlet/>
            </main>
        </>
    );
}
