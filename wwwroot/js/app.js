var isImportant = false;
var detailsVisible = true;
var serverURL = "http://fsdi.azurewebsites.net/api";

function toggleImportant() {
  if (isImportant) {
    $("#imp-star").removeClass("fas").addClass("far");
    isImportant = false;
  } else {
    $("#imp-star").removeClass("far").addClass("fas");
    isImportant = true;
  }
}

function saveTask() {
  // get the values from controls
  let title = $("#txtTitle").val();
  let desc = $("#txtDesc").val();
  let date = $("#dateDue").val();
  let alert = parseInt($("#selAlert").val() || 0);
  let location = $("#txtLocation").val();

  if (!title) {
    //    $("#title-error").removeClass("hide");
    $("#details").removeClass("short-details");
    $("#title-error").slideDown("slow");

    setTimeout(function () {
      //      $("#title-error").addClass("hide");
      $("#title-error").slideUp("slow", function () {
        $("#details").addClass("short-details");
      });
    }, 3000);
    return;
  } else if (!date) {
    $("#details").removeClass("short-details");
    $("#date-error").slideDown("slow");

    setTimeout(function () {
      $("#date-error").slideUp("slow", function () {
        $("#details").addClass("short-details");
      });
    }, 3000);
    return;
  }

  // create an object
  let aTask = new Task(title, desc, isImportant, date, alert, location);

  // console log the object
  console.log(aTask);
  console.log(JSON.stringify(aTask));
  // send task to server
  $.ajax({
    url: "/api/SaveTask", // '/tasks' is endpoint of server
    type: "POST",
    data: JSON.stringify(aTask),
    contentType: "application/json",
    success: function (res) {
      console.log(`Server says`, res);
      displayTask(res);
      $("#details").removeClass("short-details").addClass("tall-details");
      $("#success-save").slideDown("slow");

      setTimeout(function () {
        //      $("#title-error").addClass("hide");
        $("#success-save").slideUp("slow", function () {
          $("#details").removeClass("tall-details").addClass("short-details");
        });
      }, 3000);
    },
    error: function (error) {
      console.error(`Error saving: ${error}`);
      $("#details").addClass("tall-details");
      $("#error-save").slideDown("slow");

      setTimeout(function () {
        //      $("#title-error").addClass("hide");
        $("#error-save").slideUp("slow", function () {
          $("#details").removeClass("tall-details");
        });
      }, 3000);
    },
  });

  clear();
}

function clear() {
  $("#txtTitle").val("");
  $("#txtDesc").val("");
  $("#dateDue").val("");
  $("#selAlert").val(1);
  $("#txtLocation").val("");
  if (isImportant) {
    $("#imp-star").removeClass("fas").addClass("far");
    isImportant = false;
  }
}

function displayTask(task) {
  let alert = "";
  switch (task.alertText) {
    case 1:
      alert = "Don't forget to:";
      break;
    case 2:
      alert = "Stop:";
      break;
    case 3:
      alert = "Start:";
      break;
    case 4:
      alert = "Get more coffee and then:";
      break;
  }
  let syntax = `
    <div class="displayed-task" id="task${task.id}">
      <div class="task-header">`;
  if (task.important === true) {
    syntax += `<i class="fas fa-star important"></i>
    <alert class="important"><strong>${alert}</strong> ${task.title}</alert>`;
  } else {
    syntax += `
    <alert><strong>${alert}</strong> ${task.title}</alert>`;
  }
  syntax += `
        <span class="del-btn-cont">
          <button class="btn btn-dark btn-sm" onclick="delTask(${task.id})"><i class="far fa-trash-alt"></i></button>
        </span>
      </div>
      <div class="task-detail">
        ${task.description}
      </div>
      <div class="task-location">
        ${task.location}
      </div>
      <div class="due-date">
        ${task.dueDate}
      </div>
      <div class="del-btn-cont">
        <button class="btn btn-dark btn-sm " onClick="completeTask(${task.id})"><i class="far fa-check-square"></i></button>
      </div>
      `;
  if (task.status === 1) {
    $("#tasksContainer").append(syntax);
  } else {
    $("#completed-list").append(syntax);
  }
  // put actual task display here.  Divide task display into divs?
}

function completeTask(id) {
  console.log(`Completing task ${id}`);

  $.ajax({
    url: "/api/CompleteTask/" + id, // '/DeleteTasks' is endpoint of server
    type: "PATCH", // When modifying a piece of an existing object on server
    success: function (task) {
      $(`#task${id}`).remove();
      if (task.status === 1) {
        $(`#task${id}`).addClass("completed-tasks");
      } else {
        $(`#task${id}`).removeClass("completed-tasks");
      }
      displayTask(task);
    },
    error: function (error) {
      console.error(`Error completing task: ${error}`);
    },
  });
}

function delTask(id) {
  console.log(`deleting task ${id}`);
  $.ajax({
    url: "/api/DeleteTasks/" + id, // '/DeleteTasks' is endpoint of server
    type: "DELETE",
    success: function () {
      console.log(`Task ${id} removed from server`);
      $(`#task${id}`).remove();
    },
    error: function (error) {
      console.error(`Error removing task:`, error);
    },
  });
}

function retrieveTasks() {
  $.ajax({
    url: "/api/GetTasks",
    type: "GET",
    success: function (list) {
      console.log("retrieve", list);

      for (let i = 0; i < list.length; i++) {
        let task = list[i];

        if (task.user === "Todd") {
          displayTask(task);
        }
      }
    },
    error: function (err) {
      console.error("Error!", err);
    },
  });
}

function init() {
  //$("#title-error").hide();
  //load data
  retrieveTasks();
  //hook events
  $("#imp-star").click(toggleImportant);
  $("#details-btn").click(function () {
    $("#details").toggle();
  });
  $("#save-btn").click(saveTask);
}

window.onload = init;

function testRequest() {
  // uses jQuery AJAX created by MS around 2002-2005.  Asyncrhonous JavaScript in XML.  Parameter is object literal/configuration object
  $.ajax({
    url: "https://restclass.azurewebsites.net/api/test",
    type: "GET",
    success: function (response) {
      console.log(`Success!  :D  Server responded with ${response}.`);
    },
    error: function (errorDetails) {
      console.error(`Error.  :(  Server responded with ${errorDetails}`);
    },
  });
}
