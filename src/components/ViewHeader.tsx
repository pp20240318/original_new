import clsx from "clsx";

export function ViewHeader({
  value,
  active,
  onChange,
}: {
  value: any[];
  active: string;
  onChange?: (index: number) => void;
}) {
  return (
    <div className="relative flex mt-4 rounded-xl bg-base-900">
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
        ></span>
      ))}
    </div>
  );
}
