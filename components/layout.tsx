'use client';

import '@/styles/globals.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  RiSwordFill,
  RiSwordLine,
  RiUserLine,
  RiUserFill,
  RiQuestionLine,
  RiQuestionFill,
} from 'react-icons/ri';

function Layout({ children, title }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-screen w-screen relative">
      <div className="h-10 fixed top-0 right-0 left-0 max-w-lg mx-auto bg-slate-800">
        <h1 className="text-center font-black pt-2.5">{title}</h1>
      </div>
      <div className="h-full pt-10 pb-40 w-full max-w-lg mx-auto shadow-inner md:shadow-accent overflow-scroll">
        {children}
      </div>
      <div className="h-20 md:h-14 fixed bottom-0 right-0 left-0 max-w-lg mx-auto bg-slate-800">
        <div className="flex flex-row justify-evenly pt-3.5">
          <Link href="/">
            {pathname === '/' ? (
              <RiSwordFill className="h-6 w-6" />
            ) : (
              <RiSwordLine className="h-6 w-6" />
            )}
          </Link>
          <Link href="/profile">
            {pathname === '/profile' ? (
              <RiUserFill className="h-6 w-6" />
            ) : (
              <RiUserLine className="h-6 w-6" />
            )}
          </Link>
          <Link href="/faq">
            {pathname === '/faq' ? (
              <RiQuestionFill className="h-6 w-6" />
            ) : (
              <RiQuestionLine className="h-6 w-6" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Layout;
