import { format } from "date-fns"

export default function MergeReceipt({
  currentProduct,
  currentDept,
  checked,
  v,
  formatter,
}) {
  function Bottom({ v }) {
    return (
      <div className="grid grid-cols-2 text-xs ">
        <div className="pl-4">
          <p>顧客No.: {v.customerNumber}</p>
          <p>TEL: {v.tel}</p>
        </div>
        <div>
          <p>備考: {v.memo}</p>
        </div>
      </div>
    )
  }

  const Company = () => (
    <div className="text-right text-xs px-4">
      <p>
        {currentDept.fullName}&nbsp;&nbsp;
        {currentDept.person}
      </p>
      <p>
        {currentDept.zip}
        {currentDept.address1}
        <span>{currentDept.address2}</span>
      </p>
      <p>
        TEL: {currentDept.tel}&nbsp;&nbsp;&nbsp;FAX: {currentDept.fax}
      </p>
    </div>
  )

  const Address = ({ v, title }) => {
    let address
    if (v.address1) {
      address = v.address1.includes("ゆりのき")
        ? v.address1.replace("ゆりのき", "ゆりのき台")
        : v.address1
    }

    if (v.address2) {
      address += v.address2
    }

    if (v.area) {
      if (v.area2) {
        // v.area += v.area2
      }
      // address += "[" + v.area + "]"
    }

    if (v.route) {
      address += "[" + v.route + "]"
    }

    if (title === "領収書 (控)") {
      return (
        <>
          <p>{v.collector}</p>
          <p>{address}</p>
        </>
      )
    } else {
      return <p className="mt-4">{address}</p>
    }
  }

  const List = ({ title, v }) => (
    <li
      className="col-span-1 bg-white  border border-dotted py-12 text-sm font-medium"
      style={{ height: 396.5 }}
    >
      <div className="grid grid-cols-3 py-4 px-4">
        <div className="">
          <span className="border-b border-dotted">No. {v._id.substr(18)}</span>
        </div>
        <div className="-mt-4 font-bold text-center text-3xl">{title}</div>
        <div className="text-right">
          {checked ? (
            <span className="text-xs">
              年<span className="mx-8">月</span>
              <span>日</span>
            </span>
          ) : (
            format(new Date(), "yyyy/MM/dd")
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 pb-2 pt-4 px-4">
        <div className=" text-xl ">{v.name} 様</div>
        <div className="text-right text-xs -mt-2">
          <Address title={title} v={v} />
        </div>
      </div>
      <div className="grid grid-cols-1">
        <div className="text-center price-box text-3xl font-bold tracking-tight">
          <Price
            point={v.point}
            price={
              v.merged
                ? v.merged.price
                : parseInt(currentProduct.price) * parseInt(v.qty)
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-1">
        <div className="text-center py-2 px-24 text-xs">
          但&nbsp;&nbsp;
          {v.mutiple
            ? [...new Set(v.merged.products)].map((x, i) => {
                return (
                  <span key={x} className="mr-1">
                    {x} x {v.merged.qty[i]}、
                  </span>
                )
              })
            : `${currentProduct.name} x ${v.qty}`}
          <br />
          代として上記正に領収いたしました
          {v.point != 0 && <p>({v.point}ポイント適用済み)</p>}
        </div>
      </div>
      <div className="grid grid-cols-1 pt-8">
        {title === "領収書 (控)" ? <Bottom v={v} /> : <Company />}
      </div>
    </li>
  )

  const Price = ({ point, price }) => {
    if (point) {
      price = price - parseInt(point)
    }
    return <h2 className="price">{formatter.format(price)} −</h2>
  }

  return (
    <>
      <List v={v} title="領収書" />
      <List v={v} title="領収書 (控)" />
    </>
  )
}
