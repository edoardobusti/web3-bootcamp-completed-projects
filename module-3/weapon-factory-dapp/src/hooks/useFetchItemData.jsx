import { useEffect, useState } from "react";

const useFetchItemData = (id, pinata, contract, account, dispatch) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isSpecial, setIsSpecial] = useState();

  useEffect(() => {
    const fetchItemData = async () => {
      if (contract && account) {
        try {
          const uri = await contract.getUri(id);

          const res = await fetch(
            `${pinata.config.pinataGateway}/ipfs/${uri.replace("ipfs://", "")}`,
          );

          const data = await res.json();

          setTitle(data.name);
          setDescription(data.description);
          setImageUrl(
            `${pinata.config.pinataGateway}/ipfs/${data.image.replace(
              "ipfs://",
              "",
            )}`,
          );
          setIsSpecial(data.special);
        } catch (error) {
          dispatch({
            type: "ERROR",
            payload: { value: true, message: error.shortMessage },
          });
        }
      }
    };

    fetchItemData();
  }, [contract, account, id, pinata, dispatch]);

  return { title, description, imageUrl, isSpecial };
};

export default useFetchItemData;
