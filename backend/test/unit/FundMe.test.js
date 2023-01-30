const { expect, assert } = require("chai");
const { network, getNamedAccounts, deployments, ethers } = require("hardhat");
const { developmentChains } = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe unit test", () => {
        let fundMe, deployer;
        beforeEach(async () => {
            deployer = (await getNamedAccounts()).deployer;
            await deployments.fixture(["deploy"]);
            fundMe = await ethers.getContract("FundMe",deployer);
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
        describe("fund person with fixed amount function test", async () => {
            let player,connectedContract,startingBalance;
            beforeEach(async () => {
                player = (await ethers.getSigners())[1]
                await fundMe.getFunded(false, "10");
                connectedContract = await fundMe.connect(player);
                startingBalance = await fundMe.provider.getBalance(deployer);
            });
            it("reverts if the sent amount does not match the required amount", async () => {
                await expect(connectedContract.fundPerson(deployer, { value: "9" })).to.be.revertedWith("FundMe__NotEnoughFundsWereSent");
            });
            it("emits an event upon success", async () => {
                await expect(connectedContract.fundPerson(deployer, { value: "10" })).to.emit(connectedContract, "PersonFunded");
            });
            it("sends the fund value after success", async () => {
                await connectedContract.fundPerson(deployer, { value: "10" });
                const newBalance = await fundMe.provider.getBalance(deployer);
                assert(newBalance.sub(10).toString() == startingBalance.toString());
            });
            it("adds the funder to the funders list", async () => {
                await connectedContract.fundPerson(deployer, { value: "10" });
                const funder0 = (await connectedContract.getFunders(deployer))[0];
                assert(funder0 == player.address);
            });
            it("adds the recieved ammount to reciever amount", async () => {
                await connectedContract.fundPerson(deployer, { value: "10" });
                const recievedValue = await connectedContract.getRecivedFundsAmount(deployer);
                assert(recievedValue.toString() === "10");
            });
        });
        describe("fund person with changable amount function test", async () => {
            let player, connectedContract, startingBalance;
            beforeEach(async () => {
                player = (await ethers.getSigners())[1];
                await fundMe.getFunded(true,"0");
                connectedContract = await fundMe.connect(player);
                startingBalance = await fundMe.provider.getBalance(deployer);
            });
            it("reverts if the sent amount is zero", async () => {
                await expect(connectedContract.fundPerson(deployer, { value: "0" })).to.be.revertedWith("FundMe__NotEnoughFundsWereSent");
            });
            it("emits an event upon success", async () => {
                await expect(connectedContract.fundPerson(deployer, { value: "1" })).to.emit(connectedContract, "PersonFunded");
            });
            it("sends the fund value after success", async () => {
                await connectedContract.fundPerson(deployer, { value: "1" });
                const newBalance = await fundMe.provider.getBalance(deployer);
                assert(newBalance.sub(1).toString() == startingBalance.toString());
            });
            it("adds the funder to the funders list", async () => {
                await connectedContract.fundPerson(deployer, { value: "1" });
                const funder0 = (await connectedContract.getFunders(deployer))[0];
                assert(funder0 == player.address);
            });
            it("adds the recieved ammount to reciever amount", async () => {
                await connectedContract.fundPerson(deployer, { value: "1" });
                const recievedValue = await connectedContract.getRecivedFundsAmount(deployer);
                assert(recievedValue.toString() === "1");
            });
        });
    });