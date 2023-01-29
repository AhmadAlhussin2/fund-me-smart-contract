const { expect, assert } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../../web3 lottery/helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe unit test", () => {
        let fundMe, deployer;
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["deploy"]);
            fundMe = await ethers.getContract("FundMe", deployer);
        });
        describe("get funded function test", async () => {
            it("breaks if the fee is not changable, and there is no specific amount", async () => {
                await expect(fundMe.getFunded(false, "0")).to.be.revertedWith("FundMe__NeedTheAmountToFund");
            });
            it("breaks if the fee is changable, and there is specific amount", async () => {
                await expect(fundMe.getFunded(true, "10")).to.be.revertedWith("FundMe__FundIsFixedAndAmountSpecified");
            });
            it("emit an event upon successful adding of fundraiser", async () => {
                await expect(fundMe.getFunded(true, "0")).to.emit(fundMe, "FundRaiserAdded");
                await expect(fundMe.getFunded(false, "10")).to.emit(fundMe, "FundRaiserAdded");
            });
            it("initialize the fund amount successfully", async () => {
                await fundMe.getFunded(false, "10");
                const res = await fundMe.getFixedFundAmount(deployer);
                assert(res.toString() == "10");
            });
            it("revert when asking the fund amount if the fund amount is changable", async () => {
                await fundMe.getFunded(true, "0");
                await expect(fundMe.getFixedFundAmount(deployer)).to.be.revertedWith("FundMe__OnlyForFixedFunds");
            });
            it("starts with an empty balance, empty funders list, and add the person to recievers list", async () => {
                await fundMe.getFunded(false, "10");
                const fundAmount = await fundMe.getRecivedFundsAmount(deployer);
                assert(fundAmount.toString() == "0");
                const funders = await fundMe.getFunders(deployer);
                assert(funders.length == 0);
                const recieversList = await fundMe.getRecievers();
                assert(recieversList.length == 1);
                assert(recieversList[0].person == deployer);
            });
        });

    });