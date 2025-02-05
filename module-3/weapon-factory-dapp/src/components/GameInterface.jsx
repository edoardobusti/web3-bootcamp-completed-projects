/* eslint-disable react/prop-types */
import { useAppContext } from "../AppContext";
import { useState, useRef, useEffect } from "react";

import "./css/custom-scrollbar.css";

import Item from "./Item";

import logo from "../assets/logo.svg";
import walletIcon from "../assets/wallet-icon.svg";
import userIcon from "../assets/user-icon.svg";
import signOutIcon from "../assets/sign-out-icon.svg";

import arrowLeft from "../assets/arrow-left.svg";
import arrowRight from "../assets/arrow-right.svg";
import LogOutWindow from "./LogOutWindow";

function GameInterface({ getAccounts }) {
  const { account, accountValue } = useAppContext();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const shortenAddress = (address) => {
    const start = address.substring(0, 6);
    const end = address.substring(address.length - 4);

    return `${start}....${end}`;
  };

  const scrollRef = useRef(null);

  const handleScroll = (e) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += e.deltaY;
    }
  };

  const scrollBy = (distance) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: distance,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    window.ethereum.on("accountsChanged", getAccounts);

    return () => {
      window.ethereum.removeListener("accountsChanged", getAccounts);
    };
  }, [getAccounts, account]);

  return (
    <>
      <div className="container relative h-full px-40 pt-32">
        <header className="flex items-center justify-between text-white">
          <div className="flex items-center gap-4">
            <img src={logo} className="h-20 rounded-md" alt="" />
            <div className="flex flex-col">
              <p className="text-3xl font-medium">WEAPON FACTORY</p>
              <p className="text-md font-medium">Module 3 assignment</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <img src={walletIcon} className="h-6" alt="" />
              <p className="font-medium">
                {Math.trunc(accountValue * 100) / 100} MATIC
              </p>
            </div>
            <div className="flex items-center gap-1">
              <img src={userIcon} className="h-6" alt="" />
              <p className="font-medium">{shortenAddress(account)}</p>
            </div>
            <img
              src={signOutIcon}
              onClick={() => setIsLoggingOut(true)}
              className="h-4 cursor-pointer"
              alt=""
            />
          </div>
        </header>
        <main className="relative h-fit">
          <button
            onClick={() => scrollBy(-700)}
            className="absolute -left-20 top-1/2 -translate-y-1/2 transform rounded-full bg-fuchsia-500 p-3.5 text-4xl text-white shadow-lg"
          >
            <img src={arrowLeft} className="w-4" alt="" />
          </button>

          <button
            onClick={() => scrollBy(700)}
            className="absolute -right-20 top-1/2 -translate-y-1/2 transform rounded-full bg-fuchsia-500 p-3.5 text-4xl text-white shadow-lg"
          >
            <img src={arrowRight} className="w-4" alt="" />
          </button>

          <div
            className="custom-scrollbar flex h-fit gap-20 overflow-x-auto whitespace-nowrap pb-6 pt-24"
            ref={scrollRef}
            onWheel={handleScroll}
          >
            <Item id={0} />
            <Item id={1} />
            <Item id={2} />
            <Item id={3} />
            <Item id={4} />
            <Item id={5} />
            <Item id={6} />
          </div>
        </main>
        {isLoggingOut && (
          <LogOutWindow onClose={() => setIsLoggingOut(false)} />
        )}
      </div>
    </>
  );
}

export default GameInterface;
