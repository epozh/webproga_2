import { initialTasks, STORAGE_KEY } from './data.js';

// ===== СОЗДАНИЕ DOM-ЭЛЕМЕНТОВ ЧЕРЕЗ JAVASCRIPT =====

// Главный контейнер
const appContainer = document.createElement('div');
appContainer.className = 'app-container';

// Шапка приложения
const appHeader = document.createElement('header');
appHeader.className = 'app-header';

const appTitle = document.createElement('h1');
appTitle.className = 'app-title';
appTitle.textContent = 'To-Do List';

appHeader.appendChild(appTitle);

// Форма добавления задачи
const taskForm = document.createElement('form');
taskForm.className = 'task-form';

const taskInput = document.createElement('input');
taskInput.type = 'text';
taskInput.className = 'task-input';
taskInput.placeholder = 'Введите название задачи...';
taskInput.required = true;

const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.className = 'date-input';
dateInput.required = true;

const addBtn = document.createElement('button');
addBtn.type = 'submit';
addBtn.className = 'add-btn';
addBtn.textContent = 'Добавить';

taskForm.appendChild(taskInput);
taskForm.appendChild(dateInput);
taskForm.appendChild(addBtn);

// Панель управления (поиск, фильтр, сортировка)
const controls = document.createElement('div');
controls.className = 'controls';

const searchInput = document.createElement('input');
searchInput.type = 'text';
searchInput.className = 'search-input';
searchInput.placeholder = 'Поиск по названию...';

const filterSelect = document.createElement('select');
filterSelect.className = 'filter-select';

const filterAll = document.createElement('option');
filterAll.value = 'all';
filterAll.textContent = 'Все задачи';

const filterActive = document.createElement('option');
filterActive.value = 'active';
filterActive.textContent = 'Активные';

const filterCompleted = document.createElement('option');
filterCompleted.value = 'completed';
filterCompleted.textContent = 'Выполненные';

filterSelect.appendChild(filterAll);
filterSelect.appendChild(filterActive);
filterSelect.appendChild(filterCompleted);

const sortSelect = document.createElement('select');
sortSelect.className = 'sort-select';

const sortDate = document.createElement('option');
sortDate.value = 'date';
sortDate.textContent = 'По дате';

const sortAdded = document.createElement('option');
sortAdded.value = 'added';
sortAdded.textContent = 'По добавлению';

sortSelect.appendChild(sortDate);
sortSelect.appendChild(sortAdded);

controls.appendChild(searchInput);
controls.appendChild(filterSelect);
controls.appendChild(sortSelect);

// Список задач
const taskList = document.createElement('ul');
taskList.className = 'task-list';

// Собираем всё в контейнер
appContainer.appendChild(appHeader);
appContainer.appendChild(taskForm);
appContainer.appendChild(controls);
appContainer.appendChild(taskList);

// Добавляем в body
document.body.appendChild(appContainer);

// ===== ЛОГИКА ПРИЛОЖЕНИЯ =====

// Состояние приложения
let tasks = [];
let draggedItem = null;

// Загрузка задач из localStorage
function loadTasks() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        tasks = JSON.parse(stored);
    } else {
        tasks = [...initialTasks];
        saveTasks();
    }
}

// Сохранение в localStorage
function saveTasks() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// Генерация уникального ID
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Создание элемента задачи
function createTaskElement(task) {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.dataset.id = task.id;
    li.draggable = true;

    // Чекбокс выполнения
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;

    // Контент задачи
    const content = document.createElement('div');
    content.className = 'task-content';

    const text = document.createElement('div');
    text.className = 'task-text';
    text.textContent = task.title;

    const date = document.createElement('div');
    date.className = 'task-date';
    date.textContent = formatDate(task.date);

    content.appendChild(text);
    content.appendChild(date);

    // Кнопки действий
    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.textContent = 'Изменить';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Удалить';

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    // Собираем элемент
    li.appendChild(checkbox);
    li.appendChild(content);
    li.appendChild(actions);

    // Drag and Drop события
    li.addEventListener('dragstart', handleDragStart);
    li.addEventListener('dragend', handleDragEnd);
    li.addEventListener('dragover', handleDragOver);
    li.addEventListener('drop', handleDrop);

    // События элементов
    checkbox.addEventListener('change', () => toggleTask(task.id));
    editBtn.addEventListener('click', () => startEdit(li, task));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));

    return li;
}

// Форматирование даты
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Отображение задач
function renderTasks() {
    const filtered = getFilteredTasks();
    
    taskList.innerHTML = '';
    
    if (filtered.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.textContent = 'Задачи не найдены';
        taskList.appendChild(empty);
        return;
    }

    filtered.forEach(task => {
        taskList.appendChild(createTaskElement(task));
    });
}

// Получение отфильтрованных и отсортированных задач
function getFilteredTasks() {
    let result = [...tasks];

    // Поиск
    const searchTerm = searchInput.value.toLowerCase();
    if (searchTerm) {
        result = result.filter(t => t.title.toLowerCase().includes(searchTerm));
    }

    // Фильтрация по статусу
    const filter = filterSelect.value;
    if (filter === 'active') {
        result = result.filter(t => !t.completed);
    } else if (filter === 'completed') {
        result = result.filter(t => t.completed);
    }

    // Сортировка
    const sort = sortSelect.value;
    if (sort === 'date') {
        result.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    // По добавлению (по умолчанию) — оставляем как есть

    return result;
}

// Добавление задачи
function addTask(title, date) {
    const newTask = {
        id: generateId(),
        title: title,
        date: date,
        completed: false
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
}

// Удаление задачи
function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
}

// Переключение статуса выполнения
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

// Начало редактирования
function startEdit(li, task) {
    const content = li.querySelector('.task-content');
    const actions = li.querySelector('.task-actions');

    // Создаём поля редактирования
    const editContainer = document.createElement('div');
    editContainer.className = 'edit-mode';

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'edit-input';
    editInput.value = task.title;

    const editDate = document.createElement('input');
    editDate.type = 'date';
    editDate.className = 'edit-date';
    editDate.value = task.date;

    editContainer.appendChild(editInput);
    editContainer.appendChild(editDate);

    // Заменяем контент
    li.replaceChild(editContainer, content);

    // Меняем кнопки
    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'Сохранить';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'cancel-btn';
    cancelBtn.textContent = 'Отмена';

    actions.innerHTML = '';
    actions.appendChild(saveBtn);
    actions.appendChild(cancelBtn);

    // События
    saveBtn.addEventListener('click', () => {
        if (editInput.value.trim()) {
            task.title = editInput.value.trim();
            task.date = editDate.value;
            saveTasks();
            renderTasks();
        }
    });

    cancelBtn.addEventListener('click', () => {
        renderTasks();
    });
}

// ===== DRAG AND DROP =====

function handleDragStart(e) {
    draggedItem = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragEnd(e) {
    this.classList.remove('dragging');
    draggedItem = null;
    
    // Убираем все подсветки
    document.querySelectorAll('.task-item').forEach(item => {
        item.style.borderTop = '';
        item.style.borderBottom = '';
    });
}

function handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const afterElement = getDragAfterElement(taskList, e.clientY);
    
    if (afterElement == null) {
        taskList.appendChild(draggedItem);
    } else {
        taskList.insertBefore(draggedItem, afterElement);
    }
}

function handleDrop(e) {
    e.preventDefault();
    
    // Обновляем порядок в массиве tasks
    updateTasksOrder();
    saveTasks();
}

// Определение позиции для вставки
function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Обновление порядка задач в массиве
function updateTasksOrder() {
    const newOrder = [];
    const items = taskList.querySelectorAll('.task-item');
    
    items.forEach(item => {
        const id = item.dataset.id;
        const task = tasks.find(t => t.id === id);
        if (task) {
            newOrder.push(task);
        }
    });
    
    tasks = newOrder;
}

// ===== ОБРАБОТЧИКИ СОБЫТИЙ =====

// Добавление новой задачи
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = taskInput.value.trim();
    const date = dateInput.value;
    
    if (title && date) {
        addTask(title, date);
        taskInput.value = '';
        dateInput.value = '';
    }
});

// Поиск
searchInput.addEventListener('input', renderTasks);

// Фильтрация
filterSelect.addEventListener('change', renderTasks);

// Сортировка
sortSelect.addEventListener('change', renderTasks);

// ===== ИНИЦИАЛИЗАЦИЯ =====

function init() {
    loadTasks();
    renderTasks();
}

// Запуск приложения
init();