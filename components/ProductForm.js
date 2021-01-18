import axios from "axios"
import BaseForm from "./BaseForm"

export default function ProductForm(props) {
  const {
    currentDept,
    products,
    setProducts,
    form,
    setForm,
    currentProduct,
    setCurrentProduct,
  } = props

  const labels = [
    { ja: "商品名", en: "name", type: "text" },
    { en: "dept_id", type: "hidden", value: currentDept._id },
    { en: "sales", type: "hidden", value: 0 },
    { en: "status", type: "hidden", value: "active" },
    { ja: "在庫数", en: "qty", type: "number" },
    { ja: "税込価格", en: "price", type: "number" },
    { ja: "連絡事項", en: "info" },
  ]

  const onPost = (data) => {
    const copied = [...products]
    setForm(null)
    setProducts(copied)
  }

  const onPut = (data) => {}

  const onPatch = (data) => {
    const { value } = data
    const copied = products.filter((v) => v._id !== value._id)
    setForm(null)
    setProducts([...copied, value])
    setCurrentProduct({ ...value })
  }

  const onDelete = () => {
    axios.delete(form.url, { data: { _id: currentProduct._id } }).then((r) => {
      const { _id } = r.data.value
      const copied = products.filter((v) => v._id !== _id)

      setForm(null)
      setProducts([...copied])
      setCurrentProduct(null)
    })
  }

  const Input = ({ v, i, register }) =>
    v.type === "hidden" ? (
      <input type="hidden" name={v.en} value={v.value} ref={register} />
    ) : (
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
              defaultValue={form.method === "PATCH" ? currentProduct[v.en] : ""}
            />
          ) : (
            <input
              type={v.type}
              name={v.en}
              id={v.en}
              className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              ref={register}
              defaultValue={form.method === "PATCH" ? currentProduct[v.en] : ""}
            />
          )}
        </div>
        {form.method === "PATCH" && (
          <input
            type="hidden"
            name="_id"
            value={currentProduct._id}
            ref={register}
          />
        )}
      </div>
    )

  const locals = {
    onPost,
    onPut,
    onDelete,
    onPatch,
  }

  const Actions = () => (
    <div className="p-4 sticky top-0 bg-gray-50 bg-opacity-90 border-b">
      <div className={`flex justify-end max-w-6xl`}>
        <button
          type="button"
          onClick={() => setForm(null)}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          キャンセル
        </button>
        <button
          type="submit"
          className="disabled:opacity-50 ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          保存
        </button>
        <button
          href="#"
          // type="submit"
          onClick={(e) => {
            if (window.confirm("削除しますか？")) {
              e.preventDefault()
              onDelete()
            }
          }}
          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:red-offset-2 focus:ring-red-500"
        >
          削除
        </button>
      </div>
    </div>
  )

  return (
    <BaseForm {...props} {...locals} actions={<Actions key="actions" />}>
      {labels.map((v, i) => {
        return <Input v={v} i={i} key={v.en} />
      })}
    </BaseForm>
  )
}
