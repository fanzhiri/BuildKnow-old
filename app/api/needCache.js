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