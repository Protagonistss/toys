type extract = Promise<number>
type GetValue<P> = P extends Promise<infer Value> ? Value : never
type GetValueDemo = GetValue<extract>

type isTwo<T> = T extends 2 ? true : false

type tuple = [1, 2, 3]
type Push<Arr extends unknown[], Ele> = [...Arr, Ele]
type PushDemo = Push<tuple, 4>

type tuple_1 = [1, 2]
type tuple_2 = ['test1', 'test2']
type Zip<Pre extends [unknown, unknown], After extends [unknown, unknown]> = Pre extends [infer PreFirst, infer PreSecond] ? After extends [infer AfterFirst, infer AfterSecond] ? [[PreFirst, AfterFirst], [PreSecond, AfterSecond]] : [] : []
type ZipDemo = Zip<tuple_1, tuple_2>

type ZipRecur<Pre extends unknown[], Aft extends unknown[]> = Pre extends [infer PreFirst, ...infer PreRest] ? Aft extends [infer AftFirst, ...infer AftRest] ? [[PreFirst, AftFirst], ...ZipRecur<PreRest, AftRest>] : [] : []
type muli_tuple_1 = [1, 2, 3]
type muli_tuple_2 = [4, 5, 6]
type ZipRecurDemo = ZipRecur<muli_tuple_1, muli_tuple_2>

type CapitalizeStr<Str extends string> = Str extends `${infer First}${infer Rest}` ? `${Uppercase<First>}${Rest}` : Str
type Str = 'test'
type StrDemo = CapitalizeStr<Str>

type DropSubStr<Str extends string, SubStr extends string> = Str extends `${infer Prefix}${SubStr}${infer Suffix}` ? DropSubStr<`${Prefix}${Suffix}`, SubStr> : Str
type DropSubStrDemo = DropSubStr<'te-st---', '-'>

type AppendArgument<Func extends Function, Arg> = Func extends (...args: infer Args) => infer ReturnType ? (...args: [...Args, Arg]) => ReturnType : never
type AppendArgumentDemo = AppendArgument<(name: string) => boolean, number>

type obj = {
  name: string
  age: number
  gender: boolean
}
type Mapping<Obj extends object> = { [Key in keyof Obj]: Obj[Key] }