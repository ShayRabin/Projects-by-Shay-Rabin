function login() {
    const obj = {
        userName: document.querySelector("#userName").value,
        password: document.querySelector("input[type=password]").value,
    };

    loader(true);

    // שליחה לשרת
    fetch("https://api.shipap.co.il/login", {
        method: 'POST',
        credentials: 'include', // מאפשר שליחה וקבלה של עוגיות
        headers: {
            'Content-Type': 'application/json' // הגדרת סוג התוכן הנשלח לשרת
        },
        body: JSON.stringify(obj), // תוכן הקריאה לשרת
    })
    // קבלה מהשרת
    // *המרת התוכן לפי הצורך*
    .then(res => res.json())
    // התוכן שהתקבל מהשרת (לאחר טיפול של הפונקציה הקודמת)
    .then(data => {
        if (data.status == 'success') {
            setUser(data.user);
            snackbar("You are connected. Welcome");
        } else {
            alert(data.message);
            loader(false);

        }
    });
}

// פונקציה הרצה בהפעלת האתר ובודקת האם היוזר מחובר
function loginStatus() {
    loader(true);

    fetch("https://api.shipap.co.il/login", {
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 'success') {
            setUser(data.user);
            snackbar("You are connected. Welcome");
        } else {
            setUser();
        }

        loader(false);
    });
}

// פונקציה הרצה בהתנתקות ובודקת האם היוזר התנתק בהצלחה

function logout() {
    loader(true);

    fetch("https://api.shipap.co.il/logout", {
        credentials: 'include',
    })
    .then(() => {
        setUser();
        snackbar("Good bye motek");
        loader(false);
    });
}

// פונקציה הרצה בהוספת מוצרים חדשים לרשימת הקניות

function getProducts() {
    loader(true);

    fetch("https://api.shipap.co.il/products", {
        credentials: 'include',
    })
    .then(res => res.json())
    .then(data => {
        document.querySelector(".products").style.display = "block";
        const tbody = document.querySelector(".products tbody");
        tbody.innerHTML = '';

        data.forEach((p, i) => {
            const tr = document.createElement("tr");

            tr.innerHTML = `
            <td>${i + 1}</td>
            <td contenteditable="true" oninput="contentChange(this)" class="name">${p.name}</td>
            <td contenteditable="true" oninput="contentChange(this)" class="price">${p.price}</td>
            <td contenteditable="true" oninput="contentChange(this)" class="discount">${p.discount}</td>
            <td>
                <button class="save" onclick="saveProduct(${p.id}, this)">💾</button>
                <button class="remove" onclick="removeProduct(${p.id}, this)">❌</button>
            </td>
        `;

            tbody.appendChild(tr);
        });

        loader(false);
    });
}

// שינויים ברשימה

function contentChange(tdElem) {
    tdElem.closest('tr').querySelector('.save').style.visibility = 'visible';
}

// שמירה

function saveProduct(id, btnElem) {
    const tr = btnElem.closest('tr');

    const obj = {
        name: tr.querySelector('.name').innerText,
        price: tr.querySelector('.price').innerText,
        discount: tr.querySelector('.discount').innerText,
    };

    loader(true);

    fetch(`https://api.shipap.co.il/products/${id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
    })
    .then(() => {
        tr.querySelector('.save').style.visibility = 'hidden';
        loader(false);
        snackbar("The product has been saved successfully");
    });
}

// הוספת מוצר

function addProduct() {
    const name = document.querySelector('#name');
    const price = document.querySelector('#price');
    const discount = document.querySelector('#discount');

    const obj = {
        name: name.value,
        price: +price.value,
        discount: +discount.value,
    };

    name.value = '';
    price.value = '';
    discount.value = '';

    loader(true);

    fetch("https://api.shipap.co.il/products", {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj),
    })
    .then(res => res.json())
    .then(data => {
        getProducts();
        snackbar("The product has been successfully added");
    });
}

// הורדת מוצר

function removeProduct(id, btnElem) {
    if (!confirm('Are you sure you want to remove this product?')) {
        return;
    }

    loader(true);

    fetch(`https://api.shipap.co.il/products/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    })
    .then(() => {
        btnElem.closest('tr').remove();
        const trs = document.querySelectorAll('tbody tr');
        trs.forEach((tr, i) => tr.querySelector('td').innerHTML = i + 1);
        loader(false);
        snackbar("The product has been successfully deleted");
    });
}

// פונקציה האחראית לשים את שם המשתמש בהודעה או לאפשר התחברות
function setUser(user = null) {
    const divLogin = document.querySelector(".login");
    const divUser = document.querySelector(".user");
    const divProduct = document.querySelector(".products");

    // אם יש יוזר, מציגה את שם היוזר ומסתירה את תיבת ההתחברות 
    if (user) {
        divLogin.style.display = 'none';
        divUser.style.display = 'block';
        divUser.querySelector('.userName').innerHTML = `${user.fullName} Connected!`;
        getProducts();
    } else {
        // אם אין יוזר, מציגה את תיבת ההתחברות
        divLogin.style.display = 'block';
        divUser.style.display = 'none';
        divProduct.style.display = 'none';
        loader(false);
    }
}

function loader(isShowing = false) {
    const loaderFrame = document.querySelector('.loaderFrame');

    if (isShowing) {
        loaderFrame.style.display = 'flex';
    } else {
        loaderFrame.style.display = 'none';
    }
}

function snackbar(message) {
    const elem = document.getElementById("snackbar");
    elem.innerHTML = message;
    elem.classList.add("show");
    setTimeout(() => elem.classList.remove("show"), 3000);
}