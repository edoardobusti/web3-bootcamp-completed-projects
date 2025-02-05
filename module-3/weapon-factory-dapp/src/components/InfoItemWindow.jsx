/* eslint-disable react/prop-types */
function InfoItemWindow({ id, imageUrl }) {
  const itemsNeeded =
    id === 3
      ? [
          {
            id: 0,
            title: "GUNPOWDER",
            image: `${imageUrl.replace("ipfs://", "").slice(0, -5) + `0.png`}`,
          },
          {
            id: 1,
            title: "METAL",
            image: `${imageUrl.replace("ipfs://", "").slice(0, -5) + `1.png`}`,
          },
        ]
      : id === 4
        ? [
            {
              id: 1,
              title: "METAL",
              image: `${imageUrl.replace("ipfs://", "").slice(0, -5) + `1.png`}`,
            },
            {
              id: 2,
              title: "FUEL",
              image: `${imageUrl.replace("ipfs://", "").slice(0, -5) + `2.png`}`,
            },
          ]
        : id === 5
          ? [
              {
                id: 0,
                title: "GUNPOWDER",
                image: `${imageUrl.replace("ipfs://", "").slice(0, -5) + `0.png`}`,
              },
              {
                id: 2,
                title: "FUEL",
                image: `${imageUrl.replace("ipfs://", "").slice(0, -5) + `2.png`}`,
              },
            ]
          : id === 6
            ? [
                {
                  id: 0,
                  title: "GUNPOWDER",
                  image: `${imageUrl.replace("ipfs://", "").slice(0, -5) + `0.png`}`,
                },
                {
                  id: 1,
                  title: "METAL",
                  image: `${imageUrl.replace("ipfs://", "").slice(0, -5) + `1.png`}`,
                },
                {
                  id: 2,
                  title: "FUEL",
                  image: `${imageUrl.replace("ipfs://", "").slice(0, -5) + `2.png`}`,
                },
              ]
            : null;

  return (
    <div className="absolute -top-28 right-32 z-50 w-auto rounded bg-white px-6 py-4 text-black shadow-lg">
      <p className="mb-2 text-fuchsia-500">Items needed:</p>
      <div className="">
        {itemsNeeded.map((item, key) => {
          return (
            <div key={key} className="mb-1 flex items-center gap-2">
              <img src={item.image} className="h-6" alt="" />
              <p className="flex gap-1">
                <span>#{item.id} </span>
                <span>{item.title}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default InfoItemWindow;
