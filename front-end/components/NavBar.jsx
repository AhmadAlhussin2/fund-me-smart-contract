import { ConnectButton } from "web3uikit";
import Image from "next/image";
import Style from "../styles/Home.module.css";
import Link from "next/link";

const NavBar = () => {
    return (
        <div className="border-b-2 flex flex-row p-2 mb-2">
            <Image src="/donate-icon.png" alt="logo" width={70} height={0}/>
            <Link href="/"><h1 className="py-4 px-4 font-blog text-3xl">Fund me with ETH</h1></Link>
            <div className="ml-auto py-2 px-4">
                <ConnectButton moralisAuth={false}></ConnectButton>
            </div>
        </div>
    );
}

export default NavBar