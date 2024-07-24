/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["da"],
    defaultLocale: "da",
  },
  env:{
    'MYSQL_HOST':'10.130.8.249',
    'MYSQL_PORT':'3306',
    'MYSQL_DATABASE':'test',
    'MYSQL_USER':'aakennes',
    'MYSQL_PASSWORD':'Krsq363570'
  },
};

module.exports = nextConfig;
