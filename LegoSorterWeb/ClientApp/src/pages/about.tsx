import { Component, createEffect, Suspense } from 'solid-js';
import { useRouteData } from '@solidjs/router';

export default function About() {
    return (
        <section class="bg-base-300 text-base-800 p-8">
            <h1 class="text-2xl font-bold">About</h1>

            <p class="mt-4">A page all about lego sorter control.</p>
            <p class="mt-4">Session - clicking Fiftyone logo might load database</p>

        </section>
    );
}
