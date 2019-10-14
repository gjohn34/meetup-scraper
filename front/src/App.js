import React, { useEffect, useState} from 'react';
import './App.css';
import * as axios from 'axios'

function Form(props) {
  const [city, setCity] = useState('')

  return ( 
    <form onSubmit={props.handleSubmit}>
    <div onClick={() => document.querySelector('#form').classList.toggle('hidden')}>
      Options...
    </div>
    <div id='form' className='hidden'>
      <div>
        <label>Category</label>
        <select data-param='category'>
          <option value='tech'>Tech</option>
          <option value='music'>Music</option>
          <option value='arts'>Arts</option>
        </select>
      </div>
      <div>
        <label>Distance from...</label>
        <select data-param='radius'>
          <option value='3'>5km</option>
          <option value='6'>10km</option>
          <option value='16'>25km</option>
        </select>
      </div>
      <div>
        <label>City</label>
        <input data-param='userFreeform' onChange={(e) => setCity(e.target.value)} value={city}/>
      </div>
    </div>
    <button>Submit</button>
  </form>
  )
}


function App() {
  const [resultData, setResultData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [activeData, setActiveData] = useState()
  const [included, setIncluded] = useState([])

  useEffect(() => {
    if (resultData) {
      setActiveData(resultData[0])}
  }, [resultData])

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    const elements = e.target.elements
    const data = {}
    for (let i = 0; i < elements.length; i++) {
      data[elements[i].dataset.param] = elements[i].value.replace(' ', '+')
    }
    axios.post('http://localhost:4000/', data).then(response => {
      setResultData(response.data)
      setIsLoading(false)
    }).catch(error => alert('Something went wrong, please refresh the page and start again.'))
  }

  const handleDiscard = () => {
    const newArray = resultData.slice(1)
    setResultData(newArray)
  }

  const handleInclude = () => {
    if (included === undefined) {
      setIncluded([activeData])
    } else {
      const newIncludedArray = included.slice()
      newIncludedArray.push(activeData)
      setIncluded(newIncludedArray)
    }
    const newArray = resultData.slice(1)
    setResultData(newArray)
  }

  const renderResults = () => {
    const active = activeData || resultData[0]
    if (active) {
      return (
        <div>
          <h2>{active.groupName}'s<br />{active.eventName}</h2>
          <h4>@{active.time} on {active.date}</h4>
          <a href={active.eventLink} target='_blank' rel='noopener noreferrer'>About...</a>
          <button onClick={handleInclude}>Include</button>
          <button onClick={handleDiscard}>Discard</button>
          {resultData.length > 97 && <button onClick={() => {
            const newArray = resultData.slice(97)
            setResultData(newArray)
          }}>Skip</button>}
        </div>
      )
    } else {
      return (
        <p>Thats all!</p>
      )
    }
  }

  const renderIncluded = () => {
    return (
      <ul>
        {included.map(event => <li>{event.eventName}</li>)}
      </ul>
    )
  }
  
  if (!isLoading) {
    return (
      <div className="App">
        <Form handleSubmit={handleSubmit}/>
        {resultData !== undefined && renderResults()}
        {included !== undefined && renderIncluded()}
      </div>
    );
  } else {
    return (<p>Loading...</p>)
  }
}

export default App;
