const express = require('express');
const app = express();
const cors = require('cors');
const pool = require('./creds');


// middleware
app.use(cors());
app.use(express.json());

//get info from sql data base 
app.post('/get_tables', async (req, res) => {
    try {
        const { dayDate } = req.body;
        let sql = 'SELECT * FROM tableInfo WHERE tableID NOT IN (SELECT tableID FROM res_date WHERE resDATE = \''+ dayDate + '\');';
        const allRows = await pool.query(sql);
        res.json(allRows.rows);
    } catch (err) {
        console.log(err.message);
    }
});

app.post('/user_valid', async (req, res) => {
    try {
        const { username } = req.body;
        let sql = 'SELECT * FROM loginInfo WHERE username = \'' + username + '\';';
        const Row = await pool.query(sql);
        let x = false;
        if (Row.rows[0] == undefined) {
            x = true;
        }
        res.json(x);
    } catch (err) {
        console.log(err.message);
    }
});

app.post('/login_valid', async (req, res) => {
    try {
        const { username, password } = req.body;
        let sql = 'SELECT * FROM loginInfo WHERE username = \'' + username + '\' AND password = \'' + password + '\';';
        const Row = await pool.query(sql);
        let x = true;
        if (Row.rows[0] == undefined) {
            x = false;
        }
        res.json(x);
    } catch (err) {
        console.log(err.message);
    }
})
app.post('/get_user_info', async (req, res) => {
    try {
        const {username} = req.body;
        let sql = 'select userInfo.firstname, userInfo.lastname, userInfo.address, userInfo.city, userInfo.city, '+
        'userInfo.state, userInfo.phoneN from userInfo, loginInfo where userInfo.userID = loginInfo.userID AND loginInfo.username = \''+ username+ '\';';
        const allRows = await pool.query(sql);
        res.json(allRows.rows[0]);
    } catch (err) {
        console.log(err.message);
    }
});
app.post('/create_new_user', async (req, res) => {
    try {
        const { username, password, firstname, lastname,
            address, city, state, phoneN } = req.body;
        let sql = 'INSERT INTO loginInfo (username, password) VALUES (\'' + username + '\', \'' + password + '\');';
        let exc = await pool.query(sql);
        sql = 'INSERT INTO userInfo (firstname, lastname, address, city, state, phoneN) VALUES (\'' +
            firstname + '\', \'' + lastname + '\', \'' + address + '\', \'' + city + '\', \'' + state +
            '\', \'' + phoneN + '\');';
        exc = await pool.query(sql);
    } catch (err) {
        console.log(err.message);
    }
})
app.post('/special_day', async (req, res) => {
    try {
        const { dayDate } = req.body;
        let sql = 'SELECT * FROM holiday WHERE dayDate = \'' + dayDate + '\';';
        const Row = await pool.query(sql);
        let x = true;
        if (Row.rows[0] == undefined) {
            x = false;
        }
        res.json(x);
    } catch (err) {
        console.log(err.message);
    }
})
app.post('/reserve_table', async (req, res) => {
    try {
        const { tableID, resDATE } = req.body;
        let sql = 'INSERT INTO res_date (tableID, resDATE) VALUES (' + tableID + ', \'' + resDATE + '\');';
        let exc = await pool.query(sql);
    } catch (err) {
        console.log(err.message);
    }
})







































app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/contents/reservation.html'));
});
// set up the server listening at port 5000 (the port number can be changed)
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server has started on port ${port}`);
});