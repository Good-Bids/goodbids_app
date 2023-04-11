/**
 * CharitiesPage.tsx
 *
 * Next JS page/route
 * Displays the public list view of Charities available
 * in the Supabase postgres DB
 *
 * Features req:
 * - Pagination controller
 * - Link to Charity detail page via NextJS + Charity Id
 *
 * note: sub components should not be in this file - they are temp for testing the
 * backend integrations
 *
 */
import { useCharitiesQuery } from "~/hooks/useCharity";
import { I_CharityCollection, I_CharityModel } from "~/utils/types/charities";
import Link from "next/link";

/**
 * QueryLoadingDisplay
 * not implemented
 */
const QueryLoadingDisplay = () => {};

/**
 * QueryErrorDisplay
 * not implemented
 */
const QueryErrorDisplay = () => {};

/**
 * CharityListRow
 * Component container for the CharityModel display
 * separated for rendering/windowing and isolated updates in
 * the future ( if a row gets expensive can memo it )
 */
const CharityListRow = ({ charity }: I_CharityModel) => {
  return (
    <li className="border-b bg-neutral-50 p-2 text-neutral-800">
      <Link href={`/charities/${charity.charity_id}`}>
        <p className="text-base font-medium">{charity.name}</p>
        <p className="text-sm">{charity.status}</p>
      </Link>
    </li>
  );
};

/**
 * CharitiesListView
 * Container for a List view of Charities available
 * ie: another one would be tileView or maybe a cardView
 */
const CharitiesListView = ({ charities }: I_CharityCollection) => {
  return (
    <ul className="flex flex-grow flex-col bg-slate-100">
      {charities.map((charity) => (
        <CharityListRow key={charity.charity_id} charity={charity} />
      ))}
    </ul>
  );
};

/**
 * CharitiesPage
 * Main functional component responsible for rendering layout
 */
export const CharitiesPage = () => {
  const [query, updatePagination] = useCharitiesQuery();

  return (
    <div className="flex w-full flex-grow flex-col p-24">
      <h1 className="pb-4 text-6xl font-bold text-black">Charities</h1>

      {/* temp container for testing hook query status and errors */}
      <p className="mb-2 bg-slate-50 pb-2 pl-2 pt-2 text-xs text-neutral-800">
        query: status: {query.queryStatus.isLoading ? "loading" : "done"}
      </p>

      {/* temp container for testing pagination windows via the ui + hook */}
      <div className="mb-2 bg-slate-50 p-2 text-xs text-neutral-800">
        Sorted by newest top, Page:
      </div>

      {/* temp container for Auctions View module */}
      <div className="flex w-full flex-grow flex-col">
        <CharitiesListView charities={query.charities} />
      </div>
    </div>
  );
};
