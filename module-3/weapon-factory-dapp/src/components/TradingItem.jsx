/* eslint-disable react/prop-types */

import { useAppContext } from "../AppContext";
import useFetchItemData from "../hooks/useFetchItemData";

function TradingItem({ id, isSelected, setIsSelected }) {
  const { pinata, contract, account, dispatch } = useAppContext();

  const { title, imageUrl } = useFetchItemData(
    id,
    pinata,
    contract,
    account,
    dispatch,
  );

  return (
    <button
      className={`relative flex cursor-pointer items-center gap-2 rounded-md p-4 ${
        isSelected === id && "border-2 border-fuchsia-500"
      }`}
      onClick={() => setIsSelected(id)}
    >
      <div className="absolute inset-0 rounded-lg bg-fuchsia-500 opacity-0 transition-opacity duration-300 hover:opacity-20"></div>
      <img src={imageUrl} className="w-12" alt="" />
      <div>
        <p className="whitespace-normal font-medium text-black">
          #{id} {title}
        </p>
      </div>
    </button>
  );
}

export default TradingItem;
