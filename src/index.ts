import "./style.scss";
import TimeDivisions from "./components/TimeDivisions";
import TasksFactory from "./components/TasksFactory";
import OverlapService from "./components/OverlapService";

window.onload = () => {
    const { coordinates, pixelsInMinute } = new TimeDivisions().getTimeDivisionMeasures();
    TasksFactory.createTasks(data, coordinates, pixelsInMinute);
    OverlapService.fixTaskOverlapping();
}
