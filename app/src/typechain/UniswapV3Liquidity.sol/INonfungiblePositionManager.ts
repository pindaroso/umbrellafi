/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "../common";

export declare namespace INonfungiblePositionManager {
  export type CollectParamsStruct = {
    tokenId: BigNumberish;
    recipient: AddressLike;
    amount0Max: BigNumberish;
    amount1Max: BigNumberish;
  };

  export type CollectParamsStructOutput = [
    tokenId: bigint,
    recipient: string,
    amount0Max: bigint,
    amount1Max: bigint
  ] & {
    tokenId: bigint;
    recipient: string;
    amount0Max: bigint;
    amount1Max: bigint;
  };

  export type DecreaseLiquidityParamsStruct = {
    tokenId: BigNumberish;
    liquidity: BigNumberish;
    amount0Min: BigNumberish;
    amount1Min: BigNumberish;
    deadline: BigNumberish;
  };

  export type DecreaseLiquidityParamsStructOutput = [
    tokenId: bigint,
    liquidity: bigint,
    amount0Min: bigint,
    amount1Min: bigint,
    deadline: bigint
  ] & {
    tokenId: bigint;
    liquidity: bigint;
    amount0Min: bigint;
    amount1Min: bigint;
    deadline: bigint;
  };

  export type IncreaseLiquidityParamsStruct = {
    tokenId: BigNumberish;
    amount0Desired: BigNumberish;
    amount1Desired: BigNumberish;
    amount0Min: BigNumberish;
    amount1Min: BigNumberish;
    deadline: BigNumberish;
  };

  export type IncreaseLiquidityParamsStructOutput = [
    tokenId: bigint,
    amount0Desired: bigint,
    amount1Desired: bigint,
    amount0Min: bigint,
    amount1Min: bigint,
    deadline: bigint
  ] & {
    tokenId: bigint;
    amount0Desired: bigint;
    amount1Desired: bigint;
    amount0Min: bigint;
    amount1Min: bigint;
    deadline: bigint;
  };

  export type MintParamsStruct = {
    token0: AddressLike;
    token1: AddressLike;
    fee: BigNumberish;
    tickLower: BigNumberish;
    tickUpper: BigNumberish;
    amount0Desired: BigNumberish;
    amount1Desired: BigNumberish;
    amount0Min: BigNumberish;
    amount1Min: BigNumberish;
    recipient: AddressLike;
    deadline: BigNumberish;
  };

  export type MintParamsStructOutput = [
    token0: string,
    token1: string,
    fee: bigint,
    tickLower: bigint,
    tickUpper: bigint,
    amount0Desired: bigint,
    amount1Desired: bigint,
    amount0Min: bigint,
    amount1Min: bigint,
    recipient: string,
    deadline: bigint
  ] & {
    token0: string;
    token1: string;
    fee: bigint;
    tickLower: bigint;
    tickUpper: bigint;
    amount0Desired: bigint;
    amount1Desired: bigint;
    amount0Min: bigint;
    amount1Min: bigint;
    recipient: string;
    deadline: bigint;
  };
}

export interface INonfungiblePositionManagerInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "collect"
      | "decreaseLiquidity"
      | "increaseLiquidity"
      | "mint"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "collect",
    values: [INonfungiblePositionManager.CollectParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "decreaseLiquidity",
    values: [INonfungiblePositionManager.DecreaseLiquidityParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "increaseLiquidity",
    values: [INonfungiblePositionManager.IncreaseLiquidityParamsStruct]
  ): string;
  encodeFunctionData(
    functionFragment: "mint",
    values: [INonfungiblePositionManager.MintParamsStruct]
  ): string;

  decodeFunctionResult(functionFragment: "collect", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "decreaseLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "increaseLiquidity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
}

export interface INonfungiblePositionManager extends BaseContract {
  connect(runner?: ContractRunner | null): INonfungiblePositionManager;
  waitForDeployment(): Promise<this>;

  interface: INonfungiblePositionManagerInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  collect: TypedContractMethod<
    [params: INonfungiblePositionManager.CollectParamsStruct],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "payable"
  >;

  decreaseLiquidity: TypedContractMethod<
    [params: INonfungiblePositionManager.DecreaseLiquidityParamsStruct],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "payable"
  >;

  increaseLiquidity: TypedContractMethod<
    [params: INonfungiblePositionManager.IncreaseLiquidityParamsStruct],
    [
      [bigint, bigint, bigint] & {
        liquidity: bigint;
        amount0: bigint;
        amount1: bigint;
      }
    ],
    "payable"
  >;

  mint: TypedContractMethod<
    [params: INonfungiblePositionManager.MintParamsStruct],
    [
      [bigint, bigint, bigint, bigint] & {
        tokenId: bigint;
        liquidity: bigint;
        amount0: bigint;
        amount1: bigint;
      }
    ],
    "payable"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "collect"
  ): TypedContractMethod<
    [params: INonfungiblePositionManager.CollectParamsStruct],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "payable"
  >;
  getFunction(
    nameOrSignature: "decreaseLiquidity"
  ): TypedContractMethod<
    [params: INonfungiblePositionManager.DecreaseLiquidityParamsStruct],
    [[bigint, bigint] & { amount0: bigint; amount1: bigint }],
    "payable"
  >;
  getFunction(
    nameOrSignature: "increaseLiquidity"
  ): TypedContractMethod<
    [params: INonfungiblePositionManager.IncreaseLiquidityParamsStruct],
    [
      [bigint, bigint, bigint] & {
        liquidity: bigint;
        amount0: bigint;
        amount1: bigint;
      }
    ],
    "payable"
  >;
  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<
    [params: INonfungiblePositionManager.MintParamsStruct],
    [
      [bigint, bigint, bigint, bigint] & {
        tokenId: bigint;
        liquidity: bigint;
        amount0: bigint;
        amount1: bigint;
      }
    ],
    "payable"
  >;

  filters: {};
}
