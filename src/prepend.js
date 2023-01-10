var Module = {
    stdout: '/dev/stdout',
    stderr: '/dev/stderr',
    print: stdout => STDOUT.push(stdout),
    printErr: stderr => STDERR.push(stderr),
    noInitialRun: true
}