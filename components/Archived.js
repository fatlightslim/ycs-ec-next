import useSWR from "swr"
import BaseTable from "./BaseTable"

export default function Archived(props) {
  const { data, error } = useSWR(`/api/products`)
  if (error) return <div>failed to load</div>
  if (!data) return <div className="text-center mt-24">Loading...</div>

  const result = data.filter((v) => v.status === "done")
  return <BaseTable result={result} {...props} />
}
