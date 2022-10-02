

// Variables y Selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


// Eventos
eventListeners();

function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}



// Clases
class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce( (total, gasto) => total + gasto.cantidad, 0);

        this.restante = this.presupuesto - gastado;
    }

    eliminarGasto(id) {
        this.gastos = this.gastos.filter( aux => aux.id !== id );
        this.calcularRestante();
    }
}

class UI {
    insertarPresupuesto( cantidad ) {
        // extrae el valor
        const { presupuesto, restante } = cantidad;

        // los agrega al HTML
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta( mensaje, tipo) {
        // crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        // mensaje de error
        divMensaje.textContent = mensaje;

        // insertar en el HTML
        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // quitar el mensaje luego de 3 segundos
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarGasto(gastos) {

        this.limpiarHTML();
        
        // iterar sobre los gastos
        gastos.forEach( aux => {
            const { cantidad, nombre, id } = aux;

            // crear un li
            const nuevoGasto = document.createElement('li');
            // el className hace lo mismo que el classList
            // lo unico que cambia es la sintaxis nada más
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';

            // 2 formas de agregarle un "id" a este "li" que 
            // estamos creando
            // nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id;


            // Agregar el html del gasto
            nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">${cantidad}</span>`;
            

            // Boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.innerHTML= 'Borrar &bigotimes;';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);

            // Agregar al html
            gastoListado.appendChild( nuevoGasto );
        });
    }

    limpiarHTML(){
        while( gastoListado.firstChild ) {
            gastoListado.removeChild( gastoListado.firstChild );
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const { presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        // comprobar el 25%
        if ((presupuesto / 4) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if ((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // si el total es cero o menor
        if (restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');

            formulario.querySelector('button[type="submit"]').disabled = true;
        }
    }
}

// instanciar
const ui = new UI();
let presupuesto;

// Funciones

function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('Cual es tu presupuesto?');

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN( presupuestoUsuario ) || presupuestoUsuario <= 0) {
        // recarga denuevo la página
        window.location.reload();
    }

    presupuesto = new Presupuesto(presupuestoUsuario);

    ui.insertarPresupuesto(presupuesto);
}



// Añade los gastos
function agregarGasto(e) {
    e.preventDefault();

    // Leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // Validando
    if (nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;
    } else if ( cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no valida', 'error');

        return;
    }


    // Generar un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() }

    // añade un nuevo gasto
    presupuesto.nuevoGasto( gasto );

    // mensaje para imprimir en HTML
    ui.imprimirAlerta('Gasto agregado correctamente');

    // imprimir los gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGasto(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    // reinicia el formulario
    formulario.reset();
}



function eliminarGasto(id) {
    // elimina los gastos del objeto
    presupuesto.eliminarGasto(id);

    // elimina los gastos del html
    const { gastos, restante } = presupuesto;
    ui.mostrarGasto(gastos);

    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);
}