import goBackIcon from "../assets/go-back-icon.svg";

/* eslint-disable react/prop-types */
function LogOutWindow({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="w-1/5 rounded bg-white p-6 shadow-lg">
        <h2 className="mb-2 text-xl font-medium text-fuchsia-500">
          Logging out
        </h2>
        <p className="mb-3 whitespace-normal text-black">Are you sure?</p>
        <div className="flex items-center">
          <button
            onClick={() => window.location.reload()}
            className="z-10 mb-2 flex items-center gap-2 rounded-lg bg-gradient-to-r from-fuchsia-500 via-fuchsia-600 to-fuchsia-700 px-3 py-2 font-medium text-white shadow-md shadow-purple-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-purple-300 dark:shadow-md dark:shadow-purple-800/80 dark:focus:ring-purple-800"
          >
            Continue
          </button>

          <button
            onClick={onClose}
            className="z-10 mb-2 me-2 flex items-center justify-center gap-1 rounded-lg px-3 py-2 text-center font-medium text-fuchsia-500"
          >
            Go back <img src={goBackIcon} className="w-4" alt="" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default LogOutWindow;
