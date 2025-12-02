export default function PartJackPot() {
  return (
    <>
      <div className="bg-[#19212c] p-2 border-[#2a3443] border-[1px] border-solid rounded-lg">
        <div className="flex flex-row items-center">
          <div className="w-1/2">
            <img
              src="/hilo/jackpot.png"
              alt="Hilo Game"
              className="w-full h-auto"
            />
          </div>
          <div className="flex flex-col flex-1 justify-center items-center">
            <div className="flex flex-row">
              <div className="flex flex-row justify-center items-center gap-2 text-[#55657e]">
                <div className="flex justify-center items-center border-[#5b6773] border-[1px] border-dashed rounded-md w-5 h-5">
                  7
                </div>
                <div className="flex justify-center items-center border-[#5b6773] border-[1px] border-dashed rounded-md w-5 h-5">
                  7
                </div>
                <div className="flex justify-center items-center border-[#5b6773] border-[1px] border-dashed rounded-md w-5 h-5">
                  7
                </div>
                <div className="flex justify-center items-center border-[#5b6773] border-[1px] border-dashed rounded-md w-5 h-5">
                  7
                </div>
                <div className="ml-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="text-[#ffc51c]">0.02092975 BTC</div>
          </div>
        </div>
      </div>
    </>
  );
}