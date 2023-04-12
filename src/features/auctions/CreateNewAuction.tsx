/**
 * CreateNewAuctionPage
 *
 * once a user has the 'charityAdmin' role,
 * they can create auctions for their charity.
 *
 */

import { useForm } from "react-hook-form";

export const CreateNewAuctionPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => console.log(data);

  console.log(errors);

  return (
    <div className="p-6 border">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label
          htmlFor="Auction Name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Auction Name
        </label>
        <input
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Auction Name"
          {...register("Auction Name", { required: true, max: 80, min: 10 })}
        />
        <label
          htmlFor="Auction Name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Auction description
        </label>
        <input
          type="text"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Auction description"
          {...register("Auction description", {
            required: true,
            max: 200,
            min: 10,
          })}
        />
        <label
          htmlFor="Auction Name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Opening bid value
        </label>
        <input
          type="number"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Opening bid value"
          {...register("Opening bid value", { required: true, max: 3, min: 1 })}
        />
        <label
          htmlFor="Auction Name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Bid increment
        </label>
        <input
          type="number"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Bid increment"
          {...register("Bid increment", { required: true, max: 100, min: 1 })}
        />
        <label
          htmlFor="Auction Name"
          className="block mb-2 text-sm font-medium text-gray-900"
        >
          Top bid duration
        </label>
        <input
          type="number"
          className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
          placeholder="Top bid duration, this is set to seconds"
          {...register("Top bid duration, this is set to seconds", {
            required: true,
            max: 10000,
            min: 1,
          })}
        />

        <div className="pt-4">
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 sm:w-auto"
          >
            Submit
          </button>
        </div>
        
      </form>
    </div>
  );
};
