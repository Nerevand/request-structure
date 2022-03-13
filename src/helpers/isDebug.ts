import { EnabledDebuggingModules } from '../invariants'

export default (module: any) => !!EnabledDebuggingModules[module]
