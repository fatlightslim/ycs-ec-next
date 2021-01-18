// import { useState } from "react";
// import Dropzone from "react-dropzone";
// // import { updateData } from "./config/func";
// import csv from "csv";
// import encoding from "encoding-japanese";

// function str2Array(str) {
//   var array = [],
//     i,
//     il = str.length;
//   for (i = 0; i < il; i++) array.push(str.charCodeAt(i));
//   return array;
// }

// const items = (v) => {
//   return {
//     address1: v[79],
//     address2: v[152],
//     name: v[151],
//     collector: v[133],
//   };
// };
// const stores = [
//   {
//     value: "takatsu",
//     label: "高津",
//     id: "z5V0rmIb8HEgCHGtsS61",
//     items: (v) => items(v),
//     itemsEx: (v) => {
//       return {
//         tel: v[82],
//         area: v[13],
//         customerNumber: v[150],
//       };
//     },
//   },
//   {
//     value: "toganeChuo",
//     label: "東金中央",
//     id: "SbWloIXEHZOCt7JtedI1",
//     items: (v) => items(v),
//     itemsEx: (v) => {
//       return {
//         tel: v[82],
//         area: v[13],
//         area2: v[14],
//         customerNumber: v[150],
//         route: v[147],
//       };
//     },
//   },
//   {
//     value: "toganeTobu",
//     label: "東金東部",
//     id: "fwwbw6x7KyE76Aj9yLxd",
//     items: (v) => items(v),
//     itemsEx: (v) => {
//       return {
//         tel: v[82],
//         area: v[13],
//         area2: v[14],
//         customerNumber: v[150],
//         route: v[147],
//       };
//     },
//   },
// ];

// export default function FileUpload({ currentDept }) {
//   const [open, setOpen] = useState(false);
//   const [dept, setDept] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (event) => {
//     setDept(event.target.value);
//   };

//   function convertData(data) {
//     const array = [];
//     const selectedDept = stores.filter((v) => v.id === dept)[0];

//     data.forEach((v, i) => {
//       let item = selectedDept.items(v);

//       Object.keys(item).forEach((v) => {
//         if (item[v]) {
//           var str = encoding.convert(str2Array(item[v]), "unicode", "sjis");
//           item[v] = encoding.codeToString(str);
//         }
//       });

//       // array.push(Object.assign({}, item, selectedDept.itemsEx(v)))
//       array.push({ ...item, ...selectedDept.itemsEx(v) });
//     });
//     // console.log(array);
//     const json = JSON.stringify(array);
//     return Promise.resolve(json);
//   }

//   return (
//     <>
//       <Dropzone
//         onDrop={(acceptedFiles) => {
//           acceptedFiles.forEach((file) => {
//             const reader = new FileReader();

//             reader.onabort = () => console.log("file reading was aborted");
//             reader.onerror = () => console.log("file reading has failed");
//             reader.onload = () => {
//               setLoading(true);
//               // setDept(oldDept)
//               csv.parse(reader.result, async (err, data) => {
//                 const json = await convertData(data);
//                 console.log(json);
//                 // updateData(json, dept).then((res) => {
//                 //   setOpen(false);
//                 //   setLoading(false);
//                 //   alert("更新が完了しました");
//                 // });
//               });
//             };
//             reader.readAsBinaryString(file);
//           });
//         }}
//       >
//         {({ getRootProps, getInputProps }) => (
//           <section>
//             <div {...getRootProps()}>
//               <input {...getInputProps()} />
//               <p className="drop">
//                 CSVファイルをここにドラッグ&amp;ドロップしてください ,
//                 選択も可能です
//               </p>
//             </div>

//             <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
//               <label
//                 htmlFor="cover_photo"
//                 className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
//               >
//                 Cover photo
//               </label>
//               <div className="mt-2 sm:mt-0 sm:col-span-2">
//                 <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
//                   <div className="space-y-1 text-center">
//                     <svg
//                       className="mx-auto h-12 w-12 text-gray-400"
//                       stroke="currentColor"
//                       fill="none"
//                       viewBox="0 0 48 48"
//                       aria-hidden="true"
//                     >
//                       <path
//                         d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
//                         strokeWidth="{2}"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       />
//                     </svg>
//                     <div className="flex text-sm text-gray-600">
//                       <label
//                         htmlFor="file-upload"
//                         className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
//                       >
//                         <span>Upload a file</span>
//                         <input
//                           id="file-upload"
//                           name="file-upload"
//                           type="file"
//                           className="sr-only"
//                         />
//                       </label>
//                       <p className="pl-1">or drag and drop</p>
//                     </div>
//                     <p className="text-xs text-gray-500">
//                       PNG, JPG, GIF up to 10MB
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         )}
//       </Dropzone>
//     </>
//   );
// }
