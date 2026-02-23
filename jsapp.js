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