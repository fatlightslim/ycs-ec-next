import axios from "axios"
import { useState, useRef, useMemo, useEffect, forwardRef } from "react"
import {
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useFlexLayout,
  useTable,
  useSortBy,
  useRowSelect,
} from "react-table"

export default function OrderList({
  orders,
  currentProduct,
  status,
  statusList,
  setEditOrder,
  setForm,
  setPrintableData,
  setDuplicate,
  setPrintedData,
  setCurrentProduct,
  setUpdated,
  setLoading,
  loading,
  products,
  setProducts
}) {
  const [ordersByStatus, setOrdersByStatus] = useState([])
  const statusLabel = {}
  statusList.forEach(
    (v) => (statusLabel[v.status] = { label: v.label, bg: v.bg })
  )

  useEffect(() => {
    const data = orders.filter((v) => v.status === status)
    setOrdersByStatus(data)
    setLoading(false) // loading start at useEffect in page/index
  }, [orders, status])

  const data = useMemo(
    () =>
      ordersByStatus.map((v) => {
        const adr = v.address1
        return {
          col0: <Edit setEditOrder={setEditOrder} setForm={setForm} v={v} />,
          col1: statusLabel[status].label,
          col2: v.name,
          col3: v.address2 ? adr + v.address2 : adr,
          col4: v.tel,
          col5: v.route ? v.area + "-" + v.route : v.area,
          col6: v.collector,
          col7: v.qty,
          col8: v.by,
          col9: v.point,
          col10: new Date(v.createdAt).toLocaleString("ja-JP"),
          col11: new Date(v.updatedAt).toLocaleString("ja-JP"),
          col12: v.memo,
          col13: v._id,
        }
      }),
    [status, ordersByStatus, currentProduct]
  )

  const columns = useMemo(() => generateHeader(statusLabel[status].bg), [
    status,
    ordersByStatus,
  ])

  const filterTypes = useMemo(() => functionForOmit(), [])

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  )

  const archiveProduct = () => {
    const status = {status: "done"}
    axios.put("/api/products", {_id: currentProduct._id, status}).then(r => {
      const copied = products.filter(v => v._id !== r.data.value._id)
      setProducts([...copied])
      setCurrentProduct(null)
    })
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
    state,
    visibleColumns,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      data,
      columns,
      defaultColumn, // Be sure to pass the defaultColumn option
      filterTypes,
    },
    useFilters, // useFilters!
    useGlobalFilter, // useGlobalFilter!
    useSortBy,
    useFlexLayout,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        // Let's make a column for selection
        {
          id: "selection",
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          Header: ({ getToggleAllRowsSelectedProps }) => (
            <div className="mt-3">
              <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
            </div>
          ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          width: 50,
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
            </div>
          ),
        },
        ...columns,
      ])
    }
  )

  function StatusButton({}) {
    const done = { label: "完了済に変更", status: "done" }
    const active = { label: "処理中に変更", status: "active" }
    const printed = {
      status: "printed",
      label: "印刷済に変更",
    }
    const statusToChange =
      status === "active"
        ? [printed]
        : status === "printed"
        ? [active, done]
        : [active, printed]
    return statusToChange.map((v) => (
      <button
        key={v.label}
        onClick={() => {
          status === "deleted"
            ? restoreFromDeleted(selectedFlatRows, currentProduct, v.status).then(
                (r) => {
                  const { updatedProduct } = r[0].data
                  setCurrentProduct(updatedProduct)
                  setUpdated(true)
                  setTimeout(() => {
                    setUpdated(false)
                  }, 3000)
                }
              )
            : changeStatus(selectedFlatRows, v.status).then(() => {
                setUpdated(true)
                setTimeout(() => {
                  setUpdated(false)
                }, 3000)
              })
        }}
        type="button"
        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {v.label}
      </button>
    ))
  }

  return (
    <div className={`flex flex-col`}>
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          {selectedFlatRows.length > 0 &&
            (status === "active" ? (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true)
                    return getDuplicateOrders(selectedFlatRows).then((data) => {
                      setPrintedData([...data])
                      setLoading(false)
                      return data.length === selectedFlatRows.length
                        ? setPrintableData(data)
                        : setDuplicate(data)
                    })
                  }}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  印刷プレビュー
                </button>
                <StatusButton />
              </div>
            ) : (
              <StatusButton />
            ))}
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200 table-auto"
            >
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column, index) => {
                      return (
                        <th
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          {column.render("Header")}
                          <span>
                            {index > 2 && column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                          {/* <div
                            {...column.getResizerProps()}
                            className={`resizer ${
                              column.isResizing ? "isResizing" : ""
                            }`}
                          /> */}
                          {index > 2 && (
                            <div>
                              {column.canFilter
                                ? column.render("Filter")
                                : null}
                            </div>
                          )}
                        </th>
                      )
                    })}
                  </tr>
                ))}
              </thead>

              <tbody
                {...getTableBodyProps()}
                className="bg-white divide-y divide-gray-200"
              >
                {loading ? (
                  <tr>
                    <td className="p-4">Loading...</td>
                  </tr>
                ) : rows.length === 0 ? (
                  <tr>
                    <td className="p-4">
                      <h2 className="py-4">販売終了にしますか？販売終了商品は今後も管理画面から確認できます。</h2>
                      <button
                        onClick={(e) => {
                          if (
                            window.confirm(
                              "販売終了にしますか？販売終了商品は今後も管理画面から確認できます。"
                            )
                          ) {
                            e.preventDefault()
                            archiveProduct()
                          }
                        }}
                        className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                      >
                        {/* <Pencil className="-ml-0.5 mr-2 h-4 w-4" /> */}
                        販売終了
                      </button>
                    </td>
                  </tr>
                ) : (
                  rows.map((row, i) => {
                    prepareRow(row)
                    return (
                      <tr {...row.getRowProps()}>
                        {row.cells.map((cell, index) => {
                          return (
                            <td
                              {...cell.getCellProps()}
                              className={
                                index === 1
                                  ? "w-1 p-4 whitespace-nowrap"
                                  : "px-6 py-4 whitespace-nowrap"
                              }
                            >
                              <div className="text-sm font-normal text-gray-900">
                                {cell.render("Cell")}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
  const defaultRef = useRef()
  const resolvedRef = ref || defaultRef

  useEffect(() => {
    resolvedRef.current.indeterminate = indeterminate
  }, [resolvedRef, indeterminate])

  return (
    <>
      <input
        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
        type="checkbox"
        ref={resolvedRef}
        {...rest}
      />
    </>
  )
})

// Define a default UI for filtering
function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}) {
  const count = preGlobalFilteredRows.length
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 200)

  return (
    <span>
      Search:{" "}
      <input
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
        placeholder={`${count} records...`}
        style={{
          fontSize: "1.1rem",
          border: "1px solid #eee",
        }}
      />
    </span>
  )
}

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <div>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-1 flex items-center pointer-events-none">
          <Svg />
        </div>
        <input
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-5 sm:text-sm border-gray-300 rounded-md"
          value={filterValue || ""}
          onChange={(e) => {
            setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
          }}
        />
      </div>
    </div>
  )
}

function Svg() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-3 w-3 text-gray-300"
    >
      <path
        fillRule="evenodd"
        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
        clipRule="evenodd"
      />
    </svg>
  )
}
function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val

const thList = [
  "",
  "",
  "名前",
  "住所",
  "TEL",
  "区",
  "集金人",
  "数量",
  "対応者",
  "ポイント",
  "受付日",
  "最終更新日",
  "備考",
  "_id",
]

function generateHeader(bg) {
  return thList.map((Header, i) => {
    const index = i
    switch (index) {
      case 1:
        return {
          Header,
          accessor: "col1",
          sortType: "basic",
          width: 70,
          Cell: ({ value }) => (
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${bg}`}
            >
              {value}
            </span>
          ),
        }
      case 0:
        return {
          Header,
          accessor: "col0",
          width: 30,
        }
      case 3:
        return {
          Header,
          accessor: "col3",
          width: 270,
        }
      case 12:
        return {
          Header,
          accessor: "col12",
          width: 800,
        }
      default:
        return {
          Header,
          accessor: "col" + index, // accessor is the "key" in the data
          sortType: "basic",
        }
    }
  })
}

function functionForOmit() {
  return {
    // Add a new fuzzyTextFilterFn filter type.
    fuzzyText: fuzzyTextFilterFn,
    // Or, override the default text filter to use
    // "startWith"
    text: (rows, id, filterValue) => {
      return rows.filter((row) => {
        const rowValue = row.values[id]
        return rowValue !== undefined
          ? String(rowValue)
              .toLowerCase()
              .startsWith(String(filterValue).toLowerCase())
          : true
      })
    },
  }
}

function Edit({ setForm, setEditOrder, v }) {
  return (
    <button
      onClick={(e) => {
        setForm({ method: "PATCH", url: "/api/orders" })
        setEditOrder(v)
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4 text-gray-400 cursor-pointer"
      >
        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
        <path
          fillRule="evenodd"
          d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}

function getDuplicateOrders(selectedFlatRows) {
  const current = selectedFlatRows.map((v) => v.original.col4) //tel
  return new Promise((resolve) => {
    axios.get("/api/orders").then((res) => {
      const data = res.data.filter((v) => {
        return current.includes(v.tel) && v.product.length > 0
      })
      resolve(data)
    })
  })
}

function changeStatus(rows, status) {
  const data = rows.map((v) => {
    const res = { _id: v.original.col13, ...v.original }
    delete res["col0"]
    return res
  })
  const props = {
    data,
    status,
  }
  return new Promise((resolve) => {
    axios.put("/api/orders", props).then((res) => {
      resolve(res.data)
    })
  })
}

function restoreFromDeleted(rows, currentProduct, status) {
  return Promise.all(
    rows.map(
      async (v) =>
        await axios.post(`/api/orders/${v.values.col13}`, {
          data: {
            product_id: currentProduct._id,
            qty: v.values.col7,
            status,
          },
        })
    )
  )
}
