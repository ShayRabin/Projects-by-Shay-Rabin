interface Task {
    id: number;
    title: string;
    description: string;
    contentEditable: boolean;
    addedTime: string;
    priority: PriorityTypes;
    isCompleted: boolean;
}

enum PriorityTypes {
    low,
    medium,
    high,
}

class TaskManager {

    private isCurrentlyEditing: boolean = false;
    // 3 Defult tasks
    tasks: Task[] = [
        {
            id: 1,
            title: 'Example',
            addedTime: '2023-07-31 17:30:20',
            description: 'Task description',
            contentEditable: false,
            isCompleted: false,
            priority: PriorityTypes.low,
        },
        {
            id: 2,
            title: 'Example',
            addedTime: '2023-07-31 17:30:20',
            description: 'Task description',
            contentEditable: false,
            isCompleted: false,
            priority: PriorityTypes.high,
        },
        {
            id: 3,
            title: 'Example',
            addedTime: '2023-07-31 17:30:20',
            description: 'Task description',
            contentEditable: false,
            isCompleted: false,
            priority: PriorityTypes.medium,
        },
    ];

    constructor() {
        this.showTasks();

        const elem = document.querySelector("header");

        // When the button add task is clicked a task is added
        elem?.querySelector("button")?.addEventListener("click", ev => {
            const elemTitle = elem?.querySelector("input");
            const elemPriority = elem?.querySelector("select");
            const elemdescription = elem?.querySelector("input.dis") as HTMLInputElement;

            const title = elemTitle?.value || '';
            const priority = elemPriority?.value || '';
            const description = elemdescription?.value || '';

            // Clears the inputs
            if (elemTitle) {
                elemTitle.value = "";
            }
            if (elemPriority) {
                elemPriority.value = "";
            }
            if (elemdescription) {
                elemdescription.value = "";
            }
            this.addTask(title, +priority, description);
        });
    }
    // Function to add a task
    addTask(title: string, priority?: PriorityTypes, description?: string) {
        // Creates an array of ids
        const ids = this.tasks.map(x => x.id);
        let max;
        if (ids.length == 0) {
            max = 0;
        } else {
            max = Math.max(...ids);
        };

        const now = new Date();
        const y = now.getFullYear();
        const m = now.getMonth() + 1;
        const d = now.getDate();

        const h = now.getHours();
        const mn = now.getMinutes();
        const s = now.getSeconds();
        // Added time
        const addedTime = `${y}-${(m < 10 ? '0' + m : m)}-${d} ${h}:${mn}:${s}`;
        this.tasks.push({
            id: max + 1,
            title,
            addedTime,
            description: `${description}`,
            contentEditable: false,
            isCompleted: false,
            priority: priority || PriorityTypes.low,
        });

        this.showTasks();
    }
    // Function to edit a task
    editTask(taskId: number) {
        const item = this.tasks.find(x => x.id == taskId);
        const isDivFound = document.querySelector("div[contenteditable='true']") as HTMLDivElement;
        if (item && isDivFound == null) {
            item.contentEditable = true;
            this.isCurrentlyEditing = true;
        } else {
            throw new Error(`Task ${taskId}`)
        }
        this.showTasks();
        const currentDiv = document.querySelector("div[contenteditable='true']") as HTMLDivElement;
        currentDiv.focus();
    }
    // Function that allows you to save a task you edited
    saveTask(taskId: number) {
        const item = this.tasks.find(x => x.id == taskId);
        const div = document.querySelector("div[contenteditable='true']")
        if (div == null || item == null) {
            return;
        }
        item.contentEditable = false;
        this.isCurrentlyEditing = false;
        item.description = div.innerHTML
        this.showTasks();
    }
    // Function to remove a task
    removeTask(taskId: number) {
        const i = this.tasks.findIndex(x => x.id == taskId);
        this.tasks.splice(i, 1);
        this.showTasks();
    }
    // Function to complete a task
    completeTask(taskId: number) {
        const item = this.tasks.find(x => x.id == taskId);
        if (item) {
            item.isCompleted = true;
        }
        this.showTasks();
    }

    // Function to uncomplete a task
    unCompleteTask(taskId: number) {
        const item = this.tasks.find(x => x.id == taskId);
        if (item) {
            item.isCompleted = false;
        }
        this.showTasks();
    }
    // Function to show all tasks
    showTasks() {
        const elem = document.querySelector("div.tasks");
        if (elem) {
            elem.innerHTML = "";
        }
        this.tasks.forEach(t => {
            const div = document.createElement("div");
            if (t.isCompleted) {
                div.classList.add('completed');
            }

            switch (t.priority) {
                case PriorityTypes.low: div.classList.add('low'); break;
                case PriorityTypes.medium: div.classList.add('medium'); break;
                case PriorityTypes.high: div.classList.add('high'); break;
            }
            div.contentEditable = "false";
            div.innerHTML = `
                <h3>${t.title}</h3>
                <p><b>Creative time:</b> ${t.addedTime}</p>
                <p><b>Description:</b><div class"onEdit" contenteditable="${t.contentEditable}"> ${t.description || '*No comment*'}</div></p>
                <footer>
                    <button class="remove">Delete</button>
                    ${t.isCompleted ? '<button class="uncomplete">Not carried out</button>' : '<button class="complete">Done</button>'}
                    <button class="edit">Edit</button>
                    <button class="finishEdit">Save</button>
                </footer>
            `;
            // Adds event listeners to each button
            div.querySelector('.remove')?.addEventListener("click", () => this.removeTask(t.id));
            div.querySelector('.complete')?.addEventListener("click", () => this.completeTask(t.id));
            div.querySelector('.uncomplete')?.addEventListener("click", () => this.unCompleteTask(t.id));
            div.querySelector('.edit')?.addEventListener("click", () => this.editTask(t.id));
            div.querySelector('.finishEdit')?.addEventListener("click", () => this.saveTask(t.id));
            elem?.appendChild(div);
        });
    }
}
const tasks = new TaskManager;