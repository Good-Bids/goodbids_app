import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent } from "src/components/Dialog";
import { goodBidsIntroVideo } from "~/utils/constants";

export const LearnMoreDialog = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
  const openLearnMoreDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <p
          className="mb-2 flex w-fit cursor-pointer self-center rounded bg-bo-red px-4 py-1 text-center text-lg font-bold text-white"
          onClick={openLearnMoreDialog}
        >
          Learn More about GoodBids
        </p>
      </DialogTrigger>
      <DialogContent className="sm:w-80% h-fit sm:max-w-[1200px]">
        <div
          className={`mt-4 flex h-fit w-full flex-col items-center gap-4 px-1 py-2 sm:px-2 sm:py-4`}
        >
          <p className="text-center text-lg font-bold text-bo-red">
            Watch this video to learn more about GoodBids
          </p>
          <iframe
            src={goodBidsIntroVideo}
            allow="fullscreen; picture-in-picture; autoplay"
            className="mb-2 aspect-video sm:w-full"
            title="buildOn and GoodBids"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
