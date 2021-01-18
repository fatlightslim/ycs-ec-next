import Downshift from "downshift"
import VirtualList from "react-tiny-virtual-list"

export default function SuggestDownshift({
  ja,
  en,
  customers,
  defaultValue,
  ...rest
}) {
  return (
    <Downshift
      itemCount={customers.length}
      itemToString={(selectedItem) => {
        return selectedItem ? selectedItem.tel : ""
      }}
      {...rest}
    >
      {({
        getInputProps,
        getItemProps,
        getLabelProps,
        getMenuProps,
        isOpen,
        getToggleButtonProps,
        inputValue,
        highlightedIndex,
        selectedItem,
        getRootProps,
        clearSelection,
      }) => (
        <>
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
            <label
              {...getLabelProps()}
              htmlFor={en}
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              {ja}
            </label>
            <div
              {...getRootProps({}, { suppressRefError: true })}
              className="mt-1 sm:mt-0 sm:col-span-2"
            >
              <input
                {...getInputProps()}
                type="text"
                name={en}
                id={en}
                className="max-w-lg inline-block w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 rounded-md"
              />

              {selectedItem ? (
                <span
                  className="-m-8"
                  onClick={clearSelection}
                  aria-label="clear selection"
                >
                  <XIcon />
                </span>
              ) : (
                <span className="-m-8" {...getToggleButtonProps()}>
                  <ArrowIcon isOpen={isOpen} />
                </span>
              )}
            </div>
          </div>
          <div className="relative -ml-12 -top-5">
            <ul
              {...getMenuProps()}
              className="divide-y divide-gray-200 max-w-xs mx-auto absolute inset-x-0 shadow-xl"
            >
              {!isOpen || !customers.length ? null : (
                <VirtualList
                  scrollToIndex={highlightedIndex || 0}
                  scrollToAlignment="auto"
                  height={customers.length < 5 ? customers.length * 100 : 500}
                  itemCount={customers.length}
                  itemSize={42}
                  // height={600}
                  renderItem={({ index, style }) => {
                    return (
                      <li
                        className="border-b border-dotted"
                        {...getItemProps({
                          key: customers[index]._id,
                          item: customers[index],
                          index,
                          style: {
                            backgroundColor:
                              highlightedIndex === index
                                ? "lightgray"
                                : "white",
                            fontWeight:
                              selectedItem === customers[index]
                                ? "bold"
                                : "normal",
                          },
                        })}
                      >
                        {/* <a href="#" onClick={() => onChange()}> */}
                        <Inner item={customers[index]} />
                        {/* </a> */}
                        {/* {itemToString(customers[index])} */}
                      </li>
                    )
                  }}
                />
              )}
              {/* ))} */}
            </ul>
          </div>
        </>
      )}
    </Downshift>
  )
}

function Inner({ item }) {
  return (
    <div className="px-4 py-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-indigo-600 truncate">
          {item.name}
        </p>
      </div>
      <div className="mt-2 sm:flex sm:justify-between">
        <div className="sm:flex">
          <p className="flex items-center text-sm text-gray-500">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {item.tel}
          </p>
          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
            <svg
              className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {item.address1}
          </p>
        </div>
      </div>
    </div>
  )
}

function ArrowIcon({ isOpen }) {
  return (
    <svg
      className="inline-block"
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={16}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
      transform={isOpen ? "rotate(180)" : undefined}
    >
      <path d="M1,6 L10,15 L19,6" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      className="inline-block"
      viewBox="0 0 20 20"
      preserveAspectRatio="none"
      width={12}
      fill="transparent"
      stroke="#979797"
      strokeWidth="1.1px"
    >
      <path d="M1,1 L19,19" />
      <path d="M19,1 L1,19" />
    </svg>
  )
}
