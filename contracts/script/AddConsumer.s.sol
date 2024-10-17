// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from 'forge-std/Script.sol';

import {IFunctionsSubscriptions} from '../src/chainlink/functions/interfaces/IFunctionsSubscriptions.sol';

contract AddConsumerScript is Script {
  function run() public {
    vm.startBroadcast();
    IFunctionsSubscriptions(vm.envAddress('CHAINLINK_SUBSCRIPTIONS_ADDRESS'))
      .addConsumer(603, vm.envAddress('RISK_ENGINE_ADDRESS'));
    vm.stopBroadcast();
  }
}
