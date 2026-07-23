
function isStringInvalid(str:string | null | undefined):boolean {
  return (!str || /^\s*$/.test(str));
}

function isValidDate(dateString: string): boolean {
  if (!dateString || dateString.length !== 10) return false;
  const [day, month, year] = dateString.split('/');
  if (!day || !month || !year) return false;
  const d = parseInt(day, 10);
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  if (isNaN(d) || isNaN(m) || isNaN(y)) return false;
  const dateObj = new Date(y, m - 1, d);
  return dateObj.getFullYear() === y && dateObj.getMonth() === m - 1 && dateObj.getDate() === d;
}

export{
  isStringInvalid,
  isValidDate
}
