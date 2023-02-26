// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract King {

    address king;
    uint public prize;
    address public owner;

    constructor() payable {
        owner = msg.sender;
        king = msg.sender;
        prize = msg.value;
    }

    receive() external payable {
        console.log("King#receive msg.sender: ", msg.sender);
        require(msg.value >= prize || msg.sender == owner);
        payable(king).transfer(msg.value);
        king = msg.sender;
        prize = msg.value;
    }

    function _king() public view returns (address) {
        return king;
    }
}

error MustRetainKingship();

contract DeterminedKing {
    constructor(address payable king) payable {
        (bool sent, bytes memory data) = king.call{value: msg.value}("");
        console.log("DeterminedKing#constructor sent: ", sent);
    }

    receive() external payable {
//        console.log("I will never give up my kingship");
//        revert MustRetainKingship();
    }
}