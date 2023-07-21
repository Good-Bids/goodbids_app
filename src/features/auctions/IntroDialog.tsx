import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "src/components/Dialog";
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
  useIntroRedirect(props.prize, setIsDialogOpen);

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
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="h-fit sm:max-w-[90%]">
        <div className="flex flex-col p-0 sm:flex-row">
          <div className="flex w-full flex-col items-center justify-center gap-4 p-6 sm:w-1/3">
            <p className={`text-${colorString} text-4xl font-bold`}>
              Your generosity deserves a prize
            </p>
            <p className="mb-0 mt-2 text-sm font-normal text-outerSpace-900 dark:text-white">
              Welcome to a new kind of charity auction where every bid is a
              donation, and your generosity can win you prizes.
            </p>
            <div className="mt-6 flex w-full flex-row items-center justify-start gap-10">
              <Link href={`/SignUp`} className="h-fit w-fit self-center">
                <button
                  className={`bg-${colorString} container flex w-full flex-col items-stretch justify-center self-center px-7 py-4 text-xl font-bold text-white sm:w-fit sm:px-8`}
                >
                  <p>Sign Up</p>
                </button>
              </Link>
              <p
                className="cursor-pointer text-xl font-bold text-bo-red underline"
                onClick={() => setIsDialogOpen(false)}
              >
                to auction
                <ArrowRight className="inline" />
              </p>
            </div>
          </div>
          <div className="flex aspect-video w-full flex-col items-center justify-center overflow-clip border-0 sm:aspect-video sm:w-2/3 sm:rounded-r-lg">
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
