import NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
export const entry: string;
export const mode: string;
export namespace output {
    const filename: string;
    const library: string;
    const libraryTarget: string;
    const globalObject: string;
    const libraryExport: string;
}
export namespace resolve {
    const extensions: string[];
}
export namespace module {
    const rules: ({
        test: RegExp;
        exclude: RegExp;
        use: {
            loader: string;
            options: {
                presets: string[];
            };
        };
    } | {
        test: RegExp;
        use: {
            loader: string;
            options: {
                transpileOnly: boolean;
            };
        }[];
        exclude: RegExp;
    })[];
}
export const plugins: NodePolyfillPlugin[];
