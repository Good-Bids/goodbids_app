import React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { Charity } from "~/utils/types/charities";
import { charityColorTailwindString } from "~/utils/constants";

interface AuctionDetailsTabProps {
  detailsText: string[];
  charity?: Charity;
  charityName: "buildOn" | "charityWater";
}

export const AuctionDetailsTab = ({
  detailsText,
  charity,
  charityName,
}: AuctionDetailsTabProps) => {
  const charityDescriptionHeader = charity?.description_header;
  const charityDescriptionBody = charity?.description_body.split("</br>");
  const colorString = charityColorTailwindString[charityName];

  return (
    <Tabs.Root
      className="flex w-full flex-col shadow-md md:w-4/6"
      defaultValue="tab1"
    >
      <Tabs.List
        className="flex flex-shrink-0 border-b-2 border-pompadour"
        aria-label="Find out more"
      >
        <Tabs.Trigger
          className="flex h-11 flex-1 select-none items-center justify-center bg-white px-5 py-0 first:rounded-tl-md last:rounded-tr-md hover:bg-screaminGreen hover:bg-opacity-40 focus:relative focus:shadow-sm"
          value="tab2"
        >
          <p className={`text-l font-bold text-${colorString}`}>The Cause</p>
        </Tabs.Trigger>
        <Tabs.Trigger
          className="flex h-11 flex-1 select-none items-center justify-center bg-white px-5 py-0 first:rounded-tl-md last:rounded-tr-md hover:bg-screaminGreen hover:bg-opacity-40 focus:relative focus:shadow-sm"
          value="tab1"
        >
          <p className={`text-l font-bold text-${colorString}`}>
            Auction Details
          </p>
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content
        className="flex flex-grow rounded-b-md bg-white p-5 outline-none focus:shadow-sm"
        value="tab1"
      >
        <div className="flex h-full w-full flex-col gap-4 overflow-y-auto">
          {detailsText.map((text) => (
            <p>{text}</p>
          ))}
        </div>
      </Tabs.Content>
      <Tabs.Content
        className="flex flex-grow rounded-b-md bg-white p-5 outline-none focus:shadow-sm"
        value="tab2"
      >
        <div className="flex h-full w-full flex-col gap-4 overflow-y-auto">
          <iframe
            title="vimeo-player"
            src={"https://vimeo.com/822187106/fdfea88b99"}
            width="640"
            height="360"
            allowFullScreen
          />

          <p className="text-3xl font-black">{charityDescriptionHeader}</p>
          {charityDescriptionBody?.map((text) => (
            <p>{text}</p>
          ))}
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
};
