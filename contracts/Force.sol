// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Force {
    function boom(address payable target) payable public {
        selfdestruct(target);
    }
}

contract ForcePushEth {
    function boom(address payable target) payable public {
        selfdestruct(target);
    }
}