// 将对象属性置为空
export const getEmpty = (obj: any) => {
  const objArr: string[] = Object.keys(obj);
  objArr.forEach((objKey: string) => {
    obj[objKey] = " ";
  });
  return obj;
};
