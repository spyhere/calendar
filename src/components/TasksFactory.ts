import {timeToMinutes, warnOfTasksCount} from "../utilities/helpers";
import Task, {IInput, ITask} from "./Task";
import {TimeCoordinates} from "./TimeDivisions";
import TasksContainer, {ITasksContainer} from "./TasksContainer";

class TasksFactory {
    private static maxAllDayTasks = 4;

    private static createTaskContainer(task: ITask, containers: Array<ITasksContainer>) {
        const availableContainer = containers.filter((container: ITasksContainer) => {
            return container.isPointInside(task.getCoordinates());
        })
        if (availableContainer[0]) {
            availableContainer[0].attachTask(task);
        } else {
            const newContainer = new TasksContainer(task.getCoordinates());
            newContainer.attachTask(task);
            containers.push(newContainer);
        }
    }

    private static renderToTarget(target: string, elements: Array<ITasksContainer>|Array<ITask>) {
        document.querySelector(target).append(...elements.map(element => element.getDOMElement))
    }

    public static createTasks(data: Array<IInput>, coordinates: TimeCoordinates, pixelsInMinute: number) {
        const containers: Array<ITasksContainer> = [];
        const allDayTasks: Array<ITask> = [];
        // Sort by start time of the task
        const sortedData = data.sort((input1, input2) => timeToMinutes(input1.time[0]) - timeToMinutes(input2.time[0]))

        sortedData.forEach((input: IInput, index: number) => {
            const task = new Task(input, index);
            if (Array.isArray(input.time)) {
                task.calculateCoordinates(coordinates, pixelsInMinute).makeHeight();
                this.createTaskContainer(task, containers);
            } else if (!Array.isArray(input.time) && allDayTasks.length < 4) {
                allDayTasks.push(task);
            } else {
                warnOfTasksCount(this.maxAllDayTasks, task.getTitle);
            }
        })

        this.renderToTarget('.tasksDivision', containers);
        this.renderToTarget('.all-day', allDayTasks);
    }

}

export default TasksFactory;
