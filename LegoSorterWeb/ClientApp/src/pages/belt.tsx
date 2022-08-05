import { batch, createEffect, createResource, createSignal, For, onCleanup, Show } from 'solid-js';
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



export default function Belt(props: any) {
    const defaultProps = mergeProps({ gui: true }, props);

    const [speed, setSpeed] = createSignal(1);


    const [displayLines, setDisplayLines] = createSignal(true);

    const [conditionalLines, setConditionalLines] = createSignal(true);



    const map_ldraw = JSON.parse(map_ldraw_raw);
    const fetchData = async () =>
        await fetch(`/api/Sorter/`);


    const [data, { mutate, refetch }] = createResource(fetchData);

    function testTest() {
        createLego({ partNo: "3001", z: 2, x: -17, y: 0 });
        createLego({ partNo: "3002", z: -2, x: -16, y: 0 });
        createLego({ partNo: "3003", z: 0, x: -18, y: 0 });
    }

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

    type MessageItem = { ymin: number, xmin: number, ymax: number, xmax: number, label: string, score: number };

    const [message_ymin, setMessage_ymin] = createSignal(0);
    const [message_xmin, setMessage_xmin] = createSignal(0);
    const [message_ymax, setMessage_ymax] = createSignal(0);
    const [message_xmax, setMessage_xmax] = createSignal(0);
    const [message_label, setMessage_label] = createSignal("");
    const [message_score, setMessage_score] = createSignal(0.0);


    type LegoItemMessage = { partNo: string, x: number, y: number, z: number};
    type LegoModelItem = { model: THREE.Group, refMes: LegoItemMessage };

    //const [legoItemMessages, setLegoItemMessages] = createStore<LegoItemMessage[]>([]);

    const [legoModels, setLegoModels] = createStore<LegoModelItem[]>([]);

    const [messages, setMessages] = createStore<MessageItem[]>([]);


    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/sorter')
        .build();

    onCleanup(() => {
        console.log("cleanup");
        connection.stop().catch((err: string) => console.log(err))
    });

    connection.on("messageReceived", (new_messages) => {
        console.log("messageReceived")
        clearLegoModels();
        for (var message of new_messages) {
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
        let x, z;
        let median_x = (xmin + xmax) / 2;
        let median_y = (ymin + ymax) / 2;
        //TODO values from config, plus camera angle, position and belt width in px

        z = - 10 * (median_x / 1080) + 5 // 10 - width; median_x/1080 - proportion of width; +5 belt edge offest; values reversed - +, becouse view is mirror
        x = 40 * (median_y / 1920) - 20 // 40 - length; median_y/1920 - proportion of length; -20 belt edge offest;

        return [x, z]
    }

    connection.start().catch((err: string) => console.log(err));

    const addMessage = (e: SubmitEvent) => {
        e.preventDefault();
        batch(() => {
            connection.send("sendMessage", [{ ymin: message_ymin(), xmin: message_xmin(), ymax: message_ymax(), xmax: message_xmax(), label: message_label(), score: message_score() }, { ymin: message_ymin(), xmin: message_xmin(), ymax: message_ymax(), xmax: message_xmax(), label: message_label(), score: message_score() }]);
            setMessage_ymin(0);
            setMessage_xmin(0);
            setMessage_ymax(0);
            setMessage_xmax(0);
            setMessage_label("");
            setMessage_score(0.0);
        });
    };

    const scene = new THREE.Scene();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);

    if (defaultProps.gui) {
        var camera = new THREE.PerspectiveCamera(40, 480 / 854, 0.1, 1000);

        renderer.setSize(480, 854);
    }
    else {
        var camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);

        renderer.setSize(window.innerWidth, window.innerHeight);

        window.addEventListener('resize', () => {
            camera.aspect = (window.innerWidth / window.innerHeight);
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    camera.position.set(22, 24, 0);
    camera.lookAt(0, 0, 0);
    onCleanup(() => renderer.dispose());

    renderer.render(scene, camera);

    // Fake lego

    //const geometry2 = new THREE.BoxGeometry(2, 1, 1);
    //const material2 = new THREE.MeshStandardMaterial();
    //material2.color = new THREE.Color(0xff6347);
    //const torus2 = new THREE.Mesh(geometry2, material2);
    //torus2.position.set(-17, 2.5, 2)
    //scene.add(torus2);

    // Lego

    // Instantiate a loader
    const loader = new LDrawLoader();

    function createLego(legoMessage: LegoItemMessage) {
        //let lego: THREE.Group;
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
                //group.position.y += 0.05;
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
    //{
    //    side: THREE.DoubleSide,
    //    map: createTexture()
    //});
    m.side = THREE.DoubleSide;
    m.map = createTexture();

    const band = new THREE.Mesh(g, m);

    scene.add(band);

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

    const controls = new OrbitControls(camera, renderer.domElement);
    onCleanup(() => controls.dispose());

    //var t: LegoModelItem = { model:, refMes: {heigth:0,partNo:"3001",width:0,x:0,y:0}}

    //setLegoModels([new LegoModelItem()])

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

    //function updateObjectsVisibility() {
    //    for (var modelItem of legoModels) {
    //        var model = modelItem.model;
    //        model.traverse(c => {
    //            if (c.isLineSegments) {
    //                if (c.isConditionalLine) {
    //                    c.visible = guiData.conditionalLines;
    //                } else {
    //                    c.visible = guiData.displayLines;
    //                }
    //            }
    //        });
    //    }
    //}

    // Animation Loop
    let clock = new THREE.Clock();

    let last = clock.getElapsedTime()
    function animate() {
        requestAnimationFrame(animate);

        let off = clock.getElapsedTime()

        for (var modelItem of legoModels) {
            var lego = modelItem.model;
            if (lego != undefined) {
                lego.position.x += ((off - last) * (path.getLength() / 10))*speed();
                if (lego.position.x > 17) {
                    lego.position.x = modelItem.refMes.x;
                }
                //TODO remove lego if to far
            }
        }

        controls.update();
        if (m.map != null)
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
                    <>
                    {renderer.domElement}
                    </>
                }
            >
                <section class="bg-base-300 text-base-800 p-4 flex flex-wrap">
                    <h1 class="text-2xl font-bold p-4">Belt Web Config</h1>
                    <button class="btn" innerText="Test" onClick={() => testTest()} />
                    <div class="form-control p-4">
                        <label class="input-group cursor-pointer">
                            <span class="label-text">Conditional Lines</span>
                            <input type="checkbox" class="toggle toggle-primary" checked onChange={(e) => setConditionalLines(e.currentTarget.checked)}/>
                        </label>
                    </div>
                    <div class="form-control p-4">
                        <label class="input-group cursor-pointer">
                            <span class="label-text">Display Lines</span>
                            <input type="checkbox" class="toggle toggle-primary" checked onChange={(e) => setDisplayLines(e.currentTarget.checked)} />
                        </label>
                    </div>
                    <div class="form-control p-4">
                        <label class="input-group cursor-pointer">
                            <span class="label-text">Speed:</span>

                            <input type="range" min="0" max="10" step="0.1" value={speed()} class="range range-primary" onInput={(e) => setSpeed(parseFloat(e.currentTarget.value))} onChange={(e) => setSpeed(parseFloat(e.currentTarget.value))} />
                            <span class="label-text">{speed}</span>
                        </label>
                    </div>
                </section>
                <div class="flex flex-wrap">
                    <section class="overflow-auto bg-base-300 text-base-800 p-4 h-[854px] min-w-[520px]">

                        <button class="btn" innerText="start" onClick={() => testTest()} />
                        <button class="btn" innerText="Clear Messages" onClick={() => clearMessages()} />
                        <button class="btn" innerText="Clear Lego" onClick={() => clearLegoModels()} />
                        <h1 class="text-2xl font-bold">Belt log:</h1>
                        <For each={messages}>
                            {(mes, i) => (
                                <div>Label: {mes.label} Score:{mes.score} ymin:{mes.ymin} xmin:{mes.xmin} ymax:{mes.ymax} xmax:{mes.xmax}</div>
                            )}
                        </For>
                    </section>
                    <section class="bg-base-300 text-base-800 p-4">
                        {renderer.domElement}
                    </section>
                    </div>
            </Show>
        </>
    );
}




