const btnAbrirModal = document.getElementById("btn-abrir-modal");
const btnCerrarModal = document.getElementById("btn-cerrar-modal");
const modal = document.getElementById("modal");
const form = document.getElementById("form-producto");
const tablaBody = document.getElementById("tabla-body");

let productos = [];
let id = 1;
let editandoId = null; // <- aquí guardamos el id del producto en edición

// Cargar datos desde JSON
async function cargarDatos() {
  try {
    const res = await fetch("db.json");
    const data = await res.json();
    productos = data.productos;
    id = productos.length ? productos[productos.length - 1].id + 1 : 1;
    renderTabla();
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

// Renderizar tabla
function renderTabla() {
  tablaBody.innerHTML = productos
    .map(
      (p) => `
        <tr class="border-b">
          <td class="px-4 py-2">${p.id}</td>
          <td class="px-4 py-2">${p.descripcion}</td>
          <td class="px-4 py-2">$${p.precio}</td>
          <td class="px-4 py-2">${p.stock}</td>
          <td class="px-4 py-2">
            <button 
              class="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded mr-2" 
              onclick="editar(${p.id})">
              Editar
            </button>
            <button 
              class="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded" 
              onclick="eliminar(${p.id})">
              Eliminar
            </button>
          </td>
        </tr>
      `
    )
    .join("");
}

// Crear nuevo producto
function crear(descripcion, precio, stock) {
  const nuevo = {
    id: id++,
    descripcion,
    precio: parseFloat(precio),
    stock: parseInt(stock),
  };
  productos.push(nuevo);
  renderTabla();
}

// Editar producto (abrir modal con datos cargados)
function editar(pid) {
  const producto = productos.find((p) => p.id === pid);
  if (!producto) return;

  document.getElementById("descripcion").value = producto.descripcion;
  document.getElementById("precio").value = producto.precio;
  document.getElementById("stock").value = producto.stock;

  editandoId = pid; // guardamos el id del que vamos a editar
  modal.classList.remove("hidden");
}

// Eliminar producto
function eliminar(pid) {
  productos = productos.filter((p) => p.id !== pid);
  renderTabla();
}

// Guardar formulario (crear o editar)
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const stock = document.getElementById("stock").value;

  if (editandoId !== null) {
    // editar producto existente
    productos = productos.map((p) =>
      p.id === editandoId
        ? {
            ...p,
            descripcion,
            precio: parseFloat(precio),
            stock: parseInt(stock),
          }
        : p
    );
    editandoId = null; // reset después de guardar
  } else {
    // crear nuevo
    crear(descripcion, precio, stock);
  }

  form.reset();
  modal.classList.add("hidden");
  renderTabla();
});

// Abrir modal para nuevo producto
btnAbrirModal.addEventListener("click", () => {
  editandoId = null; // aseguramos que no esté en modo edición
  form.reset();
  modal.classList.remove("hidden");
});

// Cerrar modal
btnCerrarModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

// Iniciar
cargarDatos();
