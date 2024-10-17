'use client';

import { Button } from '@nextui-org/react';
import Main from '@/components/Main';
import Link from 'next/link';

export default function Home() {
  return (
    <Main>
      <div className="mx-auto mt-12 flex-full flex-col overflow-hidden md:w-3/4 sm:w-96 z-10 px-2 text-center">
        <h1 className="bg-gradient-to-r from-red-300 to-red-500 font-bold text-6xl inline-block text-transparent bg-clip-text pb-2">
          Balance risk with ease
        </h1>
        <p className="text-xl mt-4 text-red-100">
          Permissionless infrastructure to create, manage and trade tokenized
          ETFs
        </p>
        <Button
          as={Link}
          size="lg"
          href="/etfs"
          className="rounded-full mt-4 py-6 px-6 bg-gradient-to-tr from-red-300 to-red-500 text-white shadow-lg"
        >
          Get Started
        </Button>
      </div>
    </Main>
  );
}
