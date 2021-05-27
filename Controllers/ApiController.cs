// Indended function: Application programming interface for passing data to and from the server
using System;
using Microsoft.AspNetCore.Mvc;
using TaskManager.Models;
using System.Collections.Generic;
using System.Linq;

namespace TaskManager.Controllers
{
    public class ApiController : Controller
    {
        // Array/list to temporarily store data (replace when video on DB is received)
        static List<Task> DB;
        DataContext dbContext;

        // Constructor has the same name of the class and no return type
        public ApiController(DataContext db)
        {
            dbContext = db;
        }

        [HttpPost]
        public IActionResult SaveTask([FromBody] Task data)  // [FromBody] prompts Controller to look for data: element in the js
        {
            Console.WriteLine("SaveTask function called: " + data.Title);

            // save to database
            dbContext.Tasks.Add(data);
            dbContext.SaveChanges();

            // return the object back
            return Json(data);
        }

        [HttpGet]
        public IActionResult GetTasks()
        {
            var list = dbContext.Tasks.ToList();
            return Json(list);
        }

        [HttpDelete]
        public IActionResult DeleteTasks(int id) // Lack of [FromBody] tells Controller you sent the data in the URL
        {
            // find the task with the id
            Task t = dbContext.Tasks.Find(id);  // .First() requires namespace System.Linq.  One of the most useful namespaces
            if (t == null)
            {
                return NotFound();
            }

            // remove that task
            dbContext.Tasks.Remove(t);
            dbContext.SaveChanges();

            return Ok();
        }

        [HttpPatch]
        public IActionResult CompleteTask(int id)
        {
            // find the task
            Task t = dbContext.Tasks.Find(id);
            // change the status
            if (t == null)
            {
                return NotFound();
            }
            else if (t.Status == 1)
            {

                t.Status = 2;
                dbContext.SaveChanges();       // 2 = Done
            }
            else
            {
                t.Status = 1;
                dbContext.SaveChanges();
            }

            return Json(t);
        }
    }
}