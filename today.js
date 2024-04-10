const realFuckingDate = {
    dayString : [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday"
    ],
    dayNumberSuffix:[
        "st",
        "nd",
        "rd",
        "th"
    ],
    monthString:[
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ],
    getMonth(monthNumber){
        return this.monthString[monthNumber]
    },
    getDayNumberWithSuffix(dayNumber){
        if (dayNumber<4){ return dayNumber + this.dayNumberSuffix[dayNumber-1]}
        return dayNumber + this.dayNumberSuffix[3]
    },
    getDayString(day){
        return this.dayString[day-1]
    }
}

const now = new Date();
const day = realFuckingDate.getDayString(now.getDay());
const dayNumber = realFuckingDate.getDayNumberWithSuffix(now.getDate());
const month =realFuckingDate.getMonth(now.getMonth());
const hours = now.getHours();
const minutes = now.getMinutes();
console.log(now,`  Today is ${day} the ${dayNumber} of ${month} the and the time is ${hours}:${minutes}.`);