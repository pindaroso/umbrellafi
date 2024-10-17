// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from 'forge-std/Script.sol';

import {Manager} from '../src/Manager.sol';

contract UpdateWeightsScript is Script {
  function run() public {
    vm.startBroadcast();
    uint256 poolIndex = 0;
    Manager(vm.envAddress('MANAGER_ADDRESS')).updateWeights(poolIndex);
    vm.stopBroadcast();
  }
}
