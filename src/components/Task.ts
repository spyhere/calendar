import { TimeCoordinates } from "./TimeDivisions";
import { Coordinates } from "./TasksContainer";
import {parseTime, timeToMinutes} from "../utilities/helpers";

export interface IInput {
    title: string,
    location: string,
    time: Array<string>|string
}

export interface ITask {
    getTitle: string;
    getDOMElement: HTMLElement;
    getCoordinates(): Coordinates;
    calculateCoordinates(timeMarkersCoordinates: TimeCoordinates, pixelForMinute: number): ITask;
    makeHeight(): void;
    setNewYOffset(y: number): void;
}

class Task implements ITask {
    protected title: string;
    protected location: string;
    protected time: Array<string>|string;
    protected element: HTMLElement;
    protected coordinates: Coordinates;


    constructor(input: IInput, index: number) {
        this.title = input.title;
        this.location = input.location;
        this.time = input.time;
        this.createTask(index)
    }

    protected get timeInMinutes(): Coordinates {
        const finalTime = [];
        for (const time of this.time) {
            finalTime.push(timeToMinutes(time));
        }
        return {top: finalTime[0], bottom: finalTime[1]};
    }

    protected parseTime(time: Array<string>|string) {
        if (Array.isArray(time)) {
            return parseTime(time[0], true) + '-';
        } else {
            return 'All day - ';
        }
    }

    protected createTask(index: number) {
        const newTask = this.createDOMElement('task')
        const parsedTime = this.parseTime(this.time);
        const time = this.createDOMElement('time', 'span', parsedTime);
        const title = this.createDOMElement('title', 'span', this.title);
        const location = this.createDOMElement('location', 'span', this.location);
        const newDescription = this.createDOMElement('description');

        newDescription.append(...[time, title, location]);
        newTask.appendChild(newDescription);
        if (Array.isArray(this.time)) {
            newTask.setAttribute('id', String(index))
        }

        this.element = newTask;
    }

    protected createDOMElement(className: string, tagName: string = 'div', content?: string) {
        const newElement = document.createElement(tagName);
        newElement.setAttribute('class', className);
        if (content) {
            newElement.innerHTML = content;
        }
        return newElement;
    }

    public get getTitle() {
        return this.title;
    }

    public getCoordinates() {
        return this.coordinates;
    }

    public get getDOMElement() {
        return this.element;
    }

    public calculateCoordinates(timeDivisionsCoordinates: TimeCoordinates, pixelsForMinute: number ) {
        const taskTime = this.timeInMinutes;
        const coordinates: Coordinates = {top: null, bottom: null};
        // Calculation. Using this type of calculation to make coordinates more precise
        for (const timePosition in taskTime) {
            Object.keys(timeDivisionsCoordinates).map((displayedTime, index, timeDivisions) => {
                if (coordinates[timePosition]) return;

                if (taskTime[timePosition] === Number(displayedTime)) {
                    coordinates[timePosition] = Math.round(timeDivisionsCoordinates[Number(displayedTime)]);
                } else if (taskTime[timePosition] < Number(timeDivisions[index + 1])) {
                    const difference = Number(timeDivisions[index + 1]) - taskTime[timePosition];
                    coordinates[timePosition] = Math.round(timeDivisionsCoordinates[Number(timeDivisions[index+1])] - (difference * pixelsForMinute));
                }
            })
        }

        this.coordinates = coordinates;
        return this;
    }

    public makeHeight() {
        this.element.style.height = this.coordinates.bottom - this.coordinates.top + 'px';
    }

    public setNewYOffset(y: number) {
        this.element.style.top = y + 'px';
    }

}

export default Task;
