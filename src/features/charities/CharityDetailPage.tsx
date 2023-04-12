/**
 * CharityDetailPage.tsx
 *
 * Next JS page/route
 * Displays the charity publicly available data
 * from the Supabase postgres DB
 *
 * If the user has Authenticated and is this charities admin
 * the edit charity or edit/new auction buttons may be available as
 * [next] Links to the pages needed
 *
 * note: sub components should not be in this file - they are temp for testing the
 * backend integrations
 *
 * note: this page uses useAuctions temporarily will be moved to a useCharityAuctions
 * hook in a later PR ( bids will be hydrated into that PR )
 *
 */

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useCharityQuery } from "../../hooks/useCharity";
import { useAuctionsQuery } from "~/hooks/useAuction";
import {
  I_AuctionCollection,
  T_AuctionModelExtended,
} from "~/utils/types/auctions";
import { I_CharityModel } from "~/utils/types/charities";

/**
 * QueryLoadingDisplay
 * not implemented
 */
const QueryLoadingDisplay = () => {
  return <p>LOADING</p>;
};

/**
 * QueryErrorDisplay
 * not implemented
 */
const QueryErrorDisplay = () => {
  return <p>ERROR</p>;
};

/**
 * AuctionListRowView
 * Component container for the AuctionModel display
 * separated for rendering/windowing and isolated updates in
 * the future ( if a row gets expensive can memo it )
 */

interface LimitedAuctionListRowViewProps {
  auction: T_AuctionModelExtended;
}

export const LimitedAuctionListRowView = ({
  auction,
}: LimitedAuctionListRowViewProps) => {
  return (
    <li className="border-b bg-neutral-50 p-2 text-neutral-800">
      <p className="text-base font-medium">{auction.name}</p>
      <p className="font-regular text-xs text-neutral-500">
        auction is currently in: {auction.status} mode
      </p>
      <p className="pb-2 pt-2 text-sm">{auction.description}</p>
      <div
        id={"view-bids-" + auction.auction_id}
        data-auction-id={auction.auction_id}
        className="p2 inline-block cursor-pointer border"
      >
        <p className="select-none p-2 text-sm">view bids</p>
      </div>
    </li>
  );
};

/**
 * AuctionsMiniListView
 * Auctions Stubbed in with the full Auctions call
 * TODO: will
 */
const AuctionsMiniListView = ({ auctions }: I_AuctionCollection) => {
  return (
    <div className="flex w-full flex-col pt-2">
      <ul className="flex flex-grow flex-col bg-slate-100">
        {auctions.map((auction) => (
          <LimitedAuctionListRowView
            key={auction.auction_id}
            auction={auction}
          />
        ))}
      </ul>
    </div>
  );
};

/**
 * CharityDetails
 * TODO: defaults for all values
 *
 * Note, since we do not collect the dateTime that the charity goes "Active", the
 * best we can do is say things like status since { created_at } is ""
 *
 * TODO:
 * <p>{charity.auctions.length} auctions run</p>
 * <p>${totalRaised} raised</p>
 * <p>Auction history</p>
 *
 */
const CharityDetails = ({ charity }: I_CharityModel) => {
  const [auctionQuery, updateAuctionPagination] = useAuctionsQuery();
  const [selectedAuction, setSelectedAuction] = useState<string>("");

  const memberSinceDate = new Date(charity.created_at ?? "");
  const formattedMemberSinceDate = `${
    memberSinceDate.getMonth() + 1
  }/${memberSinceDate.getFullYear()}`;

  let totalRaised = 0;
  let totalAuctions = 0;

  // Skip the loading displays here to show the component prior to auctions request
  // TODO: push down the auctionQuery.queryStatus into the child component to render
  //       loading/error/isEmpty - this would make it look like partials
  if (
    !auctionQuery.queryStatus.isLoading &&
    !auctionQuery.queryStatus.isError &&
    auctionQuery.auctions !== undefined
  ) {
    totalRaised = 26000;
    totalAuctions = auctionQuery.auctions.length;
  }

  // If we have auctions or a change in auctions
  // and we do not use Jotai or a something we
  // avoid prop drilling here. Kept it all together
  // her for easy ripping out.
  // TODO remove this for proper registrations
  useEffect(() => {
    if (totalAuctions > 0) {
      const viewBidsEls = document.querySelectorAll('[id^="view-bids-"]');
      if (viewBidsEls.length > 0) {
        viewBidsEls.forEach((el, i) => {
          el.addEventListener("click", (e: Event) => {
            let target = e.currentTarget as HTMLElement;
            let attribute: string = target.getAttribute(
              "data-auction-id"
            ) as string;
            setSelectedAuction(attribute);
          });
        });
      }
    }
    return () => {
      const viewBidsEls = document.querySelectorAll('[id^="view-bids-"]');
      if (viewBidsEls.length > 0) {
        viewBidsEls.forEach((el, i) => {
          el.removeEventListener("click", (e: Event) => {
            let target = e.currentTarget as HTMLElement;
            let attribute: string = target.getAttribute(
              "data-auction-id"
            ) as string;
            setSelectedAuction(attribute);
          });
        });
      }
    };
  }, [totalAuctions]);

  // Total Raised Math
  // const totalRaised = charity.auctions.reduce((prior, current) => prior += current.high_bid_value ?? 0, 0)

  return (
    <div className="flex flex-grow flex-col bg-slate-50">
      <div className="flex w-full flex-col border-b p-2">
        <p className="text-3xl font-bold leading-none text-bottleGreen">
          {charity.name}
        </p>
        <p className="pt-1 text-xs text-neutral-800">
          Charity status: {charity.status} since: {formattedMemberSinceDate}
        </p>
      </div>
      <div className="flex w-full flex-grow flex-row flex-wrap">
        {/* Left col */}
        <div className="border-r-none flex w-full flex-shrink-0 flex-grow flex-col md:w-1/2 md:border-r">
          <div className="border-b p-2">
            <p className="pt-1 text-xs text-neutral-800">
              Registered Charity Number (USA): {charity.ein}
            </p>
            <p className="pt-1 text-xs text-neutral-800">
              contact: {charity.email}
            </p>
            <p className="pt-1 text-xs text-neutral-800">
              Auctions [{totalAuctions}] Raised by all auctions [${totalRaised}]
              - fake value{" "}
            </p>
          </div>
          <AuctionsMiniListView auctions={auctionQuery.auctions} />
        </div>
        {/* Right col */}
        <div className="flex w-full flex-shrink-0 flex-grow flex-col p-2 md:w-1/2">
          {/* AUCTION BID HISTORY GOES HERE ( possibly )*/}
          <p className="pt-1 text-xs text-neutral-800">
            Auction Id selected: {selectedAuction || "none"}
          </p>
        </div>
      </div>
    </div>
  );
};

export const CharityDetailPage = () => {
  const router = useRouter();

  // https://nextjs.org/docs/api-reference/next/router always an object or empty object
  // but they have typed it as string | string[] | undefined
  const charityId = router.query?.charityId as string;
  const query = useCharityQuery(charityId);

  // These act as the "page getting data loaders"

  // ReactQuery Status -> loading
  if (query.queryStatus.isLoading && query.queryStatus.isError === false) {
    return <QueryLoadingDisplay />;
  }

  // ReactQuery SubQuery or auctionId Validation -> error
  if (query.queryStatus.isLoading === false && query.hasError) {
    return <QueryErrorDisplay />;
  }

  if (query.charity === undefined) {
    return <QueryErrorDisplay />;
  }

  return (
    <div className="flex w-full flex-grow flex-col p-24">
      {/* temp container for testing hook query status and errors */}
      <p className="mb-2 bg-slate-50 pb-2 pl-2 pt-2 text-xs text-neutral-800">
        query: status: {query.queryStatus.isLoading ? "loading" : "done"}
      </p>

      {/* temp container for Charity Detail View module */}
      <div className="flex w-full flex-grow flex-col">
        <CharityDetails charity={query.charity} />
      </div>
    </div>
  );
};
