/**
 * @function executor
 * @param {Object} options
 * @param {srting[]} args
 * @return {void}
 */

module.exports = new Program()

function includes(str, other) {
    return !!~str.indexOf(other)
}

/**
 * @constructor
 */
function Program() {
    /**
     * @private
     */
    this._options = []
    /**
     * @private
     */
    this._commands = {}
}

/**
 * @private
 */
Program.prototype._executor = void 0
/**
 * @private
 */
Program.prototype._requiresCommand = false
/**
 * @private
 */
Program.prototype._includesCommand = false
/**
 * @private
 */
Program.prototype._includesOptions = true
/**
 * @private
 */
Program.prototype._includesArguments = true
/**
 * @private
 */
Program.prototype._requiresArguments = false
/**
 * @private
 */
Program.prototype._argumentsIsRest = false
/**
 * @private
 */
Program.prototype._usage = ''
/**
 * Setup how to use your cli.
 * SET NAME OF CLI FIRST.
 * 
 * [] = optional, <> = required
 * cmd | options | args (include '...' after to capture rest)
 * @param {string} usage How to use your cli.
 * @return {Program}
 */
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

/**
 * @private
 */
Program.prototype._version = ''
/**
 * @private
 */
Program.prototype._customVersionFlags = -1
/**
 * Set a version for your cli.
 * @param {string} version The current version.
 * @param {string=} customFlags Set a custom flag to get the version.
 * @return {Program}
 * @see Program#option
 */
Program.prototype.version = function version(version, customFlags) {
    if (customFlags) {
        this._customVersionFlags = this._options.length
        this._options.push(customFlags)
    }
    if (version) {
        this._version = version
    }
    return this
}

/**
 * @private
 */
Program.prototype._help = ''
/**
 * @private
 */
Program.prototype._customHelpFlags = -1
/**
 * Set a custom help message.
 * @param {string=} customFlags Set a custom flag to get the version.
 * @param {string=} message Set the custom help message.
 * @return {Program}
 * @see Program#option
 */
Program.prototype.help = function help(customFlags, message) {
    if (customFlags) {
        this._customHelpFlags = this._options.length
        this._options.push(customFlags)
    }
    if (message) {
        this._help = message
    }
    return this
}

/**
 * Set a option for the program or a command
 * @param {string} name Set a name for the option to be used in #execute.
 * @param {string} flags Set the flag name(s).
 * There are two ways to get values if they are there or not or has a value attached.
 * Like "-f, --force" for true or false or "-n, --name <name>" to get a value of it.
 * @param {string=} description Set a help description for the option.
 * @return {Program}
 */
Program.prototype.option = function option(name, flags, description) {
    const options = this._commands.length !== 0 ? this._commands[this._commands.length - 1].options : this._options
    options[name] = {
        flags,
        description
    }
    return this
}

/**
 * Set what to do when to the program/command is called.
 * @param {executor} executor What to do when it is executed.
 * @return {Program}
 */
Program.prototype.execute = function execute(executor) {
    const hasCommand = this._commands.length !== 0
    if (hasCommand)
        this._commands[this._commands.length - 1].executor = executor
    else this._executor = execute
    return this
}

/**
 * Make a new command.
 * 
 * All later calls to option and execute is added to the command.
 * @param {string} name The long name of the command.
 * @param {string[]=} aliases Set the aliases of this command.
 * @return {void}
 */
Program.prototype.command = function command(name, aliases) {
    this._commands.push({ name, aliases, options: {}, executor: void 0 })
    return this
}

/**
 * To end the setup, call from with the arguments (process.argv form most cases).
 * @param {string[]} args The arguments to call this program with.
 */
Program.prototype.from = function from(args) {
    const cmd = this._includesCommand ? this._findCmd(args[2]) : void 0
    if (this._requiresCommand && !cmd) {
        this._showHelp()
        return
    }

    // TODO: Continue
}

Program.prototype._showHelp = function showHelp() {
    if (!this._help) {
        console.log(this._help)
    }
    
}

/**
 * @private
 */
Program.prototype._findCmd = function _findCmd(command) {
    const potencialCmd = this._commands.filter(cmd => {
        if (cmd.name === command) 
            return true
        return command in cmd.aliases
    })[0]
    if (potencialCmd.startsWith('-')) 
        return
    if (/\W/.test(potencialCmd))
        return
    return potencialCmd
}

function getOption(flags, args) {
    const _flags = flags.split(/,\s*/g)
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
