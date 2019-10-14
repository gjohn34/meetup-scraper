const express = require('express')
const app = express()
const port = 4000
// const puppeteer = require('puppeteer')
const cheerio = require('cheerio')
const axios = require('axios')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

app.use(cors(), bodyParser.json(), cookieParser())

let scrape = async (body) => {
  const { category, radius, userFreeform } = body
  const log = `https://www.meetup.com/en-AU/find/events/${category || 'tech'}/?allMeetups=false&radius=${radius || '3'}&userFreeform=${userFreeform || 'brisbane'}`
  console.log(log)
  const result = axios.get(`
    https://www.meetup.com/en-AU/find/events/${category || 'tech'}/?allMeetups=false&radius=${radius || '3'}&userFreeform=${userFreeform || 'brisbane'}
  `).then(response => {
    const $ = cheerio.load(response.data)
    let data = []
    const nodes = $('.event-listing')
    for (let i = 0; i < nodes.length; i++) {
      const { year, month, day } = $(nodes[i]).data()
      const time = $(nodes[i]).find('time').text()
      const chunk = $(nodes[i]).find('div.chunk')
      const text = $(chunk).find('a.omnCamp')
      const obj = {
        date: `${day}/${month}/${year}`,
        time: time,
        groupName: $(text[0]).text(),
        eventName: $(text[1]).text(),
        groupLink: $(text[0]).attr('href')
      }
      data.push(obj)
    }
    return data
  })
  return result
}
  // const browser = await puppeteer.launch({headless: true});
  // const page = await browser.newPage();
  // const branch, radius, location 
  
  // await page.goto(`https://www.meetup.com/en-AU/find/events/${category}/?allMeetups=false&radius=${radius}&userFreeform=${userFreeform}`)
  // await page.waitFor(1000);

  // const result = await page.evaluate(() => {
  //   let data = []
  //   let nodes = document.querySelectorAll('.event-listing')
  //   return data


app.post('/', async function(req,res) {
  let result = await scrape(req.body) 
  console.log(result)
  res.send(result)
})

app.listen(port, () => console.log('listening'))