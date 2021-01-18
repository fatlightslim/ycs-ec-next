export default function BaseInput({ v, ...rest }) {
  return (
    <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
      <label
        htmlFor={v.en}
        className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
        children={v.ja}
      />
      <div className="mt-1 sm:mt-0 sm:col-span-2">
        <input
          {...rest}
          type={v.type}
          name={v.en}
          id={v.en}
          className="max-w-lg block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
        />
      </div>
    </div>
  )
}
