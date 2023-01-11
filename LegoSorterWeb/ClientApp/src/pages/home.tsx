import { createSignal } from 'solid-js';

export default function Home() {

    return (
        <section class="bg-base-100 text-base-700 p-4">
            <h1 class="text-2xl font-bold">Lego sorter control page:</h1>
            <p class="mt-4">Control App - control phone app and sorter visualize results</p>
            <p class="mt-4">App Conf - phone app configuration</p>
            <p class="mt-4">Web Conf - this website server configuration</p>
            <p class="mt-4">Server Conf - control phone app, visualize results</p>
            <p class="mt-4">Sesions - add sessions to FiftyOne</p>
            <p class="mt-4">About - information about system</p>
            <p class="mt-4">Disconnected / Connected - information if phone is connected</p>
            <p class="mt-4">Theme change</p>
        </section>
    );
}
