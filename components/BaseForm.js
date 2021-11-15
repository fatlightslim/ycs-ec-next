import { useScrollPosition } from "@n8tb1t/use-scroll-position"
import React, { useState } from "react"
import { useForm, FormProvider, useFormContext } from "react-hook-form"
import axios from "axios"

export default function BaseForm({
  actions,
  children,
  form,
  setForm,
  currentDept,
  orders,
  setOrders,
  currentProduct,
  setCurrentProduct,
  products,
  setProducts,
  onPost,
  onPut,
  onDelete,
  onPatch,
  ...rest
}) {
  const [headerStyle, setHeaderStyle] = useState(false)
  const methods = useForm()

  useScrollPosition(
    ({ prevPos, currPos }) => {
      const isVisible = currPos.y < -40
      setHeaderStyle(isVisible)
    },
    [headerStyle]
  )

  const onSubmit = (data) => {
    const { method, url } = form
    axios({
      method,
      url,
      data: { data },
    }).then((r) => {
      switch (method) {
        case "POST":
          return onPost(r.data)
        case "PUT":
          return onPut(r.data)
        case "PATCH":
          return onPatch(r.data)
        case "DELETE":
          return onDelete(r.data)
      }
    })
  }

  const Title = ({ ...props }) => {
    const translation = {
      "/api/products": "商品を",
      "/api/depts": "部門を",
      PATCH: "編集",
      POST: "登録",
    }
    return (
      <h3 {...props}>
        {currentDept.name} | {translation[form.url] || form.url}
        {translation[form.method]}
      </h3>
    )
  }

  // console.log(watch("downshift")) // watch input value by passing the name of it
  // console.log(headerStyle);

  return (
    // <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mb-16">
        {actions}
        <div className="max-w-5xl mx-auto  px-4 sm:px-6 lg:px-8">
          <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
            <div className="pt-8 space-y-6 sm:pt-10 sm:space-y-5 px-4">
              <Title
                className={`text-lg leading-6 font-medium text-gray-900 ${
                  headerStyle && "sticky top-6 z-50"
                }`}
              />
              <div className="space-y-6 sm:space-y-5">
                {React.Children.map(children, (child) => {
                  return React.createElement(child.type, {
                    ...{
                      ...child.props,
                      key: child.key,
                      register: methods.register,
                      control: methods.control,
                      useFormContext,
                      setValue: methods.setValue
                    },
                  })
                })}
                {/* {children} */}
              </div>
            </div>
          </div>
          {/* <DevTool control={control} /> */}
        </div>
      </form>
    // </FormProvider>
  )
}
