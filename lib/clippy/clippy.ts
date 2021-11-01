import clippyjs from "clippyjs";
import "jquery";
import { useEffect, useState } from "react";

export type Agents =
    | "Clippy"
    | "Merlin"
    | "Rover"
    | "Links"
    | "Bonzi"
    | "F1"
    | "Genie"
    | "Genius"
    | "Peedy"
    | "Rocky";

export async function clippyAsync(agentName: Agents = "Clippy") {
    console.log(`Loading ${agentName}`);
    return new Promise((resolve, reject) => {
        clippyjs.load(
            agentName,
            (agent: any) => {
                resolve(agent);
            },
            (err: any) => {
                reject(err);
            },
            "/assets/agents/"
        );
    });
}

export function useClippy(agentName: Agents = "Clippy") {
    const [clippy, setClippy] = useState<Promise<any>>(clippyAsync(agentName));

    // useEffect(() => {
    //     setClippy(clippyAsync(agentName));
    // }, [agentName]);

    return { clippy };
}
