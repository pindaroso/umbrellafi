// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {IERC20} from './IERC20.sol';

interface IERC20Wrapper is IERC20 {
  function deposit() external payable;

  function withdraw(uint amount) external;
}
