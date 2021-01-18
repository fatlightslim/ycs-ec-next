module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    content: [
      "./components/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [
        "bg-gray-100",
        "text-gray-800",
        "text-gray-400",
        "bg-green-100",
        "text-green-800",
        "text-green-400",
        "bg-yellow-100",
        "text-yellow-800",
        "text-yellow-400",
        "bg-red-100 text-red-800",
        "text-red-400",
        "bg-indigo-600",
        "hover:bg-indigo-700",
        "lg:col-start-6",
        "lg:col-end-8",
        "lg:row-start-2",
        "lg:row-end-3",
        "lg:mx-0",
        "lg:max-w-none",
        "lg:col-start-1",
        "lg:row-start-2",
        " lg:row-end-3",
        "lg:col-end-3",
        "from-gray-900",
        "from-gray-800",
        "from-gray-700",
        "via-purple-900",
        "via-red-900",
        "via-green-900",
        "to-indigo-900",
        "to-yellow-900",
        "to-green-800",
      ],
    },
  },
  theme: {
    extend: {
      colors: {
        "accent-1": "#333",
      },
    },
  },
  // variants: {
  //   extend: {
  //     border: ["last"],
  //   },
  // },
  plugins: [
    // require("@tailwindcss/aspect-ratio")
  ],
}
