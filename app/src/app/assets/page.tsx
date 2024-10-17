'use client';

import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
} from '@nextui-org/react';
import { FaExternalLinkAlt } from 'react-icons/fa';

import { BLOCK_EXPLORER_URL } from '@/app/constants';
import useStore from '@/stores/core';
import Main from '@/components/Main';
import { concatEthereumAddress, formatAsset } from '@/app/helpers';

export default function Home() {
  const { assets } = useStore();

  return (
    <Main>
      <Table
        aria-label="Assets table"
        className="custom-table md:w-1/4 flex z-10 mx-auto sm:w-96"
      >
        <TableHeader className="bg-blue-100">
          <TableColumn key="asset">Symbol</TableColumn>
          <TableColumn key="address">Address</TableColumn>
        </TableHeader>
        <TableBody className="bg-blue-200">
          {assets.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <Chip
                  size="md"
                  key={row.address}
                  color="default"
                  className="bg-yellow-100"
                >
                  {formatAsset(row.symbol)}
                </Chip>
              </TableCell>
              <TableCell>
                <code className="text-gray-300 flex">
                  {concatEthereumAddress(row.address.toString())}
                  <a
                    href={`${BLOCK_EXPLORER_URL}/token/${row.address.toString()}`}
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Main>
  );
}
