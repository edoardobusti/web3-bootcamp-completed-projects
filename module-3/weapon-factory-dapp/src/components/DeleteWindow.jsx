/* eslint-disable react/prop-types */

import { useState } from "react";
import { useAppContext } from "../AppContext";

import goBackIcon from "../assets/go-back-icon.svg";
import orderLoading from "../assets/order-loading.svg";

function DeleteWindow({ id, onClose, title, imageUrl }) {
  const { contract, dispatch } = useAppContext();

  const [isPending, setIsPending] = useState(false);

  const handleDeleteItem = async () => {
    try {
      setIsPending(true);
      const tx = await contract.dismantleItem(id);
      await tx.wait();
      dispatch({ type: "TX_ACTION", payload: `idle` });
      onClose();
    } catch (error) {
      setIsPending(false);
      dispatch({
        type: "ERROR",
        payload: {
          value: true,
          message: `${
            error.shortMessage === "could not coalesce error"
              ? "Try to increase the gas fee"
              : error.shortMessage
          }`,
        },
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="w-fit rounded bg-white p-6 shadow-lg">
        <h2 className="mb-6 text-xl font-medium text-fuchsia-500">
          Are you sure to {id < 3 ? "destroy" : "dismantle"} this item?
        </h2>
        <div className="mb-6 flex items-center gap-2">
          <img src={imageUrl} className="w-14" alt="" />
          <div>
            <p className="justify-center whitespace-normal font-medium text-black">
              {title} x 1
            </p>
          </div>
        </div>
        <div className="flex items-center">
          <button
            onClick={handleDeleteItem}
            className="z-10 mb-2 flex items-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 px-3 py-2 font-medium text-white shadow-md shadow-purple-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-purple-300 dark:shadow-md dark:shadow-purple-800/80 dark:focus:ring-purple-800"
          >
            {isPending ? (
              <>
                Pending
                <img src={orderLoading} className="h-4 animate-spin"></img>
              </>
            ) : (
              "Continue"
            )}
          </button>
          {!isPending && (
            <button
              onClick={onClose}
              className="z-10 mb-2 me-2 flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-center font-medium text-fuchsia-500"
            >
              Go back <img src={goBackIcon} className="w-4" alt="" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DeleteWindow;
