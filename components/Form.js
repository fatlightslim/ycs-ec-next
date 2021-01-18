import { Controller } from "react-hook-form"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Suggest from "./SuggestDownshift"
import axios from "axios"
import { DevTool } from "@hookform/devtools"
import { matchSorter } from "match-sorter"

const labels = [
  { ja: "電話番号", en: "tel", type: "text" },
  { ja: "名前", en: "name", type: "text" },
  { ja: "顧客No.", en: "customerNumber", type: "text" },
  { ja: "住所1", en: "address1", type: "text" },
  { ja: "住所2", en: "address2", type: "text" },
  { ja: "集金人", en: "collector", type: "text" },
  { ja: "区域", en: "area", type: "text" },
  { ja: "順路", en: "route", type: "text" },
  { ja: "注文数", en: "qty", type: "number", default: 1 },
  { ja: "使用ポイント", en: "point", type: "number", default: "0" },
  { ja: "対応者", en: "by", type: "text" },
  { ja: "備考", en: "memo", type: "text" },
]

export default function Form({
  setForm,
  currentDept,
  orders,
  setOrders,
  currentProduct,
  setCurrentProduct,
  editOrder,
  form,
}) {
  const [customers, setCustomers] = useState([])
  const [initialData, setInitialData] = useState([])

  useEffect(() => {
    axios.get("/api/customers").then((res) => {
      const data = res.data.filter((v) => v.region === currentDept.customers)
      // console.log(data)
      setCustomers(data)
      setInitialData(data)
    })
  }, [])

  const {
    register,
    handleSubmit,
    watch,
    errors,
    control,
    setValue,
    reset,
    // formState: { isDirty, isSubmitting, touched, submitCount },
    // formState: { touched },
  } = useForm({
    // mode: "onChange",
  })

  const getItems = (filter) => {
    return filter
      ? matchSorter(customers, filter, {
          keys: ["tel"],
        })
      : customers
  }
  const itemToString = (i) => {
    return i ? i.tel : ""
  }

  const handleStateChange = (changes, downshiftState) => {
    if (changes.hasOwnProperty("inputValue")) {
      const filtered = getItems(changes.inputValue)
      setCustomers(filtered)
    }
    // handle stuff here if you need to
    // this is especially useful if you need
    // to controll some of the internal state yourself
  }
  const handleChange = (selectedItem, downshiftState) => {
    setCustomers(initialData)
    // handle the new selectedItem here
    selectedItem
      ? Object.keys(selectedItem).forEach((v) => {
          setValue(v, selectedItem[v])
        })
      : reset({})
  }

  const onPost = (data) => {
    const { newOrder, updatedProduct } = data
    const copied = [...orders]
    copied.unshift(newOrder)

    setOrders(copied)
    setCurrentProduct(updatedProduct)
    setForm(null)
  }

  const onPatch = (data) => {
    const { newOrder, updatedProduct } = data
    const copied = orders.filter((v) => v._id !== newOrder._id)

    setOrders([...copied, newOrder])
    setCurrentProduct(updatedProduct || currentProduct)
    setForm(null)
  }

  const onDelete = (data) => {
    const { _id, updatedProduct } = data
    const copied = orders.filter((v) => v._id !== _id)

    setOrders([...copied])
    setCurrentProduct(updatedProduct)
    setForm(null)
  }

  const onSubmit = (data) => {
    const { method, url } = form
    axios({
      method,
      url,
      data: { data },
    }).then((r) => {
      switch (form.method) {
        case "POST":
          return onPost(r.data)
        case "PATCH":
          return onPatch(r.data)
        case "DELETE":
          return onDelete(r.data)
      }
    })
  }

  const Input = ({ v, i }) => (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor={v.en}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        children={v.ja}
      />
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        {i === labels.length - 1 ? (
          <textarea
            name={v.en}
            id={v.en}
            className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md"
            ref={register}
            defaultValue={form.method === "PATCH" ? editOrder[v.en] : ""}
          />
        ) : (
          <input
            type={v.type}
            name={v.en}
            id={v.en}
            className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
            ref={register}
            defaultValue={
              form.method === "PATCH" ? editOrder[v.en] : v.default || ""
            }
          />
        )}
      </div>
    </div>
  )

  // console.log(watch("downshift")) // watch input value by passing the name of it

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-8 divide-y divide-gray-200"
      >
        <input type="hidden" value={editOrder._id} name="_id" ref={register} />
        <input
          type="hidden"
          value={currentProduct._id}
          name="product_id"
          ref={register}
        />
        <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
          <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {form.method}
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Use a permanent address where you can receive mail.
              </p>
            </div>
            <div className="space-y-6 sm:space-y-5">
              {labels.map((v, i) => {
                // console.log(form);
                return i === 0 ? (
                  form.method === "POST" ? (
                    <Controller
                      key={v.en}
                      control={control}
                      name="tel"
                      render={(props) => {
                        return (
                          <Suggest
                            ja={v.ja}
                            en={v.en}
                            {...props}
                            customers={customers}
                            onChange={handleChange}
                            onStateChange={handleStateChange}
                            itemToString={itemToString}
                            // defaultValue={
                            //   form.method === "PATCH" ? editOrder[v.en] : ""
                            // }
                          />
                        )
                      }}
                    />
                  ) : (
                    <Input v={v} i={i} key={v.en} />
                  )
                ) : (
                  <Input v={v} i={i} key={v.en} />
                )
              })}
            </div>
          </div>
        </div>

        <div className="pt-5">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setForm(null)}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              保存
            </button>
            <button
              onClick={(e) => {
                if (window.confirm("削除しますか？")) {
                  setForm({ method: "DELETE", url: "/api/orders" })
                  handleSubmit(onSubmit)
                }
              }}
              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              削除
            </button>
          </div>
        </div>
      </form>
      {/* <pre>{JSON.stringify(formState, null, 2)}</pre> */}
      {/* <DevTool control={control} /> */}
    </div>
  )
}
