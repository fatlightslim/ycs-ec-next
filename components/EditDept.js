import { useForm } from "react-hook-form"
import { useState } from "react"
import axios from "axios"
import SelectDept from "./SelectDept"

export default function EditDept(props) {
  const {currentDept, setCurrentDept} = props
  const { reset, register, handleSubmit } = useForm()

  const locals = {
    input: (key) => {
      // console.log(currentDept[key]);
      return {
        key,
        name: key,
        value: currentDept[key],
        register,
      }
    },
    blackList: ["old_id", "_id", "createdAt", "deleted", "updatedAt"],
  }

  const onSubmit = (data) => {
    // console.log(data)
    axios.post("/api/depts", data).then((res) => {
      setCurrentDept(res.data.value)
    })
  }

  return (
    <>
      {/* <Radio {...props.radio} /> */}
      <SelectDept reset={reset} {...props} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <input type="hidden" value={currentDept._id} name="_id" ref={register} />

        {Object.keys(currentDept).sort().map((key) => {
          return locals.blackList.includes(key) ? null : (
            <Input {...locals.input(key)} />
          )
        })}

        <button type="submit" className="mt-4 btn-blue">
          更新
        </button>
      </form>
    </>
  )
}

const labels = {
  name: "名前",
  fullName: "領収書表示名",
  zip: "郵便番号",
  person: "代表者",
  address1: "住所1",
  address2: "住所2",
  fax: "FAX",
  tel: "TEL",
}

function Input({ name, value, register }) {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {labels[name]}
      </label>
      <div className="mt-1">
        <input
          ref={register}
          type="text"
          name={name}
          id={name}
          className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          defaultValue={value}
          //   onChange={(e) => setValue('name', e.target.value, { shouldValidate: true })}
        />
      </div>
    </div>
  )
}


// function Radio({ setDept, data, dept, reset }) {
//   return (
//     <div className="m-4 space-y-4">
//       {data.map((v) => {
//         return (
//           <div key={v.name} className="flex items-center">
//             <input
//               id={v.name}
//               name="region"
//               onChange={() => {
//                 reset(v)
//                 setDept(v)
//               }}
//               checked={v._id === dept._id}
//               type="radio"
//               className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
//             />
//             <label
//               htmlFor={v.name}
//               className="ml-3 block text-sm font-medium text-gray-700"
//             >
//               {v.name}
//             </label>
//           </div>
//         )
//       })}
//     </div>
//   )
// }
