import Link from "next/link";

const page = () => {
    return (
        <div>
            About page
            <Link href="/" className="rounded-sm bg-slate-300">
                Home
            </Link>
        </div>
    );
};

export default page;
