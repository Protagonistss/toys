import React, { ReactNode, useState } from 'react'
import logo from './logo.svg'
import './App.css'


type TListItem = { title: string, status: string }

const KanbanCard = ({ title, status }:TListItem) => {
  return (
    <li className="kanban-card">
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

const KanbanColumn = ({ children, className, title }: { children: ReactNode, className: string, title: string | ReactNode }) => {
  const combinedClassName = `kanban-column ${className}`
  return (
    <section className={combinedClassName}>
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

function App() {
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
  return (
    <div className="App">
      <header className="App-header">
        <h1>我的看板</h1>
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <KanBoard>
        <KanbanColumn className="column-todo" title={<>待处理<button onClick={handleAdd}
          disabled={showAdd}>&#8853; 添加新卡片</button></>}>
            {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
            {todoList.map(props => <KanbanCard { ...props }/>)}
        </KanbanColumn>
        <KanbanColumn className="column-ongoing" title='进行中'>
            {ongoingList.map(props => <KanbanCard {...props}/>)}
        </KanbanColumn>
        <KanbanColumn className="column-done" title="已完成">
            {doneList.map(props => <KanbanCard { ...props }/>)}
        </KanbanColumn>
      </KanBoard>
    </div>
  )
}

export default App
