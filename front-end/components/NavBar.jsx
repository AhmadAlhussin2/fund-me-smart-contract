import { ConnectButton } from "web3uikit";
import Image from "next/image";
import Link from "next/link";

const NavBar = () => {
    return (
        <div className="border-b-2 flex flex-row p-2 mb-2 navBar">
            <Link href="/" style={{ margin: "auto 0" ,display:"flex"}}>
                <Image src="/donate-icon.png" alt="logo" width={50} height={0} className="logo" />
                <h1 className="py-4 px-4 font-blog titleText">Fund me with ETH</h1>
            </Link>
            <div className="ml-auto py-2 px-4 accountBtn">
                <ConnectButton moralisAuth={false} ></ConnectButton>
            </div>
        </div>
    );
}

export default NavBar