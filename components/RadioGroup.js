import { useState } from "react";

export default function RadioGroup({ depts }) {
  const [checked, setChecked] = useState(0);
  return (
    <fieldset>
      <h3>部門</h3>
      <ul
        className="space-y-4"
        role="radiogroup"
        aria-labelledby="radiogroup-label"
      >
        {depts.map((v) => (
          <Radio key={v._id} {...v} checked={checked} setChecked={setChecked} />
        ))}
      </ul>
    </fieldset>
  );
}

function Radio({_id, name, checked, setChecked}) {
  return (
    <li
      onClick={() => setChecked(_id)}
      id="radiogroup-option-0"
      tabIndex="{0}"
      role="radio"
      className="group relative bg-white rounded-lg shadow-sm cursor-pointer focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-indigo-500 grid grid-cols-1 md:grid-cols-6"
    >
      <div className="rounded-lg border border-gray-300 bg-white px-6 py-4 hover:border-gray-400 sm:flex sm:justify-between">
        <div className="flex items-center">
          <div className="text-sm">
            <p className="font-medium text-gray-900">{name}</p>
          </div>
        </div>
      </div>
      {/* On: "border-indigo-500", Off: "border-transparent" */}
      <div
        className={`${
          checked === _id ? "border-indigo-500" : "border-transparent"
        } absolute inset-0 rounded-lg border-2 pointer-events-none`}
        aria-hidden="true"
      />
    </li>
  );
}
