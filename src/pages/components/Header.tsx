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
    <div className="relative flex rounded-xl bg-base-900">
      {value.map((item, index) => (
        <span
          key={item}
          className={clsx(
            "cursor-pointer flex justify-center items-center font-semibold w-1/3 px-1 py-4 rounded-lg text-xs",
            item === active
              ? "text-white shadow-[inset_0_0_8px_#fd565c] bg-gradient-to-b from-[#fd565c] to-[#fd565c]/50"
              : "text-base-400"
          )}
          onClick={() => {
            onChange?.(index);
          }}
        >
          <div className="flex items-center flex-col">
            <img className="w-8 h-8" src={Icons?.[item === active ? 0 : 1]} />
            <div>{item}</div>
          </div>
        </span>
      ))}
    </div>
  );
}
