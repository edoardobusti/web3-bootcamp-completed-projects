import "../index.css";
import "./css/fingerprint.css";

function LoginLoader() {
  return (
    <div className="relative flex flex-col items-center">
      <div className="fingerprint relative h-[112px] w-[89px]"></div>
      <h3 className="blink-animation mt-5 text-xl font-medium tracking-wide text-[#3fefef]">
        Connecting...
      </h3>
    </div>
  );
}

export default LoginLoader;
