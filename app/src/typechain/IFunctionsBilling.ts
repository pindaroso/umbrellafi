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
} from "./common";

export interface IFunctionsBillingInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "deleteCommitment"
      | "estimateCost"
      | "getAdminFee"
      | "getDONFee"
      | "getWeiPerUnitLink"
      | "oracleWithdraw"
      | "oracleWithdrawAll"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "deleteCommitment",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "estimateCost",
    values: [BigNumberish, BytesLike, BigNumberish, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getAdminFee",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getDONFee",
    values: [BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "getWeiPerUnitLink",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "oracleWithdraw",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "oracleWithdrawAll",
    values?: undefined
  ): string;

  decodeFunctionResult(
    functionFragment: "deleteCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "estimateCost",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getAdminFee",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getDONFee", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "getWeiPerUnitLink",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "oracleWithdraw",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "oracleWithdrawAll",
    data: BytesLike
  ): Result;
}

export interface IFunctionsBilling extends BaseContract {
  connect(runner?: ContractRunner | null): IFunctionsBilling;
  waitForDeployment(): Promise<this>;

  interface: IFunctionsBillingInterface;

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

  deleteCommitment: TypedContractMethod<
    [requestId: BytesLike],
    [void],
    "nonpayable"
  >;

  estimateCost: TypedContractMethod<
    [
      subscriptionId: BigNumberish,
      data: BytesLike,
      callbackGasLimit: BigNumberish,
      gasPriceWei: BigNumberish
    ],
    [bigint],
    "view"
  >;

  getAdminFee: TypedContractMethod<[], [bigint], "view">;

  getDONFee: TypedContractMethod<[requestCBOR: BytesLike], [bigint], "view">;

  getWeiPerUnitLink: TypedContractMethod<[], [bigint], "view">;

  oracleWithdraw: TypedContractMethod<
    [recipient: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;

  oracleWithdrawAll: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "deleteCommitment"
  ): TypedContractMethod<[requestId: BytesLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "estimateCost"
  ): TypedContractMethod<
    [
      subscriptionId: BigNumberish,
      data: BytesLike,
      callbackGasLimit: BigNumberish,
      gasPriceWei: BigNumberish
    ],
    [bigint],
    "view"
  >;
  getFunction(
    nameOrSignature: "getAdminFee"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "getDONFee"
  ): TypedContractMethod<[requestCBOR: BytesLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "getWeiPerUnitLink"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "oracleWithdraw"
  ): TypedContractMethod<
    [recipient: AddressLike, amount: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "oracleWithdrawAll"
  ): TypedContractMethod<[], [void], "nonpayable">;

  filters: {};
}
