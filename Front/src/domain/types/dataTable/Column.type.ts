export type Column = {
  name: string,
  value?: string,
  selector?: (row: any) => any,
  width?: number,
  sx?: any
}