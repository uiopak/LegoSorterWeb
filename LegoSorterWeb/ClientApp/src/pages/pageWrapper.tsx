import { Outlet } from "solid-app-router";
import Tc from "../components/tc";



export default function PageWrapper() {
    return (
        <>
            <div class="navbar bg-base-200 gap-1">
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/">
                        Home
                    </a>
                </div>
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/belt">
                        Belt
                    </a>
                </div>
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/config">
                        Config
                    </a>
                </div>
                <div class="flex-none">
                    <a class="btn btn-ghost normal-case text-xl" href="/about">
                        About
                    </a>
                </div>
                <div class="flex-1">
                    <a class="btn btn-ghost normal-case text-xl" href="/error">
                        Error
                    </a>
                </div>
                <div class="gap-1">
                    <div class="flex-none">
                        <Tc />
                    </div>
                    <div class="flex-none">
                        <span> </span>
                    </div>
                    <div class="flex-none">
                        <div class="form-control" >
                            <label class="input-group">
                                <span>URL:</span>
                                <input type="text" readOnly class="input" value={location.pathname} />
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <main>
                <Outlet/>
            </main>
        </>
    );
}
