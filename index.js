module.exports = new Program()

function includes(str, other) {
    return !!~str.indexOf(other)
}

function Program() {
    this._options = []
    this._commands = {}
}

Program.prototype._executor = void 0
Program.prototype._requiresCommand = false
Program.prototype._includesCommand = false
Program.prototype._includesOptions = true
Program.prototype._includesArguments = true
Program.prototype._requiresArguments = false
Program.prototype._argumentsIsRest = false
Program.prototype._usage = ''
Program.prototype.usage = function usage(usage) {
    this._usage = usage
    const parts = usage.split(/\s+/g)
    const cmd = parts.filter(part => includes(part, 'cmd'))[0]
    if (cmd) {
        this._includesCommand = true
        this._requiresCommand = includes(cmd, '<')
    }
    const opts = parts.filter(part => includes(part, 'options'))[0]
    if (!opts)
        this._includesOptions = false
    const args = parts.filter(part => includes(part, 'args'))[0]
    if (args) {
        this._requiresArguments = includes(args, '<')
        this._argumentsIsRest = includes(args, '...')
    } else this._includesArguments = false
    return this
}

Program.prototype._help = ''
Program.prototype._customHelpFlags = false
Program.prototype.help = function help(customFlags, message) {
    if (customFlags) {
        this._customHelpFlags = true
        this._options.push(customFlags)
    }
    if (message) {
        this._help = message
    }
    return this
}

Program.prototype._version = ''
Program.prototype._customVersionFlags = false
Program.prototype.version = function version(version, customFlags) {
    if (customFlags) {
        this._customVersionFlags = true
        this._options.push(customFlags)
    }
    if (version) {
        this._version = version
    }
    return this
}

Program.prototype.option = function option(name, flags, description, validation) {
    const options = this._commands.length !== 0 ? this._commands[this._commands.length - 1] : this._options
    options[name] = {
        flags,
        description,
        validation
    }
    return this
}

Program.prototype.execute = ''
Program.prototype.command = ''
Program.prototype.from = ''

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
