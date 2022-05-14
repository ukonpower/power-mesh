module.exports = {
	watch: true,
	watchOptions: {
		aggregateTimeout: 100,
		poll: 500
	},
    mode: 'development',
    entry: {
    },
    output: {
    },
    module: {
        rules: [{
                test: /\.ts$/,
                exclude: /node_modules/,
                use: 'ts-loader'
            },
            {
				test: /\.(vs|fs|glsl)$/,
				exclude: /node_modules/,
				use: [
					'raw-loader',
					{
						loader: 'glslify-loader',
						options: {
							transform: [
								['glslify-hex'],
								['glslify-import']
							],
							basedir: './src/examples/glsl-chunks'
						}
					}
				]
			}
        ]
    },
    resolve: {
        extensions: [".ts", ".js", '.d.ts']
	},
	cache: {
		type: 'filesystem',
		buildDependencies: {
			config: [__filename]
		}
	},
	optimization: {
		innerGraph: true
	}
};