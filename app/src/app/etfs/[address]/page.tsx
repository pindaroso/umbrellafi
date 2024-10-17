'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa6';
import { Button } from '@nextui-org/react';
import { ContractTransactionReceipt } from 'ethers';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import Main from '@/components/Main';
import useStore from '@/stores/core';
import { ETF, concatEthereumAddress } from '@/app/helpers';
import { BLOCK_EXPLORER_URL } from '@/app/constants';

export default function Page() {
  const path = usePathname();
  const [etf, setETF] = useState(null as ETF | null);
  const { etfs, updateWeights } = useStore();
  const router = useRouter();

  const onUpdateWeightsClick = async () => {
    // TODO: Fix
    const index = 0;
    try {
      await toast.promise(updateWeights(index), {
        loading: 'Executing tx...',
        success: (receipt: ContractTransactionReceipt) => {
          const url = `${BLOCK_EXPLORER_URL}/tx/${receipt.hash}`;
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
    if (!etf) {
      const address = path?.split('/')[2] || '';
      const currentETF = etfs.find((etf) => etf.token.address === address);
      if (currentETF) {
        setETF(currentETF);
      }
    }
  }, [etf, etfs, path]);

  return (
    <Main>
      <div className="mx-auto flex-full flex-row rounded-medium overflow-hidden shadow-lg mx-auto w-96 z-10">
        <a
          className="text-gray-400 flex mb-2 text-small"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/etfs')}
        >
          <FaArrowLeft />
        </a>
      </div>
      <div className="mx-auto flex-full flex-row rounded-medium overflow-hidden shadow-lg bg-gray-800 mx-auto w-96 z-10 mt-1">
        <div className="px-6 py-4 flex-row text-gray-300">
          <code>{etf ? concatEthereumAddress(etf.token.address) : '-'}</code>
        </div>
      </div>
      <div className="mx-auto flex-full flex-col rounded-medium overflow-hidden mx-auto w-96 z-10">
        <Button
          aria-label="update weights"
          variant="bordered"
          onClick={onUpdateWeightsClick}
          className="border-yellow-400 my-3 flex w-96 flex-full text-yellow-400 mr-2 rounded-full z-10"
        >
          Update Weights
        </Button>
        <Button
          aria-label="deposit"
          variant="bordered"
          onClick={(e) => {
            router.push(`/etfs/${etf?.token.address}/deposit`);
          }}
          className="border-red-400 my-3 flex w-96 flex-full text-red-400 mr-2 rounded-full z-10"
        >
          Deposit
        </Button>
        <Button
          aria-label="withdraw"
          variant="bordered"
          onClick={() => {
            router.push(`/etfs/${etf?.token.address}/withdraw`);
          }}
          className="border-gray-400 my-3 flex w-96 flex-full text-gray-400 mr-2 rounded-full z-10"
        >
          Withdraw
        </Button>
      </div>
    </Main>
  );
}
