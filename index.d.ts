declare interface Program {
    /**
     * Setup how to use your cli.
     * SET NAME OF CLI FIRST.
     * 
     * [] = optional, <> = required
     * cmd | options | args (include '...' after to capture rest)
     * @param usage How to use your cli.
     */
    usage(usage: string): Program
    /**
     * Set a version for your cli.
     * @param version The current version.
     * @param customFlags Set a custom flag to get the version.
     */
    version(version: string, customFlags?: string)
    /**
     * Set a custom help message.
     * @param customFlags Set a custom flag to get the version.
     * @param message Set the custom help message.
     */
    help(customFlags?: string, message?: string)

    /**
     * Set a option for the program or a command
     * @param name Set a name for the option to be used in #execute.
     * @param flags Set the flag name(s).
     * There are two ways to get values if they are there or not or has a value attached.
     * Like "-f, --force" for true or false or "-n, --name <name>" to get a value of it.
     * @param description Set a help description for the option.
     * @param validation Set a validation method.
     */
    option(name: string, flags: string, description?: string, validation?: RegExp | ((value: string) => void)): Program
    /**
     * Set what to do when to the program/command is called.
     * @param executor What to do when it is executed.
     */
    execute(executor: (options: {[name: string]: boolean | any}, arguments: string[]) => void): Program

    /**
     * Make a new command.
     * 
     * All later calls to option and execute is added to the command.
     * @param name The long name of the command.
     * @param aliases Set the aliases of this command.
     */
    command(name: string, aliases?: string[]): Program

    /**
     * To end the setup, call from with the arguments (process.argv form most cases).
     * @param args The arguments to call this program with.
     */
    from(args: string[]): void

}

export = Program
