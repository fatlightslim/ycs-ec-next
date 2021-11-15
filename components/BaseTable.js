import SelectDept from "./SelectDept"

const blacklist = ["status", "_id", "old_id", "info", "dept_id", "createdAt", 'updatedAt' ]

export default function BaseTable(props) {
  const { result, currentDept } = props

  const Tr = ({ v }) => {
    return currentDept._id === v.dept_id ? (
      <tr>
        {Object.keys(v).map((x, i) => {
          return blacklist.includes(x) ? null : (
            <td key={i} className="px-6 py-4 whitespace-nowrap">
              <div className="ml-4">
                <div className="text-sm  text-gray-900">{v[x]}</div>
              </div>
            </td>
          )
        })}
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
                    {result.length > 0 &&
                      Object.keys(result[0]).map((v) => {
                        return blacklist.includes(v) ? null : (
                          <th
                            key={v}
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                            children={labels[v]}
                          />
                        )
                      })}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {result.map((v) => {
                    // console.log(v)
                    return <Tr key={v._id} v={v} />
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

const labels = {
  qty: "数量",
  sales: "価格",
  dept_id: "部門",
  createdAt: "作成日",
  updatedAt: "更新日",
  count: "販売数",
  name: "名前",
  price: "価格",
}
