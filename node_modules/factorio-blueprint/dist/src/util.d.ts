/**
 * Created by anth on 21.05.2017.
 */
declare const toExport: {
    /**
     * Parse blueprint string in .15 format
     * @param str blueprint string to parse
     * @returns {Object} Factorio blueprint object
     */
    decode: {
        0: (str: string) => any;
        latest: (str: string) => any;
    };
    /**
     * Encode an arbitrary object
     * @param obj
     * @returns {string} object encoded in Factorio .15 format
     */
    encode: {
        0: (obj: any) => string;
        latest: (obj: any) => string;
    };
};
export default toExport;
