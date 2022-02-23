export default class TimeHelper {
    currentTimeUTC(){
        return new Date().toISOString();
    }
    convertToString(d: Date){
        return d.toISOString();
    }
}