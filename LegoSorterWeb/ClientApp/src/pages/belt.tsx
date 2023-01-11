import { batch, createEffect, createResource, createSignal, For, Match, onCleanup, Show, Switch } from 'solid-js';
import { createStore } from "solid-js/store";
import type { StoreNode, Store, SetStoreFunction } from "solid-js/store";

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries';
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader';
import GUI from 'lil-gui';

import * as signalR from "@microsoft/signalr";

import map_ldraw_raw from '../assets/map_ldraw.json?raw';

import { mergeProps } from "solid-js";

import "./camera.css"
import { Configs, LegoModelItem, LegoItemMessage, MessageItem } from "../components/types"
import { useConection } from '../contexts/connectionContext';



export default function Belt(props: any) {
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

    const defaultProps = mergeProps({ gui: true, default_speed: "1", default_opacity: "100", camera_view: false }, props);

    if (defaultProps.default_speed != "") {
        var localSpeed = defaultProps.default_speed as string
    }
    else {
        var localSpeed = localStorage.getItem("speed") || "1.0"
    }

    const [speed, setSpeed] = createSignal(parseFloat(localSpeed));
    createEffect(() => localStorage.setItem("speed", JSON.stringify(speed())))

    const localDisplayLines = localStorage.getItem("displayLines") || "true";
    const [displayLines, setDisplayLines] = createSignal(JSON.parse(localDisplayLines));
    createEffect(() => localStorage.setItem("displayLines", JSON.stringify(displayLines())))

    const localConditionalLines = localStorage.getItem("conditionalLines") || "true";
    const [conditionalLines, setConditionalLines] = createSignal(JSON.parse(localConditionalLines));
    createEffect(() => localStorage.setItem("conditionalLines", JSON.stringify(conditionalLines())))

    const local_camera_preview_time = localStorage.getItem("camera_preview_time") || "500";
    const [camera_preview_time, setCamera_preview_time] = createSignal(parseInt(local_camera_preview_time));
    createEffect(() => localStorage.setItem("camera_preview_time", JSON.stringify(camera_preview_time())))

    const [image, setImage] = createSignal("");

    const [displaySwitch, setDisplaySwitch] = createSignal("nav");
    const [navigationSwitch, setNavigationSwitch] = createSignal("nav");

    const map_ldraw = JSON.parse(map_ldraw_raw);
    const fetchData = async () =>
        await fetch(`/api/Sorter/`);

    async function getPrev() {
        refetch();
        var response = data()
        if (response != undefined) {
            const responseBlob = await response.blob()
            if (responseBlob.size > 0)
                setImage(URL.createObjectURL(responseBlob))
        }
    }

    const [startStopTimerPreviewText, setStartStopTimerPreviewText] = createSignal("Start timer");
    var timerInterval: any = undefined

    function startStopTimerPreview() {
        if (timerInterval == undefined) {
            timerInterval = setInterval(() => { getPrev() }, camera_preview_time());
            setStartStopTimerPreviewText("Stop timer")
        }
        else {
            setStartStopTimerPreviewText("Start timer")
            clearInterval(timerInterval)
            timerInterval = undefined
        }
    }



    const [data, { mutate, refetch }] = createResource(fetchData);

    function testTest() {
        createLego({ partNo: "3001", z: 2, x: -17, y: 0 });
        createLego({ partNo: "3002", z: -2, x: -16, y: 0 });
        createLego({ partNo: "3003", z: 0, x: -18, y: 0 });
    }

    function sendAction(action: string) {
        connectionControl.send("action", action)
    }

    function startStopAnalyze() {
        sendAction("analyzeFast")
    }

    function startStopNormalAnalyze() {
        sendAction("analyze")
    }

    function startStopSort() {
        sendAction("sort")
    }

    function startStopSortMachine() {
        sendAction("sortMachine")
    }

    function sendNavigation(navigation: string) {
        connectionControl.send("navigation", navigation)
    }

    function navigateFastAnalyze() {
        sendNavigation("analyzeFast")
        setNavigationSwitch("analyzeFast")
        connectionControl.send("getSession")
    }
    function navigateAnalyze() {
        sendNavigation("analyze")
        setNavigationSwitch("analyze")
    }
    function navigateSort() {
        sendNavigation("sort")
        setNavigationSwitch("sort")
    }
    function navigateBack() {
        sendNavigation("back")
        if (navigationSwitch() != "nav") {
            setNavigationSwitch("nav")
        }
    }

    const connectionSorter = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/sorter')
        .build();

    //camera config start
    const frequency = () => {
        if (sensor_exposure_time() != "") {
            var val = parseFloat(sensor_exposure_time())
            return val != 0 ? (1000 / val).toString() : "NaN"
        }
        else {
            return "NaN"
        }
    }
    
    function getConfig() {
        connectionControl.send("getConfigs")
    }
    function getConfigsConstraints() {
        connectionControl.send("getConfigsConstraints")
    }
    function getConfigAndConstraints() {
        getConfig()
        getConfigsConstraints()
    }
    function getSession() {
        connectionControl.send("getSession")
    }
    
    function setConfig() {
        var conf: Configs = {
            capture_mode_preference: capture_mode_preference(),
            capture_resolution_value: capture_resolution_value(),
            analysis_resolution_value: analysis_resolution_value(),
            exposure_compensation_value: exposure_compensation_value(),
            manual_settings: manual_settings(),
            sensor_exposure_time: sensor_exposure_time(),
            sensor_sensitivity: sensor_sensitivity(),
            sorter_conveyor_speed_value: sorter_conveyor_speed_value(),
            sorter_mode_preference: sorter_mode_preference(),
            run_conveyor_time_value: run_conveyor_time_value(),
            analysis_minimum_delay: analysis_minimum_delay(),
            render_belt_speed: render_belt_speed(),
            render_belt_opacity: render_belt_opacity(),
            render_belt_camera_view: render_belt_camera_view()
        }
        connectionControl.send("setConfigs", conf)
    }

    function setSession() {
        connectionControl.send("setSession", saveImgSwitchVal(), savedSession())
    }

    //camera config end


    onCleanup(() => {
        console.log("cleanup");
        connectionSorter.stop().catch((err: string) => console.log(err))
    });

    function clearMessages() {
        setMessages([])
    }
    function clearLegoModels() {
        for (var modelItem of legoModels) {
            scene.remove(modelItem.model);
            modelItem.model.remove();
        }
        setLegoModels([]);
    }

    const [legoModels, setLegoModels] = createStore<LegoModelItem[]>([]);

    const [messages, setMessages] = createStore<MessageItem[]>([]);


    connectionSorter.on("messageReceived", (new_messages) => {
        console.log("messageReceived")
        clearLegoModels();
        for (var message of new_messages) {
            if (messages.length > 36) {
                var mes = messages.slice(-36)
                setMessages(mes!);
            }
            setMessages(messages.length, {
                ymin: message.ymin,
                xmin: message.xmin,
                ymax: message.ymax,
                xmax: message.xmax,
                label: message.label,
                score: message.score
            });
            let x, z;
            [x, z] = min_max2x_z(message.ymin, message.xmin, message.ymax, message.xmax);
            createLego({ partNo: message.label, z: z, x: x, y: 0 });
        }
    });


    function min_max2x_z(ymin: number, xmin: number, ymax: number, xmax: number) {
        if (!defaultProps.camera_view) {
            let x, z;
            let median_x = (xmin + xmax) / 2;
            let median_y = (ymin + ymax) / 2;
            //TODO values from config, plus camera angle, position and belt width in px

            z = - 10 * (median_x / 1080) + 5 // 10 - width; median_x/1080 - proportion of width; +5 belt edge offest; values reversed - +, becouse view is mirror
            x = 40 * (median_y / 1920) - 20 // 40 - length; median_y/1920 - proportion of length; -20 belt edge offest;

            return [x, z]
        }
        else {
            let x, z;
            let median_x = (xmin + xmax) / 2;
            let median_y = (ymin + ymax) / 2;
            //TODO values from config, plus camera angle, position and belt width in px

            z = - 10 * (median_x / 1080) + 5 // 10 - width; median_x/1080 - proportion of width; +5 belt edge offest; values reversed - +, becouse view is mirror
            x = 17.78 * (median_y / 1920) // 17.78 - length; median_y/1920 - proportion of length;

            return [x, z]
        }
    }

    connectionSorter.start().catch((err: string) => console.log(err));

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    if (defaultProps.gui) {
        var camera = new THREE.PerspectiveCamera(40, 480 / 854, 0.1, 1000);

        renderer.setSize(480, 854);
    }
    else {
        if (!defaultProps.camera_view) {
            var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        }
        else {
            var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
        }


        renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', () => {
            camera.aspect = (window.innerWidth / window.innerHeight);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    const controls = new OrbitControls(camera, renderer.domElement);
    onCleanup(() => controls.dispose());

    if (!defaultProps.camera_view) {
        camera.position.set(22, 24, 0);
    }
    else {
        camera.position.set(8.89, 26.4, 0);
        camera.rotation.z = 0.11;
        camera.rotation.x = 0.11;
        camera.rotation.y = 0.11;
        controls.target.set(8.889999, 0, 0)

        controls.update()
        const geometry = new THREE.PlaneGeometry(17.78, 10);
        geometry.rotateX(-Math.PI * 0.5);
        const material = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide });
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);
        plane.position.set(8.89, 2.01, 0)
    }

    onCleanup(() => renderer.dispose());

    renderer.render(scene, camera);

    // Lego

    // Instantiate a loader
    const loader = new LDrawLoader();
    (loader as any).setPartsLibraryPath("/");

    function changeOpacity(className: string) {
        var elems = document.querySelectorAll(className);
        var index = 0, length = elems.length;
        for (; index < length; index++) {
            (elems[index] as HTMLElement).style.backgroundColor = "transparent";
        }
    }

    if (defaultProps.default_opacity != "100") {
        changeOpacity(':root, [data-theme]')
        console.log(defaultProps.default_opacity)
    }

    function createLego(legoMessage: LegoItemMessage) {
        loader.smoothNormals = true;
        loader.load(
            // resource URL
            `/parts/parts/${map_ldraw[legoMessage.partNo]}.dat`,

            // called when the resource is loaded
            function (group) {

                group.rotateX(Math.PI);
                group.scale.set(0.025, 0.025, 0.025);

                const bbox = new THREE.Box3().setFromObject(group);

                const low = bbox.min;

                group.position.y -= low.y;
                group.position.y += 2;
                group.position.x = legoMessage.x;
                group.position.z = legoMessage.z;
                scene.add(group);

                setLegoModels(legoModels.length,
                    { model: group, refMes: legoMessage }
                );
            },
            // called while loading is progressing
            function (xhr) {

            },
            // called when loading has errors
            function (error) {

                console.log('LDrawLoader an error happened');

            }
        );

    }

    // Belt
    const path = new THREE.Path();
    path.absarc(20, 0, 2, Math.PI * 0.5, Math.PI * 1.5, true);
    path.absarc(-20, 0, 2, Math.PI * 1.5, Math.PI * 0.5, true);
    path.closePath();

    const basePts = path.getSpacedPoints(200).reverse();

    const g = new THREE.PlaneGeometry(1, 1, 200, 1);
    basePts.forEach((p, idx) => {
        g.attributes.position.setXYZ(idx, p.x, p.y, -5);
        g.attributes.position.setXYZ(idx + 201, p.x, p.y, 5);
    })
    onCleanup(() => g.dispose());
    const m = new THREE.MeshStandardMaterial();
    onCleanup(() => m.dispose());
    m.side = THREE.DoubleSide;
    m.map = createTexture();

    const band = new THREE.Mesh(g, m);
    if (!defaultProps.camera_view) {
        scene.add(band);
    }

    function createTexture() {
        let c: HTMLCanvasElement = document.createElement("canvas");
        c.width = c.height = 256;
        let ctx = c.getContext("2d");
        if (ctx != null) {
            ctx.fillStyle = "maroon";
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.strokeStyle = "white";
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineWidth = 128;
            ctx.lineTo(c.width, c.height);
            ctx.stroke();
        }

        let texture = new THREE.CanvasTexture(c);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.MirroredRepeatWrapping;
        texture.repeat.set(10, 2);
        texture.flipY = true;
        onCleanup(() => texture.dispose());
        return texture;
    }


    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(0, 10, -15);
    scene.add(pointLight);
    const lightHelper = new THREE.PointLightHelper(pointLight)
    scene.add(lightHelper)
    onCleanup(() => pointLight.dispose());
    onCleanup(() => lightHelper.dispose());

    const pointLight2 = new THREE.PointLight(0xffffff, 0.8);
    pointLight2.position.set(0, 10, 15);
    scene.add(pointLight2);
    const lightHelper2 = new THREE.PointLightHelper(pointLight2)
    scene.add(lightHelper2)
    onCleanup(() => pointLight2.dispose());
    onCleanup(() => lightHelper2.dispose());

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);
    onCleanup(() => ambientLight.dispose());

    // Helpers


    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper)

    createEffect(() => {
        for (var modelItem of legoModels) {
            var model = modelItem.model;
            model.traverse(c => {
                if ((c as THREE.LineSegments).isLineSegments) {
                    if ((c as any).isConditionalLine) {
                        c.visible = conditionalLines();
                    } else {
                        c.visible = displayLines();
                    }
                }
            });
        }
    })

    // Animation Loop
    let clock = new THREE.Clock();

    let last = clock.getElapsedTime()
    function animate() {
        requestAnimationFrame(animate);

        let off = clock.getElapsedTime()

        for (var modelItem of legoModels) {
            var lego = modelItem.model;
            if (lego != undefined) {
                lego.position.x += ((off - last) * (path.getLength() / 10)) * speed();
                if (lego.position.x > 17) {
                    lego.position.x = modelItem.refMes.x;
                }
                //TODO remove lego if to far
            }
        }

        controls.update();
        if (m.map != null && !defaultProps.camera_view)
            m.map.offset.x += (off - last) * speed()

        last = off;

        renderer.render(scene, camera);
    }

    animate();

    return (
        <>
            <Show
                when={defaultProps.gui}
                fallback={
                    <div style={{ opacity: parseFloat(defaultProps.default_opacity) / 100 }}>
                        {renderer.domElement}
                    </div>
                }
            >
                <div class="flex flex-wrap">
                    <section class="bg-base-300 text-base-800 shrink">
                        <div class="flex flex-wrap  p-4 shrink ">
                            <label class="label cursor-pointer gap-3" >
                                <input type="radio" name="radio-0" class="radio" checked value="nav" onChange={(e) => setDisplaySwitch(e.currentTarget.value)} />
                                <span class="label-text">Navigation</span>
                            </label>
                            <label class="label cursor-pointer gap-3">
                                <input type="radio" name="radio-0" class="radio" value="rend-prev" onChange={(e) => setDisplaySwitch(e.currentTarget.value)} />
                                <span class="label-text">Clasification<br />Render</span>
                            </label>
                            <label class="label cursor-pointer gap-3">
                                <input type="radio" name="radio-0" class="radio" value="cam-prev" onChange={(e) => {
                                    setDisplaySwitch(e.currentTarget.value)
                                    getPrev()
                                }} />
                                <span class="label-text">Camera<br />Preview</span>
                            </label>
                            <label class="label cursor-pointer gap-3">
                                <input type="radio" name="radio-0" class="radio" value="cam-set" onChange={(e) => {
                                    setDisplaySwitch(e.currentTarget.value)
                                    getConfigAndConstraints()
                                }} />
                                <span class="label-text">Camera<br />Settings</span>
                            </label>
                            <label class="label cursor-pointer gap-3">
                                <input type="radio" name="radio-0" class="radio" value="rend-set" onChange={(e) => setDisplaySwitch(e.currentTarget.value)} />
                                <span class="label-text">Render<br />Settings</span>
                            </label>
                        </div>
                        <Switch>
                            <Match when={displaySwitch() == "rend-prev"}>
                                <section class="bg-base-300 text-base-800 p-4">
                                    <div class="mockup-phone">
                                        <div class="camera"></div>
                                        <div class="display">
                                            {renderer.domElement}
                                        </div>
                                    </div>
                                </section>
                            </Match>
                            <Match when={displaySwitch() == "cam-prev"}>
                                <section class="bg-base-300 text-base-800 p-4">
                                    <div class="mockup-phone">
                                        <div class="camera"></div>
                                        <div class="display  w-[480px] h-[854px]">
                                            <div class="relative w-[480px] h-[854px]  ">
                                                <Show when={image() != ""} fallback={
                                                    <div class="artboard artboard-demo gap-4 h-[854px]">
                                                        <div>
                                                            No preview
                                                        </div>
                                                        <Show when={!connection()}>
                                                            Connect using button on navbar
                                                        </Show>
                                                        <button class="btn w-48" disabled={!connection()} innerText="Get preview" onClick={() => getPrev()} />
                                                    </div>
                                                }>
                                                    {/*<img src={image()} class="w-[854px] h-[480px] max-w-none origin-top-left translate-x-[480px] rotate-90 " />*/}{/*If image require 90 rotation*/}
                                                    <img src={image()} class="w-[480px] h-[854px] max-w-none" />
                                                    <button class="absolute top-4 left-4 btn w-24" innerText="Refresh preview" onClick={() => getPrev()} />
                                                    <button class="absolute top-4 right-4 btn w-24" innerText={startStopTimerPreviewText()} onClick={() => startStopTimerPreview()} />
                                                </Show>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </Match>
                            <Match when={displaySwitch() == "nav"}>
                                <section class="bg-base-300 text-base-800 p-4">
                                    <div class="mockup-phone">
                                        <div class="camera"></div>
                                        <div class="display w-[480px] h-[854px]">
                                            <div class="artboard artboard-demo gap-4 h-[854px]">
                                                <Show when={!connection()}>
                                                    Connect using button on navbar
                                                </Show>
                                                <Switch fallback={
                                                    <>
                                                        <button class="btn w-48" disabled={!connection()} onClick={() => navigateAnalyze()}>Analyze</button>
                                                        <button class="btn w-48" disabled={!connection()} onClick={() => navigateSort()}>Sort</button>
                                                        <button class="btn w-48" disabled={!connection()} onClick={() => navigateFastAnalyze()}>Fast Analyze</button>
                                                        <button class="btn w-48" disabled={!connection()} onClick={() => navigateBack()}>Back</button>
                                                    </>
                                                }>

                                                    <Match when={state() == "analyzeFragment" || state() == "analyzeFragmentAnalysisStarted"}>
                                                        <Show when={state() == "analyzeFragmentAnalysisStarted"} fallback={
                                                            <button class="btn w-48" disabled={!connection()} innerText="Start Analyze" onClick={() => startStopNormalAnalyze()} />
                                                        }>
                                                            <button class="btn w-48" disabled={!connection()} innerText="Stop Analyze" onClick={() => startStopNormalAnalyze()} />
                                                        </Show>
                                                        <button class="btn w-48" disabled={!connection()} onClick={() => navigateBack()}>Back</button>
                                                    </Match>
                                                    <Match when={state() == "sortFragmentOn" || state() == "sortFragmentOff" || state() == "sortFragmentSortingStartedOn" || state() == "sortFragmentSortingStartedOff"}>
                                                        <div class="card card-compact w-96 bg-base-200 h-max max-w-xs shadow-xl">
                                                            <div class="card-body">
                                                                <div class="flex flex-row">
                                                                    <div class="basis-1/2 justify-items-center grid ">
                                                                        <Show when={state() == "sortFragmentSortingStartedOn" || state() == "sortFragmentSortingStartedOff"} fallback={
                                                                            <button class="btn w-24" disabled={!connection()} innerText="Start Sorting" onClick={() => startStopSort()} />
                                                                        }>
                                                                            <button class="btn w-24" disabled={!connection()} innerText="Stop Sorting" onClick={() => startStopSort()} />
                                                                        </Show>
                                                                    </div>
                                                                    <div class="basis-1/2 justify-items-center grid ">
                                                                        <Show when={state() == "sortFragmentOn" || state() == "sortFragmentSortingStartedOn"} fallback={
                                                                            <button class="btn w-24" disabled={!connection()} innerText="Start Machine" onClick={() => startStopSortMachine()} />
                                                                        }>
                                                                            <button class="btn w-24" disabled={!connection()} innerText="Stop Machine" onClick={() => startStopSortMachine()} />
                                                                        </Show>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button class="btn w-48" disabled={!connection()} onClick={() => navigateBack()}>Back</button>
                                                    </Match>
                                                    <Match when={state() == "analyzeFastFragment" || state() == "analyzeFastFragmentAnalysisStarted"}>
                                                        <div class="card card-compact w-96 bg-base-200 h-max max-w-xs shadow-xl">
                                                            <div class="card-body">
                                                                <div class="form-control  w-full max-w-xs">
                                                                    <label class="label cursor-pointer">
                                                                        <span class="label-text">Store images on server</span>
                                                                        <input type="checkbox" class="toggle" disabled={!connection()} checked={saveImgSwitchVal()}
                                                                            onChange={(e) => setSaveImgSwitchVal(e.currentTarget.checked)}
                                                                        />
                                                                    </label>
                                                                </div>
                                                                <div class="form-control w-full max-w-xs">
                                                                    <label class="label">
                                                                        <span class="label-text">Session name</span>
                                                                    </label>
                                                                    <input type="text" placeholder="Not set (disabled storage)" class="input input-bordered w-full max-w-xs" value={savedSession()} disabled={!saveImgSwitchVal() || !connection()}
                                                                        onChange={(e) => { setSavedSession(e.currentTarget.value) }} />
                                                                </div>
                                                                <div class="flex flex-row">
                                                                    <div class="basis-1/2 justify-items-center grid ">
                                                                        <button class="btn w-24" innerText="Refresh" disabled={!connection()} onClick={() => getSession()} />
                                                                    </div>
                                                                    <div class="basis-1/2 justify-items-center grid ">
                                                                        <button class="btn w-24" innerText="Save" disabled={!connection()} onClick={() => setSession()} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Show when={state() == "analyzeFastFragmentAnalysisStarted"} fallback={
                                                            <button class="btn w-48" disabled={!connection()} innerText="Start Analyze" onClick={() => startStopAnalyze()} />
                                                        }>
                                                            <button class="btn w-48" disabled={!connection()} innerText="Stop Analyze" onClick={() => startStopAnalyze()} />
                                                        </Show>
                                                        <button class="btn w-48" disabled={!connection()} onClick={() => navigateBack()}>Back</button>
                                                    </Match>
                                                </Switch>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </Match>
                            <Match when={displaySwitch() == "cam-set"}>
                                <section class="bg-base-300 text-base-800 p-4">
                                    <div class="mockup-phone">
                                        <div class="camera"></div>
                                        <div class="display w-[480px] h-[854px]">
                                            <div class="artboard artboard-demo gap-4 h-[854px]">
                                                <Show when={!connection()}>
                                                    Connect using button on navbar
                                                </Show>
                                                <button class="btn  w-48" innerText="Get Config" disabled={!connection()} onClick={() => getConfigAndConstraints()} />
                                                <div class="card card-compact w-96 bg-base-200 h-max max-w-xs shadow-xl">
                                                    <div class="card-body">
                                                        <div class="form-control  w-full max-w-xs">
                                                            <label class="label cursor-pointer">
                                                                <span class="label-text">Custom exposure settings</span>
                                                                <input type="checkbox" class="toggle" disabled={!connection()} checked={manual_settings()} onChange={(e) => setManual_settings(e.currentTarget.checked)} />
                                                            </label>
                                                        </div>

                                                        <div class="form-control w-full max-w-xs">
                                                            <label class="label">
                                                                <span class="label-text">Sensor exposure time (ms)</span>
                                                                <span class="label-text-alt">{frequency()} Hz</span>
                                                            </label>
                                                            <input type="number" step="0.000001" min={exposureTimeRangeMin()} max={exposureTimeRangeMax()} placeholder="Not set" class="input input-bordered w-full max-w-xs" value={sensor_exposure_time()} disabled={!manual_settings() || !connection()}
                                                                onChange={
                                                                    (e) => {
                                                                        if (parseFloat(e.currentTarget.value) >= exposureTimeRangeMin() && parseFloat(e.currentTarget.value) <= exposureTimeRangeMax())
                                                                            setSensor_exposure_time(e.currentTarget.value)
                                                                        else {
                                                                            if (e.currentTarget.value != "")
                                                                                e.currentTarget.value = sensor_exposure_time()
                                                                            else
                                                                                setSensor_exposure_time(e.currentTarget.value)
                                                                        }

                                                                    }} />
                                                            <label class="label">
                                                                <span class="label-text-alt">Min {exposureTimeRangeMin()} ms</span>
                                                                <span class="label-text-alt">Max {exposureTimeRangeMax()} ms</span>
                                                            </label>
                                                        </div>

                                                        <div class="form-control w-full max-w-xs">
                                                            <label class="label">
                                                                <span class="label-text">Sensor sensitivity</span>
                                                                <span class="label-text-alt">ISO</span>
                                                            </label>
                                                            <input type="number" step="1" min={sensitivityRangeMin()} max={sensitivityRangeMax()} placeholder="Not set" class="input input-bordered w-full max-w-xs" value={sensor_sensitivity()} disabled={!manual_settings() || !connection()}
                                                                onChange={
                                                                    (e) => {
                                                                        if (parseInt(e.currentTarget.value) >= sensitivityRangeMin() && parseInt(e.currentTarget.value) <= sensitivityRangeMax())
                                                                            setSensor_sensitivity(e.currentTarget.value)
                                                                        else {
                                                                            if (e.currentTarget.value != "")
                                                                                e.currentTarget.value = sensor_sensitivity()
                                                                            else
                                                                                setSensor_sensitivity(e.currentTarget.value)
                                                                        }

                                                                    }} />
                                                            <label class="label">
                                                                <span class="label-text-alt">Min {sensitivityRangeMin()}</span>
                                                                <span class="label-text-alt">Max {sensitivityRangeMax()}</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button class="btn w-48" disabled={!connection()} innerText="Save Config" onClick={() => setConfig()} />
                                                <div class="card card-compact w-96 bg-base-200 h-max max-w-xs shadow-xl">
                                                    <div class="card-body">
                                                        <div class="form-control w-full max-w-xs">
                                                            <label class="label">
                                                                <span class="label-text">Preview update rate</span>
                                                                <span class="label-text-alt">ms</span>
                                                            </label>
                                                            <input type="number" step="1" min="1" placeholder="Not set" class="input input-bordered w-full max-w-xs" value={camera_preview_time()}
                                                                onChange={
                                                                    (e) => {
                                                                        if (parseInt(e.currentTarget.value) >= 1)
                                                                            setCamera_preview_time(parseInt(e.currentTarget.value))
                                                                        else {
                                                                            if (e.currentTarget.value != "")
                                                                                e.currentTarget.value = camera_preview_time().toString()
                                                                            else
                                                                                setCamera_preview_time(500)
                                                                        }

                                                                    }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </Match>
                            <Match when={displaySwitch() == "rend-set"}>
                                <section class="bg-base-300 text-base-800 p-4">
                                    <div class="mockup-phone">
                                        <div class="camera"></div>
                                        <div class="display w-[480px] h-[854px]">
                                            <div class="artboard artboard-demo gap-4 h-[854px] bg-base-100">
                                                <div class="card card-compact w-96 bg-base-200 h-max max-w-xs shadow-xl">
                                                    <div class="card-body">
                                                        <div class="form-control  w-full max-w-xs">
                                                            <label class="label cursor-pointer">
                                                                <span class="label-text">Conditional Lines</span>
                                                                <input type="checkbox" class="toggle" checked={conditionalLines()} onChange={(e) => setConditionalLines(e.currentTarget.checked)} />
                                                            </label>
                                                        </div>
                                                        <div class="form-control w-full max-w-xs">
                                                            <label class="label cursor-pointer">
                                                                <span class="label-text">Display Lines</span>
                                                                <input type="checkbox" class="toggle" checked={displayLines()} onChange={(e) => setDisplayLines(e.currentTarget.checked)} />
                                                            </label>
                                                        </div>
                                                        <div class="form-control w-full max-w-xs">
                                                            <label class="label">
                                                                <span class="label-text">Speed:</span>
                                                                <span class="label-text-alt">{speed}</span>
                                                            </label>
                                                            <input type="range" min="0" max="10" step="0.1" value={speed()} class="range" onInput={(e) => setSpeed(parseFloat(e.currentTarget.value))} onChange={(e) => setSpeed(parseFloat(e.currentTarget.value))} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </Match>
                        </Switch>

                    </section>
                    <section class="overflow-auto bg-base-300 text-base-800 p-4 h-[1008px] min-w-[520px]">

                        <button class="btn" innerText="Clear Messages" onClick={() => clearMessages()} />
                        <button class="btn" innerText="Clear Lego" onClick={() => clearLegoModels()} />
                        <button class="btn" innerText="Test Add Lego" onClick={() => testTest()} />
                        <h1 class="text-2xl font-bold">Belt log:</h1>
                        <For each={messages}>
                            {(mes, i) => (
                                <div>Label: {mes.label} Score:{mes.score} ymin:{mes.ymin} xmin:{mes.xmin} ymax:{mes.ymax} xmax:{mes.xmax}</div>
                            )}
                        </For>
                    </section>
                </div>
            </Show>
        </>
    );
}




