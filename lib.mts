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

export function client(options: Partial<ClientOptions>) {
    let channelId: number | null = null;
    async function connect() { 
        const socket = await Bun.connect({
            hostname: 'localhost',
            port: 8080,
            socket: {
                open(socket) {
                },
                data(_, data) {
                    const type = data[0];
                    const payload = data.subarray(0);

                    type == SSH_MSG_CHANNEL_OPEN_CONFIRMATION
                        ? channelId = payload.readUInt32BE(4)
                        : type == SSH_MSG_CHANNEL_DATA
                            ? (() => {
                                const channel = payload.readUInt32BE(0);
                                const content = decoder.decode(payload.subarray(4));       
                            })()
                            : type == SSH_MSG_CHANNEL_SUCCESS
                                ? (() => {

                                })()
                                : ''
                }
            }
        });
    }

    return {
        connect
    }
}
