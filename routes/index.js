var express = require('express');
var router = express.Router();
var login = require('../controller/authenticate/login');
const puppeteer = require("puppeteer");
const chalk = require("chalk");
const chromeOptions = {
  headless:true,
  defaultViewport: null,
};
var username = "";
var password = "";



// MY OCD of colorful console.logs for debugging... IT HELPS
const error = chalk.bold.red;
const success = chalk.keyword("green");


router.get('/', function(req, res, next) {
  res.render('login', { error: false, signout: false});
});
router.post('/portal', function (req, res, next) {
  (async function main() {
  try {
    if (req.body.username) {
      username = req.body.username;
    }
    if (req.body.password) {
      password = req.body.password;
    }
    if (username.length > 0 && password.length > 0) {

        const browser = await puppeteer.launch(chromeOptions);
        const page = await browser.newPage();
        await page.goto('https://ihs-fusd-ca.schoolloop.com/portal/login');
        await page.type('#login_name', username);
        await page.type('#password', password);
        await page.evaluate(() => {
          let elements = document.getElementsByClassName('btn-action-highlight-lg');
          for (let element of elements)
              element.click();
        });
        await page.waitForNavigation();
        let currUrl = page.url();
        await browser.close();
        if (currUrl === "https://ihs-fusd-ca.schoolloop.com/portal/student_home") {
          res.redirect("/portal/student-home");
        }
        else {
          res.render('login', { error: true });
        }

    }
  } catch (err) {
    // Catch and display errors
    console.log(error(err));
    await browser.close();
    console.log(error("Browser Closed"));
  }
  })()
});
router.get('/portal/student-home', function (req, res, next) {
  (async function main() {
    try {
      if (req.body.username) {
        username = req.body.username;
      }
      if (req.body.password) {
        password = req.body.password;
      }
      if (username.length > 0 && password.length > 0) {
          const browser = await puppeteer.launch(chromeOptions);
          const page = await browser.newPage();
          await page.goto('https://ihs-fusd-ca.schoolloop.com/portal/login');
          await page.type('#login_name', username);
          await page.type('#password', password);
          await page.evaluate(() => {
            let elements = document.getElementsByClassName('btn-action-highlight-lg');
            for (let element of elements)
                element.click();
          });
          await page.waitForNavigation();
          let bodyHTML = await page.evaluate(() => document.body.innerHTML);
          var schedule = await page.evaluate(() => {
            var tableList = document.getElementsByClassName("student_row");
            var schedule = []
            for (var i = 0; i < tableList.length; i++) {
              for (var j = 0; j < tableList[i].rows.length; j++) {
                schedule.push({
                  period: tableList[i].rows[j].cells[0].innerText.trim(),
                  course: tableList[i].rows[j].cells[1].innerText.trim(),
                  teacher: tableList[i].rows[j].cells[4].innerText.trim(),
                });
              }
            }
            return schedule;

          });
          await browser.close();
          console.log(schedule);
          if (schedule.length > 0) {
            res.render("student-home", {sched: schedule});
          }
          else {
            res.render('login', { error: true, signout: false});
          }
      }
      else {
        res.redirect("/");
      }
    } catch (err) {
      // Catch and display errors
      console.log(error(err));
      await browser.close();
      console.log(error("Browser Closed"));
    }
  })()
});
router.post('/portal/student-home', function (req, res, next) {
  (async function main() {
    try {
      if (req.body.username) {
        username = req.body.username;
      }
      if (req.body.password) {
        password = req.body.password;
      }
      if (username.length > 0 && password.length > 0) {
          const browser = await puppeteer.launch(chromeOptions);
          const page = await browser.newPage();
          await page.goto('https://ihs-fusd-ca.schoolloop.com/portal/login');
          await page.type('#login_name', username);
          await page.type('#password', password);
          await page.evaluate(() => {
            let elements = document.getElementsByClassName('btn-action-highlight-lg');
            for (let element of elements)
                element.click();
          });
          await page.waitForNavigation();
          let bodyHTML = await page.evaluate(() => document.body.innerHTML);
          var schedule = await page.evaluate(() => {
            var tableList = document.getElementsByClassName("student_row");
            var schedule = []
            for (var i = 0; i < tableList.length; i++) {
              for (var j = 0; j < tableList[i].rows.length; j++) {
                schedule.push({
                  period: tableList[i].rows[j].cells[0].innerText.trim(),
                  course: tableList[i].rows[j].cells[1].innerText.trim(),
                  teacher: tableList[i].rows[j].cells[4].innerText.trim(),
                });
              }
            }
            return schedule;

          });
          await browser.close();
          console.log(schedule);
          if (schedule.length > 0) {
            res.render("student-home", {sched: schedule});
          }
          else {
            res.render('login', { error: true, signout: false});
          }
      }
      else {
        res.redirect("/");
      }
    } catch (err) {
      // Catch and display errors
      console.log(error(err));
      await browser.close();
      console.log(error("Browser Closed"));
    }
  })()
});
router.get('/logout', function(req, res, next) {
  username = "";
  password = "";
  res.render('login', { error: false, signout: true});
});


module.exports = router;
