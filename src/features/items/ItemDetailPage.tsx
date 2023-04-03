import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useItemQuery } from "~/hooks/useitem"

export const ItemDetailPage = () => {
  const router = useRouter()
  const [itemId, setItemId] = useState<string>()

  useEffect(() => {
    if (router.query.itemId) {
      if (!Array.isArray(router.query.itemId))
        setItemId(router.query.itemId)
    }

  }, [router])

  const { data: item } = useItemQuery(itemId)



  if (item) {
    return (<>
      <h1>{item.name}</h1>
      <p>value: {item.value}</p>
      <p>description: {item.description}</p>
      {item.auction_id && (
        <p>assigned to auction {item.auction_id}</p>
      )}
    </>)
  }
}

