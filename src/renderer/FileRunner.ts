import child_process from "child_process"

export default class FileRunner {
    static run(path: string){
        let modifiedPath = path.split(' ').join('\\ ')
        child_process.exec(`xdg-open ${modifiedPath}`)
    }
}