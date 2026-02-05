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

function setState(blocked,inspected){
    if(blocked == 1){
        return "red";
    } else if(inspected == 0) {
        return "yellow";
    }
}
function timeAgo(dateTimeString) {
    const past = new Date(dateTimeString);
    const now  = new Date();

    const diffMs = now - past; // milliseconds
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
}

async function writeInPage(content){
   document.querySelector("main").innerHTML = content; 
   
} 
function writeInLoginError(error) {
    document.querySelector("#layoutSidenav_content > main > div > div > form > p").innerText = error;
}

async function evNewPost(text){
    try {
        const response = await fetch(`../api-add-post.php?text=${text}`);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        switch (json["error"]) {
            case "":
                getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0","main");
                break;
            default:
                console.log(json["error"]);
                break;
        }
    
    }   catch (error) {
    console.log(error.message);
    }
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
            
            case "username_exists":
                writeInLoginError("nome utente gia in uso");
                break;

            case "baddata":
                writeInLoginError("errore con i dati inseriti");
                break;
            case "":
                //sends a positive feedback
                loadWaitScreen();
                getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0","main");
                break;
            default:
                writeInLoginError(json["error"]);
                break;
        }
    } catch (error) {
        console.log(error.message);
    }
}

async function evIsAdminLoggedIn(){
    try {
         const response = await fetch("../api-get-user.php");

        if (!response.ok) {
            throw new Error("Response status: " + response.status);
        }

    const json = await response.json(); 
    if(json["data"]["s_power_user"] == 1){
        document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:last-child")
            .hidden = false;         
    } else {document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:last-child")
            .hidden = true;   }
    } catch (error) {
        console.log(json["error"]);
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
                document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:last-child")
                    .hidden = false;
                
                loadWaitScreen();
                getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0","main");
                break;
            case "dataerror":
                writeInLoginError("password e/o username invalidi");
                break;
            case "missingdata":
                writeInLoginError("inserire sia la password che l'utente");
                break;
            case "err":
                writeInLoginError("i dati inseriti non corrispondono");
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
                getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0","main");
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

async function evToggleReport(post_id){
    try {

        const response = await fetch(`../api-toggle-report.php?post_id=${post_id}`);

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

async function evToggleLike(url,like_path){
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

async function evBlockPost(post_id){
    //comment selector deve andare a prendere il testo del commento
    const url = `../api-add-comment-post.php?post_id=${post_id}&text=${testo}`;
    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        switch (json["error"]) {
            case "":
                doc = `<div class="card spotted-comment mb-3">
                                    <div class="card-body d-flex flex-column">
                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                            <span class="comment-user">${json["data"][0].username}</span>
                                            <span class="comment-time">${timeAgo(json["data"][0].data_creazione)}</span>
                                        </div>
                                        <p class="comment-text mb-1">
                                            ${json["data"][0].contenuto}
                                        </p>
                                        <div class="d-flex justify-content-end">
                                            <button type="button" class="btn-like-sm">
                                                <i class="far fa-heart" id= heart></i><span class="post-like-count">${json["data"][0].like_count}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>`
                document.querySelector(comment_space_selector).innerHTML =
                    `${doc} ${document.querySelector(comment_space_selector).innerHTML}`;

                document.querySelector(`${comment_space_selector} > div:nth-child(1) div > div.d-flex.justify-content-end > button`)
                .addEventListener("click",function(){
                    evToggleLike(`../api-togglelike.php?comment_id=${json["data"][0]["comment_id"]}`,
                        `${comment_space_selector} > div:nth-child(1) div > div.d-flex.justify-content-end > button > span`);
                });
                /* const heart = document.getElementById('heart');

                heart.addEventListener('click', () => {
                    heart.classList.toggle('fas');
                    heart.classList.toggle('far');

                    // Animazione
                    heart.classList.add('animate');
                    setTimeout(() => heart.classList.remove('animate'), 300);
                }); */

                
                break;
            default:
                console.log(json["error"]);
                break;
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

async function evAddComment(comment_space_selector,post_id,testo){
    //comment selector deve andare a prendere il testo del commento
    const url = `../api-add-comment-post.php?post_id=${post_id}&text=${testo}`;
    try {

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        const json = await response.json();
        switch (json["error"]) {
            case "":
                doc = `<div class="card spotted-comment mb-3">
                                    <div class="card-body d-flex flex-column">
                                        <div class="d-flex justify-content-between align-items-center mb-1">
                                            <span class="comment-user">${json["data"][0].username}</span>
                                            <span class="comment-time">${timeAgo(json["data"][0].data_creazione)}</span>
                                        </div>
                                        <p class="comment-text mb-1">
                                            ${json["data"][0].contenuto}
                                        </p>
                                        <div class="d-flex justify-content-end">
                                            <button type="button" class="btn-like-sm">
                                                <i class="far fa-heart"></i><span class="post-like-count">${json["data"][0].like_count}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>`
                document.querySelector(comment_space_selector).innerHTML =
                    `${doc} ${document.querySelector(comment_space_selector).innerHTML}`;

                document.querySelector(`${comment_space_selector} > div:nth-child(1) div > div.d-flex.justify-content-end > button`)
                .addEventListener("click",function(){
                    evToggleLike(`../api-togglelike.php?comment_id=${json["data"][0]["comment_id"]}`,
                        `${comment_space_selector} > div:nth-child(1) div > div.d-flex.justify-content-end > button > span`);
                });
                
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
                getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0","main");
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

            let form = `
                <div class="container-fluid px-4 pt-5">
                    <div class="rounded-4 shadow-sm p-4 mb-4 position-relative profile-card">
                        <div class="d-flex flex-column align-items-center text-center">

                            <div class="position-relative mb-2">
                                <i class="fa-solid fa-circle-user profile-avatar"></i>
                                <span class="online-badge position-absolute"></span>
                            </div>

                            <div class="mb-3">
                                <button id="editBtn" class="btn btn-sm">
                                    Modifica profilo
                                </button>
                                <button id="cancelBtn" class="btn btn-outline-secondary btn-sm d-none">
                                    Annulla
                                </button>
                                <button id="theme-toggle" style="position: fixed; top: 60px; right: 20px; padding: 0.5rem 1rem; cursor: pointer;">
                            🌙 Dark Mode
                            </button>
                            </div>

                            <form id="profileForm" class="w-100" style="max-width: 350px;">
                                <div class="mb-3 text-start">
                                    <label class="form-label">Nome utente</label>
                                    <input id="username" type="text"
                                        class="form-control editable"
                                        value="${json.data.username}"
                                        disabled>
                                </div>

                                <div class="mb-3 text-start">
                                    <label class="form-label">Email</label>
                                    <input id="email" type="email"
                                        class="form-control editable"
                                        value="${json.data.email}"
                                        disabled>
                                </div>

                                <div class="mb-3 text-start">
                                    <label class="form-label">Bio</label>
                                    <textarea id="bio"
                                        class="form-control editable auto-resize"
                                        rows="1"
                                        disabled>${json.data.bio}</textarea>
                                </div>

                                <button id="saveBtn"
                                    type="submit"
                                    class="btn  w-100 d-none">
                                    Salva modifiche
                                </button>
                            </form>

                        </div>
                    </div>

                    <div class="row g-4 card-row"></div>
                </div>
                `;

            
            switch (json["error"]) {
                case "nologin":
                    generaLoginPage()
                    throw new Error("no login");
            
                default:
                    writeInPage(form);
                    getMyPosts("#layoutSidenav_content > main > div > div.row.g-4.card-row");
                        // AUTO RESIZE BIO
                        const textareas = document.querySelectorAll(".auto-resize");

                        function autoResize(el) {
                            el.style.height = "auto";
                            el.style.height = el.scrollHeight + "px";
                        }

                        textareas.forEach(el => {
                            autoResize(el);
                            el.addEventListener("input", () => autoResize(el));
                        });

                        // ELEMENTI
                        const editBtn = document.getElementById("editBtn");
                        const cancelBtn = document.getElementById("cancelBtn");
                        const saveBtn = document.getElementById("saveBtn");
                        const editableFields = document.querySelectorAll(".editable");

                        // VALORI ORIGINALI (per Annulla)
                        const originalData = {
                            username: document.getElementById("username").value,
                            email: document.getElementById("email").value,
                            bio: document.getElementById("bio").value
                        };

                        // EDIT
                        editBtn.addEventListener("click", () => {
                            editableFields.forEach(el => el.disabled = false);
                            saveBtn.classList.remove("d-none");
                            cancelBtn.classList.remove("d-none");
                            editBtn.classList.add("d-none");
                            textareas.forEach(el => autoResize(el));
                        });

                        // ANNULLA
                        cancelBtn.addEventListener("click", () => {
                            document.getElementById("username").value = originalData.username;
                            document.getElementById("email").value = originalData.email;
                            document.getElementById("bio").value = originalData.bio;

                            editableFields.forEach(el => el.disabled = true);
                            saveBtn.classList.add("d-none");
                            cancelBtn.classList.add("d-none");
                            editBtn.classList.remove("d-none");

                            textareas.forEach(el => autoResize(el));
                        });

                        // SUBMIT
                        document.getElementById("profileForm").addEventListener("submit", e => {
                            e.preventDefault();

                            const username = document.getElementById("username").value;
                            const email = document.getElementById("email").value;
                            const bio = document.getElementById("bio").value;

                            evUpdateUser(username, email, bio);

                            editableFields.forEach(el => el.disabled = true);
                            saveBtn.classList.add("d-none");
                            cancelBtn.classList.add("d-none");
                            editBtn.classList.remove("d-none");
                        });
                        const toggleButton = document.getElementById('theme-toggle');
                        const body = document.body;
                        document.cookie = 'dark'
                            if(localStorage.getItem('theme') === 'dark') {
                            body.classList.add('dark-theme');
                            toggleButton.textContent = '☀️ Light Mode';
                            }

                            toggleButton.addEventListener('click', () => {
                            document.cookie = 'dark';    
                            body.classList.toggle('dark-theme');

                            if(body.classList.contains('dark-theme')) {
                                toggleButton.textContent = '☀️ Light Mode';
                                localStorage.setItem('theme', 'dark');
                            } else {
                                toggleButton.textContent = '🌙 Dark Mode';
                                localStorage.setItem('theme', 'light');
                                document.cookie = 'light'
                            }
                        });

                    break;
                            
            } 
    } catch (error) {
        console.log(error.message);
    }
}

async function getNewPostPage() {
    writeInPage(`
        <div class="container py-5">
                        <h2 class="mb-4 text-center">Inserimento Post</h2>

                        <!-- Form per aggiungere post -->
                        <div class="mb-5">
                            <form id="postForm">
                                <div class="mb-3">
                                    <textarea class="form-control" id="testopost" rows="3" placeholder="Scrivi il tuo post..." required></textarea>
                                </div>
                                <button type="submit" class="btn btn-primary">Aggiungi Post</button>
                            </form>
                        </div>
                    </div>`)

    document.querySelector("main div div form").addEventListener("submit", function (event) {
        event.preventDefault();
        const testo = document.querySelector("#testopost").value;
        evNewPost(testo);
    });
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
    <div class="row justify-content-center align-items-start g-4">

        <!-- COLONNA POST -->
        <div class="col-12 col-lg-5">
            <div class="card spotted-post h-100">
                <div class="card-body d-flex flex-column h-100">

                    <!-- HEADER -->
                    <div class="d-flex justify-content-between align-items-center mb-3 spotted-header">
                        <span class="spotted-time">
                            ${timeAgo(json["data"][0]["data_creazione"])}
                        </span>

                        <span class="btn-report" role="button" aria-label="Segnala post">
                            <i class="fa-regular fa-flag"></i>
                        </span>

                        <span role="button" class="btn-like like-post">
                            <i class="far fa-heart"></i>
                            <span class="post-like-count">
                                ${json["data"][0]["like_count"]}
                            </span>
                        </span>
                    </div>

                    <!-- TESTO CENTRATO -->
                    <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                        <p class="spotted-text text-center m-0">
                            ${json["data"][0]["testo"]}
                        </p>
                    </div>

                    <!-- FOOTER -->
                    <div class="mt-3 text-center">
                        <button
                            type="button"
                            class="btn btn-warning btn-respond"
                            id="btnRespond">
                            Respond
                        </button>
                    </div>

                </div>
            </div>
        </div>

        <!-- COLONNA COMMENTI -->
        <div class="col-12 col-lg-5">

            <!-- FORM COMMENTO -->
            <div class="card spotted-comment mb-3" id="commentFormWrapper" hidden>
                <div class="card-body">
                    <form id="commentForm">
                        <label for="commentTextInput" class="form-label">
                            Aggiungi un commento:
                        </label>

                        <textarea
                            class="form-control mb-3"
                            id="commentTextInput"
                            rows="3"
                            placeholder="Scrivi il tuo commento..."
                            required>
                        </textarea>

                        <div class="d-flex gap-2 justify-content-end">
                            <button type="reset" class="btn btn-secondary btn-sm">
                                Annulla
                            </button>
                            <button type="submit" class="btn btn-success btn-sm">
                                Invia
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- LISTA COMMENTI -->
            <div id="commentsList" class="d-flex flex-column gap-3">
                <!-- comment cards -->
            </div>

        </div>

    </div>
</article>
`

        await writeInPage(doc);
        
        document.querySelector("span.like-post").addEventListener("click",() => {
            evToggleLike(`../api-togglelike.php?post_id=${json["data"][0]["post_id"]}`,"span.like-post > span ");
            });
        document.querySelector("span.btn-report").addEventListener("click",() => {
            evToggleReport(json["data"][0]["post_id"]);
            });
        document.querySelector("button.btn-respond").addEventListener("click",() =>{
            document.querySelector("#commentFormWrapper").toggleAttribute("hidden");
            });
       
        document.querySelector("#commentForm").addEventListener("submit",(event) =>{
            event.preventDefault();
            evAddComment("#commentsList",json["data"][0]["post_id"],document.querySelector("#commentTextInput").value);
            document.querySelector("#commentTextInput").value = "";
            }); 

        document.querySelector("#commentForm").addEventListener("reset",(event) =>{
            document.querySelector("#commentFormWrapper").toggleAttribute("hidden");
            document.querySelector("#commentTextInput").value = "";
            }); 


        getPostComments(`../api-comments-of-post.php?post_id=${json["data"][0]["post_id"]}`,"#commentsList");    
    } catch (error) {
        console.log(error.stack);
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
                                            <span class="comment-user">${element.username}</span>
                                            <span class="comment-time">${timeAgo(element.data_creazione)}</span>
                                        </div>
                                        <p class="comment-text mb-1">
                                            ${element.contenuto}
                                        </p>
                                        <div class="d-flex justify-content-end">
                                            <button type="button" class="btn-like-sm">
                                                <i class="far fa-heart"></i><span class="post-like-count">${element.like_count}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>`//qua ci va l'html dei commenti
        });

        document.querySelector(posts_path).innerHTML = doc;

       for (let i = 0; i < json["data"].length; i++) {
            document.querySelector(`${posts_path} > div:nth-child(${i+1}) div > div.d-flex.justify-content-end > button`)
                .addEventListener("click",function(){
                    evToggleLike(`../api-togglelike.php?comment_id=${json["data"][i]["comment_id"]}`,
                        `${posts_path} > div:nth-child(${i+1}) div > div.d-flex.justify-content-end > button > span`);
                });
        }
        
        
    } catch (error) {
        console.log(error.message);
    }
}
async function getCompactPostsPage(url,path) {
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
                                    <small class="card-time"><span>•</span>${timeAgo(element.data_creazione)}</small>
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
        document.querySelector(path).innerHTML = doc; 
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


async function getPostsPage(url, path,bool) {
    if (bool == 'undefined')
        bool = false;
    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Response status: " + response.status);
        }

        const json = await response.json();

        // Controllo errori login
        if (json["error"] === "nologin") {
            generaLoginPage();
            throw new Error("no login");
        }
        let doc = `<div class="row g-4 card-row">`;
        if(!bool){
            json["data"].forEach(element => {
                doc += `
                    <div class="col-6 col-lg-3">
                        <div class="card shadow-sm h-100 custom-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <small class="card-time"><span>•</span>${timeAgo(element.data_creazione)}</small>
                                </div>
                                <div class="mt-2 card-text">
                                    <p>${element.testo}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
        }
        else{
            json["data"].forEach(element => {
                doc += `
                    <div class="col-6 col-lg-3">
                        <div class="card shadow-sm h-100 custom-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <small class="card-time"><span>•</span>${timeAgo(element.data_creazione)}</small>
                                    <span class="online-badge position-absolute 
                                    ${setState(element.blocked,element.inspected)} "></span>
                                </div>
                                <div class="mt-2 card-text">
                                    <p>${element.testo}</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
            });
        }

        
        doc += `</div>`;
        document.querySelector(path).innerHTML = doc;
        json["data"].forEach((element, i) => {
            document.querySelector(path + ` .col-6:nth-child(${i + 1})`)
                .addEventListener("click", function() {
                    loadWaitScreen();
                    getPostPage(`../api-post-id.php?post_id=${element.post_id}`);
                });
        });

    } catch (error) {
        console.log(error.stack);
    }
}


async function getMyPosts(path){
    getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=my_posts",path,true);
}

async function addPost(url) {
   try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Response status: " + response.status);
            }

            const json = await response.json();

            switch (json["error"]) {
                case "nologin":
                    generaLoginPage()
                    throw new Error("no login");
            
                default:
                    break;
            }
        } catch (error) {
        console.log(error.message);
    }
}

//costruisce una pagina senza bisogno di ricevere dati
async function generaLoginPage() {
    // Utente NON loggato
    let form = `
    <div class="login-wrapper">
        <div class="login-card">
                    <h2 class="mb-3 text-center">Accedi</h3>
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
                        <p style="color:orange" ></p>
                        <!-- <div class="mb-3 form-check">
                        <input
                            type="checkbox"
                            class="form-check-input"
                            id="remember"
                        />
                        <label class="form-check-label" for="remember">Ricordami</label>
                        </div> -->
                        <button type="submit" name="submit" value="Invia"class="btn btn-primary w-100 login-button">
                        Accedi
                        </button>
                        <button type="submit" name="submit" value="Invia"class="btn btn-primary w-100 registration-button mt-2">
                        Registrati
                        </button>
                    </form>
                </div>
            </div>`;
    writeInPage(form);
    // Gestisco tentativo di login
    document.querySelector("main div form").addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        evLogin(username, password);
    });
    document.querySelector("main div .registration-button").addEventListener("click",generaSignInPage);
}

async function generaSignInPage() {
    // Utente NON loggato
    let form =`
    <div class="login-wrapper">
        <div class="login-card">
            <h2 class="mb-3 text-center">Registrazione</h2>
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
                <p style="color:orange"></p>
                <!-- <div class="mb-3 form-check">
                <input
                    type="checkbox"
                    class="form-check-input"
                    id="remember"
                />
                <label class="form-check-label" for="remember">Ricordami</label>
                </div> -->
                <button type="submit" name="submit" value="Invia"class="btn btn-primary w-100 login-button">
                Accedi
                </button>
                <button type="submit" name="submit" value="Invia"class="btn btn-primary w-100 registration-button mt-2">
                Registrati
                </button>
            </form>
        </div>
    </div>`;
    writeInPage(form);
    // Gestisco tentativo di login
    document.querySelector("main div form").addEventListener("submit", function (event) {
        event.preventDefault();
        const username = document.querySelector("#username").value;
        const password = document.querySelector("#password").value;
        const email = document.querySelector("#email").value;
        evSignIn(username, password,email);
    });
    document.querySelector("main div .login-button").addEventListener("click",generaLoginPage);
}


    // Render Top 3 Post più commentati
function renderTopPosts(topPostsContainer,topPosts) {
    topPostsContainer.innerHTML = "";
    if(topPosts.length === 0){
        topPostsContainer.innerHTML = `<p class="no-post">Nessun post da mostrare</p>`;
        return;
    }
    topPosts.forEach((post,i) => {
        const col = document.createElement("div");
        col.classList.add("col-12", "col-lg-4");
        /* col.classList.add("col");
        col.style.flex = "0 0 300px";
        col.style.maxWidth = "300px"; */
        col.innerHTML = `
            <div class="card spotted-post h-100">
            <div class="card-body d-flex flex-column h-100">

                <!-- HEADER -->
                <div class="d-flex justify-content-between align-items-center mb-3 spotted-header">
                    <span class="spotted-time">
                        ${timeAgo(post.data_creazione)}
                    </span>

                </div>

                <!-- TESTO CENTRATO -->
                <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                    <p class="spotted-text text-center m-0">
                        ${post.testo}
                    </p>
                </div>

            </div>
        </div>
    </div>
        `;
        topPostsContainer.appendChild(col);
        topPostsContainer.querySelector(`div:nth-child(${i+1})`)
            .addEventListener("click", function() {
                loadWaitScreen();
                getPostPage(`../api-post-id.php?post_id=${post.post_id}`);
            });
    });

}

    // Render Pending Posts
function renderPendingPosts(pendingPostsContainer,pendingPosts) {
    pendingPostsContainer.innerHTML = "";
    if(pendingPosts.length === 0){
        pendingPostsContainer.innerHTML = `<p class="no-post">Nessun post in sospeso</p>`;
        return;
    }
    pendingPosts.forEach((post,i) => {
        const col = document.createElement("div");
        col.classList.add("col-12", "col-lg-4");
        col.innerHTML = `
        <div class="card spotted-post h-100" postid="${post.post_id}">
            <div class="card-body d-flex flex-column h-100">

                <!-- HEADER -->
                <div class="d-flex justify-content-between align-items-center mb-3 spotted-header">
                    <span class="spotted-time">
                        ${timeAgo(post.data_creazione)}
                    </span>

                </div>

                <!-- TESTO CENTRATO -->
                <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                    <p class="spotted-text text-center m-0">
                        ${post.testo}
                    </p>
                </div>

                <!-- FOOTER -->
                <div class="mt-3 text-center d-flex justify-content-between gap-2">
                    <button
                        type="button"
                        class="btn btn-success btn-respond btn-approve"
                        data-id="${post.post_id}"
                        />
                        Approve
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger btn-respond btn-decline"
                        data-id="${post.post_id}"
                        />
                        
                        Decline
                    </button>
                </div>

            </div>
        </div>
    </div>`
        ;
        pendingPostsContainer.appendChild(col);
        pendingPostsContainer.querySelector(`div[postid = "${post.post_id}"] > div > 
            div > button.btn-success`)
            .addEventListener("click",function(){
                pendingPostsContainer.querySelector(`div[postid = "${post.post_id}"]`).remove()
                fetch(`../api-eval-post.php?blocked=0&post_id=${post.post_id}`);
            })
        pendingPostsContainer.querySelector(`div[postid = "${post.post_id}"]  > div > 
            div > button.btn-decline`)
            .addEventListener("click",function(){
                pendingPostsContainer.querySelector(`div[postid = "${post.post_id}"]`).remove()
                fetch(`../api-eval-post.php?blocked=1&post_id=${post.post_id}`);
            })
    });
}

    // Render Reported Posts
function renderReportedPosts(reportedPostsContainer,reportedPosts){
    reportedPostsContainer.innerHTML = "";
    if(reportedPosts.length === 0){
        reportedPostsContainer.innerHTML = `<p class="no-post">Nessun post segnalato</p>`;
        return;
    }
    reportedPosts.forEach((post,i) => {
        const col = document.createElement("div");
        col.classList.add("col-12", "col-lg-4");
        col.innerHTML = `
            <div class="card spotted-post h-100" postid="${post.post_id}" >
                <div class="card-body d-flex flex-column h-100">
                    <!-- HEADER -->
                    <div class="d-flex justify-content-between align-items-center mb-3 spotted-header">
                        <span class="spotted-time">
                            ${timeAgo(post.data_creazione)}
                        </span>
                    </div>

                    <!-- TESTO CENTRATO -->
                    <div class="flex-grow-1 d-flex align-items-center justify-content-center">
                        <p class="spotted-text text-center m-0">
                            ${post.testo}
                        </p>
                    </div>

                    <!-- FOOTER CON PULSANTI -->
                    <div class="mt-3 text-center d-flex justify-content-between gap-2">
                        <button
                            type="button"
                            class="btn btn-respond btn-normalize"
                            data-id="${post.post_id}">
                            Togli segnalazione
                        </button>
                        <button
                            type="button"
                            class="btn btn-respond btn-remove"
                            data-id="${post.post_id}">
                            Rimuovi
                        </button>
                    </div>
                </div>
            </div>
        `;
        reportedPostsContainer.appendChild(col);
        reportedPostsContainer.querySelector(`div[postid = "${post.post_id}"] > div >
             div > button.btn.btn-respond.btn-normalize`)
            .addEventListener("click",function(){
                reportedPostsContainer.querySelector(`div[postid = "${post.post_id}"]`).remove()
                fetch(`../api-remove-reports.php?post_id=${post.post_id}`);
            })
        reportedPostsContainer.querySelector(`div[postid = "${post.post_id}"] > div >  
            div > button.btn-remove`)
            .addEventListener("click",function(){
                reportedPostsContainer.querySelector(`div[postid = "${post.post_id}"]`).remove()
                fetch(`../api-eval-post.php?blocked=1&post_id=${post.post_id}`);
            })
});
}
function removePendingPost(pendingPosts,postId) {
        const index = pendingPosts.findIndex(p => p.id == postId);
        if(index !== -1){
            pendingPosts.splice(index,1);
            //renderPendingPosts();
        }
    }
function moveReportedToPending(reportedPosts,postId) {
    const index = reportedPosts.findIndex(p => p.id == postId);
    if(index !== -1){
        const post = reportedPosts.splice(index,1)[0];
        pendingPosts.push(post); // oppure in "approvati" se vuoi
        renderReportedPosts();
        renderPendingPosts();
    }
}

function removeReportedPost(reportedPosts,postId) {
    const index = reportedPosts.findIndex(p => p.id == postId);
    if(index !== -1){
        reportedPosts.splice(index,1);
        renderReportedPosts();
    }
}

async function getAdminPage() {
    try {
        const response = await fetch("../api-get-admin.php");

        if (!response.ok) {
            throw new Error("Response status: " + response.status);
        }

        const json = await response.json();

        // Controllo errori login
        if (json["error"] === "nologin") {
            generaLoginPage();
            throw new Error("no login");
        }

        doc = `<div class="container py-5">
                    <h2 class="mb-4 text-center">Admin - Gestione Post</h2>

                    <!-- TOP 3 POST PIÙ COMMENTATI -->
                    <h3 class="section-title">Top 3 Post Più Commentati</h3>
                    <div id="topPostsContainer" class="row g-4 mb-5">
                    <!-- Top 3 post caricati dinamicamente qui -->
                    </div>

                    <!-- POST IN SOSPESO -->
                    <h3 class="section-title">Post in Sospeso</h3>
                    <div id="pendingPostsContainer" class="row g-4 mb-5">
                        <!-- I post in sospeso saranno caricati qui -->
                    </div>

                    <!-- POST SEGNALATI -->
                    <h3 class="section-title">Post Segnalati</h3>
                    <div id="reportedPostsContainer" class="row g-4 mb-5">
                        <!-- I post segnalati saranno caricati qui -->
                    </div>
                </div>`
        writeInPage(doc);

    const topPostsContainer = document.getElementById("topPostsContainer");
    const pendingPostsContainer = document.getElementById("pendingPostsContainer");
    const reportedPostsContainer = document.getElementById("reportedPostsContainer");
    
    const pendingPosts = json["data"]["uninspected_posts"];
    const reportedPosts = json["data"]["reported_posts"];
    const mostCommentePosts = json["data"]["most_commented_posts"];

    renderTopPosts(topPostsContainer,mostCommentePosts);
    renderPendingPosts(pendingPostsContainer,pendingPosts);
    renderReportedPosts(reportedPostsContainer,reportedPosts);

    } catch (error) {
        console.log(error.stack);
    }
}


evIsAdminLoggedIn();
getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all","main");

//get feed
document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:nth-child(1)")
    .addEventListener("click",function(){
    loadWaitScreen();
    getPostsPage("../api-post.php?limit=5&offset=0&order=asc&filter=all&id=0","main");
});

document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:nth-child(2)")
    .addEventListener("click",function(){
    getNewPostPage();
});

//logout
document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:nth-child(3)")
    .addEventListener("click",function(){
    evLogout();
    generaLoginPage();
});

document.querySelector("body > nav > a").addEventListener("click" ,function(){
    getUserPage("../api-get-user.php");
})

document.querySelector("#sidenavAccordion > div.sb-sidenav-menu > div > a:last-child")
                        .addEventListener("click",function(){
                        loadWaitScreen();
                        getAdminPage();
                    });
if(document.cookie.includes('dark')){
    body.classList.add('dark-theme');
    toggleButton.textContent = '☀️ Light Mode';
}
else{
    body.classList.add('light-theme');
    toggleButton.textContent = '☀️ Dark Mode';
}




