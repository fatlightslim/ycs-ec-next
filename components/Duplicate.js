import { useMemo, useRef, forwardRef, useEffect, useState } from "react"
import { useTable, useRowSelect } from "react-table"
import axios from "axios"
// import uniqBy from 'lodash/uniqBy'
// import groupBy from 'lodash/groupBy'
// import { first } from "lodash"

export default function Duplicate({
  setDuplicate,
  setPrintableData,
  duplicate,
  currentProduct,
  checkedData,
  printableData,
}) {
  async function fetchProductToGetReceiptData(originalData, key) {
    const data = [...duplicate]
    const others = data.filter((v) => v.product_id !== currentProduct._id)

    const promises = await Promise.all(
      originalData.map(async (org) => {
        org.price = parseInt(org.qty) * parseInt(org.product[0].price)
        org.merged = {
          memo: [org.memo],
          products: [org.product[0].name],
          point: [org.point],
          price: org.price,
        }
        // console.log(key)

        if (key !== "original") {
          const dataShouldMerge = others.filter((oth) => oth.tel === org.tel)

          await dataShouldMerge.map(async (v) => {
            // console.log(v);
            // const res = await axios.get(`/api/duplicate/${v.product_id}`)
            // console.log(res.data);
            // let product = res.data
            org.mutiple = true
            org.price += parseInt(v.product[0].price) * parseInt(v.qty)
            org.merged.price += parseInt(v.product[0].price) * parseInt(v.qty)
            org.merged.memo.push(v.memo)
            org.merged.products.push(v.product[0].name)
            org.merged.point.push(v.point)
            return org
          })
        }

        // console.log(org)
        return org
      })
    )
    return promises
  }

  async function getOrderData(data) {
    const orders = await Promise.all(
      data.map(async (v) => {
        const res = await axios.post(`/api/duplicate/${v.values.col13}`)
        const r = await res.data
        return { ...r }
      })
    )
    return fetchProductToGetReceiptData(orders, "original")
  }

  async function getDuplicateData(items) {
    const others = duplicate.filter((v) => v.product_id !== currentProduct._id)
    const result = items.map((item) => {
      item.merged = {
        memo: [],
        point: [],
        products: [item.product[0].name],
        qty: [item.qty],
        price: item.qty * item.product[0].price,
      }

      const otherData = others.filter((v) => v.tel === item.tel)
      otherData.forEach(async (v) => {
        item.mutiple = true
        item.merged.price += parseInt(v.product[0].price) * parseInt(v.qty)
        if (v.memo) item.merged.memo.push(v.memo)
        item.merged.products.push(v.product[0].name)
        item.merged.point.push(v.point)
        item.merged.qty.push(v.qty)
      })
      return item
    })
    // console.log(result);
    return result
  }

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

  async function mergeData(data) {
    const items = duplicate.filter((v) => v.product_id === currentProduct._id)
    const grouped = groupBy(items, (item) => item.tel)
    const mapped = grouped.map((item) => {
      const sum = item[1].reduce((v, x) => v + x.qty, 0)
      item[1][0].qty = sum
      return item[1][0]
    })
    // console.log(mapped)
    return getDuplicateData(mapped)
  }

  async function preparePrintableData(key) {
    const res =
      key === "original"
        ? await getOrderData(checkedData)
        : // : await fetchProductToGetReceiptData(originalData, "duplicate")
          await mergeData()
    setPrintableData(res)
    // console.log(res)
    // setPrintedData(data)
    setTimeout(() => {
      setDuplicate([])
    }, 400)
  }

  return (
    <div className="bg-gray-50 mt-8">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
          <span className="block text-indigo-600">
            同一のお客様による他商品の注文があります。
          </span>
        </h2>
        <div className="mt-8 lex lg:mt-0 lg:flex-shrink-0">
          <div className="inline-flex rounded-md shadow">
            <button
              onClick={() => preparePrintableData("duplicate")}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              合算して印刷
            </button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <button
              onClick={() => preparePrintableData("original")}
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              無視
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <Table duplicate={duplicate} currentProduct={currentProduct} />
      </div>
    </div>
  )
}

const labelsJp = [
  "名前",
  "商品",
  "TEL",
  "住所",
  "区",
  "集金人",
  "対応者",
  "ポイント",
  "受付日",
  "最終更新日",
  "備考",
]
const labels = [
  "name",
  "product",
  "tel",
  "address",
  "area",
  "collector",
  "by",
  "point",
  "createdAt",
  "updatedAt",
  "memo",
]

function Table({ duplicate, currentProduct }) {
  const [color, setColor] = useState("bg-white")

  useEffect(() => {
    toggleAllRowsSelected(true)
  }, [])

  const IndeterminateCheckbox = forwardRef(
    ({ indeterminate, ...rest }, ref) => {
      const defaultRef = useRef()
      const resolvedRef = ref || defaultRef

      useEffect(() => {
        resolvedRef.current.indeterminate = indeterminate
      }, [resolvedRef, indeterminate])

      return (
        <>
          <input
            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
            type="checkbox"
            ref={resolvedRef}
            {...rest}
          />
        </>
      )
    }
  )
  const sorted = duplicate.sort((a, b) => {
    if (a.name < b.name) {
      return -1
    }
    if (a.name > b.name) {
      return 1
    }
    return 0
  })
  // let values = []
  // const data = sorted
  const data = useMemo(
    () =>
      // sorted.map((v) => {
      //   labels.map((x) => {
      //     return {
      //       [x]: v[x],
      //     }
      //   })
      // }),
      sorted.map((v, i) => {
        return {
          [labels[2]]: v.tel,
          [labels[0]]: v.name,
          [labels[1]]:
            v.product[0]._id === currentProduct._id ? (
              <span className="text-blue-700">{v.product[0].name}</span>
            ) : (
              v.product[0].name
            ),
          [labels[3]]: v.address1,
          [labels[4]]: v.area,
          [labels[5]]: v.collector,
          [labels[6]]: v.by,
          [labels[7]]: v.point,
          [labels[8]]: v.createdAt,
          [labels[9]]: v.updatedAt,
          [labels[10]]: v.memo,
          _id: v._id,
        }
      }),
    []
  )
  const columns = useMemo(
    () =>
      labels.map((v, i) => {
        return {
          Header: labelsJp[i],
          accessor: v,
        }
      }),
    []
  )
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    selectedFlatRows,
    state: { selectedRowIds },
    toggleAllRowsSelected,
    // toggleAllPageRowsSelected
  } = useTable({ columns, data }, useRowSelect, (hooks) => {
    hooks.visibleColumns.push((columns) => [
      // Let's make a column for selection
      {
        id: "selection",
        // The header can use the table's getToggleAllRowsSelectedProps method
        // to render a checkbox
        Header: ({ getToggleAllRowsSelectedProps }) => (
          <div>
            <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          </div>
        ),
        // The cell can use the individual row's getToggleRowSelectedProps method
        // to the render a checkbox
        Cell: ({ row }) => (
          <div>
            <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          </div>
        ),
      },
      ...columns,
    ])
  })

  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table
              {...getTableProps()}
              className="min-w-full divide-y divide-gray-200"
            >
              <thead className="bg-gray-50">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        className="px-6 py-3 text-left text-xs font-normal text-gray-500 uppercase tracking-wider"
                      >
                        {column.render("Header")}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody {...getTableBodyProps()}>
                {rows.map((row, i) => {
                  prepareRow(row)
                  // let prev = i > 0 ? rows[i - 1] : null
                  // if (prev) {
                  //   if (prev.values.tel !== row.values.tel) {
                  //     let bg = color === "bg-white" ? "bg-gray-100" : "bg-white"
                  //     // console.log(bg);
                  //     setColor(bg)
                  //   }
                  // }
                  return (
                    <tr {...row.getRowProps()} className={color}>
                      {row.cells.map((cell) => {
                        return (
                          <td
                            {...cell.getCellProps()}
                            className="px-6 py-4 whitespace-nowrap text-sm font-normal text-gray-900"
                          >
                            {cell.render("Cell")}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
