/** @type {import('tailwindcss').Config} */

export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.{vue,js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require("tailwindcss"),
        require("autoprefixer"),
        require("postcss-nested"),
        require("@tailwindcss/forms"),
    ],
}

