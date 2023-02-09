// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Delegate {

    address public owner;

    constructor(address _owner) {
        console.log("in Delegate#constructor, _owner is: ", address(_owner));
        console.log("in Delegate#constructor, this   is: ", address(this));
        owner = _owner;
    }

    function pwn() public {
        console.log("in Delegate#pwn, msg.sender is: ", msg.sender);
        console.log("in Delegate#pwn, this       is: ", address(this));
        owner = msg.sender;
    }
}

contract Delegation {

    address public owner;
    Delegate delegate;

    constructor(address _delegateAddress) {
        console.log("in Delegation#constructor, _delegateAddress is: ", _delegateAddress);
        console.log("in Delegation#constructor, this             is: ", address(this));
        delegate = Delegate(_delegateAddress);
        owner = msg.sender;
    }

    fallback() external {
        console.log("in Delegation#fallback, msg.sender is: ", msg.sender);
        console.log("in Delegation#fallback, delegate   is: ", address(delegate));
        console.logBytes4(bytes4(msg.data[:4]));
        (bool result,) = address(delegate).delegatecall(msg.data);
        console.log("in Delegation#fallback, result     is: ", result);
        if (result) {
            this;
        }
    }
}