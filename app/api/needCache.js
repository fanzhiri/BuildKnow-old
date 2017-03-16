/**
 * Created by slako on 17/3/16.
 */
//由年月日份决定是否从缓存取
export function cacheByYearAndMonthAndDay(year, month, day) {
    let date = new Date();
    //当前月日份的数据可能还会增加, 所以不能从缓存中取
    if (date.getFullYear() === year && date.getMonth() === month && date.getDay() === day) {
        return false;
    } else {
        return true;
    }
}

function cachemins(inData,t) {
    let date = new Date();
    let inDataTime=inData.getTime();
    let tempinDataTime=inDataTime+(t*60*1000);
    let tempDataTime=data.getTime();

    if (tempDataTime > tempinDataTime) {
        return false;
    } else {
        return true;
    }
}

export function cache5mins(inData) {
    return cachemins(inData,5);
}

export function cache10mins(inData) {
    return cachemins(inData,10);
}