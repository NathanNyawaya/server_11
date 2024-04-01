export const hasDatePassed = (targetTime) => {
    const targetDate = new Date(targetTime);
    const currentDate = Date.now();
    return targetDate <= currentDate;
}

export const uptoDate = (targetTime) => {
    const targetDate = new Date(targetTime);
    const currentDate = Date.now();
    return targetDate >= currentDate;
}


export const formatGMTDateTime = (gmtDateTime) => {
    const dateObject = new Date(gmtDateTime);
    const formattedTime = dateObject.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    });
    const formattedDate = dateObject.toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
    });

    return {
        time: formattedTime,
        date: formattedDate,

    };
}



export const datePassed = (targetDateStr) => {
    const targetDate = new Date(targetDateStr);

    const currentDate =Date.now();
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth() + 1;
    const currentDay = currentDate.getUTCDate();

    const targetYear = targetDate.getUTCFullYear();
    const targetMonth = targetDate.getUTCMonth() + 1;
    const targetDay = targetDate.getUTCDate();

    if (targetYear === currentYear && targetMonth >= currentMonth && targetDay >= currentDay) {
        return true;
    } else {
        return false;
    }
}
