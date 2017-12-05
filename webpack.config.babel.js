import path from 'path';
import fs from 'fs';
import nodeExternals from 'webpack-node-externals';

const client = {
  entry: {
    js: './src/app-client.js',
  },
	node: {
		fs: 'empty',
	},
  output: {
    path: path.join(__dirname, 'src', 'static', 'js'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: path.join(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: 'cacheDirectory=.babel_cache',
        },
      },
    ],
  },
};

const server = {
  target: 'node',
  node: {
    __dirname: false,
  },
  externals: [nodeExternals({
    modulesFromFile: true,
  })],
  entry: {
    js: './src/server.js',
  },
  output: {
    path: path.join(__dirname, 'src'),
    filename: 'server-es5.js',
    libraryTarget: 'commonjs2',
  },
	devServer: {
		https: {
			key: fs.readFileSync("/etc/ssl/private/frontend.key"),
			cert: fs.readFileSync("/etc/ssl/certs/frontend.crt"),
		},
	},
  module: {
    rules: [
      {
        test: path.join(__dirname, 'src'),
        use: {
          loader: 'babel-loader',
          options: 'cacheDirectory=.babel_cache',
        },
      },
    ],
  },
};

export default [client, server];
