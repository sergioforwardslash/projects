const l_name = document.getElementById('l_name');
const l_password = document.getElementById('l_password');

const createLoginBtn = document.getElementById('createLogin');

async function registerUser() {
  const userName = l_name.value;
  const password = l_password.value;

  const registerResponse = await document.queryDatabase(`
    INSERT INTO account (Name, Password)
      VALUES ('${userName}', '${password}');
  `);

  if (registerResponse.errno) {
    alert('User with that Username already Exists!');
  } else {
    //get new created account including db id
    const getIdResponse = await document.queryDatabase(`
      SELECT * FROM account
        WHERE Name = '${userName}' AND Password = '${password}'
      LIMIT 1;
    `);

    const userObject = {
      Name: getIdResponse[0].Name,
      UserId: getIdResponse[0].UserId
    };

    sessionStorage.setItem('user', JSON.stringify(userObject));
    window.location = 'index.html';
  }
}

createLoginBtn.addEventListener('click', registerUser);
