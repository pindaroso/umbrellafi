'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Input, Button } from '@nextui-org/react';
import { toast } from 'react-hot-toast';
import { ContractTransactionReceipt } from 'ethers';
import { FaArrowLeft } from 'react-icons/fa6';
import { useRouter } from 'next/navigation';

import Main from '@/components/Main';
import useStore from '@/stores/core';
import ETFDetails from '@/components/ETFDetails';
import { ETF } from '@/app/helpers';
import { BLOCK_EXPLORER_URL } from '@/app/constants';

export default function Page() {
  const path = usePathname();
  const [etf, setETF] = useState(null as ETF | null);
  const [amount, setAmount] = useState('');
  const [txPending, setTxPending] = useState(false);
  const { truncatedAddress, etfs, deposit, tokenBalances } = useStore();
  const router = useRouter();

  const onDepositClick = async () => {
    // TODO: Add decimals
    const amountU256 = parseInt(amount);
    const balance = tokenBalances.get('USDC-USD.CC') ?? 0;

    if (amountU256 > balance || balance === 0) {
      toast.error('You do not have enough USDC to deposit');
      return;
    }

    setTxPending(true);

    // TODO: Get correct index
    const index = 0;

    try {
      await toast.promise(deposit(index, amountU256), {
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
      setTxPending(false);
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
          onClick={router.back}
        >
          <FaArrowLeft />
        </a>
      </div>
      <div className="mx-auto flex-full flex-row rounded-medium overflow-hidden shadow-lg bg-gray-800 mx-auto w-96 z-10 mt-1">
        <div className="px-6 py-4 flex-row">
          <Input
            className="w-full mt-4"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            label="Amount"
            placeholder="0"
          />
          <Button
            isDisabled={!truncatedAddress}
            onClick={onDepositClick}
            disabled={txPending}
            className="bg-red-400 justify-center flex w-full text-white px-4 py-1 my-3 rounded-full"
          >
            Deposit USDC
          </Button>
          <ETFDetails etf={etf} />
        </div>
      </div>
    </Main>
  );
}
