import { useMemo } from "react"
import { useTable } from "react-table"

export default function Customers({ customers }) {
  const data = useMemo(
    () =>
      customers.data.map((v) => {
        return {
          col0: v.name,
          col1: v.address2 ? v.address1 + v.address2 : v.address1,
          col2: v.tel,
          col3: v.customerNumber,
          col4: v.route ? v.area + "-" + v.route : v.area,
          col5: v.collector,
        }
      }),
    [customers]
  )

  const columns = useMemo(
    () =>
      ["名前", "住所", "TEL", "顧客No.", "区", "集金人"].map((Header, i) => {
        return {
          Header,
          accessor: "col" + i, // accessor is the "key" in the data
          sortType: "basic",
        }
      }),
    []
  )
  return (
    <div className="bg-gray-100 flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <Table columns={columns} data={data} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Table({ columns, data }) {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  })

  // Render the UI for your table
  return (
    <table
      {...getTableProps()}
      className="min-w-full divide-y divide-gray-200 table-auto"
    >
      <thead className="bg-gray-50">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                {...column.getHeaderProps()}
              >
                {column.render("Header")}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody
        {...getTableBodyProps()}
        className="bg-white divide-y divide-gray-200"
      >
        {rows.map((row, i) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    className="px-6 py-4 whitespace-nowrap"
                    {...cell.getCellProps()}
                  >
                    <div className="text-sm font-normal text-gray-900">
                      {cell.render("Cell")}
                    </div>
                  </td>
                )
              })}
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
