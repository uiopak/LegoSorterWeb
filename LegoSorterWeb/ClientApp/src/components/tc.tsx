import { onMount } from 'solid-js';
import { themeChange } from "theme-change"

export default function Tc() {
    onMount(async () => {
        themeChange(false)
        // 👆 false parameter is required for react project
    })
    return (
        <div class="flex gap-2">
            <button data-set-theme="light" class="btn btn-ghost btn-square" data-act-class="btn-active">
                <svg class="inline-block w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>ionicons-v5-q</title><path d="M256,118a22,22,0,0,1-22-22V48a22,22,0,0,1,44,0V96A22,22,0,0,1,256,118Z" /><path d="M256,486a22,22,0,0,1-22-22V416a22,22,0,0,1,44,0v48A22,22,0,0,1,256,486Z" /><path d="M369.14,164.86a22,22,0,0,1-15.56-37.55l33.94-33.94a22,22,0,0,1,31.11,31.11l-33.94,33.94A21.93,21.93,0,0,1,369.14,164.86Z" /><path d="M108.92,425.08a22,22,0,0,1-15.55-37.56l33.94-33.94a22,22,0,1,1,31.11,31.11l-33.94,33.94A21.94,21.94,0,0,1,108.92,425.08Z" /><path d="M464,278H416a22,22,0,0,1,0-44h48a22,22,0,0,1,0,44Z" /><path d="M96,278H48a22,22,0,0,1,0-44H96a22,22,0,0,1,0,44Z" /><path d="M403.08,425.08a21.94,21.94,0,0,1-15.56-6.45l-33.94-33.94a22,22,0,0,1,31.11-31.11l33.94,33.94a22,22,0,0,1-15.55,37.56Z" /><path d="M142.86,164.86a21.89,21.89,0,0,1-15.55-6.44L93.37,124.48a22,22,0,0,1,31.11-31.11l33.94,33.94a22,22,0,0,1-15.56,37.55Z" /><path d="M256,358A102,102,0,1,1,358,256,102.12,102.12,0,0,1,256,358Z" /></svg>
            </button>
            <button data-set-theme="dark" class="btn btn-ghost btn-square" data-act-class="btn-active">
                <svg class="inline-block w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><title>ionicons-v5-j</title><path d="M152.62,126.77c0-33,4.85-66.35,17.23-94.77C87.54,67.83,32,151.89,32,247.38,32,375.85,136.15,480,264.62,480c95.49,0,179.55-55.54,215.38-137.85-28.42,12.38-61.8,17.23-94.77,17.23C256.76,359.38,152.62,255.24,152.62,126.77Z" /></svg>
            </button>
            <select data-choose-theme class="select">
                <option value="">Default</option>
                <option value="light">light</option>
                <option value="dark">dark</option>
                <option value="cupcake">cupcake</option>
                <option value="bumblebee">bumblebee</option>
                <option value="emerald">emerald</option>
                <option value="corporate">corporate</option>
                <option value="synthwave">synthwave</option>
                <option value="cyberpunk">cyberpunk</option>
                <option value="valentine">valentine</option>
                <option value="halloween">halloween</option>
                <option value="garden">garden</option>
                <option value="forest">forest</option>
                <option value="aqua">aqua</option>
                <option value="lofi">lofi</option>
                <option value="pastel">pastel</option>
                <option value="fantasy">fantasy</option>
                <option value="wireframe">wireframe</option>
                <option value="black">black</option>
                <option value="luxury">luxury</option>
                <option value="dracula">dracula</option>
                <option value="cmyk">cmyk</option>
                <option value="autumn">autumn</option>
                <option value="business">business</option>
                <option value="acid">acid</option>
                <option value="lemonade">lemonade</option>
                <option value="night">night</option>
                <option value="coffee">coffee</option>
                <option value="winter">winter</option>
            </select>
        </div>
    )
}