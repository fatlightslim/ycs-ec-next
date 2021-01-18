import useSWR from "swr"
import SelectDept from "./SelectDept"
import { useState } from "react"

const groupBy = (array, getKey) => {
  return Array.from(
    array.reduce((map, cur, idx, src) => {
      const key = getKey(cur, idx, src)
      const list = map.get(key)
      if (list) list.push(cur)
      else map.set(key, [cur])
      return map
    }, new Map())
  )
}

export default function Aggregate(props) {
  const { currentDept } = props
  const { data, error } = useSWR(`/api/aggregate`)
  if (error) return <div>failed to load</div>
  if (!data) return <div className="text-center mt-24">Loading...</div>

  const result = groupBy(data, (item) => item.collector)
  // console.log(result);

  const Tr = ({ collector, array, printed }) => {
    const dept_id = array[0].product[0].dept_id
    // console.log(array[0].product[0].dept_id);
    // console.log(dept_id);
    return currentDept._id === dept_id ? (
      <tr>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{collector}</div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {array.length}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-gray-900">
            {printed.length}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          {/* <a href="#" className="text-indigo-600 hover:text-indigo-900">
            Edit
          </a> */}
        </td>
      </tr>
    ) : null
  }

  return (
    <div className="p-8">
      <SelectDept {...props} />
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["集金人", "処理中", "印刷済", ""].map((v) => (
                      <th
                        key={v}
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        children={v}
                      />
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.map((array) => {
                    const printed = array[1].filter((v) => "printed" === v.status)
                    return (
                      <Tr
                        key={array[0]}
                        collector={array[0]}
                        printed={printed}
                        array={array[1]}
                      />
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
