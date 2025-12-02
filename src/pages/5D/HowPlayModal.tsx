import { DialogTitle } from "@headlessui/react";
import { UxModal } from "../../../ui";
import { XMarkIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
export default function HowPlayModal({
  open,
  onClose,
  title,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
}) {
  return (
    <UxModal
      styles={{
        overlay: {
          width: document.documentElement.style.maxWidth,
          margin: "auto",
        },
        container: {
          width: document.documentElement.style.maxWidth,
          margin: "auto",
        },
      }}
      open={open}
      onClose={onClose}
      render={
        <div className="relative flex flex-col rounded-lg shadow-xl bg-back-200 ">
          <button
            className="absolute top-3 right-3 flex justify-center items-center w-9 h-9 text-base-200 hover:text-base-white"
            onClick={onClose}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
          <DialogTitle
            as="h2"
            className={clsx(
              "shrink-0 text-base-white text-lg font-semibold leading-6 truncate pl-6 pr-16 py-5 text-center"
            )}
          >
            {title}
          </DialogTitle>
          <div className="custom-scroll  text-base-white text-xs m-2 overflow-auto max-h-[40vh] break-all" >
            <p>
              <strong>Each race has 10 cars numbered 1-10.</strong>
            </p>
            <br />
            <p>
              <strong>
                In the Champion runner-up betting interface, we calculate the
                sum of the first and second place car numbers.
              </strong>
            </p>
            <br />
            <p>
              <strong>
                The sum of the first and second place numbers is 3-19, a total
                of 17 numbers.
              </strong>
            </p>
            <br />
            <p>
              <strong>
                The sum of the first and second place numbers 3-19 has more odd
                numbers and fewer even numbers.
              </strong>
            </p>
            <br />
            <p>
              <strong>
                So the odds for odd numbers are 1.782. Even numbers are 2.227.
              </strong>
            </p>
            <br />
            <p>
              <strong>
                The sum of the first and second place numbers 3-11 is small.
                12-19 is big.
              </strong>
            </p>
            <br />
            <p>
              <br />
              <strong>The odds are also different.</strong>
            </p>
            <p>
              <strong>
                You can also predict what the sum of the first and second place
                numbers is. The odds are higher.
              </strong>
            </p>
            <p>
              <br />
              <strong>
                Calculate the odds based on the numbers under each number from
                3-19.
              </strong>
            </p>
            <p>
              <br />
              <strong>
                For example, you bet 100rs on 3, and the odds of 3 are 43.1: the
                first and second place car numbers are 1 and 2, then you can get
                98*43.1=4223.8rs.
              </strong>
            </p>
          </div>
        </div>
      }
    />
  );
}
