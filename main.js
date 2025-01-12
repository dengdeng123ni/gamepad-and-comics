const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('node:path')
const { execSync } = require('child_process')
const { HttpsProxyAgent } = require('https-proxy-agent');
const { getProxySettings, getAndTestProxySettings } = require("get-proxy-settings");
const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');
const os = require('os');
const net = require('net');
const { Blob } = require('buffer');
const WebSocket = require('ws');

browser = false;


const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const server = express();
const PORT = process.env.PORT || 7708;

server.use(cors());
// 使用 bodyParser 中间件解析请求体
server.use(express.json({ limit: '50mb' }));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.get('/api/get/ip', async (req, res) => {
    const ipAddress = getIpAddress();
    res.json({
        IP: ipAddress,
    });
    
});

server.post('/api/local/eval', async (req, res) => {
    const requestBody = req.body;
    const data = await getWebLocal(requestBody)
    res.json(data);
});
// 处理 POST 请求
server.post('/api/local/send', async (req, res) => {
    const requestBody = req.body;
    const data = await getWebLocal(requestBody)
    res.json(data);
});

server.get('/api/local/getAll', async (req, res) => {
    res.json([
        {
            id: "_420000000000",
            name: "手柄与漫画程序应用"
        }
    ]);
});

server.get('/api/win/focused', async (req, res) => {
    win.show()
    res.json([]);
});
server.get('/api/ws/getAll', async (req, res) => {
    let ids = [];
    for (const [clientId, ws] of clients) {
        if (ws.readyState === WebSocket.OPEN) {
            ids.push(clientId)
        }
    }
    const json = arr.filter(x => ids.includes(x.id))
    res.json(json);
});

server.post('/api/ws/send', async (req, res) => {
    const requestBody = req.body;
    const data = await getWsLocal(requestBody)
    res.json(data);
});
server.post('/api/ws/client/synamic/javascript', async (req, res) => {
    const requestBody = req.body;
    const data = await getWsEval(requestBody.client_id, requestBody.javascript)
    res.json(data);
});

// 启动服务器
server.use(express.static(path.join(__dirname, 'public/browser')));
// // 处理 SPA 客户端路由
server.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/browser/index.html'));
});
function isPortInUse(port, host = '127.0.0.1') {
    return new Promise((resolve, reject) => {
        const server = net.createServer();

        server.once('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true); // 端口被占用
            } else {
                reject(err); // 其他错误
            }
        });

        server.once('listening', () => {
            server.close(); // 如果成功监听，则关闭服务器
            resolve(false); // 端口未被占用
        });

        server.listen(port, host);
    });
}

const getIpAddress = () => {
    const interfaces = os.networkInterfaces();
    let ip = '';

    // 遍历网络接口，查找非回环地址
    for (const iface in interfaces) {
        for (const details of interfaces[iface]) {
            if (details.family === 'IPv4' && !details.internal) {
                ip = details.address;
                break;
            }
        }
        if (ip) break;
    }
    return ip || 'localhost'; // 如果没有找到 IP，默认使用 localhost
};


async function init() {
    browser = await puppeteer.launch({
        defaultViewport: null, // 设置为 null 窗口会最大化
        args: ['--start-maximized'], // 启动时最大化窗口 
    });
}

init()

async function getHtml(url) {
    const page = await browser.newPage();
    await page.goto(url);
    const html = await page.evaluate(() => document.documentElement.outerHTML);
    return html
}
async function executeEval(url, js) {
    const page = await browser.newPage();
    await page.goto(url);
    const res = await page.evaluate(async (js) => {
        const data = await eval(js)
        return data
    }, js);
    return res
}
async function getWindowWebProxy() {
    const res = await getProxySettings()
    if (res) return `http://${res.http.host}:${res.http.port}`
    else null
}
function getMacWebProxy() {
    // 这种方法需要考虑到用户使用不同网卡的情况，Wi-Fi 是网络设备名称，对于使用有线网卡的用户，可能需要替换成 Ethernet 等适当的名称
    const cmd = 'networksetup -getwebproxy "Wi-Fi"'
    const output = execSync(cmd).toString()
    const result = output.match(/(?:Enabled:\s)(\w+)\n(?:Server:\s)([^\n]+)\n(?:Port:\s)(\d+)/)

    if (result) {
        const [_, enabled, server, port] = result
        if (enabled === 'Yes') {
            return `http://${server}:${port}`
        }
    }

    return null
}

async function fetchc(url, options = {}) {
    const fetch = (await import('node-fetch')).default;
    let f = null;
    if (os.platform() === "win32") {
        f = await getWindowWebProxy()
    } else {
        f = getMacWebProxy();
    }
    let obj = {}
    if (f) obj["agent"] = new HttpsProxyAgent(f)
    const res = await fetch(url, obj)
    return res
}

async function fetchWithTimeoutAndRace(url, options = {}) {
    try {
        try {
            const requestPromise = await fetchc(url, options);
            return requestPromise;
        } catch (error) {
            const requestPromise = await fetchc(url, options);
            return requestPromise
        }
    } catch (error) {
        try {
            const requestPromise = await fetchc(url, options);
            return requestPromise;
        } catch (error) {
            return null
        }
    }
}
async function stringToReadStream(string) {
    const readableStream = new ReadableStream({
        start(controller) {
            for (const data of string) {
                controller.enqueue(Uint8Array.from(data));
            }
            controller.close();
        },
    });
    const response = new Response(readableStream)
    const json = await response.json();
    return JSON.stringify(json);
}
async function readStreamToString(response) {
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    return uint8Array;
}
let _gh_data = {};

let win;

const clients = new Map();
let arr = []
// 创建 Electron 窗口
async function createWindow() {

    const wss = new WebSocket.Server({ port: 7703 });
    wss.on('listening', () => {
        const address = wss.address();
        console.log('WebSocket 服务器已启动');
        console.log(`监听地址: ${address.address}`);
        console.log(`监听端口: ${address.port}`);
    });

    wss.on('connection', async (ws) => {
        ws.on('message', async (blob) => {
            const text = await new Blob([blob]).text();
            const c = JSON.parse(text); 
            if (c.type == "init") {
                clients.set(c.id, ws);
                arr.push({ id: c.id, name: c.name })
                const jsonData = { type: "init", name: c.name, id: c.id };
                const jsonString = JSON.stringify(jsonData);
                const blob = new Blob([jsonString], { type: "application/json" })
                ws.send(blob);
            } else if (c.type == "get_all_client") {
                let ids = [];
                for (const [clientId, ws] of clients) {
                    if (ws.readyState === WebSocket.OPEN) {
                        ids.push(clientId)
                    }
                }

                const res = arr.filter(x => ids.includes(x.id))
                const jsonData = { type: "get_all_client", id: c.id, data: res };
                const jsonString = JSON.stringify(jsonData);
                const blob = new Blob([jsonString], { type: "application/json" })
                ws.send(blob);
            } else if (c.type == "send") {
                const b = clients.get(c.receiver_client_id);
                if (b) b.send(blob)
            } else if (c.type == "receive") {
                const b = clients.get(c.receiver_client_id);
                if (b) b.send(blob)
            } else if (c.type == "http_receive") {
                _gh_data[c.id] = c.data;
            } else if (c.type == "http_receive_eval") {
                _gh_data[c.id] = c.data;
            }
        });
        ws.on('close', () => {
        });
        ws.on('error', (error) => {
            console.error('WebSocket error:', error);
        });
    });
    server.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
    // 监听 error 事件
    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.error(`端口 ${PORT} 已被占用，请使用其他端口。`);
        } else {
            console.error('服务器错误：', err);
        }
    });
    const options = {
        key: fs.readFileSync(path.join(__dirname, 'public/ssl/key.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'public/ssl/cert.pem'))
    };
    // 创建 HTTPS 服务
    const ipAddress = getIpAddress();
    https.createServer(options, server).listen(7707, ipAddress, () => {
        console.log(`HTTPS server running on https://${ipAddress}:3230`);
    });
    win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,  // 开启 Node.jsss 集成
        },
        backgroundColor: '#303030',

        show: false
    });
    Menu.setApplicationMenu(null);
    // win.webContents.openDevTools();

    ipcMain.on('message-from-renderer', async (event, arg) => {
        if (arg.type == "pulg_proxy_request") {
            let request = arg;
            if (request.http.option.body) request.http.option.body = await stringToReadStream(request.http.option.body);
            const rsponse = await fetchWithTimeoutAndRace(request.http.url, request.http.option)
            if (rsponse) {
                const data = await readStreamToString(rsponse)
                let headers = [];
                rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
                let res = { id: request.id, proxy_response_website_url: request.proxy_response_website_url, type: "proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } }
                event.reply('message-from-main', res);
            }
        } else if (arg.type == "website_proxy_request_html") {
            const src = await getHtml(arg.proxy_request_website_url);
            var myBlob = new Blob([src], {
                type: "application/text"
            });
            var init = { status: 200, statusText: "OK" };
            var rsponse = new Response(myBlob, init);
            const data = await readStreamToString(rsponse)
            let headers = [];
            rsponse.headers.forEach(function (value, name) { headers.push({ value, name }) });
            let res = { id: arg.id, proxy_response_website_url: arg.proxy_response_website_url, type: "proxy_response", data: { body: data, bodyUsed: rsponse.bodyUsed, headers: headers, ok: rsponse.ok, redirected: rsponse.redirected, status: rsponse.status, statusText: rsponse.statusText, type: rsponse.type, url: rsponse.url } };
            event.reply('message-from-main', res);
        } else if (arg.type == "website_request_execute_script") {
            const data = await executeEval(arg.proxy_request_website_url, arg.javascript);
            let res = { data: data, type: 'execute_script_data', id: arg.id }
            event.reply('message-from-main', res);
        } else if (arg.type == "electron_receive_local") {
            _gh_data[arg.id] = arg.data;
            setTimeout(() => {
                _gh_data[arg.id] = undefined;
            }, 10000)
        } else if (arg.type == "window_open") {
            console.log(arg);
            open(arg.url)
        }

    });

    win.loadURL(`http://localhost:${PORT}?config=${objectToBase64({ "local_network_url": `https://${ipAddress}:${7707}` })}`);

    win.webContents.on('did-finish-load', () => {
        win.show();  // 页面加载完成后显示窗口
    });
}

function objectToBase64(obj) {
    const jsonString = JSON.stringify(obj);
    const encodedString = encodeURIComponent(jsonString);
    const base64String = Buffer.from(encodedString, 'utf-8').toString('base64');

    return base64String;
}

const getWebLocal = (e) => {
    const id = Math.random().toString(36).substring(2, 9)
    win.webContents.send('message-from-main', {
        send_client_id: e.send_client_id,
        receiver_client_id: e.receiver_client_id,
        type: "electron_send_local",
        data: e.data,
        id
    })
    let bool = true;
    return new Promise((r, j) => {
        const getData = () => {
            setTimeout(() => {
                if (_gh_data[id]) {
                    bool = false;
                    r(_gh_data[id])
                } else {
                    if (bool) getData()
                }
            }, 33)
        }
        getData()

        setTimeout(() => {
            if (bool) {
                bool = false;
                r(null)
                j(null)
            }
            _gh_data[id] = undefined;
        }, 40000)
    })
}

const getWsEval = (client_id, javascript) => {
    const id = Math.random().toString(36).substring(2, 9)
    const b = clients.get(client_id); 
    if (b) {
        const jsonString = JSON.stringify({
            client_id: client_id,
            type: "http_send_eval",
            javascript: javascript,
            id
        });
        const blob = new Blob([jsonString], { type: "application/json" })
        b.send(blob)
    }
    let bool = true;
    return new Promise((r, j) => {
        const getData = () => {
            setTimeout(() => {
                if (_gh_data[id]) {
                    bool = false;
                    if(_gh_data[id]=="g93h_void"){
                        r(null)
                    }else{
                        r(_gh_data[id])
                    } 
                } else {
                    if (bool) getData()
                }
            }, 33)
        }
        getData()

        setTimeout(() => {
            if (bool) {
                bool = false;
                r(null)
                j(null)
            }
            _gh_data[id] = undefined;
        }, 40000)
    })
}

const getWsLocal = (e) => {
    const id = Math.random().toString(36).substring(2, 9)
    const b = clients.get(e.receiver_client_id);
    if (b) {
        const jsonString = JSON.stringify({
            send_client_id: e.send_client_id,
            receiver_client_id: e.receiver_client_id,
            type: "http_send",
            data: e.data,
            id
        });
        const blob = new Blob([jsonString], { type: "application/json" })
        b.send(blob)
    }
    let bool = true;
    return new Promise((r, j) => {
        const getData = () => {
            setTimeout(() => {
                if (_gh_data[id]) {
                    bool = false;
                    r(_gh_data[id])
                } else {
                    if (bool) getData()
                }
            }, 33)
        }
        getData()

        setTimeout(() => {
            if (bool) {
                bool = false;
                r(null)
                j(null)
            }
            _gh_data[id] = undefined;
        }, 40000)
    })
}

async function open(url) {
    const open = (await import('open')).default;
    open(url)
}

const gotTheLock = app.requestSingleInstanceLock();

async function win_quit() {
    const fetch = (await import('node-fetch')).default;
    await fetch("http://127.0.0.1:7708/api/win/focused")
    app.quit(); // 退出当前实例 
}

if (!gotTheLock) {
    win_quit()
} else {
    app.whenReady().then(() => {
        createWindow();
        app.on('activate', () => {
            if (BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    });
}

// 在所有窗口关闭时退出应用
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
