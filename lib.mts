import type { Socket } from "bun";

interface ClientOptions {
    username: string;
    password: string;
    host: string;
    port: number;
}

const SSH_MSG_DISCONNECT = 1;
const SSH_MSG_IGNORE = 2;
const SSH_MSG_UNIMPLEMENTED = 3;
const SSH_MSG_DEBUG = 4;
const SSH_MSG_SERVICE_REQUEST = 5;
const SSH_MSG_SERVICE_ACCEPT = 6;
const SSH_MSG_EXT_INFO = 7;
const SSH_MSG_NEWCOMPRESS = 8;
const SSH_MSG_KEXINIT = 20;
const SSH_MSG_NEWKEYS = 21;
const SSH_MSG_USERAUTH_REQUEST = 50;
const SSH_MSG_USERAUTH_FAILURE = 51;
const SSH_MSG_USERAUTH_SUCCESS = 52;
const SSH_MSG_USERAUTH_BANNER = 53;
const SSH_MSG_USERAUTH_INFO_REQUEST = 60;
const SSH_MSG_USERAUTH_INFO_RESPONSE = 61;
const SSH_MSG_GLOBAL_REQUEST = 80;
const SSH_MSG_REQUEST_SUCCESS = 81;
const SSH_MSG_REQUEST_FAILURE = 82;
const SSH_MSG_CHANNEL_OPEN = 90;
const SSH_MSG_CHANNEL_OPEN_CONFIRMATION = 91;
const SSH_MSG_CHANNEL_OPEN_FAILURE = 92;
const SSH_MSG_CHANNEL_WINDOW_ADJUST = 93;
const SSH_MSG_CHANNEL_DATA = 94;
const SSH_MSG_CHANNEL_EXTENDED_DATA = 95;
const SSH_MSG_CHANNEL_EOF = 96;
const SSH_MSG_CHANNEL_CLOSE = 97;
const SSH_MSG_CHANNEL_REQUEST = 98;
const SSH_MSG_CHANNEL_SUCCESS = 99;
const SSH_MSG_CHANNEL_FAILURE = 100;

const decoder = new TextDecoder();
const queues = new Set<{}>();

const _ = client({});
_.connect();
interface ClientOptions {
    user: string;
    password: string;
    host: string;
    port: number;
}

const D = new TextDecoder();
const E = new TextEncoder();

function createPacket() {}

function client(options: Partial<ClientOptions>) {
    let s: Socket;
    let r: Function;
    const p = new Promise((y) => (r = y));

    function write(t: number, d: Uint8Array = new Uint8Array()) {
        const b = new Uint8Array(d.length + 4 + (4 - ((d.length + 1) % 8)) % 8);

        new DataView(d.buffer).setUint32(0, d.length + 1);
        b[4] = t;

        if (d.length > 0 && b.length >= d.length + 5) {
            b.set(d, 5);
        }

        s.write(b);
    }

    async function connect() {
        s = await Bun.connect({
            hostname: 'localhost',
            port: 22,
            socket: {
                error(socket, error) {
                    console.error(error)
                },
                async open(socket) {
                    write(255, E.encode('SSH-2.0-sshx\r\n'));
                    write(SSH_MSG_KEXINIT);
                    await p;
                    write(SSH_MSG_USERAUTH_REQUEST, E.encode(options.user + `\x00${SSH_CONNECTION_STRING}\x00password\x00\x00` + options.password));
                },
                data(socket, data) {
                    const type = data[0];
                    const payload = data.subarray(0);
                    console.log(type, D.decode(payload));
    
                    ({
                        [SSH_MSG_SERVICE_ACCEPT]() {
                            if(!options.user || !options.password) {
                                console.log('pas de username ou de password')
                                return;
                            }
                        },
                        //[SSH_MSG_CHANNEL_OPEN_CONFIRMATION]: () => c = payload.readUInt32BE(4),
                        [SSH_MSG_CHANNEL_DATA]() {
                            const channel = payload.readUInt32BE(0);
                            const content = D.decode(payload.subarray(4));
                        },
                        [SSH_MSG_USERAUTH_SUCCESS]() {
                            console.log('connecté');
        
                        },
                        [SSH_MSG_USERAUTH_FAILURE]() {
        
                        }
                    })[type]();
                }
            }
        })
    }

    return {
        connect
    }
}
let c = client({
    host: 'localhost',
    port: 22,
    user: 'test',
    password: 'password'
});
await c.connect();
