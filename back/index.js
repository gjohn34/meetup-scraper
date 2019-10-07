// import cheerio from 'cheerio'
const express = require('express')
const app = express()
const port = 4000
const puppeteer = require('puppeteer')
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors(), bodyParser.json())

let scrape = async (body) => {
  const { category, radius, userFreeform } = body
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  // const branch, radius, location 
  console.log(`https://www.meetup.com/en-AU/find/events/${category}/?allMeetups=false&radius=${radius}&userFreeform=${userFreeform}`)

  await page.goto(`https://www.meetup.com/en-AU/find/events/${category}/?allMeetups=false&radius=${radius}&userFreeform=${userFreeform}`)
  await page.waitFor(1000);

  const result = await page.evaluate(() => {
    let data = []
    let nodes = document.querySelectorAll('.event-listing')
    nodes.forEach(node => {
      const { year, month, day } = node.dataset
      const [ groupDiv, eventDiv ] = node.children[1].firstElementChild.children
      const obj = {
        groupName: groupDiv.innerText,
        date: `${day}/${month}/${year}`,
        time: node.children[0].innerText,
        groupLink: groupDiv.firstElementChild.href,
        eventLink: eventDiv.href,
        eventName: eventDiv.innerText
      }
      data.push(obj)
    })
    return data

  });

  browser.close();
  return result;
};


app.post('/', async function(req,res) {
  let result = await scrape(req.body)
  res.send(result)
})

app.listen(port, () => console.log('listening'))