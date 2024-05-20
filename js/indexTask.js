//cargo los datos fijos para poder modificar en memoria.
var usuarios = JSON.parse(localStorage.getItem('users'));
var tareas = alltask;

// si el usuario no esta loguado no puede hacer nada en la pagina
function deshabilitarBotones() {
    //Obtengo el nombre de usuario
    var nombre = localStorage.getItem('nombre');

    var botones = document.getElementsByTagName('button');
    if (nombre) {
        for (var i = 0; i < botones.length; i++) {
            botones[i].disabled = false;
        }
    } else {
        for (var i = 0; i < botones.length; i++) {
            botones[i].disabled = true;
        }
    }

};

function cargaUsuarios() {
    document.getElementById("addselectUsuario").options.length = 0; // reseteo el select
    $('#addselectUsuario').append($('<option>', {
        value: '999',
        text: 'Seleccionar',
        selectedIndex: 0
    }));
    var jsonData = JSON.parse(JSON.stringify(usuarios))
    for (var i = 0; i < jsonData.length; i++) {
        var counter = jsonData[i];
        $('#addselectUsuario').append($('<option>', {
            value: counter[0],
            text: counter[1]
        }));
    }
};

async function getDatos() {
    generarTarjetas(tareas);
};

function generarTarjetas(datos) {
    console.log(datos)
    let conteos = {};
    let tareas = {};

    for (let fila of datos) {
        let idUsuario = fila[8] || 'Sin-Asignar';
        let estadoTarea = fila[6];
        let idTarea = fila[0];
        let comentario = fila[11];
        let fechaComentario = fila[12];

        if (!conteos[idUsuario]) {
            conteos[idUsuario] = {
                asignadas: 0,
                enProceso: 0,
                cerradas: 0
            };
        }

        if (!tareas[idTarea]) {
            tareas[idTarea] = {
                ...fila,
                comentarios: []
            };

            switch (estadoTarea) {
                case 1:
                case 3:
                    conteos[idUsuario].asignadas++;
                    break;
                case 2:
                    conteos[idUsuario].enProceso++;
                    break;
                case 4:
                    conteos[idUsuario].cerradas++;
                    break;
            }
        }

        if (comentario) {
            tareas[idTarea].comentarios.push({
                texto: comentario,
                fecha: fechaComentario,
                autor: idUsuario
            });
        }
    }
    for (let idUsuario in conteos) {
        let card = createCard(idUsuario, conteos[idUsuario]);
        if (idUsuario !== 'Sin-Asignar') {
            $('#tarjetasUsuarios').append(card);
        }
    }

    for (let idTarea in tareas) {
        let color;
        if (tareas[idTarea][6] === 4) {
            color = 'card-danger'
        } else if (tareas[idTarea][6] === 3) {
            color = 'card-warning'
        } else {
            color = 'card-success'
        };

        let task = createTask(tareas[idTarea], tareas[idTarea][8], tareas[idTarea].comentarios, color);
        if (tareas[idTarea][6] === 4) {
            $('#tareasUsuariosCerradas').append(task);
        } else if (tareas[idTarea][6] === 0) {
            $('#tareasSinAsignar').append(task);
        } else {
            $('#tareasUsuarios').append(task);
        }
    }
    $('#tareasUsuarios .card, #tareasUsuariosCerradas .card, #tareasSinAsignar .card').hide();
}

function createCard(idUsuario, tareas) {
    let card = `<div class="card m-1 text-bg-light col-auto card-header-PT">
                        <div class="card-header text-center">${idUsuario}</div>
                        <div class="card-body">
                            <b>Estado de tareas:</b>
                            <p class="card-text-task">Asignadas: <span>${tareas.asignadas}</span></p>
                            <p class="card-text-task">En proceso: <span>${tareas.enProceso}</span></p>
                            <p class="card-text-task">Cerradas: <span>${tareas.cerradas}</span></p>
                        </div>
                        <div class="card-footer text-center">
                            <div class="btn-group" role="group" aria-label="Basic example">
                                <div class="d-grid gap-1 d-md-flex justify-content-md-end ">
                                    <button class="btn btn-primary -md" type="button" place-holder="Ver"
                                        onclick="viewTask('${idUsuario}');"><i class="fa-solid fa-eye"></i></button>
                                        <button class="btn btn-primary -md" type="button" place-holder="Cerradas" title="Cerradas"
                                        onclick="viewTaskClose('${idUsuario}');"><i class="fa-solid fa-thumbs-up"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>`;
    return card;
}

function createTask(tarea, usuario, comentarios, color) {
    // Crear las opciones del select con el valor seleccionado a
    let options = [{
        value: '999',
        text: 'Seleccionar'
    },
    {
        value: '0',
        text: 'Sin Asignar'
    },
    {
        value: '1',
        text: 'Asignada'
    },
    {
        value: '2',
        text: 'En Proceso'
    },
    {
        value: '3',
        text: 'En Espera'
    },
    {
        value: '4',
        text: 'Cerrado'
    }
    ].map(option =>
        `<option value="${option.value}" ${tarea[6] == option.value ? 'selected' : ''}>${option.text}</option>`
    ).join('');

    // Crear un elemento de lista para cada comentario
    let listaComentarios = '';
    if (comentarios) {
        listaComentarios = comentarios.map(comentario =>
            `<div class="list-group-item list-group-item-action" aria-current="true">
                    <div class="d-flex w-100 justify-content-between">
                    <span class="dato-comentario">${formatFecha(comentario.fecha)} -  ${comentario.autor}</span>
                    </div>
                    <p class="texto-comentario text-left">${comentario.texto}</p>
                </div>`
        ).join('');
    }

    let task = `<div class="card text-bg-light col-2 card-header-PT cardTask"  id="${tarea[0]}" data-usuario="${usuario || 'SinAsignar'}">
            <div class="card-header text-center ${color}">${tarea[1]}</div>
            <div class="card-body">
                <form id="formTask_${tarea[0]}">
                    <input type="text"  id="inputTaskId_${tarea[0]}" value="${tarea[0]}" style="display: none;">
                    <input type="text"  id="inputUserId_${tarea[0]}" value="${tarea[7]}" style="display: none;">
                    <div class="label-comentario text-left">
                        Descripción</div>
                    <textarea class="form-control text-left" style="min-width: 100%" name="textDescripcion" id="textDescripcion" cols="34" rows="2" disabled>${tarea[2]}</textarea>
                    ${tarea[6] == 0 ? `
                                    <chi-label for="udpSelectUsuario_${tarea[0]} ata-placement="top" data-toggle="tooltip"
                                        title="" data-original-title="Seleccione el Usuario">
                                        Usuario</chi-label>
                                    <select class="form-select form-select-sm col-12" id="udpSelectUsuario_${tarea[0]}"
                                        aria-label="Small select example">
                                        <option value="999" selectedindex="0">Seleccionar</option>
                                        <option value="1">RomanA</option>
                                        <option value="2">FlorenciaR</option>
                                        <option value="3">MatiasA</option>
                                        <option value="4">ConradoG</option>
                                        <option value="5">ConstanzaR</option>
                                     </select>`
            : ''}<div class="label-comentario text-left" for="selectStatus">Estado</div>
                        <select class="form-select form-select-sm col-12" id="selectStatus_${tarea[0]}">
                            ${options}
                        </select>
                    <div class="label-comentario text-left" for="textObservaciones_${tarea[0]}">Observaciones</div>
                    <textarea class="form-control text-left" name="textObservaciones" id="textObservaciones_${tarea[0]}" cols="34" rows="2" ${tarea[6] == 4 ? 'disabled' : ''}></textarea>
                    <div class="label-comentario text-left" for="fecha_inicio">Fecha de Inicio</div>
                        <input type="text" class="form-control" id="fecha_inicio" value="${formatFecha(tarea[3])}" disabled>
                        <div class="label-comentario text-left">Comentarios anteriores</div>
                    <div class="list-group">
                        ${listaComentarios}
                    </div>
                    <div class="card-footer text-center">
                        <div class="btn-group">
                            <div class="d-grid gap-1 d-md-flex justify-content-md-end ">
                                ${tarea[6] == 4 ? '' : `<button class="btn btn-outline-primary btn-sm" type="button" onclick="saveTask('${tarea[0]}');">Guardar</button>`}
                                <button class="btn btn-outline-secondary btn-sm" type="reset">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>`;
    return task;
}

function Addtask() {
    // Resetea el formulario dentro del modal
    $('#ModalForm')[0].reset();
    $('addselectUsuario').prop('selectedIndex', 0);
    $('addselectStatus').prop('selectedIndex', 0);
    $("#modalTotal").modal("toggle");
};

function closeModal() {
    $("#modalTotal").modal("toggle");
};

function addNewTask() {
    let addNameTask = $("#addNameTask").val();
    let addtextDescripcion = $("#addtextDescripcion").val();
    let select1 = document.getElementById("addselectUsuario");
    let addselectUsuario = select1.options[select1.selectedIndex].value;
    let addselectUsuarioName = select1.options[select1.selectedIndex].text;
    let select2 = document.getElementById("addselectStatus");
    let addselectStatus = Number(select2.options[select2.selectedIndex].value);
    //let datepicker1 = $("#datepicker1").val();
    //let datepicker2 = $("#datepicker2").val();

    // obtengo el id y sumo uno para agregar la proxima tarea
    var maxId = Math.max(...tareas.map(task => task[0]));
    var nextId = maxId + 1;
    var fechaCreacion = new Date().toISOString();;
    if (addselectUsuario == '999') {
        alert('Debe seleccionar un usuario!');
        return;
    };
    if (addselectStatus == 'Seleccionar') {
        alert('Debe seleccionar un estado!');
        return;
    };

    //Agrego la tarea 
    tareas.push([nextId, addNameTask, addtextDescripcion, fechaCreacion, null, null, addselectStatus, addselectUsuario, addselectUsuarioName, null, null, null, null],)

    closeModal();
    // Vaciar los contenedores de las tarjetas
    $('#tarjetasUsuarios').empty();
    $('#tareasUsuarios').empty();
    $('#tareasUsuariosCerradas').empty();
    $('#tareasSinAsignar').empty();
    generarTarjetas(tareas);
};

function saveTask(id) {
    // Índices de los campos que quieres modificar
    let estadoIndex = 6; // El índice del campo ESTADO
    let idComentarioIndex = 9; // El índice del campo ID_COMENTARIO
    let tareaIndex = 10; // El índice del campo TAREA
    let comentarioIndex = 11; // El índice del campo COMENTARIO
    let fechaComentarioIndex = 12; // El índice del campo FECHA_COMENTARIO

    // nuevos valores
    let nuevoEstado = Number($(`#selectStatus_${id} option:selected`).val());
    let nuevoComentario = $(`#textObservaciones_${id}`).val();
    let idTarea = Number($(`#inputTaskId_${id}`).val());

    // obtengo el id y sumo uno para agregar la proxima tarea
    let maxId = Math.max(...tareas.map(task => task[idComentarioIndex]));
    let idcomentarioGenerado = maxId + 1;

    // Modifica los campos
    tareas.forEach(task => {
        if (task[0] == idTarea) { // Solo modifica la tarea con el ID especificado
            task[estadoIndex] = nuevoEstado;
            task[idComentarioIndex] = idcomentarioGenerado;
            task[tareaIndex] = idTarea;
            task[comentarioIndex] = nuevoComentario;
            task[fechaComentarioIndex] = new Date().toISOString(); // Fecha actual
        }
    });

    // Vaciar los contenedores de las tarjetas
    $('#tarjetasUsuarios').empty();
    $('#tareasUsuarios').empty();
    $('#tareasUsuariosCerradas').empty();
    $('#tareasSinAsignar').empty();
    generarTarjetas(tareas);
};


function viewTask(idUsuario) {
    let tareas = $(`#tareasUsuarios .card[data-usuario="${idUsuario}"]`);
    let isVisible = tareas.is(':visible');

    $('#tareasUsuarios .card, #tareasUsuariosCerradas .card, #tareasSinAsignar .card').hide();

    if (isVisible) {
        tareas.hide();
    } else {
        tareas.show();
    }
};

function viewTask(idUsuario) {
    let tareas = $(`#tareasUsuarios .card[data-usuario="${idUsuario}"]`);
    let isVisible = tareas.is(':visible');

    $('#tareasUsuarios .card, #tareasUsuariosCerradas .card, #tareasSinAsignar .card').hide();

    if (isVisible) {
        tareas.hide();
    } else {
        tareas.show();

        setTimeout(function () {
            var scrollPosition = $(document)[0].scrollHeight;
            $(window).scrollTop(scrollPosition);
        }, 100);
    }
};

function viewTaskClose(idUsuario) {
    let tareas = $(`#tareasUsuariosCerradas .card[data-usuario="${idUsuario}"]`);
    let isVisible = tareas.is(':visible');

    $('#tareasUsuarios .card, #tareasUsuariosCerradas .card, #tareasSinAsignar .card').hide();

    if (isVisible) {
        tareas.hide();
    } else {
        tareas.show();
        setTimeout(function () {
            var scrollPosition = $(document)[0].scrollHeight;
            $(window).scrollTop(scrollPosition);
        }, 100); 
    }
};

function viewTaskSinAsignar(idUsuario) {
    let tareas = $(`#tareasSinAsignar .card[data-usuario="${idUsuario}"]`);
    let isVisible = tareas.is(':visible');

    $('#tareasUsuarios .card, #tareasUsuariosCerradas .card, #tareasSinAsignar .card').hide();

    if (isVisible) {
        tareas.hide();
    } else {
        tareas.show();
    }
}

function formatFecha(fecha) {
    var fecha = new Date(fecha);
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var año = fecha.getFullYear();
    var hora = fecha.getHours();
    var minuto = fecha.getMinutes();

    if (dia < 10) dia = '0' + dia;
    if (mes < 10) mes = '0' + mes;
    if (hora < 10) hora = '0' + hora;
    if (minuto < 10) minuto = '0' + minuto;

    var fechaFormateada = dia + '/' + mes + '/' + año + ' ' + hora + ':' + minuto;
    return fechaFormateada
}