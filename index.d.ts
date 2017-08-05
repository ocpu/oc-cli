interface Program {
    /**
     * @param usage [...] = optional, <...> = required, ... = cmd | options | name
     */
    usage(usage: string): Program

    option(name: string, flags: string, description?: string, validation?: RegExp): Program
    execute(executor: (options: {[name: string]: boolean | any}, arguments: string[])): Program

    /**
     * All later calls to option and execute is added to the command
     */
    command(name: string, aliases?: string[]): Program

}