interface LogData{
    message: string;
    tag?: string;
}

class AppLogger{
    trace(msg :String) {
        console.log(msg);    
    }

    traceWithTag(msg :String, tag:String) {
        console.log(`[${tag}] : ${msg}`);    
    }

    error(msg : String){
        console.error(msg);
    }

    errorWithTag(msg :String, tag:String) {
        console.error(`[${tag}] : ${msg}`);    
    }
}

let logger = new AppLogger();

export default logger;