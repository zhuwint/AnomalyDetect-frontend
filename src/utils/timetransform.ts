// 解析时间戳,返回时间 hh:mm
export function parseTime(timestamp: number) {
    const date = new Date(timestamp);
    const h = date.getHours();
    const m = date.getMinutes();
    return h + ":" + m;
}

// 解析时间戳,精确到second hh:mm:ss
export function parseTimeSecond(timestamp: number) {
    const date = new Date(timestamp);
    const h = date.getHours();
    const m = date.getMinutes();
    const s = date.getSeconds();
    return h + ":" + m + ":" + s;
}

// 解析时间戳，精确到小时
export function parseTimeHour(timestamp: number) {
    const date = new Date(timestamp);
    const month = date.getMonth();
    const day = date.getDay();
    const hour = date.getHours();
    return month + "月" + day + "天" + hour + "小时";
}

// 解析时间戳，精确到天
export function parseTimeDay(timestamp: number) {
    const day = Math.ceil(timestamp / 86400);
    return day + "天";

}

// 将utc时间字符串转化为datetime格式YYYY-MM-DD HH:MM:SS
export function parseDate(utcString: string | number) {
    let parse_date = new Date(utcString);
    // 设置时区偏移量
    parse_date.setMinutes(parse_date.getMinutes() - parse_date.getTimezoneOffset());
    return parse_date.toJSON().substr(0, 19).replace("T", " ");
}

// 将utc时间字符串转化为datetime格式YYYY-MM-DDTHH:MM:SSZ
export function parseDateUtc(utcString: string) {
    let parse_date = new Date(utcString);
    // 设置时区偏移量
    parse_date.setMinutes(parse_date.getMinutes() - parse_date.getTimezoneOffset());
    return parse_date.toJSON().substr(0, 19) + "Z";
}