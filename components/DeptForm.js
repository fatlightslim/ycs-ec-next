import axios from "axios"
import React from "react"
import BaseForm from "./BaseForm"
// import BaseInput from "./BaseInput"
import SelectDept from "./SelectDept"

export default function DeptForm(props) {
  const {
    currentDept,
    setCurrentDept,
    products,
    setProducts,
    form,
    setForm,
    depts,
    setDepts,
  } = props

  const labels = [
    { ja: "名前", en: "name", type: "text" },
    { ja: "領収書表示名", en: "fullName", type: "text" },
    { ja: "郵便番号", en: "zip", type: "text" },
    { ja: "代表者", en: "person", type: "text" },
    { ja: "住所1", en: "address1", type: "text" },
    { ja: "住所2", en: "address2", type: "text" },
    { ja: "FAX", en: "fax", type: "text" },
    { ja: "TEL", en: "tel", type: "text" },
    { en: "_id", type: "hidden", value: currentDept._id },
  ]

  const addNewDept = () => {}

  const onPost = (data) => {
    const copied = [...products]
    setForm(null)
    setProducts(copied)
  }

  const onPut = (data) => {}

  const onPatch = (data) => {
    const { value } = data
    const copied = depts.filter((v) => v._id !== value._id)
    setDepts([...copied, value])
    setCurrentDept({ ...value })
    // setForm(null)
  }

  const onDelete = () => {
    axios.delete(form.url, { data: { _id: currentDept._id } }).then((r) => {
      const { _id } = r.data.value
      const copied = depts.filter((v) => v._id !== _id)
      setDepts([...copied])
      // setForm(null)
      setCurrentDept(depts[0])
    })
  }

  const Input = ({ v, register }) =>
    v.type === "hidden" ? (
      <input type="hidden" name={v.en} value={v.value} ref={register} />
    ) : (
      // <BaseInput
      //   v={v}
      //   forwardRef={register}
      //   defaultValue={form.method === "PATCH" ? currentDept[v.en] : ""}
      // />
      <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
        <label
          htmlFor={v.en}
          className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
          children={v.ja}
        />
        <div className="mt-1 sm:mt-0 sm:col-span-2">
          <input
            // {...rest}
            ref={register}
            defaultValue={form.method === "PATCH" ? currentDept[v.en] : ""}
            type={v.type}
            name={v.en}
            id={v.en}
            className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
          />
        </div>
      </div>
    )

  const locals = {
    onPost,
    onPut,
    onDelete,
    onPatch,
  }

  const Actions = () => (
    <div className="py-4 sticky top-0 bg-gray-50 bg-opacity-90 border-b  sm:px-6 lg:px-8">
      <div className={`flex justify-end max-w-6xl`}>
        <button
          type="submit"
          className="disabled:opacity-50 ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          更新
        </button>
        <a
          href="#"
          // type="submit"
          onClick={(e) => {
            e.preventDefault()
            if (window.confirm("削除しますか？")) {
              onDelete()
            }
          }}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:red-offset-2 focus:ring-red-500"
        >
          削除
        </a>
        <button
          // type="submit"
          onClick={(e) => {
            e.preventDefault()
            addNewDept()
          }}
          className="disabled:opacity-50 ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          追加
        </button>
      </div>
    </div>
  )

  return (
    <BaseForm {...props} {...locals} actions={<Actions />}>
      <SelectDept key="selectDept" {...props} />
      {labels.map((v, i) => {
        return <Input v={v} i={i} key={v.en} />
      })}
    </BaseForm>
  )
}
