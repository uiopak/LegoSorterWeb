import { Component, createEffect, createResource, createSignal, Suspense } from 'solid-js';
import { useRouteData } from 'solid-app-router';

export default function About() {
    const serverName = useRouteData<{ address: () => string, port: () => string }>();


    return (
        <section class="bg-base-300 text-base-800 p-8">
            <h1 class="text-2xl font-bold">Config</h1>

            <p class="mt-4">Server connection data:</p>

            
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">Server address</span>
                </label>
                <Suspense fallback={<input type="text" placeholder="address" class="input input-bordered w-full max-w-xs"/>}>
                    <input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" value={serverName.address()} />
                </Suspense>
            </div>
             
            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">Server port</span>
                </label>
                <Suspense fallback={<input type="text" placeholder="port" class="input input-bordered w-full max-w-xs" />}>
                    <input type="text" placeholder="port" class="input input-bordered w-full max-w-xs" value={serverName.port()} />
                </Suspense>
                <label class="label">
                    <span class="label-text"></span>
                </label>
            </div>
            <button class="btn" innerText="Save" />

        </section>
    );
}
