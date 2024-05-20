function guardarNombre(nombre) {
    //Guardo el usuario para poder mostrarlo en las siguientes paginas
    localStorage.setItem('nombre', nombre);
    // Redirige al usuario a la página index.html
    window.location.href = "index.html";
}

function guardoLocalStorage(usuarios) {
    //guardo todos los usuarios registrados
    localStorage.setItem('users', JSON.stringify(usuarios));
};

function mostrarNombre() {
    var nombre = localStorage.getItem('nombre');
    if (!nombre) {
        nombre = 'debe iniciar sesión para poder operar'
    };
    document.getElementById('nombre').textContent = nombre;
};

function actualizarEstadoSesion() {
    var nombre = localStorage.getItem('nombre');
    var sesionEstado = document.getElementById('sesionEstado');

    if (nombre) {
        // Si el usuario está logueado, muestra el enlace de logout
        sesionEstado.innerHTML = '<a class="nav-link" href="#" onclick="logout()">Logout</a>';
    } else {
        // Si el usuario no está logueado, muestra el enlace de login
        sesionEstado.innerHTML = '<a class="nav-link" href="./login.html">Login</a>';
    };
};

function logout() {
    // Borra todos los datos locales
    localStorage.clear();

    // Redirige al usuario a la página de login
    window.location.href = "login.html";
};

/*REgistro de nuevos usuarios*/


// Función para registrar un nuevo usuario
function registerUser(username, usuarios) {

    // Guardar los usuarios en localStorage
    localStorage.setItem('users', JSON.stringify(usuarios));

    // Recuperar los usuarios de localStorage
    var storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    console.log(storedUsers);

    // Encuentra el ID más alto entre los usuarios existentes
    var maxId = Math.max(...storedUsers.map(user => user[0]), 0);

    // Crea un nuevo usuario con un ID que es uno más que el ID más alto
    var newUser = [maxId + 1, username];

    // Agrega el nuevo usuario a la lista de usuarios
    storedUsers.push(newUser);

    // Guarda los usuarios actualizados en localStorage
    localStorage.setItem('users', JSON.stringify(storedUsers));
};