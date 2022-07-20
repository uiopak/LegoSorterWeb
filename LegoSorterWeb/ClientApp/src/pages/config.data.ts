import type { RouteDataFunc } from 'solid-app-router';
import { createResource } from 'solid-js';

const fetchConfigOption = async (option: any) =>
    (await fetch(`/api/Configuration/${option}/`)).json();


function fetchServerAddress(): Promise<string> {
    return fetchConfigOption("server_address");
}

function fetchServerPort(): Promise<any> {
    return fetchConfigOption("server_port");
}


const ConfigData: RouteDataFunc = () => {
    const [address] = createResource(fetchServerAddress);
    const [port] = createResource(fetchServerPort);
    const [data] = [{
        "address": address,
        "port": port
    }];

    return data;
};

export default ConfigData;
