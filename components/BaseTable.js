import SelectDept from "./SelectDept"

export default function BaseTable(props) {
  const { result, currentDept } = props

  const Tr = ({ v }) => {
    return currentDept._id === v.dept_id ? (
      <tr>
        {Object.keys(v).map((x) => {
          return (
            <td key={v[x]} className="px-6 py-4 whitespace-nowrap">
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
                    {result.length > 0 && Object.keys(result[0]).map((v) => (
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
                  {result.map((v) => {
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
