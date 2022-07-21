import { batch, createEffect, createResource, createSignal, For } from 'solid-js';
import { createStore } from "solid-js/store";
import type { StoreNode, Store, SetStoreFunction } from "solid-js/store";



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

//function send() {
//    console.log("a")
//    //connection.start().catch((err) => document.write(err));
//    console.log(connection.state)
//    connection.send("newMessage", username, message())
//        .then(() => (setMessage("")));

//}


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
        </>
    );
}




