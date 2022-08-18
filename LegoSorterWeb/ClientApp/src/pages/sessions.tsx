import { Component, createEffect, createResource, createSignal, For, onMount, Show, Suspense, Switch } from 'solid-js';
import { useRouteData } from 'solid-app-router';
import { useConection, http } from '../contexts/connectionContext';
import { createStore } from 'solid-js/store';


interface Session { name: string, started: boolean };

export interface SessionDB {
    name: string,
    path: string,
    id: number
};

export default function Sessions() {
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

    const [sessions, setSessions] = createStore<Session[]>([])
    const [lock, setLock] = createSignal(true)

    function procesSessionsFO(rez: string[]) {
        for (var session of rez) {
            var sess = sessions.findIndex(el => el.name == session)
            if (sess >= 0)
                setSessions(sess, { name: session, started: true } as Session)
        }
        setLock(false);
    }

    async function getSessionsFO() {
        var request = `http://${address()}:${serverApiPort()}/sessions_fo/`
        var rez = await http<string[]>(request);
        procesSessionsFO(rez);
    }

    function procesSessionsDB(rez: SessionDB[]) {
        var newSessions: Session[] = []
        for (var session of rez) {
            newSessions.push({ name: session.name, started: false } as Session)
        }
        setSessions(newSessions)
        getSessionsFO()
    }

    async function getSessionsDB() {
        var request = `http://${address()}:${serverApiPort()}/sessions/`
        var rez = await http<SessionDB[]>(request);
        procesSessionsDB(rez);
    }


    onMount(async () => {
        if (address() != "" && serverApiPort() != "") {
            await getSessionsDB();
        }
        else {
            createEffect(async () => {
                if (address() != "" && serverApiPort() != "") {
                    await getSessionsDB();
                }
            })
        }
    })



    async function refresh() {
        setLock(true);
        getSessionsDB();
    }

    async function startSession(session: Session) {
        var request = `http://${address()}:${serverApiPort()}/start_session/${session.name}`
        var rez = await http<boolean>(request);
        var sess = sessions.findIndex(el => el.name == session.name)
        if (sess >= 0) {
            if (rez) {
                setSessions(sess, { name: session.name, started: true } as Session)
            }
            else {
                setSessions(sess, { name: session.name, started: false } as Session)
            }
        }

    }
    async function stopSession(session: Session) {
        var request = `http://${address()}:${serverApiPort()}/stop_session/${session.name}`
        var rez = await http<boolean>(request);
        var sess = sessions.findIndex(el => el.name == session.name)
        if (sess >= 0) {
            if (rez) {
                setSessions(sess, { name: session.name, started: false } as Session)
            }
            else {
                setSessions(sess, { name: session.name, started: true } as Session)
            }
        }
    }
    async function refreshSession(session: Session) {
        var request = `http://${address()}:${serverApiPort()}/ref_session/${session.name}`
        var rez = await http<boolean>(request);
        var sess = sessions.findIndex(el => el.name == session.name)
        if (sess >= 0) {
            if (rez) {
                setSessions(sess, { name: session.name, started: true } as Session)
            }
            else {
                setSessions(sess, { name: session.name, started: false } as Session)
            }
        }
    }

    return (
        <section class="bg-base-300 text-base-800 p-4 ">
            <button class="btn m-4" innerText="Refresh" onClick={() => refresh()} />
            <Show when={!lock()} fallback={
                <button class="btn w-24  m-4" disabled={true} innerText="Open" />
            }>
                <a href={`http://${address()}:${serverFiftyonePort()}/`} class="btn w-24 m-4">Open</a>
            </Show>
            <h1 class="text-2xl font-bold">Saved sessions:</h1>
            <For each={sessions}>
                {(session, i) => (
                    <div class="card card-compact w-96 bg-base-100 h-max max-w-xs shadow-xl m-4">
                        <div class="card-body">
                            <h2 class="card-title">{session.name}</h2>
                            <div class="form-control w-full max-w-xs">

                                <div class="flex flex-row">
                                    <div class="basis-1/2 justify-items-center grid ">
                                        <Show when={session.started} fallback={
                                            <button class="btn w-24" innerText="Start" disabled={lock()} onClick={() => startSession(session)} />
                                        }>
                                            <button class="btn w-24" innerText="Stop" disabled={lock()} onClick={() => stopSession(session)} />
                                        </Show>
                                    </div>
                                    <div class="basis-1/2 justify-items-center grid ">
                                        <button class="btn w-24" innerText="Refresh" disabled={lock()} onClick={() => refreshSession(session)} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </For>
        </section>
    );
}
