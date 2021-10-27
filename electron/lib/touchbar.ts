import { TouchBar } from "electron";
import fetch from "node-fetch";
import { EventService } from "../../lib/TBAApi";
import { getCurrentEvent, getTBAWriteCredentials } from "../../lib/fileio/data";
const { TouchBarLabel, TouchBarSpacer, TouchBarButton, TouchBarGroup } =
    TouchBar;

const eventName = new TouchBarLabel({
    label: getCurrentEvent(),
});

export async function setEventName() {
    EventService.getEventSimple(getCurrentEvent())
        .then((event) => {
            console.log("Touchbar Label:", event.name);
            eventName.label = event.name;
        })
        .catch((err) => {
            eventName.label = "No event found.";
        });
}

export async function codesSet() {
    const creds = getTBAWriteCredentials();
    console.log(creds);
    if (
        creds.clientId !== undefined &&
        creds.clientId !== "" &&
        creds.secret !== undefined &&
        creds.secret !== ""
    ) {
        qualUploadButton.enabled = true;
        elimUploadButton.enabled = true;
        forceUploadButton.enabled = true;
    } else {
        qualUploadButton.enabled = false;
        elimUploadButton.enabled = false;
        forceUploadButton.enabled = false;
    }
}

const qualUploadButton = new TouchBarButton({
    label: "Upload Quals",
    backgroundColor: "#767676",
    click: () => {
        console.log("Upload quals");
    },
});

export function setQualMode() {
    qualUploadButton.backgroundColor = "#0E6EB8";
    elimUploadButton.backgroundColor = "#767676";
}

const elimUploadButton = new TouchBarButton({
    label: "Upload Elims",
    backgroundColor: "#767676",
    click: () => {
        setEventName();
        console.log("Upload elims");
    },
});

export function setElimMode() {
    elimUploadButton.backgroundColor = "#0E6EB8";
    qualUploadButton.backgroundColor = "#767676";
}

const forceUploadButton = new TouchBarButton({
    label: "Force Upload All",
    backgroundColor: "#B03060",
    click: () => {
        console.log("Force upload");
    },
});

const touchbar = new TouchBar({
    items: [
        eventName,
        new TouchBarSpacer({ size: "large" }),
        qualUploadButton,
        elimUploadButton,
        new TouchBarSpacer({ size: "large" }),
        forceUploadButton,
    ],
});

export default touchbar;
