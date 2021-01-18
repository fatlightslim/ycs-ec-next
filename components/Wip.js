import useSWR from "swr"
import BaseTable from "./BaseTable"

export default function Wip(props) {
  const { data, error } = useSWR(`/api/orders`)
  if (error) return <div>failed to load</div>
  if (!data) return <div>loading...</div>

  let result = data.filter((v) => v.product.length > 0)
  result = result.map(v => {
    return {
      product: v.product[0].name,
      dept_id: v.product[0].dept_id,
    }
  })
  console.log(result);
  return <BaseTable result={result} {...props} />
}

