'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  Chip,
  TableCell,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { FaExternalLinkAlt } from 'react-icons/fa';

import Main from '@/components/Main';
import useStore from '@/stores/core';
import { concatEthereumAddress, formatAsset } from '@/app/helpers';
import { BLOCK_EXPLORER_URL } from '@/app/constants';

export default function Page() {
  const router = useRouter();
  const { etfs } = useStore();

  const onRowClick = (index: number) => {
    router.push(`/etfs/${etfs[index].token.address}`);
  };

  return (
    <Main>
      <Table
        aria-label="etfs table"
        className="custom-table mx-auto md:w-3/4 flex z-10 mx-auto sm:w-96"
      >
        <TableHeader>
          <TableColumn key="token">Token</TableColumn>
          <TableColumn key="tvl">TVL</TableColumn>
          <TableColumn key="assets">Assets</TableColumn>
          <TableColumn key="annual-volatility">Annual Volatility</TableColumn>
          <TableColumn key="expected-annual-return">
            Expected Annual Return
          </TableColumn>
          <TableColumn key="sharpe-ratio">Sharpe Ratio</TableColumn>
          <TableColumn key="fee">Fee</TableColumn>
        </TableHeader>
        <TableBody>
          {etfs.map((row, index) => (
            <TableRow
              key={index}
              onClick={() => onRowClick(index)}
              style={{ cursor: 'pointer' }}
            >
              <TableCell>
                <code className="text-gray-300 flex">
                  {concatEthereumAddress(row.token.address.toString())}
                  <a
                    href={`${BLOCK_EXPLORER_URL}/token/${row.token.address.toString()}`}
                    style={{ textDecoration: 'underline' }}
                    target="_blank"
                  >
                    <FaExternalLinkAlt
                      className="text-gray-300 ml-2"
                      style={{ paddingTop: '3px ' }}
                      size={15}
                    />
                  </a>
                </code>
              </TableCell>
              <TableCell>
                <span className="text-gray-100">${row.tvl}</span>
              </TableCell>
              <TableCell>
                {row.assets.map((asset: any) => (
                  <Chip
                    size="sm"
                    key={asset}
                    color="default"
                    className="mr-2 bg-yellow-100"
                  >
                    {formatAsset(asset)}
                  </Chip>
                ))}
              </TableCell>
              <TableCell>
                <span className="text-red-500">
                  {(row.performance.annualVolatility
                    ? row.performance.annualVolatility * 100
                    : 0
                  ).toFixed(2)}
                  %
                </span>
              </TableCell>
              <TableCell>
                <span className="text-green-500">
                  {(row.performance.expectedAnnualReturn
                    ? row.performance.expectedAnnualReturn * 100
                    : 0
                  ).toFixed(2)}
                  %
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-300">
                  {row.performance.sharpeRatio
                    ? row.performance.sharpeRatio.toFixed(2)
                    : 0}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-gray-300">{row.fee} bps</span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Main>
  );
}
