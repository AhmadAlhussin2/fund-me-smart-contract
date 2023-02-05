import {useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "@/constants";
import { useNotification } from "web3uikit";
import { Moralis } from "moralis-v1";
import { ethers } from "ethers";

const GetFunded = () => {
    const { chainId: chainIdHex ,isWeb3Enabled} = useMoralis();
    const chainId = parseInt(chainIdHex);

    const [fixedFundsFlag, setFixedFundsFlag] = useState(false);
    const [fundValue, setFundValue] = useState(0);

    const dispatch = useNotification();
    
    const contractAddressOnchain = chainId in contractAddress ? contractAddress[chainId] : null;
    
    const { runContractFunction: setNewFundraiser, isFetching: fetchingNewFundRaise, isLoading: loadingNewFundRaise } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddressOnchain,
        functionName: "getFunded",
        params: { changableFee: !fixedFundsFlag, fixedAmount: Moralis.Units.ETH(fundValue) }
    });

    const startListen = async () => {
        const web3Provider = await Moralis.enableWeb3();
        const contract = new ethers.Contract(contractAddressOnchain, abi, web3Provider);
        contract.on("FundRaiserAdded", () => {
            console.log("fund raiser added");
        });
    }
    useEffect(() => {
        if (isWeb3Enabled)
        startListen();
    },[isWeb3Enabled])

    useEffect(() => {
        if (fixedFundsFlag == false) setFundValue(0);
    }, [fixedFundsFlag]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await setNewFundraiser({
            onSuccess: handleSuccess,
            onError: (error)=>console.log(error)
        });
    }
    const handleSuccess = () => {
        dispatch({
            type: "info",
            message: "transaction complete",
            title: "Tx notificaiont",
            position: "topR",
            icon: "bell",
        });
    }

    return (
        <>
            <form>
                <div className="formContainer">
                    <label htmlFor="fundingGoal">Funding Goal </label>
                    <input type="number" name="fundingGoal" id="fundingGoal" />
                    <div className="checkBtn">
                        <label htmlFor="fixedFlag">Do you want your funds to be fixed? </label>
                        <input type="checkbox" id="fixedFlag" onChange={()=>setFixedFundsFlag(!fixedFundsFlag)} className="mb-2"/>
                    </div>
                    <div>
                    {
                        fixedFundsFlag  ? (
                            <>
                            <label htmlFor="fundAmount" disabled={!fixedFundsFlag} style={{marginTop:"0"}}>Specify the fixed fund amount </label>
                            <input type="number" name="fundAmount" id="fundAmount" disabled={!fixedFundsFlag} onChange={(e)=>setFundValue(e.target.value)}/>
                        </>
                        ) : <></>
                    }
                    </div>
                    <button onClick={handleSubmit} className="mt-4 bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700" >Start fundraiser</button>
                </div>
            </form>
        </>
    );
}

export default GetFunded