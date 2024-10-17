// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from 'forge-std/Script.sol';

import {Manager} from '../src/Manager.sol';

contract DeployScript is Script {
  function run() public {
    vm.startBroadcast();

    address router = 0x6E2dc0F9DB014aE19888F539E59285D2Ea04244C;
    bytes32 donId = 0x66756e2d706f6c79676f6e2d6d756d6261692d31000000000000000000000000;
    string
      memory source = 'const etfIndex = parseInt(args[0]); const assetIndex = parseInt(args[1]);'
      'const response = await Functions.makeHttpRequest({url: `https://app.umbrellafi.xyz/api/riskengine/weights?etfIndex=${etfIndex}`});'
      "if (response.status !== 200) throw new Error('Request failed');"
      'const { weights } = response.data;'
      'return Functions.encodeUint256(weights[assetIndex]);';
    uint32 gasLimit = 300000;
    uint64 subId = 603;
    new Manager(subId, router, donId, source, gasLimit);

    vm.stopBroadcast();
  }
}
