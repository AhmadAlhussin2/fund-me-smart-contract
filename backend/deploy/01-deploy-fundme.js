const { network, ethers } = require("hardhat");
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;

    console.log("Deploying contract");

    const fundMeContract = await deploy("FundMe", {
        from: deployer,
        args: [],
        logs: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    });

    console.log(`Contract deployed at ${fundMeContract.address}`);
}

module.exports.tags = ["all", "deploy"];