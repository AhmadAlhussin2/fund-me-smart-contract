// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

/// @title A fund me dapp that is used to get peer-to-peer funds
/// @author Ahmad Alhussin
contract FundMe {
    /* Errors */
    error FundMe__NeedTheAmountToFund();
    error FundMe__OnlyForFixedFunds();
    error FundMe__ReciverDoesNotExist();
    error FundMe__NotEnoughFundsWereSent();
    error FundMe__FundIsFixedAndAmountSpecified();

    /* Custom DSs */
    struct Reciever {
        address payable person;
        bool changableFee;
        uint256 fundAmount;
        uint256 amountFunded;
        address[] funders;
    }

    /* Events */
    event FundRaiserAdded();

    /* State variables */
    Reciever[] private recievers;
    mapping(address => Reciever) addressesToRecievers;

    /* Modifiers */
    modifier onlyFixedFunds(address reciever) {
        if (addressesToRecievers[reciever].changableFee == true)
            revert FundMe__OnlyForFixedFunds();
        _;
    }

    /* constructor */
    constructor() {}

    function getFunded(bool changableFee, uint256 fixedAmount) external {
        if (changableFee == false && fixedAmount == 0) {
            revert FundMe__NeedTheAmountToFund();
        }
        if (changableFee == true && fixedAmount != 0){
            revert FundMe__FundIsFixedAndAmountSpecified();
        }
        Reciever memory newReciever = Reciever(
            payable(msg.sender),
            changableFee,
            fixedAmount,
            0,
            new address[](0)
        );
        recievers.push(newReciever);
        addressesToRecievers[msg.sender] = newReciever;
        emit FundRaiserAdded();
    }

    function fundPerson(address recieverAddress) external payable {
        Reciever storage reciever = addressesToRecievers[recieverAddress];
        if (reciever.changableFee == false) {
            if (msg.value != reciever.fundAmount) {
                revert FundMe__NotEnoughFundsWereSent();
            }
        } else {
            if (msg.value == 0) {
                revert FundMe__NotEnoughFundsWereSent();
            }
        }
        uint256 recievedValue = msg.value;
        payable(recieverAddress).transfer(msg.value);
        reciever.funders.push(msg.sender);
        reciever.amountFunded += recievedValue;
    }

    /* Getters */

    function getFixedFundAmount(
        address reciever
    ) external view onlyFixedFunds(reciever) returns (uint256) {
        return addressesToRecievers[reciever].fundAmount;
    }

    function getChangableFee(address reciever) external view returns (bool) {
        return addressesToRecievers[reciever].changableFee;
    }

    function getRecivedFundsAmount(
        address reciever
    ) external view returns (uint256) {
        return addressesToRecievers[reciever].amountFunded;
    }

    function getFunders(
        address reciever
    ) external view returns (address[] memory) {
        return addressesToRecievers[reciever].funders;
    }
    
    function getRecievers() external view returns(Reciever[] memory){
        return recievers;
    }
}
