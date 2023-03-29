// once a user has the 'charityAdmin' role,
// they can create their charity in the system.

import { useForm } from "react-hook-form"
import { useCheckCharity } from "~/hooks/useCheckCharity";
import { useUserQuery } from "~/hooks/useUser";
import { checkEin } from "~/queries/charityApi";

export const CreateNewCharityPage = () => {

  const user = useUserQuery()

  const { register, handleSubmit } = useForm();


  return (
    <>
      <span className="text-6xl text-black font-bold">Register your charity</span>
      <span className="text-l text-black font-normal">Fill out the details below, and hit submit.</span>
      <span className="text-l text-black font-normal">We'll be in touch with next steps within the next business day.</span>
      <form onSubmit={handleSubmit(async (data) => {
        try {
          console.log(data)
          if (user) {
            if (data.ein) {
              const isLegit = checkEin(data.ein)
              console.log(isLegit)
            }
          }
        } catch (error) {
          window.alert(error)
        }
      })}>
        <div className="flex flex-col justify-center h-fit">
          <input {...register('name')} placeholder="Your Charity Name" />
          <input {...register('ein')} placeholder="Your EIN number (used when filing taxes)" />
          <input {...register('email')} placeholder="your main contact" />
          <input type="submit" />
        </div>
      </form>
    </>
  )
}