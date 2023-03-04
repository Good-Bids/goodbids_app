import { InferGetServerSidePropsType } from "next";

import { getServerSideProps } from "~/pages/charities/[charityId]";


type CharityDetailPageProps = InferGetServerSidePropsType<typeof getServerSideProps>

export const CharityDetailPage = ({charity}: CharityDetailPageProps) => {
  if (charity){
    
    const memberSinceDate  = new Date(charity.created_at??'')
    const formattedMemberSinceDate = `${memberSinceDate.getMonth}/ ${memberSinceDate.getFullYear()}`
    return <>
    <h1>Hi, {charity.name}!</h1>
    <p>{bidder.bids.length} lifetime bids</p>
    <p>member since {formattedMemberSinceDate}</p>
    <h2>Recent Activity</h2>
    <ol>{activity.map(item=>(<li><h4>{item.id}</h4></li>))}</ol>

    </>
  }
}

