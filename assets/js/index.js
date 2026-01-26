/* 
Abbiamo 3 tipologie di funzioni:
    - genera
    - get
    - Ev
    - le restanti

    genera:
    genera un elemento da mettere nel dom senza necessità di chiamare il server

    get:
    genera un elemento da mettere nel dom richiedendo prima dati al server

    Ev:
    è un evento che è stato collegato a qualche elemento messo nel dom, da una funzione get o genera
*/

function loadWaitScreen(){
    //
}
function writeInPage(content){
   document.querySelector("main").innerHTML = content; 
} 
function writeInLoginError(error) {
    document.querySelector("form > p").innerText = error;
}

async function evSignIn(username, password) {
    const url = '../api-signIn.php';
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    try {
        const response = await fetch(url, {
            method: "POST",                   
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        switch (json["error"]) {
            case "missingdata":
                writeInLoginError("devi completare tutti i campi");
                break;
            
            case "userexists":
                writeInLoginError("nome utente gia in uso");
                break;

            case "baddata":
                writeInLoginError("errore con i dati inseriti");
                break;
            default:
                //sends a positive feedback
                loadWaitScreen();
                getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0");
                break;
        }


    } catch (error) {
        console.log(error.message);
    }
}

async function evLogin(username, password) {
    const url = '../api-login.php';
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    try {

        const response = await fetch(url, {
            method: "POST",                   
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();

        switch (json["error"]) {
            case "":
                loadWaitScreen();
                getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0");
                break;
            case "dataerror":
                writeInLoginError("password e/o username invalidi");
                break;
            case "missingdata":
                writeInLoginError("inserire sia la password che l'utente");
                break;
            default:
                break;
        }
        
    } catch (error) {
        console.log(error.message);
    }
}


async function getPostsPage(url) {
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Response status: " + response.status);
        }

        const json = await response.json();

        let doc = "";

        switch (json["error"]) {
            case "nologin":
                generaLoginPage()
                throw new Error("no login");
        
            default:
                break;
        }
        
        json["data"].forEach(element => {
            doc += `
            <div class="container-fluid py-4">
                <div class="row g-4 card-row">
                    <div class="col-6 col-lg-3">
                        <div class="card shadow-sm h-100 custom-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <small class="card-time"><span>•</span> 2h fa</small>
                                    <button type="button" class="btn btn-icon card-icon">
                                        <i class="far fa-heart"></i>
                                    </button>
                                </div>
                                <div>
                                    <div class="mt-2 card-text">
                                        <p>${element.testo}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <button
                type="button"
                class="btn btn-warning rounded-circle fab-add"
            >
                +
            </button> `;                    
        });
        writeInPage(doc);
    } catch (error) {
        console.log(error.message);
    }
}

//costruisce una pagina senza bisogno di ricevere dati
async function generaLoginPage() {
    // Utente NON loggato
    let form = `<form action="#" method="POST">
        <h2>Login</h2>
        <p></p>
        <ul>
            <li>
                <label for="username">Username:</label><input type="text" id="username" name="username" />
            </li>
            <li>
                <label for="password">Password:</label><input type="password" id="password" name="password" />
            </li>
            <li>
                <input type="submit" name="submit" value="Invia" />
            </li>
        </ul>
    </form>`;
    writeInPage(form);
    // Gestisco tentativo di login
    document.querySelector("main form").addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        evLogin(username, password);
    });
}

async function generaSignInPage() {
    // Utente NON loggato
    let form = `<form action="#" method="POST">
        <h2>Registrazione</h2>
        <p></p>
        <ul>
            <li>
                <label for="username">Username:</label><input type="text" id="username" name="username" />
            </li>
            <li>
                <label for="password">Password:</label><input type="password" id="password" name="password" />
            </li>
            <li>
                <input type="submit" name="submit" value="Invia" />
            </li>
        </ul>
    </form>`;
    writeInPage(form);
    // Gestisco tentativo di login
    document.querySelector("main form").addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        evSignIn(username, password);
    });
}


document.querySelector("main button")
    .addEventListener("click",function(){
        loadWaitScreen();
        getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0");
    });

/* document.querySelector("main button")
    .addEventListener("click",function(){
        loadWaitScreen();
        generaSignInPage();
    }); */
        

/* document.querySelector("main button").addEventListener("click", function(e){
    getData("../api-comments-of-post.php?post_id=1&order=DESC");
}); */

/* const url = `../api-post.php?limit=5&offset=0&order=asc&filter=date&id=0`;
    const url = "../api-comments-of-post.php?post_id=1&order=DESC" */

