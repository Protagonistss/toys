type TrimStrRight<Str extends string> = Str extends `${infer Rest}${' ' | '\n' | '\r' | '\t'}` ? TrimStrRight<Rest> : Str
type TrimStrLeft<Str extends string> = Str extends `${' ' | '\n' | '\r' | '\t'}${infer Rest}` ? TrimStrLeft<Rest> : Str


// type TrimRightResult = TrimStrRight<'test      '>
// type TrimStrLeftResult = TrimStrLeft<'   test'>

type GetParamters<Func extends Function> = Func extends (...args: infer Args) => unknown ? Args : never

// type ParametersResult = GetParamters<(name: string, age: number) => string>

type GetReturnType<Func extends Function> = Func extends (...args: any[]) => infer ReturnType ? ReturnType : never

// type ReturnTypeResult = GetReturnType<() => { name: string }>