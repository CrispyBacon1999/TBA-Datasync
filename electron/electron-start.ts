import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { app, BrowserWindow } from "electron";
import touchbar, {
    setEventName,
    setQualMode,
    setElimMode,
    codesSet,
} from "./lib/touchbar";

const createWindow = async () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    win.loadURL("http://localhost:3000");
    win.setTouchBar(touchbar);
    // Setup touchbar things
    setEventName();
    codesSet();
};

const dev = process.env.NODE_ENV !== "production";
const nextServer = next({ dev });
const handle = nextServer.getRequestHandler();

nextServer.prepare().then(() => {
    createServer(async (req, res) => {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url as string, true);
        const { pathname, query } = parsedUrl;

        await handle(req, res, parsedUrl);
        if (parsedUrl.path === "/api/app/eventCode") {
            setEventName();
        } else if (parsedUrl.path === "/wizard/qualupload") {
            setQualMode();
        } else if (parsedUrl.path === "/wizard/elimupload") {
            setElimMode();
        } else if (parsedUrl.path === "/api/app/writeKeys") {
            codesSet();
        }
    }).listen(3000, () => {
        console.log("> Ready on http://localhost:3000");
        app.whenReady().then(() => {
            createWindow();

            app.on("activate", function () {
                if (BrowserWindow.getAllWindows().length === 0) createWindow();
            });
        });
    });
});

app.on("window-all-closed", function () {
    if (process.platform !== "darwin") app.quit();
});
