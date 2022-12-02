const index = require('./index')

test('username user should return false, since it is a usernmame of an account already', async () => {
    bod = { username: 'user' };
    const check_user = await fetch("http://localhost:5000/user_valid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bod)
    });
    let x = await check_user.json();
    expect(x).toBe(false);
})

test('unused username should return true, since it is not a usernmame of an account', async () => {
    bod = { username: 'username_notbeing_used' };
    const check_user = await fetch("http://localhost:5000/user_valid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bod)
    });
    let x = await check_user.json();
    expect(x).toBe(true);
})

test('user and pass are loging credentials for an account, should return true to allow user to login', async () => {
    bod = { username: 'user', password: 'pass' };
    const check_log = await fetch("http://localhost:5000/login_valid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bod)
    });
    let x = await check_log.json();
    expect(x).toBe(true);
})

test('invalid user credentials loging an account, should return false to not allow user to login', async () => {
    bod = { username: 'not_a_user', password: 'not_a_pass' };
    const check_log = await fetch("http://localhost:5000/login_valid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bod)
    });
    let x = await check_log.json();
    
})

test('New Year is a holiday/special day, so this should return true', async () => {
    bod = { dayDate: '2023-01-01' };
    const check_date = await fetch("http://localhost:5000/special_day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bod)
    });
    const x = await check_date.json();
    expect(x).toBe(true);
})
