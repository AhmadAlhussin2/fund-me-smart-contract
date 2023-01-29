const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONTEND_ABI = "../frontend/constants/abi.json";
const FRONTEND_ADDRESSES = "../frontend/constants/contractAddress.json";

module.exports = async () => {
    console.log("updating front end ....");
    await updateABI();
    await updateAddress();
}

const updateABI = async () => {
    const contract = await ethers.getContract("FundMe");
    fs.writeFileSync(FRONTEND_ABI, contract.interface.format(ethers.utils.FormatTypes.json));
}

const updateAddress = async () => {
    const contract = await ethers.getContract("FundMe");
    const chainId = network.config.chainId;
    const networksList = JSON.parse(fs.readFileSync(FRONTEND_ADDRESSES, "utf8"));
    networksList[chainId]=contract.address;
    fs.writeFileSync(FRONTEND_ADDRESSES, JSON.stringify(networksList));
}

module.exports.tags = ["all", "frontent"];