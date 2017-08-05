
function CmdCLI()


function getOption(flags, args) {
    const _flags = flags.split(/,\s?/g)
    const hasValue = /\s<(\w+)>$/g.test(_flags[_flags.length - 1])
    _flags[_flags.length - 1] = _flags[_flags.length - 1].split(/\s/)[0]
    let index = -1
    let length = args.length
    while ((length--) > 0 && index === -1) if (~_flags.indexOf(args[length])) index = length
    if (~index) {
        if (!hasValue) {
            args.splice(index, 1)
            return true
        }
        return args.splice(index, 2)[1]
    }
    if (!hasValue) return false
}