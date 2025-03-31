// Variabili globali
let posts = JSON.parse(localStorage.getItem("posts")) || [];
let users = JSON.parse(localStorage.getItem("users")) || {}; // Salva gli utenti nel localStorage
let currentUser = localStorage.getItem("currentUser"); // Utente loggato
let isAdmin = false;

// Controllo se c'è un utente loggato
if (currentUser) {
    showApp();
}

// Funzione per registrarsi
function signUp() {
    let username = document.getElementById("signup-username").value.trim();
    let password = document.getElementById("signup-password").value.trim();
    
    if (username && password) {
        if (users[username]) {
            alert("Nome utente già in uso!");
        } else {
            users[username] = password;
            localStorage.setItem("users", JSON.stringify(users));
            alert("Registrazione completata! Ora accedi.");
            showLogin();
        }
    } else {
        alert("Inserisci un nome utente e una password.");
    }
}

// Funzione per accedere
function login() {
    let username = document.getElementById("login-username").value.trim();
    let password = document.getElementById("login-password").value.trim();
    let adminId = document.getElementById("admin-id").value.trim(); // Ottieni l'ID admin

    if (users[username] && users[username] === password) {
        // Controlla se l'ID admin è corretto (6667)
        if (adminId === "6667") {
            isAdmin = true;
        } else {
            isAdmin = false;
        }
        
        localStorage.setItem("currentUser", username);
        currentUser = username;
        showApp();
    } else {
        alert("Credenziali errate!");
    }
}

// Mostra la sezione principale e nasconde il login
function showApp() {
    document.getElementById("auth-container").style.display = "none";
    document.getElementById("app-container").style.display = "block";
    document.getElementById("user-info").innerText = `Benvenuto, ${currentUser}`;

    // Verifica se l'utente è un admin
    document.getElementById("delete-all-container").style.display = isAdmin ? "block" : "none";

    renderPosts();
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

// Mostra il form di registrazione
function showSignUp() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
}

// Mostra il form di login
function showLogin() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

// Creazione di un nuovo post
document.getElementById("post-form").addEventListener("submit", function (e) {
    e.preventDefault();

    let name = currentUser;  // Usa sempre il nome dell'utente loggato
    let content = document.getElementById("content").value.trim();

    if (!content) {
        alert("Il messaggio non può essere vuoto.");
        return;
    }

    if (content.length > 200) {
        alert("Il messaggio non può superare i 200 caratteri.");
        return;
    }

    const post = {
        id: Date.now(),
        name,
        content,
    };

    posts.unshift(post);
    savePosts();
    renderPosts();
    document.getElementById("post-form").reset();
});

// Salva i post nel localStorage
function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}

// Mostra i post
function renderPosts() {
    let postsContainer = document.getElementById("posts");
    postsContainer.innerHTML = "";

    posts.forEach(post => {
        let postElement = document.createElement("div");
        postElement.innerHTML = `<strong>${post.name}:</strong> ${post.content}`;
        postElement.classList.add("post");

        if (isAdmin) {
            let deleteBtn = document.createElement("button");
            deleteBtn.innerText = "❌";
            deleteBtn.classList.add("delete-btn");
            deleteBtn.onclick = () => deletePost(post.id);
            postElement.appendChild(deleteBtn);
        }

        postsContainer.appendChild(postElement);
    });
}

// Cancella un post (solo admin)
function deletePost(postId) {
    posts = posts.filter(post => post.id !== postId);
    savePosts();
    renderPosts();
}
// Funzione per attivare/disattivare il tema scuro
function toggleTheme() {
    // Cambia il tema tra 'dark-mode' e 'light-mode'
    const body = document.body;
    if (body.classList.contains('dark-mode')) {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
    } else {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
    }
}


// Cancella tutti i post (solo admin)
document.getElementById("delete-all").addEventListener("click", function () {
    if (confirm("Sei sicuro di voler eliminare tutti i post?")) {
        posts = [];
        savePosts();
        renderPosts();
    }
});

function convertLinks(text) {
    return text.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" style="color: #1e90ff; text-decoration: underline;">$1</a>');
}
function postMessage() {
    let postContent = document.getElementById("postContent").value;
    if (postContent.trim() === "") {
        alert("Il messaggio non può essere vuoto!");
        return;
    }

    // Converte i link in cliccabili
    let formattedContent = convertLinks(postContent);

    let postContainer = document.getElementById("posts");
    let newPost = document.createElement("div");
    newPost.classList.add("post");
    newPost.innerHTML = `<p>${formattedContent}</p>`;
    
    postContainer.prepend(newPost);
    document.getElementById("postContent").value = "";
}
// Carica i post all'avvio
renderPosts();
