// import cheerio from 'cheerio'
const express = require('express')
const app = express()
const port = 4000
const puppeteer = require('puppeteer')
const cors = require('cors')
app.use(cors())

let scrape = async () => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();

  await page.goto('https://www.meetup.com/en-AU/find/events/tech/?allMeetups=false&radius=5&userFreeform=brisbane&mcId=c1000655&mcName=Brisbane%2C+AU');
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


app.get('/', async function(req,res) {
  let result = await scrape()
  res.send(result)
})

app.listen(port, () => console.log('listening'))