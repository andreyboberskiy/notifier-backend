const isDev = process.env.APP_MODE === 'development';

const config = {
  isDev,
  mixPanel: { token: process.env.MIXPANEL_TOKEN },
  auth: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  db: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: +process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    logging: isDev,
    synchronize: true,
    name: 'default',
    entities: [__dirname + '/**/*.entity.ts', __dirname + '/**/*.entity.js'],
    migrations: [
      __dirname + '/migration/**/*.ts',
      __dirname + '/migration/**/*.js',
    ],
  },
};

export default config;
