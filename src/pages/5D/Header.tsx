import clsx from "clsx";

export default function Header({
  value,
  active,
  Icons,
  onChange,
}: {
  value: any[];
  active: string;
  Icons?: string[];
  onChange?: (index: number) => void;
}) {
  return (
    <div className="relative flex bg-base-900 rounded-xl">
      {value.map((item, index) => (
        <span
          key={index}
          className={clsx(
            "flex justify-center items-center px-1 py-4 rounded-lg w-1/3 font-semibold text-xs cursor-pointer",
            item === active
              ? "text-white shadow-[inset_0_0_8px_#fd565c] bg-gradient-to-b from-[#fd565c] to-[#fd565c]/50"
              : "text-base-400"
          )}
          onClick={() => {
            onChange?.(index);
          }}
        >
          <div className="flex flex-col items-center">
            <img className="w-8 h-8" src={Icons?.[item === active ? 0 : 1]} />
            <div>5D</div>
            <div>{item}</div>
          </div>
        </span>
      ))}
    </div>
  );
}
