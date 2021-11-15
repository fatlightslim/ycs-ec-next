// import { Plus, Pencil } from "./Svg"
import axios from "axios"
import { sumBy } from "lodash";
// import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
// import Notification from "./Notification"

export default function Stats({
  currentProduct,
  formatter,
  setForm,
  orders
}) {
  // const archiveProduct = () => {
  //   const status = { status: "done" }
  //   axios
  //     .put("/api/products", { _id: currentProduct._id, status })
  //     .then((r) => {
  //       const copied = products.filter((v) => v._id !== r.data.value._id)
  //       setProducts([...copied])
  //       setCurrentProduct(null)
  //     })
  // }
  const activeOrders = orders.filter(v => v.status !== 'deleted')
  const sales = sumBy(activeOrders, (v) => v.qty)
  
  return (
    <div className="bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-xl font-extrabold tracking-tight text-gray-900">
          <span className="block text-gray-600">{currentProduct.name}</span>
          <span className="block text-sm font-normal">
            {currentProduct.info}
          </span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
          <div className="ml-3 inline-flex rounded-md shadow">
            <button
              onClick={() => setForm({ method: "POST", url: "/api/orders" })}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {/* <Plus className="-ml-0.5 mr-2 h-4 w-4" /> */}
              注文入力
            </button>
          </div>
          <div className="ml-3 inline-flex rounded-md shadow">
            <button
              onClick={() => setForm({ method: "PATCH", url: "/api/products" })}
              className="text-sm inline-flex items-center justify-center px-4 py-2 border border-transparent font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
            >
              {/* <Pencil className="-ml-0.5 mr-2 h-4 w-4" /> */}
              商品編集
            </button>
          </div>
          {/* <div className="ml-3 inline-flex rounded-md shadow">
            <button
              onClick={(e) => {
                if (window.confirm("販売終了にしますか？\販売終了商品は今後も管理画面から確認できます。")) {
                  e.preventDefault()
                archiveProduct()
                }
              }}
            className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
            >
              販売終了
            </button>
          </div> */}
        </div>
      </div>

      <div className="px-4 pb-4">
        <dl className="grid grid-cols-1 gap-5 sm:grid-cols-4">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                売上
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {formatter.format(sales * currentProduct.price)}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                販売価格
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {formatter.format(currentProduct.price)}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                販売数
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {/* {parseInt(currentProduct.sales)} */}
                {sales}
              </dd>
            </div>
          </div>
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dt className="text-sm font-medium text-gray-500 truncate">
                在庫数
              </dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">
                {currentProduct.qty <= 0 ? 0 : parseInt(currentProduct.qty) - parseInt(sales)}
              </dd>
            </div>
          </div>
        </dl>
      </div>
    </div>
  )
}

const labels = {
  name: "名前",
  zip: "郵便番号",
  address1: "住所1",
  address2: "住所2",
  fax: "FAX",
  tel: "TEL",
  info: "メモ",
  name: "名前",
  price: "価格",
  qty: "在庫数",
  sales: "売上",
  count: "販売数",
}

function Input({ name, value, register, control }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {labels[name]}
      </label>
      <div className="mt-1">
        {["info", "name"].includes(name) ? (
          <input
            ref={register}
            type="text"
            name={name}
            id={name}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            placeholder=""
            defaultValue={value}
            //   onChange={(e) => setValue('name', e.target.value, { shouldValidate: true })}
          />
        ) : (
          <Controller
            name={name}
            defaultValue={value}
            render={(props) => (
              <input
                type="number"
                {...props}
                value={props.value}
                onChange={(e) => {
                  props.onChange(parseInt(e.target.value, 10))
                }}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            )}
            control={control}
          />
        )}
      </div>
    </div>
  )
}

// function EditProduct({
//   updated,
//   setUpdated,
//   setCurrentProduct,
//   currentProduct,
// }) {
//   const { register, handleSubmit, control } = useForm()

//   const onSubmit = (data) => {
//     axios.put("/api/products", data).then((res) => {
//       setUpdated(true)
//       setTimeout(() => {
//         setUpdated(false)
//       }, 3000)
//       setCurrentProduct(res.data.value)
//     })
//   }

//   const props = {
//     input: (key) => {
//       return {
//         key,
//         name: key,
//         value: currentProduct[key],
//         register,
//         control,
//       }
//     },
//     blackList: ["_id", "timestamp", "deleted", "done", "dept_id"],
//   }
//   return (
//     <div className="bg-gray-50">
//       <Notification updated={updated} />
//       <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <input
//             type="hidden"
//             value={currentProduct._id}
//             name="_id"
//             ref={register}
//           />
//           {Object.keys(currentProduct)
//             .sort()
//             .map((key) => {
//               return props.blackList.includes(key) ? null : (
//                 <Input {...props.input(key)} />
//               )
//             })}
//           <button className="btn-blue" type="submit">
//             更新
//           </button>
//           <button className="mx-4" onClick={() => setForm(null)}>
//             キャンセル
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }
