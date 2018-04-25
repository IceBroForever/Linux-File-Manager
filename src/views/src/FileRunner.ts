import child_process from "child_process"

export default class FileRunner {
    static run(path: string){
        child_process.exec(`xdg-open ${path}`)
    }
}