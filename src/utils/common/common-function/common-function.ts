export const isNotEmpty = (val: any) => {
  if (val != undefined && val != "" && val != null) return true;
  return false;
};