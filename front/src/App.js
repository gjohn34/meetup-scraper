import React, { useEffect, useState} from 'react';
import './App.css';
import * as axios from 'axios'

function Form(props) {
  const handleSubmit = (e) => {
    e.preventDefault()
    const elements = e.target.elements
    const data = {}
    for (let i = 0; i < elements.length; i++) {
      data[elements[i].dataset.param] = elements[i].value.replace(' ', '+')
    }
    axios.post('http://localhost:4000/', data).then(response => props.setResultData(response.data))
  }

  const [city, setCity] = useState('')

  return ( 
    <form onSubmit={handleSubmit}>
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
  </form>
  )
}


function App() {
  const [resultData, setResultData] = useState()
  const [activeData, setActiveData] = useState()
  const [included, setIncluded] = useState([])

  useEffect(() => {
    if (resultData) {
      setActiveData(resultData[0])}
  }, [resultData])

  const handleDiscard = () => {
    const newArray = resultData.slice(1)
    setActiveData(newArray[0])
    setResultData(newArray)
  }

  const handleInclude = () => {
    if (included == undefined) {
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
    return (
      <div>
        <h2>{active.groupName}'s<br />{active.eventName}</h2>
        <h4>@{active.time} on {active.date}</h4>
        <a href={active.eventLink} target='_blank' rel='noopener'>About...</a>
        <button onClick={handleInclude}>Include</button>
        <button onClick={handleDiscard}>Discard</button>
      </div>

      //save this for later
      // <div onClick={() => {
      //   const se = selected != undefined ? selected : new Array()
      //   se.push(resultData[int])
      //   setSelected(se)
      //   setActiveData(int+1)
      // }}>
      //   <h2>{resultData[int].eventName}</h2>
      // </div>
    )
  }

  const renderSelected = (data) => {
    return (
      <ul>
        {/* {data.map(element => <li>{element.eventName}</li>)} */}
      </ul>
    )
  }
  
  return (
    <div className="App">
      <Form setResultData={setResultData}/>
      {resultData != undefined && renderResults()}
      {/* {activeData != undefined && renderSelected(selected)} */}
    </div>
  );
}

export default App;
