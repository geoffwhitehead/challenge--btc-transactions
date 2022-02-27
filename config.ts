interface Config {
  mongoUri: string;
}

export const config: Config = {
  mongoUri: 'mongodb://mongodb:27017/dev',
};
