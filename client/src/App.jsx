import { useState } from 'react'
import reactLogo from './assets/react.svg'
import "./App.css"
import "./normal.css"
import ChatMessage from './ChatMessage'
import { useEffect } from 'react'

function App() {
  const [models, setModels] = useState([])
  const [currentModel, setCurrentModel] = useState("text-davinci-003")
  const [input, setInput] = useState([])
  const [collectChatLog, setCollectChatLog] = useState()
  const [chatLog, setChatLog] = useState([{
    user: "gpt",
    message: "How can I help you today?"
  },
  {
    user: "me",
    message: "I want to use ChatGpt today"
  }])



  const clearChat = () => {
    console.log("chatlog2: ", chatLog)
    if (chatLog.length > 0) {
      collectChatLog ? setCollectChatLog([...collectChatLog, chatLog]) : setCollectChatLog([chatLog])
    }
    setChatLog([])
  }

  const clearConversations = () => {
    setCollectChatLog()
  }

  console.log("collect chatlog: ", collectChatLog)

  const getEngines = async () => {
    fetch("http://localhost:3001/models")
      .then(res => res.json())
      .then(data => {
        console.log("models: ", data.models)
        setModels(data.models)
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let chatLogNew = [...chatLog, { user: "me", message: `${input}` }]
    await setInput("")
    setChatLog(chatLogNew);
    //fetch response to the api combining the chat log array of messages and seinding it as a message
    const messages = chatLogNew.map((message) =>
      message.message).join("\n")
    const response = await fetch("http://localhost:3001/", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
        currentModel
      })
    });
    const data = await response.json();
    setChatLog([...chatLogNew, { user: "gpt", message: `${data.message}` }]);
    console.log(data.message);
  }

  useEffect(() => {
    getEngines();
  }, [])
  return (
    <div className="App">
      <aside className="sidemenu">
        <div className="sidemenu-buton" onClick={clearChat}>
          <span>+</span>
          New chat
        </div>

        <div className='container-conversations'>
          {collectChatLog ? <h2 className='title-conversations'>All convesations</h2> : null}
          <div className='conversations'>
            {
              collectChatLog?.map((collection) => (
                <div>{collection[0]?.message}</div>
              ))
            }
          </div>

        </div>
        <div className='models'>
          <div>
            <span>Selecciona la IA que te guste</span>
            <select onChange={(e) => {
              setCurrentModel(e.target.value)
            }}>
              {models.map((model, index) => (
                <option key={model.id} value={model.id}>
                  {model.id}</option>
              ))}
            </select>
          </div>

          <button onClick={clearConversations}>Clear conversations</button>

        </div>
      </aside>
      <section className='chatbox'>
        <div className="chat-log">
          {
            chatLog.map((message, index) => (
              <ChatMessage key={index} message={message} />
            ))
          }

        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input rows="1"
              className="chat-input-textarea" value={input}
              onChange={(e) => setInput(e.target.value)}></input>
          </form>
        </div>
      </section>
    </div>
  )
}

export default App


