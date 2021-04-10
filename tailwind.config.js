module.exports = {
  // mode: "jit",
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
        /^bg-/,
        /^text-/,
        /^from-/,
        /^via-/,
        /^to-/,
        /^hover:-/,
        /^border-/,
        /^border-/,
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
    require("@tailwindcss/forms")
  ],
}
