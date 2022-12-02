var is_login = false;
var user_name = "";
var user_add = "";
var user_city = "";
var user_state = "";
var user_p = "";

let current_tables = [];
var total_guest = 0;
var chairs_need = 0;
var chairs_res = 0;
var res_date = new Date();
let is_busy_day = false;
let points = 0;

function goto_reserve() {
    location.href = 'contents/reservation.html';
}

function cancel_req(x) {
    if (x == 1) {
        document.getElementById("reserve-table").style.display = "none";
        total_guest = 0;
        current_tables = [];
        chairs_res = 0;
    }
    if (x == 2) {
        document.getElementById("reserve-table").style.display = "block";
        document.getElementById("login-request").style.display = "none";
    }
    if (x == 3) {
        document.getElementById("reserve-table").style.display = "block";
        document.getElementById("info-request").style.display = "none";
    }
    if (x == 4) {
        location.href = '../index.html';
    }
}
function finish_req(x) {
    if (x == 1) {
        alert('$10 NO SHOW CHARGE');
        if (is_login) {
            document.getElementById("reserve-table").style.display = "none";
            document.getElementById("info-request").style.display = "block";
        }
        else {
            document.getElementById("reserve-table").style.display = "none";
            document.getElementById("login-request").style.display = "block";
        }
    }
    if (x == 2) {
        document.getElementById("login-request").style.display = "none";
        document.getElementById("account-page").style.display = "block";
    }
    if (x == 3) {
        document.getElementById("login-request").style.display = "none";
        document.getElementById("info-request").style.display = "block";
    }
}
function set_user_res() {
    total_guest = document.getElementById('total-guest').value;
    res_date = document.getElementById('date').value;
    if (total_guest == 0 || res_date == 0) {
        alert('FILL OUT TOTAL GUEST AND DATE');
    } else {
        chairs_need = total_guest;
        is_res_hightraffic();
        select_tables();
    }
}
//  display available tables -----------------------------------------------------------------------------------
let tables_table = []
const setTables = (data) => {
    tables_table = data;
}
const display_tables = () => {
    tables_table.sort((a, b) => {
        return a.key - b.key;
    });
    const dispTable = document.querySelector('#table-info');
    let tableHTML = "";
    tables_table.map(tables => {
        tableHTML +=
            `<tr key=${tables.tableid} id=\"table-${tables.tableid}\">
    <th>${tables.tableid}</th>
    <th>${tables.chairs}</th>
    <th><button type="button" class="res-button" id="table-res-button" onclick="choose_table(${tables.tableid}, ${tables.chairs})">RESERVE</button></th>
    </tr>`;
    })
    dispTable.innerHTML = tableHTML;
}

async function select_tables() {
    document.getElementById("reserve-table").style.display = "block";
    const inputID = document.querySelector('#total-guest').value;
    try {
        // GET all records from 
        body = { dayDate: res_date };
        const response = await fetch("http://localhost:5000/get_tables", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        const jsonData = await response.json();
        setTables(jsonData);
        display_tables();
    } catch (err) {
        console.log(err.message);
    }
}

async function is_res_hightraffic() {
    bod = { dayDate: res_date };
    const check_date = await fetch("http://localhost:5000/special_day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bod)
    });
    const x = await check_date.json();
    var cdate = new Date(res_date);
    if (cdate.getDay() == 6 || cdate.getDay() == 5 || cdate.getDay() == 4 || x) {
        alert('YOUR RESERVATION IS FOR A HIGH TRAFFIC DAY,\nAND ADDITIONAL CHARGE OF $7 WILL BE ADDED');
        is_busy_day = true;
    }
}

// reserve tables in the system/server -----------------------------------------------------------------------------------------------------------------------------------------------------------
function res_table() {
    if (chairs_need <= 0) {
        alert('$10 NO SHOW CHARGE');
        if (is_login) {

            document.getElementById("reserve-table").style.display = "none";
            document.getElementById("info-request").style.display = "block";
        }
        else {
            document.getElementById("reserve-table").style.display = "none";
            document.getElementById("login-request").style.display = "block";
        }
    } else {
        alert('NOT ENOUGH CHAIRS FOR ALL GUEST')
    }
}
function choose_table(id, totalC) {
    if (chairs_need <= 0) {
        alert('tables selected already cover all guest, proceed to submit')
    } else {
        chairs_need = chairs_need - totalC;
        chairs_res = chairs_res + totalC;
        current_tables.push(id);
        console.log(current_tables);
        console.log(chairs_need);
        document.getElementById("table-" + id).innerHTML =
            '<th>' + id + '</th>' +
            '<th>' + totalC + '</th>' +
            '<th><button type="button" class="res-button" id="canc-res-button" onclick="cancel_table(' + id + ', ' + totalC + ')">UNDO</button></th>';
    }
}
function cancel_table(id, totalC) {
    chairs_need = chairs_need + totalC;
    chairs_res = chairs_res - totalC;
    const index = current_tables.indexOf(id);
    if (index > -1) {
        current_tables.splice(index, 1);
    }
    console.log(current_tables);
    console.log(chairs_need);
    document.getElementById("table-" + id).innerHTML =
        '<th>' + id + '</th>' +
        '<th>' + totalC + '</th>' +
        '<th><button type="button" class="res-button" id="table-res-button" onclick="choose_table(' + id + ', ' + totalC + ')">RESERVE</button></th>';

    return 0;
}
async function is_user() {
    const username = document.querySelector('#input_user').value;
    const password = document.querySelector('#input_pass').value;
    bod = { username: username, password: password };
    const check_log = await fetch("http://localhost:5000/login_valid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bod)
    });
    let x = await check_log.json();
    if (x) {
        is_login = true;
        document.getElementById("login-request").style.display = "none";
        try {
            // GET all records from 
            body = { username: username };
            const get_info = await fetch("http://localhost:5000/get_user_info", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            let user_info = await get_info.json();
            user_name = user_info.firstname + " " + user_info.lastname;
            user_add = user_info.address;
            user_city = user_info.city;
            user_state = user_info.state;
            user_p = user_info.phonen;
            let name = document.getElementById('full-name');
            let address = document.getElementById('home-add');
            let city = document.getElementById('city');
            let state = document.getElementById('state');
            let phoneN = document.getElementById('phone');
            name.value = user_name;
            address.value = user_add;
            city.value = user_city;
            state.value = user_state;
            phoneN.value = user_p;
            document.getElementById("info-request").style.display = "block";
            //setTables(jsonData);
            //display_tables();
        } catch (err) {
            console.log(err.message);
        }

    } else {
        alert('IVALID LOGIN, TRY AGAIN')
    }
}
// get user info from server/system if logged in -------------------------------------------------------------------------------------------------------------------------------------------------
async function get_user_info() {
    // TODO: GET USERS INFOR AND EDIT #info-request html to show user's information before displaying 
    if (is_login) {
        document.getElementById("info-request").style.display = "block";
        let name = document.getElementById('full-name');
        let address = document.getElementById('home-add');
        let city = document.getElementById('city');
        let state = document.getElementById('state');
        let phoneN = document.getElementById('phone');
        if (
            name.value == 0 ||
            address.value == 0 ||
            city.value == 0 ||
            state.value == 0 ||
            phoneN.value == 0
        ) {
            alert('FILL OUT ALL FIELDS');
        } else {
            user_name = name.value;
            user_add = address.value;
            user_city = city.value;
            user_state = state.value;
            user_p = phoneN.value;
            finalize_res();
            document.getElementById("info-request").style.display = "none";
            document.getElementById("show-info").innerHTML =
                '<p1>' + user_name + ' we are happy to confirm your reservation for ' + res_date + '</p1><br>' +
                '<p2> We hope to see you all soon, your table for ' + chairs_res + ' will be ready then</p2><br>' +
                '<p3> This purchse has earned you ' + points + ' points.';
            document.getElementById("confirmation-page").style.display = "block";
        }
    } else {
        const name = document.querySelector('#full-name').value;
        const address = document.querySelector('#home-add').value;
        const city = document.querySelector('#city').value;
        const state = document.querySelector('#state').value;
        const phoneN = document.querySelector('#phone').value;
        if (
            name.length == 0 ||
            address.length == 0 ||
            city.length == 0 ||
            state.length == 0 ||
            phoneN.length == 0
        ) {
            alert('FILL OUT ALL FIELDS');
        } else {
            user_name = name;
            user_add = address;
            user_city = city;
            user_state = state;
            user_p = phoneN;
            finalize_res();
            document.getElementById("info-request").style.display = "none";
            let x = '<p1>' + user_name + ' we are happy to confirm your reservation for ' + res_date + '</p1><br>' +
                '<p2> We hope to see you all soon, your table for ' + total_guest + ' will be ready then</p2><br>';
            document.getElementById("show-info").innerHTML = x;
            document.getElementById("confirmation-page").style.display = "block";
        }
    }
}
// create an account for future login  --------------------------------------------------------------------------------------------
async function create_account() {
    const username = document.querySelector('#new-user').value;
    const password = document.querySelector('#new-pass').value;
    const firstname = document.querySelector('#new-first-name').value;
    const lastname = document.querySelector('#new-last-name').value;
    const address = document.querySelector('#new-home-add').value;
    const city = document.querySelector('#new-city').value;
    const state = document.querySelector('#new-state').value;
    const phoneN = document.querySelector('#new-phone').value;
    if (
        username.length == 0 ||
        password.length == 0 ||
        firstname.length == 0 ||
        lastname.length == 0 ||
        address.length == 0 ||
        city.length == 0 ||
        state.length == 0 ||
        phoneN.length == 0
    ) {
        alert('FILL OUT ALL FIELDS')
    } else {
        let x = await valid_username(username);
        if (x) {
            document.getElementById("account-page").style.display = "none";
            is_login = true;
            user_name = firstname + " " + lastname;
            user_add = address;
            user_city = city;
            user_state = state;
            user_p = phoneN;
            let name2 = document.getElementById('full-name');
            let address2 = document.getElementById('home-add');
            let city2 = document.getElementById('city');
            let state2 = document.getElementById('state');
            let phoneN2 = document.getElementById('phone');
            name2.value = user_name;
            address2.value = user_add;
            city2.value = user_city;
            state2.value = user_state;
            phoneN2.value = user_p;
            document.getElementById("info-request").style.display = "block";
            const body = {
                username: username, password: password, firstname: firstname, lastname: lastname,
                address: address, city: city, state: state, phoneN: phoneN
            };
            try {
                const make_user = await fetch("http://localhost:5000/create_new_user", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
                });
            } catch (error) {
                console.log(error.message);
            }
        } else {
            alert('USERNAME ALREADY TAKEN')
        }
    }
}
// check if username is already being used or not ------------------------------------------------------------------------------
async function valid_username(user) {
    bod = { username: user };
    const check_user = await fetch("http://localhost:5000/user_valid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bod)
    });
    return await check_user.json();
}
async function finalize_res() {
    if (is_login) {
        points = chairs_res * 5;
        if (is_busy_day) {
            points = points + 7;
        }
    }
    console.log(current_tables.length);
    for (let i = 0; i < current_tables.length; i++) {
        console.log(i);
        post_res(i);
    }
}
async function post_res(x){
    let body = { tableID: current_tables[x], resDATE: res_date };
        try {
            let reserve = await fetch("http://localhost:5000/reserve_table", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
        }
        catch (err) {
            console.log(err);
        }
        await reserve.json();
}
