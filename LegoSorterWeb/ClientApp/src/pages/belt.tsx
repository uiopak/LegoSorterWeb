import { batch, createEffect, createResource, createSignal, For, onCleanup } from 'solid-js';
import { createStore } from "solid-js/store";
import type { StoreNode, Store, SetStoreFunction } from "solid-js/store";

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries';
import { LDrawLoader } from 'three/examples/jsm/loaders/LDrawLoader';
import GUI from 'lil-gui';

import * as signalR from "@microsoft/signalr";


export default function Belt() {
    const fetchData = async () =>
        await fetch(`/api/Sorter/`);


    const [data, { mutate, refetch }] = createResource(fetchData);

    function testTest() {
        console.log(data())
    }

    type MessageItem = { title: string; };

    const [message, setMessage] = createSignal("");

    //function createLocalStore<T extends object>(
    //    name: string,
    //    init: T
    //): [Store<T>, SetStoreFunction<T>] {
    //    const localState = localStorage.getItem(name);
    //    const [state, setState] = createStore<T>(
    //        localState ? JSON.parse(localState) : init
    //    );
    //    createEffect(() => localStorage.setItem(name, JSON.stringify(state)));
    //    return [state, setState];
    //}

    type LegoItemMessage = { partNo: string, x: number, y: number, z: number, width: number, heigth: number };
    type LegoModelItem = { model: THREE.Group, refMes: LegoItemMessage };

    const [legoItemMessages, setLegoItemMessages] = createStore<LegoItemMessage[]>([]);

    const [legoModels, setLegoModels] = createStore<LegoModelItem[]>([]);

    const [messages, setMessages] = createStore<MessageItem[]>([]);

    const username = new Date().getTime();

    const connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/sorter')
        .build();

    onCleanup(() => {
        console.log("cleanup");
        connection.stop().catch((err: string) => console.log(err))
    });

    connection.on("messageReceived", (username: string, message: string) => {
        console.log("messageReceived")
        setMessages(messages.length, {
            title: message
        });
    });

    connection.start().catch((err: string) => console.log(err));

    const addMessage = (e: SubmitEvent) => {
        e.preventDefault();
        batch(() => {
            connection.send("sendMessage", username, message());
            setMessage("");
        });
    };

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, (window.innerWidth * 0.9) / (window.innerHeight * 0.55), 0.1, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.55);
    camera.position.set(45, 25, 0);
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
            `/parts/parts/${legoMessage.partNo}.dat`,

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

    function updateObjectsVisibility() {
        for (var modelItem of legoModels) {
            var model = modelItem.model;
            model.traverse(c => {
                if (c.isLineSegments) {
                    if (c.isConditionalLine) {
                        c.visible = guiData.conditionalLines;
                    } else {
                        c.visible = guiData.displayLines;
                    }
                }
            });
        }
    }


    let guiData = {
        displayLines: true,
        conditionalLines: true,
    };


    let gui: GUI;

    function createGUI() {

        if (gui) {

            gui.destroy();

        }

        gui = new GUI();

        gui.add(guiData, 'displayLines').name('Display Lines').onChange(updateObjectsVisibility);
        gui.add(guiData, 'conditionalLines').name('Conditional Lines').onChange(updateObjectsVisibility);

    }
    createGUI();

    createLego({ partNo: "3001", heigth: 0, width: 0, z: 2, x: -17, y: 0 });
    createLego({ partNo: "3002", heigth: 0, width: 0, z: -2, x: -16, y: 0 });
    createLego({ partNo: "3003", heigth: 0, width: 0, z: 0, x: -18, y: 0 });




    // Animation Loop
    let clock = new THREE.Clock();

    let last = clock.getElapsedTime()
    function animate() {
        requestAnimationFrame(animate);

        let off = clock.getElapsedTime()

        for (var modelItem of legoModels) {
            var lego = modelItem.model;
            if (lego != undefined) {
                lego.position.x += (off - last) * (path.getLength() / 10);
                if (lego.position.x > 17) {
                    lego.position.x = modelItem.refMes.x;
                }
                //TODO remove lego if to far
            }
        }


        last = off;


        controls.update();
        if (m.map != null)
            m.map.offset.x = off

        renderer.render(scene, camera);
    }

    animate();

    return (
        <>
            <section class="bg-base-300 text-base-800 p-8">
                <h1 class="text-2xl font-bold">Belt</h1>

                <button class="btn" innerText="start" onClick={() => testTest()} />

            </section>
            <section class="bg-base-300 text-base-800 p-8">

                <div id="divMessages" class="messages"></div>
                <For each={messages}>
                    {(mes, i) => (
                        <div>{mes.title}</div>
                    )}
                </For>
                <form onSubmit={addMessage}>
                    <input type="text" value={message()} onInput={(e) => setMessage(e.currentTarget.value)} />
                    <button >Send</button>
                </form>
            </section>
            <section class="bg-base-300 text-base-800 p-8">
                {renderer.domElement}
            </section>
        </>
    );
}




