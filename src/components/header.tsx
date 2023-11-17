import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import Image from "next/image";

export const Header = () => {
  return (
    <div className="flex w-full gap-3 border-b-4 border-white p-4">
      <div className="flex w-full items-center justify-between">
        <Image src="/x.png" alt="X" width={56} height={56}></Image>
        <div className="text-slate text-2xl">Welcome to Emoji X</div>
      </div>
    </div>
  );
};
