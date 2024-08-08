let currentUser = "";

fetch("/user/current")
    .then(res => res.json())
    .then(data => {
        currentUser = data;
        console.log(data)
        showOneUser(currentUser);
        document.getElementById("headUsername").innerText= currentUser.email;
        const roles = currentUser.roles.map(role => role.role.split('_')[1])
        document.getElementById("headRoles").innerText = roles.join(' ');
    })

function showOneUser(user) {
    let temp = "";
    const rol = user.roles.map(role => role.role.split('_')[1])
    temp += "<tr>"
    temp += "<td>" + user.id + "</td>"
    temp += "<td>" + user.username + "</td>"
    temp += "<td>" + user.lastName + "</td>"
    temp += "<td>" + user.age + "</td>"
    temp += "<td>" + user.email + "</td>"
    temp += "<td>" + rol.join(" ") + "</td>"
    temp += "</tr>"
    document.getElementById("oneUserBody").innerHTML = temp;
}