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

async function evSignIn(username, password,email) {
    const url = '../api-signIn.php';
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
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
            case "":
                //sends a positive feedback
                loadWaitScreen();
                getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0");
                break;
            default:
                writeInLoginError(json["error"]);
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

async function evLogout() {
    const url = '../api-logout.php';
    try {

        const response = await fetch(url);

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

async function evToggleLike(post_id,like_path){
    const url = `../api-togglelike.php?post_id=${post_id}`;
    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        switch (json["error"]) {
            case "":
                likenum = document.querySelector(like_path);
                switch (json["data"]) {
                    case "on":
                        likenum.innerText = Number(likenum.innerText) + 1; 
                        break;
                    case "off":
                        likenum.innerText = Number(likenum.innerText) - 1; 
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

async function evAddComment(comment_selector,post_id){
    //comment selector deve andare a prendere il testo del commento
    const testo = "commento di prova";
    const url = `../api-add-comment-post.php?post_id=${post_id}&text=${testo}`;
    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        switch (json["error"]) {
            case "":
                
                break;
            default:
                console.log(json["error"]);
                break;
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

async function evUpdateUser(username, email, bio = ""){
    const url = '../api-update-user-info.php';
    const formData = new FormData();
    formData.append('username', username);
    formData.append('bio', bio);
    formData.append('email', email);
    //si potrebbe aggiungere un controllo preventivo per i dati
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

            case "baddata":
                writeInLoginError("errore con i dati inseriti");
                break;
            case "":
                //sends a positive feedback
                loadWaitScreen();
                getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0");
                break;
            default:
                writeInLoginError(json["error"]);
                break;
        }
    } catch (error) {
        console.log(error.message);
    }
}


async function getUserPage(url){
    try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Response status: " + response.status);
            }

            const json = await response.json();

            let form = `<form action="#" method="POST">
                            <h2>Dati utenti</h2>
                            <p></p>
                            <ul>
                                <li>
                                    <label for="username">Username:</label><input type="text" id="username" name="username" />
                                </li>
                                <li>
                                    <label for="email">Email:</label><input type="text" id="email" name="email" />
                                </li>
                                <li>
                                    <label for="bio">Bio:</label><input type="text" id="bio" name="bio" />
                                </li>
                                <li>
                                    <input type="submit" name="submit" value="Invia" />
                                </li>
                            </ul>
                        </form>`;
            

            
            switch (json["error"]) {
                case "nologin":
                    generaLoginPage()
                    throw new Error("no login");
            
                default:
                    writeInPage(form);
                    document.querySelector("main form").addEventListener("submit", function (event) {
                        event.preventDefault();
                        const username = document.querySelector("#username").value;
                        const email = document.querySelector("#email").value;
                        const bio = document.querySelector("#bio").value;
                        evUpdateUser(username, email,bio);
                    });
                    break;
                            
            } 
    } catch (error) {
        console.log(error.message);
    }
}
async function getPostComments(url,posts_path) {
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
            doc += `<div class="card spotted-comment mb-3">
                                    <div class="card-body d-flex flex-column">
                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                            <span class="comment-user">anonimo</span>
                                            <span class="comment-time">2h fa</span>
                                        </div>
                                        <p class="comment-text mb-1">
                                            lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                        </p>
                                        <div class="d-flex justify-content-end">
                                            <button type="button" class="btn-like-sm">
                                                <i class="far fa-heart"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>`//qua ci va l'html dei commenti
        });
        
        document.querySelector(posts_path).innerHTML = doc;
        
    } catch (error) {
        console.log(error.message);
    }
}

async function getPostPage(url) {
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
                console.log(json["error"]);
                break;
        }
        
        doc = `<article class="container-fluid py-4 spotted-wrapper">
                        <div class="row-singolo justify-content-center">
                            <div class="col-lg-5 mb-4">
                                <div class="card spotted-post">
                                    <div class="card-body d-flex flex-column h-100">
                                        <div class="d-flex justify-content-between align-items-center mb-3 spotted-header">
                                            <span class="spotted-time">2h fa</span>
                                            <span class="btn-report" role="button">
                                                <i class="fa-regular fa-flag"></i>
                                            </span>
                                            <span role="button" class="btn-like like-post">
                                                <i class="far fa-heart "></i><span class="post-like-count">${json["data"][0]["like_count"]}</span>
                                            </span>
                                        </div>
                                        <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                                            <p class="spotted-text text-center m-0">
                                                ${json["data"][0]["testo"]}
                                            </p>
                                        </div>
                                        <div class="spotted-footer-buttons">
                                            <button type="button" class="btn btn-warning btn-respond">
                                                Respond
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-lg-5">
                            </div>
                        </div>
                    </article>`
        writeInPage(doc);
        document.querySelector("span.like-post").addEventListener("click",() => {
            evToggleLike(json["data"][0]["post_id"]," span.like-post > span ");
        });
        getPostComments(`../api-comments-of-post.php?post_id=${json["data"][0]["post_id"]}`,
            "#layoutSidenav_content > main > article > div > div:nth-child(2)");
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
            </div>`;  
            /*<button
                type="button"
                class="btn btn-warning rounded-circle fab-add"
            >
                +
            </button>*/                 
        });
        writeInPage(doc);
        for (let i = 0; i < json["data"].length; i++) {
            document.querySelector(`#layoutSidenav_content > main > div:nth-child(${i+1})`)
                .addEventListener("click",function(){
                    loadWaitScreen();
                    getPostPage(`../api-post-id.php?post_id=${json["data"][i]["post_id"]}`)
                });
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function getMyPostsPage(){

}


//costruisce una pagina senza bisogno di ricevere dati
async function generaLoginPage() {
    // Utente NON loggato
    let form = `<div class="login-card">
                    <h3 class="mb-3 text-center">Accedi</h3>
                    <form action="#" method="POST">
                        <div class="mb-3">
                        <label for="username" class="form-label">Username</label>
                        <input
                            type="text"
                            class="form-control"
                            id="username"
                            placeholder="Inserisci l'username"
                            required
                        />
                        </div>
                        <div class="mb-3">
                        <label for="password" class="form-label">Password</label>
                        <input
                            type="password"
                            class="form-control"
                            id="password"
                            placeholder="Inserisci la password"
                            required
                        />
                        </div>
                        <!-- <div class="mb-3 form-check">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            id="remember"
                        />
                        <label class="form-check-label" for="remember">Ricordami</label>
                        </div> -->
                        <button type="submit" name="submit" value="Invia"class="btn btn-primary w-100">
                        Accedi
                        </button>
                    </form>
                </div>`;
    writeInPage(form);
    // Gestisco tentativo di login
    document.querySelector("main form").addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        evLogin(username, password);
    });
    document.querySelector("main button").addEventListener("click",generaSignInPage);
}

async function generaSignInPage() {
    // Utente NON loggato
    let form =`<div class="login-card">
        <h3 class="mb-3 text-center">Registrazione</h3>
        <form action="#" method="POST">
            <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input
                type="text"
                class="form-control"
                id="username"
                placeholder="Inserisci l'username"
                required
            />
            </div>
            <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input
                            type="text"
                            class="form-control"
                            id="email"
                            placeholder="Inserisci l'email"
                            required
                        />

                        </div>
            <div class="mb-3">
            <label for="password" class="form-label">Password</label>
            <input
                type="password"
                class="form-control"
                id="password"
                placeholder="Inserisci la password"
                required
            />
            </div>
            <!-- <div class="mb-3 form-check">
            <input
                type="checkbox"
                class="form-check-input"
                id="remember"
            />
            <label class="form-check-label" for="remember">Ricordami</label>
            </div> -->
            <button type="submit" name="submit" value="Invia" class="btn btn-primary w-100">
            Registrati
            </button>
        </form>
    </div>`;
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

//get Dashboard
document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:nth-child(1)")
    .addEventListener("click",function(){
    loadWaitScreen();
    getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0");
});
//get settings
document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:nth-child(3)")
    .addEventListener("click",function(){
    loadWaitScreen();
    getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0");
});
//get feed
document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:nth-child(3)")
    .addEventListener("click",function(){
    loadWaitScreen();
    getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0");
});

//logout
document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:nth-child(4)")
    .addEventListener("click",function(){
    evLogout();
    generaLoginPage();
});

getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0");


