
function isStringInvalid(str:string | null | undefined):boolean {
  return (!str || /^\s*$/.test(str));
}

export{
  isStringInvalid,
}
