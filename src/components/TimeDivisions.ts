import {timeToMinutes} from "../utilities/helpers";

export type TimeCoordinates = {
    [key: number]: number
}

export interface ITimeDivisionsService {
    getTimeDivisionMeasures(): {coordinates: TimeCoordinates, pixelsInMinute: number};
}

class TimeDivisions implements ITimeDivisionsService {
    protected totalHoursInMinutes: number;

    constructor() {
        const totalHours = 12;
        const minutesInHour = 60;
        this.totalHoursInMinutes = totalHours * minutesInHour;
    }

    protected getTimeDivisionsCoordinates(timeDivisions: Array<HTMLElement>, topOffset: number): TimeCoordinates {
        const timeDivisionsCoordinates: TimeCoordinates = {};
        for (const time of timeDivisions) {
            timeDivisionsCoordinates[timeToMinutes(time.id)] = Math.round(time.getBoundingClientRect().top - topOffset);
        }
        return timeDivisionsCoordinates;
    }

    protected pixelsInMinute(timeDivisionsCoordinates: TimeCoordinates): number {
        const values = Object.values(timeDivisionsCoordinates);
        return Math.round(((values[values.length-1] - values[0]) / this.totalHoursInMinutes ) * 10) / 10;
    }

    public getTimeDivisionMeasures(): {coordinates: TimeCoordinates, pixelsInMinute: number} {
        const timeDivisions: Array<HTMLElement> = Array.from(document.querySelectorAll<HTMLElement>('.time-division'));
        const container: DOMRect = document.querySelector('.container').getBoundingClientRect();

        const timeDivisionsCoordinates = this.getTimeDivisionsCoordinates(timeDivisions, container.top);
        const pixelsInMinute = this.pixelsInMinute(timeDivisionsCoordinates);
        return {coordinates: timeDivisionsCoordinates, pixelsInMinute};
    }

}

export default TimeDivisions;
