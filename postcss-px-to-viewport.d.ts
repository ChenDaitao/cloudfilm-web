/*
 * @Date: 2023-01-30 11:57:59
 * @LastEditTime: 2023-02-10 17:27:55
 * @Description:外部声明 postcss-px-to-viewport
 */
declare module "postcss-px-to-viewport" {
  type Options = {
    unitToConvert: "px" | "rem" | "cm" | "em";
    viewportWidth: number;
    viewportHeight: number; // not now used; TODO: need for different units and math for different properties
    unitPrecision: number;
    viewportUnit: string;
    fontViewportUnit: string; // vmin is more suitable.
    selectorBlackList: string[];
    propList: string[];
    minPixelValue: number;
    mediaQuery: boolean;
    replace: boolean;
    landscape: boolean;
    landscapeUnit: string;
    landscapeWidth: number;
    exclude: Array;
  };

  export default (options: Partial<Options>) => any;
}
