import {ITask} from "./Task";
import {warnOfTasksCount} from "../utilities/helpers";

export type Coordinates = {
    [top: string]: number,
    bottom: number
}

export interface ITasksContainer {
    isPointInside(coordinates: Coordinates): boolean;
    attachTask(task: ITask): void;
    getDOMElement: HTMLElement;
}

class TasksContainer implements ITasksContainer{
    protected tasks: Array<ITask>;
    protected coordinates: Coordinates; // boundaries
    protected element: HTMLElement;
    protected maxTasks: number;

    constructor(coordinates: Coordinates) {
        this.coordinates = coordinates;
        this.tasks = [];
        this.maxTasks = 4;
        this.createDOMElement(coordinates);
    }

    protected createDOMElement(coordinates: Coordinates) {
        const newContainer = document.createElement('div');
        newContainer.setAttribute('class', 'taskContainer');
        newContainer.style.top = coordinates.top + 'px';
        newContainer.style.height = coordinates.bottom - coordinates.top + 'px';
        this.element = newContainer;
    }

    public get getDOMElement() {
        return this.element;
    }

    public isPointInside(coordinates: Coordinates) {
        const { top, bottom } = this.coordinates;
        return (coordinates.top >= top) && (coordinates.top <= bottom);
    }

    public attachTask(task: ITask) {
        if (this.tasks.length >= this.maxTasks) {
            return warnOfTasksCount(this.maxTasks, task.getTitle);
        }
        if (!this.tasks.length) {
            task.setNewYOffset(0)
        } else {
            task.setNewYOffset(task.getCoordinates().top - this.coordinates.top)
        }
        this.element.appendChild(task.getDOMElement);
        this.tasks.push(task);
    }

}

export default TasksContainer;
