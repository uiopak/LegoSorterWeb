import { batch, createEffect, createResource, createSignal, For, Match, onCleanup, Show, Switch } from 'solid-js';
import { createStore } from "solid-js/store";
import BeltsSpeedControl from "../components/beltsSpeedControl";
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
import { Configs, LegoModelItem, LegoItemMessage, MessageItem, SortItem, QueuesInfoMessageItem } from "../components/types"
import { useConection } from '../contexts/connectionContext';
import { CameraPicWithResults } from '../components/cameraPicWithResults';
import { QueueInfo } from '../components/queueInfo';



export default function ControlApp(props: any) {
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

    const local_camera_width = localStorage.getItem("camera_width") || "1080";
    const [camera_width, set_camera_width] = createSignal(parseInt(local_camera_width));
    createEffect(() => localStorage.setItem("camera_width", JSON.stringify(camera_width())))

    const local_camera_heigth = localStorage.getItem("camera_heigth") || "1920";
    const [camera_heigth, set_camera_heigth] = createSignal(parseInt(local_camera_heigth));
    createEffect(() => localStorage.setItem("camera_heigth", JSON.stringify(camera_heigth())))

    const local_camera_custom = localStorage.getItem("camera_custom") || "false";
    const [camera_custom, set_camera_custom] = createSignal(JSON.parse(local_camera_custom));
    createEffect(() => localStorage.setItem("camera_custom", JSON.stringify(camera_custom())))

    const local_camera_rotate90 = localStorage.getItem("camera_rotate90") || "false";
    const [camera_rotate90, set_camera_rotate90] = createSignal(JSON.parse(local_camera_rotate90));
    createEffect(() => localStorage.setItem("camera_rotate90", JSON.stringify(camera_rotate90())))

    const local_camera_rotate180 = localStorage.getItem("camera_rotate180") || "false";
    const [camera_rotate180, set_camera_rotate180] = createSignal(JSON.parse(local_camera_rotate180));
    createEffect(() => localStorage.setItem("camera_rotate180", JSON.stringify(camera_rotate180())))

    const set_cuctom_camera_size = async (option: any) => {
        switch (option) {
            case 0:
                set_camera_width(480)
                set_camera_heigth(640)
                break;
            case 1:
                set_camera_width(720)
                set_camera_heigth(1280)
                break;
            case 2:
                set_camera_width(1080)
                set_camera_heigth(1920)
                break;
            case 3:
                set_camera_width(1152)
                set_camera_heigth(2048)
                break;
            case 4:
                set_camera_width(2160)
                set_camera_heigth(3840)
                break;
        }
    }

    // Debug auto clear logs
    const localAutoClearLogs = localStorage.getItem("autoClearLogs") || "true";
    const [autoClearLogs, setAutoClearLogs] = createSignal((JSON.parse(localAutoClearLogs)));
    createEffect(() => localStorage.setItem("autoClearLogs", JSON.stringify(autoClearLogs())))

    var localLogsLimit = localStorage.getItem("logsLimit") || "19";
    const [logsLimit, setLogsLimit] = createSignal(parseInt(localLogsLimit));
    createEffect(() => localStorage.setItem("logsLimit", JSON.stringify(logsLimit())))

    // Debug auto show newest logs
    const localAutoShowNewest = localStorage.getItem("localAutoShowNewest") || "true";
    const [autoShowNewest, setAutoShowNewest] = createSignal((JSON.parse(localAutoShowNewest)));
    createEffect(() => localStorage.setItem("autoShowNewest", JSON.stringify(autoShowNewest())))

    const [image, setImage] = createSignal("");

    const [displaySwitch, setDisplaySwitch] = createSignal("debug");
    const [navigationSwitch, setNavigationSwitch] = createSignal("nav");

    const map_ldraw = JSON.parse(map_ldraw_raw);
    const fetchData = async () =>
        await fetch(`/api/Sorter/`);

    const fetchPhoto = async (session: String, id: String) =>
        await fetch(`/api/Static/${session}/${id}.jpg`);

    async function getPrev() {
        refetch();
        var response = data()
        if (response != undefined && response?.status != 500) {
            const responseBlob = await response.blob()
            if (responseBlob.size > 0)
                setImage(URL.createObjectURL(responseBlob))
        }
    }

    const [startStopTimerPreviewText, setStartStopTimerPreviewText] = createSignal("Start timer");
    var timerInterval: any = undefined

    const [selectedMessage, setSelectedMessage] = createSignal<MessageItem>();
    const [selectedSortMessage, setSelectedSortMessage] = createSignal<SortItem>();

    async function displayImage(message: MessageItem) {
        setSelectedMessage(message);
    }

    async function startSort() {
        if (sort() != "true") {
            set_sort("true")
            saveSort()
        }
    }
    async function stopSort() {
        if (sort() != "false") {
            set_sort("false")
            saveSort()
        }
    }

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

    const [sessionName, setSessionName] = createSignal("");

    function testSendImg() {
        var input = document.querySelector('input[type="file"]')

        if (input != null) {
            var data = new FormData()
            data.append('file', (input as any).files[0])
            data.append('session', sessionName())
            data.append('rotation', "0")

            fetch('/api/Sorter', {
                method: 'POST',
                body: data
            })
        }
    }

    const local_camera_capture_time = localStorage.getItem("camera_capture_time") || "500";
    const [camera_capture_time, set_camera_capture_time] = createSignal(parseInt(local_camera_capture_time));
    createEffect(() => localStorage.setItem("camera_capture_time", JSON.stringify(camera_capture_time())))
    const [startStopTimerCaptureText, setStartStopTimerCaptureText] = createSignal("Start Capture timer");

    var timerIntervalCapture: any = undefined
    function startStopTimerCapture() {
        if (timerIntervalCapture == undefined) {
            timerIntervalCapture = setInterval(() => { testSendImgCanvas() }, camera_capture_time());
            setStartStopTimerCaptureText("Stop Capture timer")
        }
        else {
            setStartStopTimerCaptureText("Start Capture timer")
            clearInterval(timerIntervalCapture)
            timerIntervalCapture = undefined
        }
    }

    function testSendImgCanvas() {
        if (!cameraOpen()) {
            openCamera()
        }
        if (cameraOpen()) {
            cameraToCanvas();
            const canvas = document.getElementById('canvas') as HTMLCanvasElement;
            canvas.toBlob((blob: Blob | null) => {
                let file = new File([blob!], "fileName.jpg", { type: "image/jpeg" })
                var data = new FormData()
                data.append('file', file)
                data.append('session', sessionName())
                data.append('rotation', "0")

                fetch('/api/Sorter', {
                    method: 'POST',
                    body: data
                })
            }, 'image/jpeg');
        }
    }

    const [videoStream, setVideoStream] = createSignal<MediaStream>();

    const [mediaDevices, setMediaDevices] = createSignal<MediaDeviceInfo[]>([])

    const [selected_mediaDevice_idx, set_selected_mediaDevice_idx] = createSignal<number>();

    async function getCameras() {
        var res = await navigator.mediaDevices.enumerateDevices()
        var mediaDevices: MediaDeviceInfo[] = []
        res.forEach(element => {
            if (element.kind == "videoinput") {
                mediaDevices.push(element)
            }
        })
        setMediaDevices(mediaDevices)
        setCameraOpen(false)
        set_selected_mediaDevice_idx()
        const player = document.getElementById('player') as HTMLVideoElement;
        player.srcObject = null;
    }
    const [cameraOpen, setCameraOpen] = createSignal<boolean>(false)

    async function openCamera() {
        const player = document.getElementById('player') as HTMLVideoElement;

        var idx = selected_mediaDevice_idx()
        if (idx != undefined) {
            var selectedMediaDevice = mediaDevices()[idx]
            if (selectedMediaDevice != undefined) {
                const constraints: MediaStreamConstraints = {
                    video: {
                        deviceId: selectedMediaDevice.deviceId
                    }
                };
                navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
                    setCameraOpen(true);
                    player.srcObject = stream;
                });
            }
        }
    }

    async function cameraToCanvas() {
        const player = document.getElementById('player') as HTMLVideoElement;
        const canvas = document.getElementById('canvas') as HTMLCanvasElement;
        const context = canvas.getContext('2d') as CanvasRenderingContext2D;
        // rotate 90
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.translate(canvas.width, 0);
        context.rotate(90 * Math.PI / 180);

        context.drawImage(player, 0, 0, canvas.height, canvas.width);
    }

    function testTest() {
        createLego({ partNo: "3003", z: 0, x: 8.5, y: 0 });
    }

    function isLocalhost<Boolean>(){
        return window.location.hostname === 'localhost' ||
        // [::1] is the IPv6 localhost address.
        window.location.hostname === '[::1]' ||
        // 127.0.0.1/8 is considered localhost for IPv4.
        Boolean(window.location.hostname.match(
            /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
        ))
    }

    function isHttps<Boolean>() {
        return location.protocol === "https:"
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
        setSortMessages([])
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

    const [sortMessages, setSortMessages] = createStore<SortItem[]>([]);


    connectionSorter.on("messageReceived", (new_messages) => {
        clearLegoModels();
        var messageIndex = 0;
        for (var message of new_messages) {
            if (autoClearLogs() && messages.length > logsLimit()) {
                var mes = messages.slice(-logsLimit())
                setMessages(mes!);
            }
            messageIndex = messages.length;
            setMessages(messages.length, {
                ymin: message.ymin,
                xmin: message.xmin,
                ymax: message.ymax,
                xmax: message.xmax,
                label: message.label,
                score: message.score,
                label_top5: message.label_top5,
                score_top5: message.score_top5,
                id: message.id,
                session: message.session
            });
            let x, z;
            [x, z] = min_max2x_z(message.ymin, message.xmin, message.ymax, message.xmax);
            if (displaySwitch() == "rend-prev") {
                createLego({ partNo: message.label, z: z, x: x, y: 0 });
            }
        }
        if (autoShowNewest()) {
            setSelectedMessage(messages[messageIndex]);
        }
    });

    connectionSorter.on("sortMessageReceived", (new_messages) => {
        var messageIndex = 0;
        for (var message of new_messages) {
            if (autoClearLogs() && sortMessages.length > logsLimit()) {
                var mes = sortMessages.slice(-logsLimit())
                setSortMessages(mes!);
            }
            messageIndex = sortMessages.length;
            setSortMessages(sortMessages.length, {
                label: message.label,
                score: message.score,
                info: message.info,
                id: message.id,
                session: message.session
            });
        }
        if (autoShowNewest()) {
            setSelectedSortMessage(sortMessages[messageIndex]);
        }
    });

    const [queuesInfoMessage, setQueuesInfoMessage] = createSignal<QueuesInfoMessageItem>({ lastImages_length: 0, storage_queue_length: 0, processing_length: 0, annotation_length: 0, sort_length: 0, crops_length: 0 });

    connectionSorter.on("queuesInfoMessageReceived", (message) => {
        setQueuesInfoMessage(message);
    });

    function refreshQueueInfo() {
        connectionSorter.send("requestQueuesInfoMessage");
    }

    function min_max2x_z(ymin: number, xmin: number, ymax: number, xmax: number) {
        let x, z;
        let median_x = (xmin + xmax) / 2;
        let median_y = (ymin + ymax) / 2;
        //TODO values from config, plus camera angle, position and belt width in px

        z = - 10 * (median_x / camera_width()) + 5 // 10 - width; median_x/1080 - proportion of width; +5 belt edge offest; values reversed - +, becouse view is mirror
        x = 17.78 * (median_y / camera_heigth()) // 17.78 - length; median_y/1920 - proportion of length;

        return [x, z]
    }

    connectionSorter.start().catch((err: string) => console.log(err));

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    var camera = new THREE.PerspectiveCamera(40, 480 / 854, 0.1, 1000);

    renderer.setSize(480, 854);

    const controls = new OrbitControls(camera, renderer.domElement);
    onCleanup(() => controls.dispose());

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

        if (displaySwitch() == "rend-prev") {
            let off = clock.getElapsedTime()

            controls.update();

            last = off;

            renderer.render(scene, camera);
        }
    }

    animate();

    return (
        <>
            <div class="flex flex-wrap  bg-base-300 p-2">
                <QueueInfo queuesInfoMessage={queuesInfoMessage()} refreshQueueInfo={refreshQueueInfo} />
            </div>
            <div class="flex bg-base-300 flex-wrap lg:flex-nowrap">
                <section class="bg-base-300 text-base-800 shrink">
                    <div class="flex flex-wrap  pl-2 pr-2 shrink ">
                        <label class="label cursor-pointer gap-3" >
                            <input type="radio" name="radio-0" class="radio" checked value="debug" onChange={(e) => setDisplaySwitch(e.currentTarget.value)} />
                            <span class="label-text">Debug</span>
                        </label>
                        <label class="label cursor-pointer gap-3" >
                            <input type="radio" name="radio-0" class="radio" value="nav" onChange={(e) => setDisplaySwitch(e.currentTarget.value)} />
                            <span class="label-text">Phone<br />Navigation</span>
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
                    </div>
                    <Switch>
                        <Match when={displaySwitch() == "rend-prev"}>
                            <section class="bg-base-300 text-base-800 p-2">
                                <div class="mockup-phone">
                                    <div class="camera"></div>
                                    <div class="display">
                                        {renderer.domElement}
                                    </div>
                                </div>
                            </section>
                        </Match>
                        <Match when={displaySwitch() == "debug"}>
                            <section class="bg-base-300 text-base-800 p-2">
                                <div class="mockup-phone">
                                    <div class="camera"></div>
                                    <div class="display">
                                        <CameraPicWithResults propsMessages={messages} selectedMessage={selectedMessage()} camera_heigth={camera_heigth} camera_width={camera_width} camera_rotate90={camera_rotate90} camera_rotate180={camera_rotate180} />
                                    </div>
                                </div>
                            </section>
                        </Match>
                        <Match when={displaySwitch() == "cam-prev"}>
                            <section class="bg-base-300 text-base-800 p-2">
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
                                                <Show when={camera_rotate90()} fallback={
                                                    <Show when={camera_rotate180()} fallback={
                                                        <img src={image()} class="w-[480px] h-[854px] max-w-none" />
                                                    }>
                                                        <img src={image()} class="w-[480px] h-[854px] max-w-none rotate-180" />
                                                    </Show>
                                                }>
                                                    <img src={image()} class="w-[854px] h-[480px] max-w-none origin-top-left translate-x-[480px] rotate-90 " />
                                                </Show>
                                                <button class="absolute top-4 left-4 btn w-24" innerText="Refresh preview" onClick={() => getPrev()} />
                                                <button class="absolute top-4 right-4 btn w-24" innerText={startStopTimerPreviewText()} onClick={() => startStopTimerPreview()} />
                                            </Show>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </Match>
                        <Match when={displaySwitch() == "nav"}>
                            <section class="bg-base-300 text-base-800 p-2">
                                <div class="mockup-phone">
                                    <div class="camera"></div>
                                    <div class="display w-[480px] h-[854px]">
                                        <div class="artboard artboard-demo gap-4 h-[854px]">
                                            <Show when={!connection()}>
                                                Connect using button on navbar
                                            </Show>
                                            {/*<Match when={state() == "startFragment"}>*/}
                                            {/*<Match when={navigationSwitch() == "nav"}>*/}
                                            <Switch fallback={
                                                <>
                                                    <button class="btn w-48" disabled={!connection()} onClick={() => navigateAnalyze()}>Analyze</button>
                                                    <button class="btn w-48" disabled={!connection()} onClick={() => navigateSort()}>Sort</button>
                                                    <button class="btn w-48" disabled={!connection()} onClick={() => navigateFastAnalyze()}>Fast Analyze</button>
                                                    <button class="btn w-48" disabled={!connection()} onClick={() => navigateBack()}>Back</button>
                                                </>
                                            }>
                                                {/*</Match>*/}

                                                <Match when={state() == "analyzeFragment" || state() == "analyzeFragmentAnalysisStarted"}>
                                                    {/*<Match when={navigationSwitch() == "analyze"}>*/}
                                                    <Show when={state() == "analyzeFragmentAnalysisStarted"} fallback={
                                                        <button class="btn w-48" disabled={!connection()} innerText="Start Analyze" onClick={() => startStopNormalAnalyze()} />
                                                    }>
                                                        <button class="btn w-48" disabled={!connection()} innerText="Stop Analyze" onClick={() => startStopNormalAnalyze()} />
                                                    </Show>
                                                    <button class="btn w-48" disabled={!connection()} onClick={() => navigateBack()}>Back</button>
                                                </Match>
                                                <Match when={state() == "sortFragmentOn" || state() == "sortFragmentOff" || state() == "sortFragmentSortingStartedOn" || state() == "sortFragmentSortingStartedOff"}>
                                                    {/*<Match when={navigationSwitch() == "sort"}>*/}
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
                                                            <div class="form-control  w-fit max-w-xs">
                                                                <label class="label cursor-pointer">
                                                                    <span class="label-text">Store images on server</span>
                                                                    <input type="checkbox" class="toggle" disabled={!connection()} checked={saveImgSwitchVal()}
                                                                        onChange={(e) => setSaveImgSwitchVal(e.currentTarget.checked)}
                                                                    />
                                                                </label>
                                                            </div>
                                                            <div class="form-control w-fit max-w-xs">
                                                                <label class="label">
                                                                    <span class="label-text">Session name</span>
                                                                </label>
                                                                <input type="text" placeholder="Not set (disabled storage)" class="input input-bordered w-fit max-w-xs" value={savedSession()} disabled={!saveImgSwitchVal() || !connection()}
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
                            <section class="bg-base-300 text-base-800 p-2">
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
                    </Switch>

                </section>
                <section class="lg:overflow-auto bg-base-300 text-base-800 pl-2 pr-2 pb-0 h-[960px] min-w-[520px] shrink w-max">
                    <div class="flex flex-wrap shrink">
                        <BeltsSpeedControl />
                        <div class="collapse collapse-arrow border-base-300 bg-base-100 rounded-box h-max m-1">
                            <input type="checkbox" class="peer" />
                            <div class="collapse-title text-xl font-medium">
                                Input image size {camera_width()}x{camera_heigth}
                            </div>
                            <div class="collapse-content">
                                <div class="flex shrink m-2">
                                    <p class="m-2">Custom size</p>
                                    <input type="checkbox" class="toggle z-50 ml-2" checked={camera_custom() == "true"}
                                        onChange={(e) => { set_camera_custom((e.currentTarget.checked).toString()) }}
                                    />
                                </div>

                                <Show when={camera_custom() == "true"}
                                    fallback={
                                        <>
                                            <select class="select select-bordered w-full max-w-xs" onChange={(e) => set_cuctom_camera_size((e.currentTarget.selectedIndex - 1))}>
                                                <option disabled selected>Image resolution</option>
                                                <option selected={camera_width() == 480 && camera_heigth() == 640}>480 x 640 (SD)</option>
                                                <option selected={camera_width() == 720 && camera_heigth() == 1280}>720 x 1280 (HD)</option>
                                                <option selected={camera_width() == 1080 && camera_heigth() == 1920}>1080 x 1920 (FHD)</option>
                                                <option selected={camera_width() == 1152 && camera_heigth() == 2048}>1152 x 2048 (2K)</option>
                                                <option selected={camera_width() == 2160 && camera_heigth() == 3840}>2160 x 3840 (UHD)</option>
                                            </select>
                                        </>
                                    }>
                                    <div class="form-control w-full max-w-xs">
                                        <label class="label">
                                            <span class="label-text">Width</span>
                                            <span class="label-text-alt"></span>
                                        </label>
                                        <input id="session_text" type="number" min="1" placeholder="Width" value={camera_width()} class="input input-bordered w-fit"
                                            onChange={
                                                (e) => {
                                                    var res = parseInt(e.currentTarget.value)
                                                    if (res >= 1)
                                                        set_camera_width(res)
                                                    else {
                                                        e.currentTarget.value = camera_width().toString()
                                                    }
                                                }} />
                                    </div>
                                    <div class="form-control w-full max-w-xs">
                                        <label class="label">
                                            <span class="label-text">Heigth</span>
                                            <span class="label-text-alt"></span>
                                        </label>
                                        <input id="session_text" type="number" min="1" placeholder="Heigth" value={camera_heigth()} class="input input-bordered w-fit"
                                            onChange={
                                                (e) => {
                                                    var res = parseInt(e.currentTarget.value)
                                                    if (res >= 1)
                                                        set_camera_heigth(res)
                                                    else {
                                                        e.currentTarget.value = camera_heigth().toString()
                                                    }
                                                }} />
                                    </div>
                                </Show>

                            </div>
                        </div>
                        <Show when={true}>
                            <div class="collapse collapse-arrow border-base-300 bg-base-100 rounded-box h-max m-1">
                                <input type="checkbox" class="peer" />
                                <div class="collapse-title text-xl font-medium">
                                    Test send file
                                </div>
                                <div class="collapse-content">
                                    {/*<input type="file" class="file-input file-input-bordered w-fit m-1" accept=".jpg,.jpeg" />*/}
                                    <input type="file" class="file-input file-input-bordered w-fit m-1" accept="image/jpeg" />
                                    {/*<input type="file" class="file-input file-input-bordered w-fit m-1" accept="image/*" />*/}
                                    <div class="form-control w-fit">
                                        <label class="label">
                                            <span class="label-text">Session</span>
                                            <span class="label-text-alt">(Folder on server)</span>
                                        </label>
                                        <input id="session_text" type="text" placeholder="Session" value={sessionName()} class="input input-bordered w-fit"
                                            onChange={(e) => { setSessionName(e.currentTarget.value) }}
                                        />
                                    </div>
                                    <button class="btn m-1" innerText="Test Send Img" onClick={() => testSendImg()} />
                                </div>
                            </div>
                        </Show>
                        <Show when={isLocalhost() || isHttps()}>
                            <div class="collapse collapse-arrow border-base-300 bg-base-100 rounded-box h-max m-1">
                                <input type="checkbox" class="peer" />
                                <div class="collapse-title text-xl font-medium">
                                    Test camera send images
                                </div>
                                <div class="collapse-content">
                                    <div class="flex flex-wrap shrink">
                                        <div class="form-control w-fit max-w-xs">
                                            <label class="label">
                                                <span class="label-text">Delay between</span>
                                                <span class="label-text-alt">[ms]</span>
                                            </label>
                                            <input type="number" step="1" min="50" placeholder="Not set" class="input input-bordered w-full max-w-xs" value={camera_capture_time()}
                                                onChange={
                                                    (e) => {
                                                        if (parseInt(e.currentTarget.value) >= 1)
                                                            set_camera_capture_time(parseInt(e.currentTarget.value))
                                                        else {
                                                            if (e.currentTarget.value != "")
                                                                e.currentTarget.value = camera_capture_time().toString()
                                                            else
                                                                set_camera_capture_time(500)
                                                        }

                                                    }} />
                                        </div>
                                        <button class="btn m-1" innerText="Get Cameras" onClick={() => getCameras()} />
                                    </div>
                                    <select class="select select-bordered w-full max-w-xs" onChange={(e) => set_selected_mediaDevice_idx((e.currentTarget.selectedIndex - 1))}>
                                        <option disabled selected>Not selected</option>
                                        <For each={mediaDevices()}>
                                            {(mediaDevice, i) => {
                                                return <>
                                                    <option selected={selected_mediaDevice_idx() == i()}>{mediaDevice.label}</option>
                                                </>
                                            }
                                            }
                                        </For>
                                    </select>
                                    <button class="btn m-1" disabled={selected_mediaDevice_idx() == undefined} innerText="Open Camera" onClick={() => openCamera()} />
                                    <video id="player" width={`480px`} height={`270px`} autoplay controls></video>
                                    <div class=" w-[480px] h-[854px] hidden">
                                        <canvas id="canvas" width={`${camera_width()}px`} height={`${camera_heigth()}px`} class="w-[480px] h-[854px] max-w-none"></canvas>
                                        {/*<canvas id="canvas" width={`${camera_heigth()}px`} height={`${camera_width()}px`} class="w-[854px] h-[480px] max-w-none origin-top-left translate-x-[480px] rotate-90"></canvas>*/}
                                    </div>
                                    <button class="btn m-1" disabled={selected_mediaDevice_idx() == undefined} innerText="Manual send image" onClick={() => testSendImgCanvas()} />
                                    <button class="btn m-1" disabled={selected_mediaDevice_idx() == undefined} innerText={startStopTimerCaptureText()} onClick={() => startStopTimerCapture()} />

                                </div>
                            </div>
                        </Show>

                    </div>
                    <div class="flex flex-wrap shrink">
                        <button class="btn m-1" innerText="Clear Logs Messages" onClick={() => clearMessages()} />
                        <Show when={displaySwitch() == "rend-prev"}>
                            <button class="btn m-1" innerText="Clear Lego" onClick={() => clearLegoModels()} />
                            <button class="btn m-1" innerText="Test Add Lego" onClick={() => testTest()} />
                        </Show>
                        <div class="flex shrink m-2">
                            <p class="m-2">Save crop of images</p>
                            <input type="checkbox" class="toggle m-2" checked={crop() == "true"}
                                onChange={(e) => { set_crop((e.currentTarget.checked).toString()); saveCrop() }}
                            />
                        </div>

                        <div class="flex shrink m-2">
                            <div class="card card-compact min-w-[340px] bg-base-200 h-max max-w-xs shadow-xl">
                                <div class="collapse collapse-arrow  border border-base-300 bg-base-100 rounded-box">
                                    <div class="collapse-title font-medium">
                                        <div class="flex shrink">
                                            <p class="">Save original images override</p>
                                            <input type="checkbox" class="toggle z-50 ml-2" checked={store_img_override() == "true"}
                                                onChange={(e) => { set_store_img_override((e.currentTarget.checked).toString()); save_store_img_override() }}
                                            />
                                        </div>
                                    </div>
                                    <input type="checkbox" />
                                    <div class="collapse-content">
                                        <div class="form-control w-fit max-w-xs">
                                            <label class="label">
                                                <span class="label-text">Session name</span>
                                            </label>
                                            <input type="text" placeholder="Empty (disabled storage)" class="input input-bordered w-fit max-w-xs" value={store_img_session()}
                                                onChange={(e) => { set_store_img_session(e.currentTarget.value) }} />
                                        </div>
                                        <button class="btn w-24 mt-2" innerText="Save" onClick={() => save_store_img_session()} />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="flex flex-wrap shrink">
                        <div class="card card-compact w-96 bg-base-100 h-max max-w-xl shadow-xl m-1">
                            <div class="card-body">
                                <h1 class="card-title text-2xl font-bold">Dection log:</h1>
                                <div class="collapse collapse-arrow border border-base-300 bg-base-200 rounded-box h-max m-1">
                                    <input type="checkbox" class="peer" />
                                    <div class="collapse-title text-xl font-medium">
                                        Log options
                                    </div>
                                    <div class="collapse-content">
                                        <div class="form-control m-1">
                                            <label class="label cursor-pointer">
                                                <span class="label-text">Auto clear logs</span>
                                                <input type="checkbox" class="toggle" checked={autoClearLogs()}
                                                    onChange={(e) => setAutoClearLogs(e.currentTarget.checked)} />
                                            </label>
                                        </div>
                                        <div class="form-control w-full m-1">
                                            <label class="label">
                                                <span class="label-text">Auto clear logs limit</span>
                                            </label>
                                            <input type="number" min="10" value={logsLimit()} placeholder="Auto clear logs limit" class="input input-bordered w-fit max-w-xs"
                                                onChange={
                                                    (e) => {
                                                        if (parseInt(e.currentTarget.value) >= 10)
                                                            setLogsLimit(parseInt(e.currentTarget.value))
                                                        else {
                                                            if (e.currentTarget.value != "")
                                                                e.currentTarget.value = logsLimit().toString()
                                                            else
                                                                setCamera_preview_time(36)
                                                        }

                                                    }} />
                                        </div>
                                        <div class="form-control m-1">
                                            <label class="label cursor-pointer">
                                                <span class="label-text">Auto show newest</span>
                                                <input type="checkbox" class="toggle" checked={autoShowNewest()}
                                                    onChange={(e) => setAutoShowNewest(e.currentTarget.checked)} />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <For each={messages}>
                                    {(mes, i) => {
                                        return <>
                                            {/*<div class="tooltip tooltip-bottom" data-tip={`${mes.label_top5}`}>*/}
                                            <div class="tooltip tooltip-right before:whitespace-pre before:content-[attr(data-tip)] w-fit"
                                                data-tip={`${mes.label_top5.map((k, i) => `${k}: ${mes.score_top5[i].toFixed(4)}\n`).join("")}`}>
                                                <p class="cursor-pointer text-left w-fit" onClick={() => displayImage(mes)}>Label: {mes.label} Score:{mes.score}</p>
                                                {/*<div onClick={() => displayImage(mes)}>Label: {mes.label} Score:{mes.score} ymin:{mes.ymin} xmin:{mes.xmin} ymax:{mes.ymax} xmax:{mes.xmax} id:{mes.id} session:{mes.session}</div>*/}
                                            </div>
                                        </>
                                    }
                                    }
                                </For>
                            </div>
                        </div>
                        <div class="card card-compact w-96 bg-base-100 h-max max-w-xl shadow-xl m-1 min-h-[146px]">
                            <div class="card-body">
                                <h1 class="card-title text-2xl font-bold">Sorter log:</h1>
                                <div class="flex flex-wrap shrink">
                                    <p>Enable Sorter</p>
                                    <input type="checkbox" class="toggle" checked={sort() == "true"} onChange={(e) => { set_sort((e.currentTarget.checked).toString()); saveSort() }} />
                                </div>
                                <For each={sortMessages}>
                                    {(mes, i) => {
                                        return <>
                                            <div >Label: {mes.label} Score:{mes.score} Info:{mes.info}</div>
                                        </>
                                    }
                                    }
                                </For>
                            </div>
                        </div>


                    </div>
                </section>
            </div>
        </>
    );
}




