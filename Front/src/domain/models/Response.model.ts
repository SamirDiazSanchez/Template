export type ResponseApi<T> = {
  result: T[],
  rows?: number
}

export type ResponseApiSave = {
  Code: number,
  Message: string,
  Id: string
}