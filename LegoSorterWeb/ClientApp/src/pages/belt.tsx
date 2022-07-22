import { batch, createEffect, createResource, createSignal, For } from 'solid-js';
import { createStore } from "solid-js/store";
import type { StoreNode, Store, SetStoreFunction } from "solid-js/store";

import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { ParametricGeometry } from 'three/examples/jsm/geometries/ParametricGeometry';
import { ParametricGeometries } from 'three/examples/jsm/geometries/ParametricGeometries';


//function getQuery(getQuery: any, fetchData: (source: any, { value, refetching }: { value: any; refetching: any; }) => Promise<void>): [any, { mutate: any; refetch: any; }] {
//    throw new Error('Function not implemented.');
//}

const fetchData = async () =>
    await fetch(`/api/Sorter/`);

//async function fetchData(source: any, { value: any, refetching }) {
//    // Fetch the data and return a value.
//    //`source` tells you the current value of the source signal;
//    //`value` tells you the last returned value of the fetcher;
//    //`refetching` is true when the fetcher is triggered by calling `refetch()`,
//    // or equal to the optional data passed: `refetch(info)`
//}



const [data, { mutate, refetch }] = createResource(fetchData);
//const [data, { mutate, refetch }] = createResource(getQuery, fetchData);

//// read value
//data();

//// check if loading
//data.loading;

//// check if errored
//data.error;

//// directly set value without creating promise
//mutate(optimisticValue);

//// refetch the last request explicitly
//refetch();

function testTest() {
    console.log(data())
}


import * as signalR from "@microsoft/signalr";
//import "./css/main.css";

type MessageItem = { title: string;};

const [message, setMessage] = createSignal("");

function createLocalStore<T extends object>(
  name: string,
  init: T
): [Store<T>, SetStoreFunction<T>] {
  const localState = localStorage.getItem(name);
  const [state, setState] = createStore<T>(
    localState ? JSON.parse(localState) : init
  );
  createEffect(() => localStorage.setItem(name, JSON.stringify(state)));
  return [state, setState];
}

const [messages, setMessages] = createStore<MessageItem[]>([]);


//const divMessages: HTMLDivElement | null = document.querySelector("#divMessages");
//const tbMessage: HTMLInputElement| null = document.querySelector("#tbMessage");
//const btnSend: HTMLButtonElement | null = document.querySelector("#btnSend");
const username = new Date().getTime();

const connection = new signalR.HubConnectionBuilder()
    .withUrl('/hubs/sorter')
    //.withUrl('http://localhost:5000/hubs/sorter')
    .build();

console.log("test")

connection.on("messageReceived", (username: string, message: string) => {
    console.log("messageReceived")
        setMessages(messages.length, {
            title: message
        });

    //const m = document.createElement("div");

    //m.innerHTML = `<div class="message-author">${username}</div><div>${message}</div>`;

    //divMessages?.appendChild(m);
    //if (divMessages != null)
    //    divMessages.scrollTop = divMessages.scrollHeight;
});

connection.start().catch((err) => document.write(err));

//tbMessage?.addEventListener("keyup", (e: KeyboardEvent) => {
//    if (e.key === "Enter") {
//        send();
//    }
//});

const addMessage = (e: SubmitEvent) => {
    e.preventDefault();
    batch(() => {
        connection.send("sendMessage", username, message());
        setMessage("");
    });
    //batch(() => {
    //    setMessages(messages.length, {
    //        title: message()
    //    });
    //    setMessage("");
    //});
};

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, (window.innerWidth * 0.9) / (window.innerHeight * 0.55), 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.55);
camera.position.set(45, 25, 0);
//camera.rotation.set(0.2,0.2,0.2)
camera.lookAt(0, 0, 0);

renderer.render(scene, camera);

// Torus

//const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
//const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
//const torus = new THREE.Mesh(geometry, material);

//scene.add(torus);

//box

// Torus

const geometry2 = new THREE.BoxGeometry(2, 1, 1);
const material2 = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus2 = new THREE.Mesh(geometry2, material2);
torus2.position.set(-17,2.5,2)
scene.add(torus2);



// Belt
const path = new THREE.Path();
path.absarc(20, 0, 2, Math.PI * 0.5, Math.PI * 1.5, true);
path.absarc(-20, 0, 2, Math.PI * 1.5, Math.PI * 0.5, true);
path.closePath();
console.log(path)
console.log(path.getLength())

const basePts = path.getSpacedPoints(200).reverse();

const g = new THREE.PlaneGeometry(1, 1, 200, 1);
basePts.forEach((p, idx) => {
    g.attributes.position.setXYZ(idx , p.x, p.y, -5);
    g.attributes.position.setXYZ(idx + 201, p.x, p.y, 5);
})

//const m = new THREE.MeshBasicMaterial({wireframe:true, side: THREE.DoubleSide, color: 0xff6347 });
const m = new THREE.MeshStandardMaterial({
    side: THREE.DoubleSide,
    map: createTexture()
});

const band = new THREE.Mesh(g, m);
//band.position.y += 2;
//band.position.z += 2;

scene.add(band);

// my belt

//let mygeometry, myobject;
//const path2 = new THREE.Path();
//path2.absarc(1, 0, 1, Math.PI * 0.5, Math.PI * 1.5, true);

//mygeometry = new ParametricGeometries.TubeGeometry(path2,2)
//mygeometry.center();
//myobject = new THREE.Mesh(geometry, material);
//myobject.position.set(- 200, 0, 200);
//scene.add(myobject);

function createTexture() {
    let c = document.createElement("canvas");
    c.width = c.height = 256;
    let ctx = c.getContext("2d");
    ctx.fillStyle = "maroon";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineWidth = 128;
    ctx.lineTo(c.width, c.height);
    ctx.stroke();

    let texture = new THREE.CanvasTexture(c);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.MirroredRepeatWrapping;
    texture.repeat.set(10, 2);
    texture.flipY = true;

    return texture;
}

// spline

//const sampleClosedSpline = new THREE.CatmullRomCurve3([
//    new THREE.Vector3(15, - 4, - 4),
//    new THREE.Vector3(15, 4, - 4),
//    new THREE.Vector3(15, 4, 4),
//    new THREE.Vector3(15, - 4, 4),
//    new THREE.Vector3(15, - 6, -4),
//    new THREE.Vector3(15, - 4, - 4)
//]);
////sampleClosedSpline.type = 'catmullrom';

//const tubeGeometry = new THREE.TubeGeometry(sampleClosedSpline, 150, 1, 2, true);


//const material3 = new THREE.MeshStandardMaterial({ map: createTexture()})//({ color: 0xff6347 });
//const tube = new THREE.Mesh(tubeGeometry, material3);
//tube.position.set(10, 10, 10);
//scene.add(tube)

// Lights
//const spotLight = new THREE.SpotLight(0xffffff);
//spotLight.position.set(0, 10, 0);
//spotLight.angle = Math.PI / 6;
//spotLight.distance = 19;
//scene.add(spotLight);

//const spotLightHelper = new THREE.SpotLightHelper(spotLight);
//scene.add(spotLightHelper);

const pointLight = new THREE.PointLight(0xffffff,0.8);
pointLight.position.set(0, 10, -15);
scene.add(pointLight);
const lightHelper = new THREE.PointLightHelper(pointLight)
scene.add(lightHelper)

const pointLight2 = new THREE.PointLight(0xffffff, 0.8);
pointLight2.position.set(0, 10, 15);
scene.add(pointLight2);
const lightHelper2 = new THREE.PointLightHelper(pointLight2)
scene.add(lightHelper2)

const ambientLight = new THREE.AmbientLight(0xffffff,0.0);
scene.add(ambientLight);

// Helpers

 
 const gridHelper = new THREE.GridHelper(200, 50);
 scene.add(gridHelper)


const controls = new OrbitControls(camera, renderer.domElement);

// Animation Loop
let clock = new THREE.Clock();
let last = clock.getElapsedTime()
function animate() {
    requestAnimationFrame(animate);

    //torus.rotation.x += 0.01;
    //torus.rotation.y += 0.005;
    //torus.rotation.z += 0.01;
    let off = clock.getElapsedTime()
    torus2.position.x += (off - last) * (path.getLength()/10);//liczba segmentów wartoœæ 1 to przesuniecie o jeden segment dlatego wyliczamy o ile siê zmieni³o
    if (torus2.position.x > 17) {
        torus2.position.x = -17;
    }
    last = off;
    //console.log(off);
    //moon.rotation.x += 0.005;

     controls.update();
    m.map.offset.x = off

    renderer.render(scene, camera);
}

animate();



//renderer.setAnimationLoop(() => {
//    m.map.offset.x = clock.getElapsedTime();
//    renderer.render(scene, camera);
//});

{

    //function send() {
    //    console.log("a")
    //    //connection.start().catch((err) => document.write(err));
    //    console.log(connection.state)
    //    connection.send("newMessage", username, message())
    //        .then(() => (setMessage("")));

    //}

    //let SCREEN_WIDTH = window.innerWidth;
    //let SCREEN_HEIGHT = window.innerHeight;
    //let aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    //let container, stats;
    //let camera, scene, renderer, mesh;
    //let cameraRig, activeCamera, activeHelper;
    //let cameraPerspective, cameraOrtho;
    //let cameraPerspectiveHelper, cameraOrthoHelper;
    //const frustumSize = 600;

    //init();
    //animate();

    //function init() {

    //	//container = document.createElement('div');
    //	//document.body.appendChild(container);

    //	scene = new THREE.Scene();

    //	//

    //	camera = new THREE.PerspectiveCamera(60, 0.5 * aspect, 1, 10000);
    //	camera.position.z = 2500;

    //	cameraPerspective = new THREE.PerspectiveCamera(50, 0.5 * aspect, 150, 1000);

    //	cameraPerspectiveHelper = new THREE.CameraHelper(cameraPerspective);
    //	scene.add(cameraPerspectiveHelper);

    //	//
    //	cameraOrtho = new THREE.OrthographicCamera(0.5 * frustumSize * aspect / - 2, 0.5 * frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 150, 1000);

    //	cameraOrthoHelper = new THREE.CameraHelper(cameraOrtho);
    //	scene.add(cameraOrthoHelper);

    //	//

    //	activeCamera = cameraPerspective;
    //	activeHelper = cameraPerspectiveHelper;


    //	// counteract different front orientation of cameras vs rig

    //	cameraOrtho.rotation.y = Math.PI;
    //	cameraPerspective.rotation.y = Math.PI;

    //	cameraRig = new THREE.Group();

    //	cameraRig.add(cameraPerspective);
    //	cameraRig.add(cameraOrtho);

    //	scene.add(cameraRig);

    //	//

    //	mesh = new THREE.Mesh(
    //		new THREE.SphereGeometry(100, 16, 8),
    //		new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true })
    //	);
    //	scene.add(mesh);

    //	const mesh2 = new THREE.Mesh(
    //		new THREE.SphereGeometry(50, 16, 8),
    //		new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true })
    //	);
    //	mesh2.position.y = 150;
    //	mesh.add(mesh2);

    //	const mesh3 = new THREE.Mesh(
    //		new THREE.SphereGeometry(5, 16, 8),
    //		new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true })
    //	);
    //	mesh3.position.z = 150;
    //	cameraRig.add(mesh3);

    //	//

    //	const geometry = new THREE.BufferGeometry();
    //	const vertices = [];

    //	for (let i = 0; i < 10000; i++) {

    //		vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
    //		vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
    //		vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z

    //	}

    //	geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    //	const particles = new THREE.Points(geometry, new THREE.PointsMaterial({ color: 0x888888 }));
    //	scene.add(particles);

    //	//

    //	renderer = new THREE.WebGLRenderer({ antialias: true });
    //	renderer.setPixelRatio(window.devicePixelRatio);
    //	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    //	/*container.appendChild(renderer.domElement);*/

    //	renderer.autoClear = false;

    //	//

    //	//stats = new Stats();
    //	//container.appendChild(stats.dom);

    //	//

    //	window.addEventListener('resize', onWindowResize);
    //	document.addEventListener('keydown', onKeyDown);

    //}

    ////

    //function onKeyDown(event) {

    //	switch (event.keyCode) {

    //		case 79: /*O*/

    //			activeCamera = cameraOrtho;
    //			activeHelper = cameraOrthoHelper;

    //			break;

    //		case 80: /*P*/

    //			activeCamera = cameraPerspective;
    //			activeHelper = cameraPerspectiveHelper;

    //			break;

    //	}

    //}

    ////

    //function onWindowResize() {

    //	SCREEN_WIDTH = window.innerWidth;
    //	SCREEN_HEIGHT = window.innerHeight;
    //	aspect = SCREEN_WIDTH / SCREEN_HEIGHT;

    //	renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    //	camera.aspect = 0.5 * aspect;
    //	camera.updateProjectionMatrix();

    //	cameraPerspective.aspect = 0.5 * aspect;
    //	cameraPerspective.updateProjectionMatrix();

    //	cameraOrtho.left = - 0.5 * frustumSize * aspect / 2;
    //	cameraOrtho.right = 0.5 * frustumSize * aspect / 2;
    //	cameraOrtho.top = frustumSize / 2;
    //	cameraOrtho.bottom = - frustumSize / 2;
    //	cameraOrtho.updateProjectionMatrix();

    //}

    ////

    //function animate() {

    //	requestAnimationFrame(animate);

    //	render();
    //	//stats.update();

    //}


    //function render() {

    //	const r = Date.now() * 0.0005;

    //	mesh.position.x = 0;// * Math.cos(r);
    //	mesh.position.z = -800;// * Math.sin(r);
    //	mesh.position.y = -600;// * Math.sin(r);

    //	mesh.children[0].position.x = 70 * Math.cos(2 * r);
    //	mesh.children[0].position.z = 70 * Math.sin(r);

    //	if (activeCamera === cameraPerspective) {

    //		cameraPerspective.fov = 35 + 30;// * Math.sin(0.5 * r);
    //		cameraPerspective.far = mesh.position.length();
    //		cameraPerspective.updateProjectionMatrix();

    //		cameraPerspectiveHelper.update();
    //		cameraPerspectiveHelper.visible = true;

    //		cameraOrthoHelper.visible = false;

    //	} else {

    //		cameraOrtho.far = mesh.position.length();
    //		cameraOrtho.updateProjectionMatrix();

    //		cameraOrthoHelper.update();
    //		cameraOrthoHelper.visible = true;

    //		cameraPerspectiveHelper.visible = false;

    //	}

    //	cameraRig.lookAt(mesh.position);

    //	renderer.clear();

    //	activeHelper.visible = false;

    //	renderer.setViewport(0, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
    //	renderer.render(scene, activeCamera);

    //	activeHelper.visible = true;

    //	renderer.setViewport(SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2, SCREEN_HEIGHT);
    //	renderer.render(scene, camera);

    //}



    //const scene = new THREE.Scene
    //scene.background = new THREE.Color(0x7f7f7f);
    //const camera = new THREE.PerspectiveCamera(70, 1, 0.5, 2000);
    //camera.position.set(20, 15, 10);
    //camera.rotation.set(.0, .0, .0);
    //camera.lookAt(0, 0, 0)

    //// LIGHTS
    //const light = new THREE.SpotLight(0xFFFFFF, 0.99);
    //light.position.set(10, 1, -5);
    //light.target.position.set(1, 2, 1);

    //scene.add(light);
    //scene.add(light.target);

    //const cameraHelper = new THREE.CameraHelper(light.shadow.camera);
    //scene.add(cameraHelper);

    //// SKYDOME

    //const vertexShader = `
    //varying vec3 vWorldPosition;

    //			void main() {

    //				vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
    //				vWorldPosition = worldPosition.xyz;

    //				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    //			}
    //`
    //const fragmentShader = `
    //uniform vec3 topColor;
    //			uniform vec3 bottomColor;
    //			uniform float offset;
    //			uniform float exponent;

    //			varying vec3 vWorldPosition;

    //			void main() {

    //				float h = normalize( vWorldPosition + offset ).y;
    //				gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );

    //			}
    //`;
    //const uniforms = {
    //    topColor: { value: new THREE.Color(0x0077ff) },
    //    bottomColor: { value: new THREE.Color(0xffffff) },
    //    offset: { value: 400 },
    //    exponent: { value: 0.6 }
    //};
    //uniforms.topColor.value.copy(light.color);

    //const skyGeo = new THREE.SphereGeometry(4000, 32, 15);
    //const skyMat = new THREE.ShaderMaterial({
    //    uniforms: uniforms,
    //    vertexShader: vertexShader,
    //    fragmentShader: fragmentShader,
    //    side: THREE.BackSide
    //});

    //const sky = new THREE.Mesh(skyGeo, skyMat);
    //scene.add(sky);


    //const renderer = new THREE.WebGLRenderer({ antialias: true });
    //renderer.setSize(innerWidth * 0.8, innerHeight * 0.8);

    ////let controls = new OrbitControls(camera, renderer.domElement);

    //let path = new THREE.Path();
    //path.absarc(5, 0, 1, Math.PI * 0.5, Math.PI * 1.5, true);
    //path.absarc(-5, 0, 1, Math.PI * 1.5, Math.PI * 0.5, true);
    //path.closePath();
    //console.log(path)
    //let basePts = path.getSpacedPoints(200).reverse();

    //let g = new THREE.PlaneGeometry(1, 1, 200, 1);
    //basePts.forEach((p, idx) => {
    //    g.attributes.position.setXYZ(idx, p.x, p.y, -2);
    //    g.attributes.position.setXYZ(idx + 201, p.x, p.y, 2);
    //})

    //const m = new THREE.MeshToonMaterial({
    //    side: THREE.DoubleSide,
    //    map: createTexture()
    //});

    //let band = new THREE.Mesh(g, m);
    //scene.add(band);


    //window.addEventListener("resize", () => {
    //    camera.aspect = innerWidth / innerHeight;
    //    camera.updateProjectionMatrix();
    //    renderer.setSize(innerWidth, innerHeight);
    //})

    //let clock = new THREE.Clock();

    //renderer.setAnimationLoop(() => {
    //    m.map.offset.x = clock.getElapsedTime();
    //    renderer.render(scene, camera);
    //});

    //function createTexture() {
    //    let c = document.createElement("canvas");
    //    c.width = c.height = 256;
    //    const ctx = c.getContext("2d");
    //    ctx.fillStyle = "maroon";
    //    ctx.fillRect(0, 0, c.width, c.height);
    //    ctx.strokeStyle = "white";
    //    ctx.beginPath();
    //    ctx.moveTo(0, 0);
    //    ctx.lineWidth = 100;
    //    ctx.lineTo(c.width, c.height);
    //    ctx.stroke();

    //    let texture = new THREE.CanvasTexture(c);
    //    texture.wrapS = THREE.RepeatWrapping;
    //    texture.wrapT = THREE.MirroredRepeatWrapping;
    //    texture.repeat.set(10, 2);

    //    return texture;
    //}

    //renderer.setSize(window.innerWidth/2, window.innerHeight/2);
    //document.body.appendChild(renderer.domElement);

    //const geometry = new THREE.BoxGeometry(1, 1, 1);
    //const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    //const cube = new THREE.Mesh(geometry, material);
    //scene.add(cube);

    //camera.position.z = 5;


    //function animate() {
    //    requestAnimationFrame(animate);

    //    cube.rotation.x += 0.01;
    //    cube.rotation.y += 0.01;

    //    renderer.render(scene, camera);
    //};

    //animate();


}

export default function Belt() {

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
                {/*<canvas id="belt"></canvas>   */}

            </section>
        </>
    );
}




