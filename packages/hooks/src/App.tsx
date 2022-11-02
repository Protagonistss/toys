import React, { ReactNode, useEffect, useState } from 'react'
import logo from './logo.svg'
import './App.css'


type TListItem = { title: string, status: string, onDragStart?: (arg: any) => any }

const KanbanCard = ({ title, status, onDragStart }:TListItem) => {
  const handleDragStart = (evt: React.DragEvent<HTMLLIElement>) => {
    evt.dataTransfer.effectAllowed = 'move'
    evt.dataTransfer.setData('text/plain', title)
    onDragStart && onDragStart(evt)
  }
  return (
    <li className="kanban-card" draggable onDragStart={handleDragStart}>
      <div className="card-title">{title}</div>
      <div className="card-status">{status}</div>
    </li>
  )
}


const KanbanNewCard = ({ onSubmit }: { onSubmit: (title: string) => void }) => {
  const [ title, setTitle ] = useState('')
  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (evt) => {
    setTitle(evt.target.value)
  }
  const handleKeyDown: React.KeyboardEventHandler = (evt) => {
    if (evt.key === 'Enter') {
      onSubmit(title)
    }
  }
  return (
    <li className="kanban-card">
      <h3>添加新卡片</h3>
      <div className="card-title">
        <input type="text" value={ title } onChange={ handleChange } onKeyDown={ handleKeyDown }/>
      </div>
    </li>
  )
}

const KanbanColumn = ({ children, className, title, setIsDragSource, setIsDragTarget }: { children?: ReactNode, className: string, title: string | ReactNode, setIsDragSource: (arg: boolean) => void, setIsDragTarget: (arg: boolean) => void }) => {
  const combinedClassName = `kanban-column ${className}`
  return (
    <section
      onDragStart={() => { setIsDragSource(true) }}
      onDragOver={evt => { evt.preventDefault(); evt.dataTransfer.dropEffect = 'move'; setIsDragTarget(true) }}
      onDragLeave={evt => { evt.preventDefault(); evt.dataTransfer.dropEffect = 'none'; setIsDragTarget(false) }}
      onDrop={evt => {evt.preventDefault()}}
      onDragEnd={evt => { evt.preventDefault(); setIsDragSource(false); setIsDragTarget(false) }}
      className={combinedClassName}>
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  )
}

const KanBoard = ({ children }: { children: ReactNode }) => {
  return (
    <main className="kanban-board">
      {children}
    </main>
  )
}

const DATA_STORE_KEY = 'kanban-data-store'
const COLUMN_KEY_TODO = 'todo'
const COLUMN_KEY_ONGOING = 'ongoing'
const COLUMN_KEY_DONE = 'done'

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [todoList, setTodoList] = useState([
    { title: '开发任务-1', status: '22-05-22 18:15' },
    { title: '开发任务-3', status: '22-05-22 18:15' },
    { title: '开发任务-5', status: '22-05-22 18:15' },
    { title: '测试任务-3', status: '22-05-22 18:15' }
  ])
  const [ ongoingList, setOngoingList ] = useState([
    { title: '开发任务-4', status: '22-05-22 18:15' },
    { title: '开发任务-6', status: '22-05-22 18:15' },
    { title: '测试任务-2', status: '22-05-22 18:15' }
  ])
  const [ doneList, setDoneList ] = useState([
    { title: '开发任务-2', status: '22-05-22 18:15' },
    { title: '测试任务-1', status: '22-05-22 18:15' }
  ])
  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY)
    setTimeout(() => {
      if (data) {
        const kanbanColumnData = JSON.parse(data)
        setTodoList(kanbanColumnData.todoList)
        setOngoingList(kanbanColumnData.ongoingList)
        setDoneList(kanbanColumnData.doneList)
      }
      setIsLoading(false)
    }, 1000)
  }, [])
  const handleAdd = (evt: React.FormEvent<HTMLButtonElement>) => {
    setShowAdd(true)
  }
  const handleSubmit = (title:string) => {
    setTodoList((current: TListItem[]) => [
      { title: title, status: new Date().toDateString() },
      ...current
    ])
    todoList.unshift({ title: title, status: new Date().toDateString() })
    setShowAdd(false)
  }
  const handleSaveAll = () => {
    const data = JSON.stringify({
      todoList,
      ongoingList,
      doneList
    })
    window.localStorage.setItem(DATA_STORE_KEY, data)
  }
  const [draggedItem, setDraggedItem] = useState({})
  const [dragSource, setDragSource] = useState(null)
  const [dragTarget, setDragTarget] = useState(null)
  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板 <button onClick={handleSaveAll}>保存所有卡片</button></h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanBoard>
        { isLoading ? (<KanbanColumn className="column-todo" title="读取中..."></KanbanColumn>) : (<>
          <KanbanColumn className="column-todo" title={<>待处理<button onClick={handleAdd}
            disabled={showAdd}>&#8853; 添加新卡片</button></>}>
              {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
              {todoList.map(props => <KanbanCard key={props.title} onDragStart={() => setDraggedItem(props)} { ...props }/>)}
          </KanbanColumn>
          <KanbanColumn className="column-ongoing" title='进行中'>
              {ongoingList.map(props => <KanbanCard {...props}/>)}
          </KanbanColumn>
          <KanbanColumn className="column-done" title="已完成">
              {doneList.map(props => <KanbanCard { ...props }/>)}
          </KanbanColumn>
        </>) }
      </KanBoard>
    </div>
  )
}

export default App
