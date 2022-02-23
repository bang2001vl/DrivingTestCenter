export default class AppLogger{
    trace(msg :string) {
        console.log(msg);    
    }

    traceWithTag(tag:string, msg :string) {
        console.log(`[${tag}] : ${msg}`);    
    }

    error(msg : string){
        console.error(msg);
    }

    errorWithTag(tag:string, msg :string) {
        console.error(`[${tag}] : ${msg}`);    
    }
}