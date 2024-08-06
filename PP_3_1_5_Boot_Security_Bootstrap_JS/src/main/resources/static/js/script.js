const BASE_URL = 'http://localhost:8080/api'

const modalEditUser = document.getElementById('edit-user-modal')
const modalDeleteUser = document.getElementById('delete-user-modal')

const deleteUserForm = document.getElementById('delete-user-form');
const editUserForm = document.getElementById('edit-user-form');
const addNewUserForm = document.getElementById('add-new-user-form')

refreshTable()

async function refreshTable() {
    fetch(BASE_URL + '/users')
        .then(response => response.json())
        .then(data => {
            fillTableWithData(data);
        })
        .catch(error => {
            console.error('Произошла ошибка:', error);
        });
}

function fillTableWithData(data) {
    const table = document.getElementById("userTable")
    const tbody = table.querySelector("tbody");

    tbody.innerHTML = ''

    data.forEach(users => {
        const row = tbody.insertRow();

        row.insertCell().textContent = users.id;
        row.insertCell().textContent = users.username;
        row.insertCell().textContent = users.lastName;
        row.insertCell().textContent = users.age;
        row.insertCell().textContent = users.email;

        const roles = users.roles.map(role => role.role.split('_')[1])
        row.insertCell().textContent = roles.join(' ');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.classList.add('btn')
        editButton.classList.add('btn-info')
        editButton.addEventListener('click', event => {
            showEditForm(event);
        });
        row.insertCell().appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('btn')
        deleteButton.classList.add('btn-danger')
        deleteButton.addEventListener('click', event => {
            showDeleteForm(event);
        });
        row.insertCell().appendChild(deleteButton);
    });
}

function showDeleteForm(event) {
    let modal = new bootstrap.Modal(modalDeleteUser);
    const button = event.currentTarget
    const tableRow = button.parentNode.parentNode;

    const userId = document.getElementById('delete-user-id')
    const userName = document.getElementById('delete-user-firstname')
    const userLastName = document.getElementById('delete-user-lastname')
    const userAge = document.getElementById('delete-user-age')
    const userEmail = document.getElementById('delete-user-email')

    userId.value = tableRow.querySelector('td:nth-child(1)').textContent;
    userName.value = tableRow.querySelector('td:nth-child(2)').textContent;
    userLastName.value = tableRow.querySelector('td:nth-child(3)').textContent;
    userAge.value = tableRow.querySelector('td:nth-child(4)').textContent;
    userEmail.value = tableRow.querySelector('td:nth-child(5)').textContent;
    modal.show()
}

function showEditForm(event) {
    let modal = new bootstrap.Modal(modalEditUser);
    const button = event.currentTarget
    const tableRow = button.parentNode.parentNode;

    const userId = document.getElementById('edited-user-id')
    const userName = document.getElementById('edited-user-firstname')
    const userLastname = document.getElementById('edited-user-lastname')
    const userAge = document.getElementById('edited-user-age')
    const userEmail = document.getElementById('edited-user-email')
    const userPassword = document.getElementById('edited-user-password')

    userId.value = tableRow.querySelector('td:nth-child(1)').textContent;
    userName.value = tableRow.querySelector('td:nth-child(2)').textContent;
    userLastname.value = tableRow.querySelector('td:nth-child(3)').textContent;
    userAge.value = tableRow.querySelector('td:nth-child(4)').textContent;
    userEmail.value = tableRow.querySelector('td:nth-child(5)').textContent;
    userPassword.value = tableRow.querySelector('td:nth-child(6)').textContent;
    modal.show()
}

deleteUserForm.addEventListener('submit', event => {
    event.preventDefault();

    const userId = document.getElementById('delete-user-id').value
    const URL = BASE_URL + '/users/' + userId;

    fetch(URL, {method: 'DELETE', credentials: 'include'})
        .then(response => {
            if (response.ok) {
                console.log('Запрос на удаление успешно выполнен');
                refreshTable()
            } else {
                console.log('Произошла ошибка при выполнении запроса удаления');
            }
        })
        .catch(error => {
            console.log('Ошибка при удалении пользователя', error)
        })

    let modal = bootstrap.Modal.getInstance(modalDeleteUser);
    modal.hide()
});

editUserForm.addEventListener('submit', event => {
    event.preventDefault();

    const email = document.getElementById('edited-user-email').value;
    const userData = {
        id: document.getElementById('edited-user-id').value,
        username: document.getElementById('edited-user-firstname').value,
        lastName: document.getElementById('edited-user-lastname').value,
        age: document.getElementById('edited-user-age').value,
        email: email,
        password: document.getElementById('edited-user-password').value,
        roles: Array.from(document.getElementById('role-select-edit-user').selectedOptions)
            .map(option => ({
                id: option.value,
                name: 'ROLE_' + option.text
            }))
    }

    const options = {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(userData)
    }

    const URL = BASE_URL + '/users';

    fetch(URL, options)
        .then(response => {
            if (response.ok) {
                console.log('Запрос на редактирование юзера успешно отправлен')
                refreshTable()
            } else {
                response.json().then(json => {
                    console.log('Произошла ошибка при редактировании юзера')
                    console.log('Полученный json', json)
                    json.errors.forEach(errorMsg => {
                        console.log('Выводим ошибку про ' + errorMsg)
                    })
                })
            }
        })
        .catch(error => {
            console.log('Ошибка при создании нового пользователя', error)
        })

    let modal = bootstrap.Modal.getInstance(modalEditUser);
    modal.hide()
});

addNewUserForm.addEventListener('submit', event => {
    event.preventDefault();

    const email = document.getElementById('new-user-email').value;
    const userData = {
        email: email,
        password: document.getElementById('new-user-password').value,
        username: document.getElementById('new-user-firstname').value,
        lastName: document.getElementById('new-user-lastname').value,
        age: document.getElementById('new-user-age').value,
        roles: Array.from(document.getElementById("role-select").selectedOptions)
            .map(option => ({
                id: option.value,
                name: 'ROLE_' + option.text
            }))
    }

    const options = {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(userData)
    }

    const URL = BASE_URL + '/users';
    console.log('POST запрос на URL ', URL)

    fetch(URL, options)
        .then(response => {
            if (response.ok) {
                console.log('Запрос на добавление юзера успешно отправлен')
                refreshTable()
                const tabUserList = document.getElementById('tab-users-list')
                tabUserList.click()
            } else {
                response.json().then(json => {
                    console.log('Произошла ошибка при добавлении юзера')
                    console.log('Полученный json', json)
                    json.errors.forEach(errorMsg => {
                        console.log('Выводим ошибку про ' + errorMsg)
                    })
                })
            }
        })
        .catch(error => {
            console.log('Ошибка при создании нового пользователя', error)
        })
});
