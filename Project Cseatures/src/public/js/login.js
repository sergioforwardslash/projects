const l_name = document.getElementById('l_name');
const l_password = document.getElementById('l_password');

const loginBtn = document.getElementById('login');

async function login() {
  const res = await document.queryDatabase(`
    SELECT * FROM account
      WHERE Name = '${l_name.value}' AND Password = '${l_password.value}'
    LIMIT 1;
  `);

  if (res && res.length) {
    const userObject = {
      Name: res[0].Name,
      UserId: res[0].UserId
    };

    sessionStorage.setItem('user', JSON.stringify(userObject));
    window.location = 'index.html';
  } else {
    alert('Invalid Login!');
  }
}

loginBtn.addEventListener('click', login);
