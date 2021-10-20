import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

export default function IndexPage() {
    const router = useRouter();
    useEffect(() => {
        router.push("/wizard/eventSelect");
    }, []);

    return <div></div>;
}
