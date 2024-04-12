function guardarNombre() {
    var nombre = document.getElementById('nombre').value;
    var password = document.getElementById('password').value;
    if (!nombre) {
        alert('Debe colocar su usuario');
        return;
    };
    if (!password) {
        alert('Debe colocar su clave');
        return;
    };

    //Guardo el usuario para poder mostrarlo en las siguientes paginas
    localStorage.setItem('nombre', nombre);

    // Redirige al usuario a la página index.html
    window.location.href = "index.html";
}

function mostrarNombre() {
    var nombre = localStorage.getItem('nombre');
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
    }
};

function logout() {
    // Borra todos los datos locales
    localStorage.clear();

    // Redirige al usuario a la página de login
    window.location.href = "login.html";
};