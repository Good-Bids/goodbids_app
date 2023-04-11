// once a user has the 'charityAdmin' role,
// they can create their charity in the system.

import { useForm } from "react-hook-form";
import { useUserQuery } from "~/hooks/useUser";
import { checkEin } from "~/queries/charityApi";

export const CreateNewCharityPage = () => {
  const user = useUserQuery();

  const { register, handleSubmit } = useForm();

  return (
    <>
      <span className="text-6xl font-bold text-black">
        Register your charity
      </span>
      <span className="text-l font-normal text-black">
        Fill out the details below, and hit submit.
      </span>
      <span className="text-l font-normal text-black">
        We'll be in touch with next steps within the next business day.
      </span>
      <form
        onSubmit={handleSubmit(async (data) => {
          try {
            if (user) {
              if (data.ein) {
                const isLegitimateCharity = await checkEin(data.ein);
                if (isLegitimateCharity) {
                  window.alert("created! (not really)");
                } else window.alert("nope! try a valid EIN");
              }
            }
          } catch (error) {
            window.alert(error);
          }
        })}
      >
        <div className="flex h-fit flex-col justify-center">
          <input {...register("name")} placeholder="Your Charity Name" />
          <input
            {...register("ein")}
            placeholder="Your EIN number (used when filing taxes)"
          />
          <input {...register("email")} placeholder="your main contact" />
          <input type="submit" />
        </div>
      </form>
    </>
  );
};
