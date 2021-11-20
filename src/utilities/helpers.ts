
export function parseTime(time: string, meridiem?: boolean): string {
    const splittedTime = time.split(':');
    let meridiemSign = 'AM';

    if (Number(splittedTime[0]) > 12) {
        splittedTime[0] = String(Number(splittedTime[0]) - 12);
        meridiemSign = 'PM';
    }
    return splittedTime.join(':') + (meridiem ? meridiemSign: '');
}

export function timeToMinutes(time: string): number {
    const splittedTime = time.split(':');
    return Number(splittedTime[0]) * 60 + Number(splittedTime[1]);
}

export function warnOfTasksCount(maximumCount: number, taskTitle: string): void {
    console.warn(`Too many tasks for the same period of time. Should be less or equal than ${maximumCount}. The task: "${taskTitle}" is being ignored`)
}
