export const concatObject = (
  prev,
  property,
  element
) => {
      let obj = {};
      obj[`${property}`] = element;
      return Object.assign({}, prev, obj);
};