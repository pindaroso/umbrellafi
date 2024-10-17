'use client';

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import {
  FaChevronDown,
  FaEllipsisH,
  FaTimes,
  FaUmbrella,
} from 'react-icons/fa';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Image,
  ButtonGroup,
  Select,
  Input,
  SelectItem,
  Chip,
  useDisclosure,
} from '@nextui-org/react';
import toast, { Toaster } from 'react-hot-toast';
import { ContractTransactionReceipt } from 'ethers';
import { useRouter } from 'next/navigation';

import useStore from '@/stores/core';
import { formatAsset, type ETF } from '@/app/helpers';
import { BLOCK_EXPLORER_URL } from '@/app/constants';
import ETFDetails from '@/components/ETFDetails';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [txPending, setTxPending] = useState(false);
  const [etf, setETF] = useState({
    token: {
      name: '',
      symbol: '',
      address: '',
    },
    tvl: 0,
    fee: 0,
    created: 0,
    updated: 0,
    assets: [],
    weights: [],
    performance: {
      expectedAnnualReturn: null,
      annualVolatility: null,
      sharpeRatio: null,
    },
  } as ETF);
  const router = useRouter();
  const [assetMap, setAssetMap] = useState([] as any[]);

  const { isOpen, onOpen, onClose, onOpenChange } = useDisclosure();

  const {
    connectWallet,
    truncatedAddress,
    createETF: createPool,
    disconnectWallet,
    assets,
    fetchPerformance,
    initWallet,
  } = useStore();

  const links = [
    {
      id: 1,
      link: '/etfs',
      external: false,
      name: 'ETFs',
    },
    {
      id: 2,
      link: '/assets',
      external: false,
      name: 'Assets',
    },
    {
      id: 4,
      link: 'https://umbrellafi.readme.io/',
      external: true,
      name: 'Docs',
    },
  ];

  const onCreatePoolClick = async () => {
    setTxPending(true);
    onClose();

    try {
      await toast.promise(createPool(etf as ETF), {
        loading: 'Executing tx...',
        success: (receipt: ContractTransactionReceipt) => {
          const url = `${BLOCK_EXPLORER_URL}/tx/${receipt.hash}`;
          setTxPending(false);
          return (
            <span>
              Tx:{' '}
              <a
                href={url}
                style={{ textDecoration: 'underline' }}
                target="_blank"
              >
                <code>{receipt.hash.slice(0, 19)}...</code>
              </a>
            </span>
          );
        },
        error: 'Error executing tx',
      });
    } catch (e) {
      console.log('e', e);
    }
  };

  useEffect(() => {
    initWallet();
  }, [initWallet]);

  useEffect(() => {
    if (assets) {
      const assetMap = assets.map((asset, index) => ({
        id: index,
        name: asset.symbol,
      }));
      setAssetMap(assetMap);
    }
  }, [assets]);

  return (
    <div className="flex items-center justify-between w-full px-4 bg-transparent fixed nav border-b-[1px] border-gray-800 z-20 py-2">
      <div className="flex justify-start w-full">
        <FaUmbrella aria-label="logo" className="mt-0.5 text-red-400 text-lg" />
        <div className="w-48">
          <h1 className="font-signature ml-2">
            <a
              className="text-gray-300 font-bold mr-10"
              onClick={() => router.push('/')}
            >
              UmbrellaFi
            </a>
          </h1>
        </div>
        <ul className="hidden md:flex">
          {links.map(({ id, link, name, external }) => (
            <li
              key={id}
              className="nav-links px-4 text-sm text-gray-300 mt-0.5 ext-gray-200 hover:text-gray-200 duration-200 link-underline"
            >
              <Link
                rel={external ? 'noopener noreferrer' : ''}
                target={external ? '_blank' : ''}
                passHref={external}
                href={link}
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {truncatedAddress ? (
        <Button
          aria-label="create"
          size="sm"
          isDisabled={!truncatedAddress}
          variant="bordered"
          className="hidden md:flex border-red-400 text-red-400 mr-2 rounded-full z-10"
          onClick={onOpen}
        >
          Create ETF
        </Button>
      ) : null}

      <ButtonGroup
        className="mr-2 ml-2 hidden md:flex"
        variant="flat"
        size="sm"
      >
        <Button style={{ backgroundColor: '#374151' }}>
          <Image alt="Matic logo" height={25} width={25} src="/matic.svg" />
        </Button>
        <Dropdown placement="bottom-end">
          <DropdownTrigger
            className="bg-gray-900"
            style={{
              border: 'none',
              borderLeft: 'solid',
              borderLeftWidth: '1px',
              borderLeftColor: 'black',
              margin: 0,
              backgroundColor: '#374151',
            }}
          >
            <Button isIconOnly>
              <FaChevronDown />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Merge options"
            selectedKeys={['polygon']}
            selectionMode="single"
            onSelectionChange={() => {}}
            className="max-w-[300px]"
          >
            <DropdownItem key="polygon">Polygon</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </ButtonGroup>

      {truncatedAddress ? (
        <div className="pl-2 py-1 px-4 hidden md:flex text-sm">
          <Dropdown aria-label="y">
            <DropdownTrigger aria-label="x">
              <code className="text-gray-100">{truncatedAddress}</code>
            </DropdownTrigger>
            <DropdownMenu aria-label="Network">
              <DropdownItem
                aria-label="disconnect"
                key="polygon"
                onClick={disconnectWallet}
              >
                Disconnect
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      ) : (
        <Button
          aria-label="connect"
          size="sm"
          variant="bordered"
          className="border-red-400 text-red-400 mr-2 rounded-full z-10"
          onClick={connectWallet}
        >
          Connect
        </Button>
      )}

      <div
        onClick={() => setNav(!nav)}
        className="cursor-pointer pr-4 text-gray-500 md:hidden z-30"
      >
        {nav ? <FaTimes size={30} className="" /> : <FaEllipsisH size={30} />}
      </div>
      {nav && (
        <ul className="flex flex-col justify-center items-center absolute top-0 left-0 w-full h-screen bg-gradient-to-b from-black to-gray-800 text-gray-500 z-20">
          {links.map(({ id, link, name }) => (
            <li
              key={id}
              className="px-4 cursor-pointer capitalize py-6 text-4xl"
            >
              <Link aria-label="y" onClick={() => setNav(!nav)} href={link}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      )}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="bg-gray-900"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
                <Input
                  type="name"
                  label="Name"
                  onChange={(e) => {
                    setETF({
                      ...etf,
                      token: {
                        symbol: etf.token.symbol,
                        name: e.target.value,
                        address: etf.token.address,
                      },
                    });
                  }}
                  placeholder="All Weather Fund"
                />
                <Input
                  type="symbol"
                  label="Symbol"
                  onChange={(e) => {
                    setETF({
                      ...etf,
                      token: {
                        symbol: e.target.value,
                        name: etf.token.name,
                        address: etf.token.address,
                      },
                    });
                  }}
                  placeholder="uAWF"
                />
                <Input
                  type="fee"
                  label="Fee"
                  onChange={(e) => {
                    setETF({
                      ...etf,
                      fee: parseInt(e.target.value),
                    });
                  }}
                  placeholder="1"
                />
                <Select
                  items={assetMap}
                  label="Assets"
                  isMultiline={true}
                  selectionMode="multiple"
                  placeholder="Select assets"
                  labelPlacement="inside"
                  onSelectionChange={(items) => {
                    const assets: string[] = Array.from(items).map(
                      (index) =>
                        assetMap.find((asset) => asset.id === index).name
                    );

                    fetchPerformance(assets).then((performance) => {
                      setETF({ ...etf, assets, performance });
                    });
                  }}
                  classNames={{
                    trigger: 'min-h-unit-12 py-2',
                  }}
                  renderValue={(items) => {
                    return (
                      <div className="flex flex-wrap gap-1 w-full">
                        {items.map((item) => (
                          <Chip key={item.key} className="bg-yellow-200">
                            {formatAsset(item.data.name)}
                          </Chip>
                        ))}
                      </div>
                    );
                  }}
                >
                  {(asset) => (
                    <SelectItem key={asset.index} textValue={asset.name}>
                      <div className="flex gap-2 items-center">
                        <div className="flex flex-col">
                          <span className="text-small">
                            {formatAsset(asset.name)}
                          </span>
                          <span className="text-tiny text-default-400">
                            {asset.name}
                          </span>
                        </div>
                      </div>
                    </SelectItem>
                  )}
                </Select>
              </ModalBody>
              <ModalFooter className="pt-1 flex w-full flex-col">
                <Button
                  className="w-full flex rounded-full justify-center bg-red-400"
                  disabled={txPending}
                  onPress={onCreatePoolClick}
                >
                  Create ETF
                </Button>
                <div className="w-full flex flex-col mt-0 justify-between text-tiny text-gray-400">
                  <ETFDetails etf={etf} />
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Toaster position="bottom-center" toastOptions={{ duration: 45_000 }} />
    </div>
  );
};

export default Navbar;
