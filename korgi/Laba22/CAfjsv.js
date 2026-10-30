import React, { useState } from 'react';
import { Columns, FileText, PlayCircle, ChevronRight, ChevronLeft, User, AlignLeft, CheckCircle2, Calendar } from 'lucide-react';

// Исходные данные для Документа распределения работ (DoW)
const dowData = [
  { role: 'Тимлид Влад', responsibility: 'Техническая реализация бэкенда, разработка архитектуры сканера и алгоритмов.', tasks: ['Архитектура сканера штрихкодов', 'Настройка серверной БД', 'Алгоритм быстрой сортировки цен'], color: 'bg-blue-100 text-blue-800' },
  { role: 'Дизайнер Кира', responsibility: 'Проектирование пользовательского интерфейса (UI/UX) для ключевых функций MVP.', tasks: ['Макеты карточки товара', 'UI шторки сканирования', 'Индикация «лучшей цены»'], color: 'bg-pink-100 text-pink-800' },
  { role: 'Бизнес-аналитик Марина', responsibility: 'Работа с данными, требованиями и интеграциями с внешними системами.', tasks: ['Проверка API сетей (Е-доставка)', 'Категории товаров', 'Требования для парсинга'], color: 'bg-emerald-100 text-emerald-800' },
  { role: 'Менеджер Настя', responsibility: 'Управление процессами, контроль бэклога и защита фокуса команды (отказ от Won\'t Have).', tasks: ['Внесение задач в трекер', 'Контроль доски', 'Блокировка лишних фич'], color: 'bg-purple-100 text-purple-800' },
];

// Исходные задачи для Канбан-доски с датами (10.03.2026 - 02.06.2026)
const initialTasks = [
  // TODO (Май - Июнь: Финализация)
  { id: 1, title: 'Алгоритм быстрой сортировки цен', assignee: 'Влад', status: 'todo', roleColor: 'bg-blue-100 text-blue-800', date: '15.05.2026' },
  { id: 2, title: 'Макеты карточки товара (финальные)', assignee: 'Кира', status: 'todo', roleColor: 'bg-pink-100 text-pink-800', date: '20.05.2026' },
  { id: 3, title: 'Классификация категорий товаров (расширенная)', assignee: 'Марина', status: 'todo', roleColor: 'bg-emerald-100 text-emerald-800', date: '25.05.2026' },
  
  // IN PROGRESS (Апрель - Май: Разработка)
  { id: 4, title: 'Архитектура сканера штрихкодов', assignee: 'Влад', status: 'inProgress', roleColor: 'bg-blue-100 text-blue-800', date: '12.04.2026' },
  { id: 5, title: 'UI шторки сканирования', assignee: 'Кира', status: 'inProgress', roleColor: 'bg-pink-100 text-pink-800', date: '20.04.2026' },
  { id: 6, title: 'Проверка доступности API торговых сетей', assignee: 'Марина', status: 'inProgress', roleColor: 'bg-emerald-100 text-emerald-800', date: '05.05.2026' },
  
  // REVIEW (Март - Апрель: Тестирование первых модулей)
  { id: 7, title: 'Настройка серверной базы данных', assignee: 'Влад', status: 'review', roleColor: 'bg-blue-100 text-blue-800', date: '28.03.2026' },
  { id: 8, title: 'Индикация «лучшей цены» (прототип)', assignee: 'Кира', status: 'review', roleColor: 'bg-pink-100 text-pink-800' , date: '02.04.2026'},
  
  // DONE (Март: Старт и планирование)
  { id: 9, title: 'Внесение задач в трекер и настройка доски', assignee: 'Настя', status: 'done', roleColor: 'bg-purple-100 text-purple-800', date: '10.03.2026' },
  { id: 10, title: 'Формализация базовых требований для MVP', assignee: 'Марина', status: 'done', roleColor: 'bg-emerald-100 text-emerald-800', date: '18.03.2026' },
];

const COLUMNS = [
  { id: 'todo', title: 'Бэклог (To Do)' },
  { id: 'inProgress', title: 'В работе (In Progress)' },
  { id: 'review', title: 'Проверка (Review)' },
  { id: 'done', title: 'Готово (Done)' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('kanban');
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (taskId, direction) => {
    setTasks(prevTasks => prevTasks.map(task => {
      if (task.id === taskId) {
        const currentIndex = COLUMNS.findIndex(col => col.id === task.status);
        const newIndex = direction === 'right' ? currentIndex + 1 : currentIndex - 1;
        if (newIndex >= 0 && newIndex < COLUMNS.length) {
          return { ...task, status: COLUMNS[newIndex].id };
        }
      }
      return task;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex flex-col md:flex-row items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="text-blue-600 h-7 w-7" />
            Проект «Чекни»
          </h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <Calendar className="h-4 w-4" />
            <span>Период разработки: 10.03.2026 — 02.06.2026</span>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-lg mt-4 md:mt-0">
          <button 
            onClick={() => setActiveTab('dow')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'dow' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <FileText className="h-4 w-4" />
            DoW
          </button>
          <button 
            onClick={() => setActiveTab('kanban')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'kanban' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <Columns className="h-4 w-4" />
            Канбан-доска
          </button>
          <button 
            onClick={() => setActiveTab('usecase')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'usecase' ? 'bg-white shadow-sm text-blue-700' : 'text-slate-600 hover:text-slate-900'}`}
          >
            <PlayCircle className="h-4 w-4" />
            Сценарий
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6 max-w-7xl mx-auto">
        
        {activeTab === 'dow' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Документ распределения работ (DoW)</h2>
              <p className="text-slate-600 mt-2">Зоны ответственности команды на весенний семестр 2026.</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {dowData.map((item, index) => (
                <div key={index} className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-2 rounded-full ${item.color}`}>
                      <User className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{item.role}</h3>
                  </div>
                  <div className="mb-4 flex-grow">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Зона ответственности</h4>
                    <p className="text-slate-700">{item.responsibility}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
                    <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                      <AlignLeft className="h-4 w-4" /> Задачи
                    </h4>
                    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                      {item.tasks.map((task, idx) => (
                        <li key={idx}>{task}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'kanban' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">Доска задач (Канбан)</h2>
              <p className="text-slate-600 mt-2 text-sm">График работ распределен с учетом дедлайна 02.06.2026.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 overflow-x-auto pb-4 items-start">
              {COLUMNS.map((column, colIndex) => {
                const columnTasks = tasks.filter(task => task.status === column.id);
                return (
                  <div key={column.id} className="bg-slate-100 rounded-xl p-4 min-w-[300px] w-full md:w-1/4 flex flex-col max-h-[70vh]">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <h3 className="font-semibold text-slate-700">{column.title}</h3>
                      <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-1 rounded-full">
                        {columnTasks.length}
                      </span>
                    </div>
                    
                    <div className="flex flex-col gap-3 overflow-y-auto pr-1">
                      {columnTasks.map(task => (
                        <div key={task.id} className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition-shadow group">
                          <div className="flex justify-between items-start mb-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${task.roleColor}`}>
                              {task.assignee}
                            </span>
                            <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                              <Calendar className="h-3 w-3" />
                              {task.date}
                            </div>
                          </div>
                          <p className="text-sm font-medium text-slate-900 mb-4 leading-tight">{task.title}</p>
                          
                          <div className="flex justify-between items-center border-t border-slate-100 pt-3">
                            <button 
                              onClick={() => moveTask(task.id, 'left')}
                              disabled={colIndex === 0}
                              className="text-slate-400 hover:text-blue-600 disabled:opacity-20 p-1"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => moveTask(task.id, 'right')}
                              disabled={colIndex === COLUMNS.length - 1}
                              className="text-slate-400 hover:text-blue-600 disabled:opacity-20 p-1"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'usecase' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-bold text-slate-900">Пример использования</h2>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-6">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-bold text-slate-900">Март 2026: Старт проекта</h4>
                <p className="text-slate-600 text-sm mt-1 underline decoration-blue-200 decoration-2">Настя (10.03)</p>
                <p className="text-slate-700 mt-2 text-sm">Проводит планирование и заносит первые задачи. Марина (18.03) фиксирует требования. К концу месяца карточки этих задач перемещаются в колонку <strong>«Готово»</strong>.</p>
              </div>

              <div className="border-l-4 border-emerald-500 pl-4">
                <h4 className="font-bold text-slate-900">Апрель - Май 2026: Активная фаза</h4>
                <p className="text-slate-600 text-sm mt-1 underline decoration-emerald-200 decoration-2">Влад и Кира (12.04 — 05.05)</p>
                <p className="text-slate-700 mt-2 text-sm">Основные задачи по архитектуре сканера и UI перемещаются в колонку <strong>«В работе»</strong>. Настя контролирует, чтобы не появлялись лишние задачи вне рамок MVP.</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-bold text-slate-900">Июнь 2026: Финализация</h4>
                <p className="text-slate-600 text-sm mt-1 underline decoration-purple-200 decoration-2">Вся команда (02.06)</p>
                <p className="text-slate-700 mt-2 text-sm">Последние задачи по сортировке и финальным макетам проходят этап <strong>«Проверка»</strong> и переходят в <strong>«Готово»</strong>. Продукт готов к презентации по итогам лаб.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}