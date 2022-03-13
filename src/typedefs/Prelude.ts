export namespace Prelude {
  export type Values<T> = T[keyof T]

  export type MaybeNil<T> = T | undefined | null
}
