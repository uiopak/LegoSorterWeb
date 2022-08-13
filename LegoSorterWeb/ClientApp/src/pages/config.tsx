import { Component, createEffect, createResource, createSignal, Suspense } from 'solid-js';
import { useRouteData } from 'solid-app-router';

export default function About() {
    const serverName = useRouteData<{ address: () => string, port: () => string }>();
    const [port, setPort] = createSignal("");
    const [address, setAddress] = createSignal("");
    const fetchConfigOption = async (option: any) =>
        (await fetch(`/api/Configuration/${option}/`)).json();


    function fetchServerAddress(): Promise<any> {
        return fetchConfigOption("server_address");
    }

    function fetchServerPort(): Promise<any> {
        return fetchConfigOption("server_port");
    }
    async function saveConnection() {
        await fetch(`/api/Configuration/server_address/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify({ "Option": "server_address", "Value": address() })
        });
        await fetch(`/api/Configuration/server_port/`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            body: JSON.stringify({ "Option": "server_port", "Value": port() })
        });

        setAddress(await fetchServerAddress());
        setPort(await fetchServerPort());

        await fetch(`/api/Sorter/?` + new URLSearchParams({
            address: address(),
            port: port(),
        }), {
            method: "PATCH",
        });
    }

    createEffect(() => {
        setPort(serverName.port())
        setAddress(serverName.address())
    })

    return (
        <section class="bg-base-300 text-base-800 p-8">
            <h1 class="text-2xl font-bold">Config</h1>

            <p class="mt-4">Server connection data:</p>

            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">Server address</span>
                </label>
                <Suspense fallback={<input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" />}>
                    <input type="text" placeholder="address" class="input input-bordered w-full max-w-xs" value={address()}
                        onChange={(e) => { setAddress(e.currentTarget.value) }} />
                </Suspense>
            </div>

            <div class="form-control w-full max-w-xs">
                <label class="label">
                    <span class="label-text">Server port</span>
                </label>
                <Suspense fallback={<input type="text" placeholder="port" class="input input-bordered w-full max-w-xs" />}>
                    <input type="text" placeholder="port" class="input input-bordered w-full max-w-xs" value={port()}
                        onChange={(e) => { setPort(e.currentTarget.value) }} />
                </Suspense>
                <label class="label">
                    <span class="label-text"></span>
                </label>
            </div>

            <button class="btn" innerText="Save" onClick={() => saveConnection()} />

        </section>
    );
}
