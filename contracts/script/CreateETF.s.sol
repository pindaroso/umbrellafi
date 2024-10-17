// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from 'forge-std/Script.sol';

import {Manager} from '../src/Manager.sol';

contract CreateETFScript is Script {
  function run() public {
    vm.startBroadcast();

    string[] memory assets = new string[](3);
    assets[0] = 'BTC-USD.CC';
    assets[1] = 'ETH-USD.CC';
    assets[2] = 'MATIC-USD.CC';

    Manager(vm.envAddress('MANAGER_ADDRESS')).createETF(
      'uAWF',
      'All Weather Fund',
      1,
      assets
    );

    vm.stopBroadcast();
  }
}
