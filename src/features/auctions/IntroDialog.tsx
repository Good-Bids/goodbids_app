import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "src/components/Dialog";
import { useIntroRedirect } from "~/hooks/useIntroRedirect";
import { charityColorTailwindString, prizeVideoUrls } from "~/utils/constants";

export const IntroDialog = (props: { prize: "watch" | "trek" }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [errorState, setErrorState] = useState<Error>();

  const colorString = charityColorTailwindString["buildOn"];
  const vimeoUrl = prizeVideoUrls[props.prize];

  const handleOpenChange = async (changeIsOpenTo: boolean) => {
    switch (changeIsOpenTo) {
      case true:
        {
          setIsDialogOpen(changeIsOpenTo);
        }
        break;
      case false: {
        console.log("closing");
        setIsDialogOpen(changeIsOpenTo);
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      {errorState && (
        <div className=" bg-cornflowerLilac text-pompadour">
          <p>{errorState.message}</p>
          <button
            className="rounded-full border-black"
            onClick={() => setErrorState(undefined)}
          >
            okay
          </button>
        </div>
      )}
      <DialogTrigger asChild>
        <div
          id="call-to-action"
          className="mx-4 flex  min-h-fit w-11/12 flex-col justify-center gap-2 sm:relative sm:left-0 sm:w-fit"
        >
          <button
            className="rounded border-2 border-solid border-black border-opacity-30 px-4 py-3"
            onClick={() => setIsDialogOpen(true)}
          >
            <p
              className={`text-xl font-bold text-${colorString}`}
            >{`Preview the intro dialog`}</p>
          </button>
        </div>
      </DialogTrigger>
      <DialogContent className="h-fit sm:max-w-[816px]">
        <div className="flex flex-col p-0 sm:flex-row">
          <div className="flex w-full flex-col p-6 sm:w-1/2">
            <p className={`text-${colorString} text-4xl font-bold`}>
              Your generosity deserves a prize
            </p>
            <p className="my-2 text-sm font-normal text-outerSpace-900">
              Welcome to a new kind of charity auction where every bid is a
              donation, and your generosity can win you prizes.
            </p>
            <Link href={`/SignUp`} className="h-fit w-fit self-center">
              <button
                className={`bg-${colorString} container flex w-full flex-col items-stretch justify-center self-center rounded px-4 py-2 text-xl font-bold text-white sm:w-fit sm:px-8`}
              >
                <p>Sign Up</p>
              </button>
            </Link>
          </div>
          <div className="flex aspect-video w-full flex-col items-center justify-center overflow-clip rounded-b-lg border-0 sm:aspect-video sm:w-1/2 sm:rounded-r-lg">
            <iframe
              src={vimeoUrl}
              allow="autoplay; fullscreen; picture-in-picture"
              style={{
                width: "100%",
                height: "100%",
              }}
              title="buildOn and GoodBids"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
