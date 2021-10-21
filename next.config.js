/** @type {import('next').NextConfig} */
module.exports = {
    reactStrictMode: true,
    async redirects() {
        return [
            {
                source: "/",
                destination: "/wizard/eventselect",
                permanent: true,
            },
            {
                source: "/wizard",
                destination: "/wizard/eventselect",
                permanent: true,
            },
        ];
    },
};
