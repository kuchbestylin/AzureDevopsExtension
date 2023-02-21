const crypto = require('crypto');

function hashEmailAndPassword(email, password) {
  const emailAndPassword = email + password;
  const hashedEmailAndPassword = crypto.createHash('sha256').update(emailAndPassword).digest('hex');
  return { hash: hashedEmailAndPassword };
}

function unhashEmailAndPassword(hashedObject) {
  const hashedEmailAndPassword = hashedObject.hash;
  const unhashedEmailAndPassword = crypto.createHash('sha256').update(hashedEmailAndPassword, 'hex').digest('utf8');
  const email = unhashedEmailAndPassword.substring(0, unhashedEmailAndPassword.length - 8);
  const password = unhashedEmailAndPassword.substring(unhashedEmailAndPassword.length - 8);
  return { email, password };
}

function getTableData(scope) {
    var emailaddr = VSS.getWebContext().user.email;
    $.get("https://adextensionapi.azurewebsites.net/api/ChangeLogs?email=" + emailaddr, function (data) {
      var table = document.getElementById("table-body");
      table.innerHTML = "";
      data.forEach(d => {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        th.setAttribute("scope", "row")
        th.innerHTML = ++scope;
        tr.append(th)
        var tdType = document.createElement("td");
        tdType.innerHTML = d.itemType.value;
        tr.append(tdType);
        var tdTitle = document.createElement("td");
        tdTitle.innerHTML = d.project.name;
        tr.append(tdTitle);

        var tdActive = document.createElement("td");
        var div = document.createElement("div");
        div.classList = ["form-check form-switch"];
        var input = document.createElement("input");
        input.className = "form-check-input";
        input.setAttribute("type", "checkbox");
        input.setAttribute("role", "switch");
        input.setAttribute("id", "flexSwitchCheckDefault");
        if (d.endDateTime == null) {
          input.setAttribute("checked", "true");
        }
        var label = document.createElement("label");
        label.className = "form-check-label";
        label.setAttribute("for", "flexSwitchCheckDefault");
        div.append(input);
        div.append(label);
        tdActive.append(div);
        tr.append(tdActive);
        var tdSDate = document.createElement("td");
        var dt = new Date(d.startDateTime);
        var s = new String(dt.toUTCString());
        tdSDate.innerHTML = s.substring(0, 22);
        tr.append(tdSDate);
        var datenow = new Date();
        var difference = datenow.getTime() - dt.getTime();
        var duration = Math.round(difference / 60000);
        var tdDuration = document.createElement("td");
        tdDuration.innerHTML = duration + "mins";
        tr.append(tdDuration);
        var tdDescription = document.createElement("td");
        tdDescription.innerHTML = d.summary;
        tr.append(tdDescription);
        $("#table-body").append(tr);
      });
    });
  }
