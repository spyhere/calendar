
class OverlapService {
    private static minWidth = 100;

    private static getDOMElements(): Array<Array<HTMLElement>> {
        const tasks = Array.from(document.querySelectorAll<HTMLElement>('.task')).filter((task: HTMLElement) => task.id);
        const tasksContainers = Array.from(document.querySelectorAll<HTMLElement>('.taskContainer'));
        return [tasks, tasksContainers];
    }

    private static fixOverlap(topTask: HTMLElement, bottomTask: HTMLElement) {
        const topTaskCoordinates = topTask.getBoundingClientRect();
        const bottomTaskCoordinates = bottomTask.getBoundingClientRect();

        if (this.isOverlapping(topTaskCoordinates, bottomTaskCoordinates)) {
            if (topTaskCoordinates.left - bottomTaskCoordinates.left < this.minWidth) {
                topTask.style.height = bottomTaskCoordinates.top - topTaskCoordinates.top - 2 + 'px';
            } else {
                bottomTask.style.flexShrink = '0';
                bottomTask.style.width = topTaskCoordinates.left - bottomTaskCoordinates.left - 10 + 'px';
            }
        }
    }

    private static isOverlapping(a: DOMRect , b: DOMRect): boolean {
        return !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom)
    }

    public static fixTaskOverlapping() {
        const [tasks, tasksContainers] = this.getDOMElements();

        for (const container of tasksContainers) {
            for (const topTask of Array.from(container.children)) {

                for (const bottomTask of tasks) {

                    if (Number(topTask.id) < Number(bottomTask.id)) {
                        this.fixOverlap(topTask as HTMLElement, bottomTask);
                    }
                }
            }
        }
    }

}

export default OverlapService;
