class Task {
  constructor(title, desc, important, dueDate, alertText, location) {
    this.id = 0;
    this.title = title;
    this.description = desc;
    this.important = important;
    this.dueDate = dueDate;
    this.alertText = alertText;
    this.location = location;
    this.status = 1; // 1 = pending; 2= done

    this.user = "Todd";
  }
}
