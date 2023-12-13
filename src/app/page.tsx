import Link from "next/link";
import ChatComponent from "./components/ChatComponent";

export default function Home() {
    return (
        <div>
            Home
            <Link href="/about" className="rounded-sm bg-slate-300">About</Link>
        </div>
    );
}
