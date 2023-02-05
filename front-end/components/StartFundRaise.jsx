import {useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { abi, contractAddress } from "@/constants";
import { useNotification } from "web3uikit";
import { Moralis } from "moralis-v1";
import { ethers } from "ethers";

const StartFundRaise = () => {

    /* get Global info */


    const { chainId: chainIdHex ,enableWeb3,isWeb3Enabled} = useMoralis();
    const chainId = parseInt(chainIdHex);

    const [fixedFundsFlag, setFixedFundsFlag] = useState(false);
    const [fundValue, setFundValue] = useState(0);

    const [reciver, setReciever] = useState("");
    const [funding, setFunding] = useState(0);
    
    const dispatch = useNotification();
    
    const contractAddressOnchain = chainId in contractAddress ? contractAddress[chainId] : null;
    
    const { runContractFunction: setNewFundraiser, isFetching: fetchingNewFundRaise, isLoading: loadingNewFundRaise } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddressOnchain,
        functionName: "getFunded",
        params: { changableFee: !fixedFundsFlag, fixedAmount: Moralis.Units.ETH(fundValue) }
    });
    const { runContractFunction: fetchAddressInfo } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddressOnchain,
        functionName: "getChangableFee",
        params: { reciever: reciver }
    });

    const { runContractFunction: getFundValue } = useWeb3Contract({
        abi: abi,
        contractAddress: contractAddressOnchain,
        functionName: "getFixedFundAmount",
        params: {reciever: reciver}
    });
    
    const startListen = async () => {
        const web3Provider = await Moralis.enableWeb3();
        const contract = new ethers.Contract(contractAddressOnchain, abi, web3Provider);
        contract.on("FundRaiserAdded", () => {
            console.log("fund raiser added");
        })
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
    const handleFund = async (e) => {
        e.preventDefault();
        const options = {
            abi: abi,
            functionName: "fundPerson",
            contractAddress: contractAddressOnchain,
            params: { recieverAddress: reciver },
            msgValue: Moralis.Units.ETH(funding)
        };    
        try {
            const tx = await Moralis.executeFunction({  ...options });
            const reciept = await tx.wait();
        }
        catch (e) {
            console.log(e);
        }
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
    useEffect(() => {
        handleFetch();
    },[reciver])

    const handleFetch = async () => {
        console.log(reciver);
        const res = await fetchAddressInfo();
        console.log(res);
        if (res == false) {
            const ret = await getFundValue({
                onError: (error)=>console.log(error)
            });
            console.log((Number(ret)/(10**18)).toString());
            setFunding((Number(ret)/(10**18)).toString());
        }
        else {
            setFunding(0);
        }
    }

    return (
        <>
            <form>
                <div className="formContainer">
                    <label htmlFor="fundingGoal">Funding Goal: </label>
                    <input type="number" name="fundingGoal" id="fundingGoal" className="mb-2 bg-slate-100 rounded"/>
                    <br />
                    
                    <label htmlFor="fixedFlag">Do you want your funds to be fixed? </label>
                    <input type="checkbox" id="fixedFlag" onChange={()=>setFixedFundsFlag(!fixedFundsFlag)} className="mb-2"/>
                    <br />
                    {
                        fixedFundsFlag  ? (
                        <>
                            <label htmlFor="fundAmount" disabled={!fixedFundsFlag}>Specify the fund amount: </label>
                            <input type="number" name="fundAmount" id="fundAmount" className="mb-2 bg-slate-100 rounded" disabled={!fixedFundsFlag} onChange={(e)=>setFundValue(e.target.value)}/>
                        </>
                        ) : <></>
                    }
                    <br />
                    <button onClick={handleSubmit} className="mt-4 bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700" >Start fundraiser</button>
                </div>
            </form>

            <form className="mt-10">
            <div className="formContainer">
                <label htmlFor="recieverAddress">Reciver address: </label>
                <input type="text" name="recieverAddress" id="recieverAddress" className="mb-2 bg-slate-100 rounded" onChange={(e)=>setReciever(e.target.value)}/>
                <br />

                <label htmlFor="fundAmount" disabled={!fixedFundsFlag}>Specify the fund amount: </label>
                <input type="number" name="fundAmount" id="fundAmount" className="mb-2 bg-slate-100 rounded" onChange={(e)=>setFunding(e.target.value)} value={funding}/>

                <br />
                    <button onClick={handleFund} className="mt-4 bg-blue-500 px-4 py-2 rounded text-white hover:bg-blue-700" >Fund</button>
                    </div>
            </form>
        </>
    );
}

export default StartFundRaise