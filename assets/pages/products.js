import loadLayout from "../ui/layout.js";
import {
  getProductsWithRelations,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../api/productsApi.js";
import { renderTablePage } from "../components/table.js";

// =======================
// Load Layout
// =======================
loadLayout("Products");

// =======================
// Variables
// =======================
let products = [];
let editIndex = null;
let deleteIndex = null;
let currentPage = 1;
const rowsPerPage = 10;

// =======================
// Load Data
// =======================
async function loadProducts() {
  try {
    const res = await getProductsWithRelations();
    products = res?.data || [];

    updateCaption();
    updatePageInfo();
    renderTablePage(products, actionsHTML, currentPage, rowsPerPage, "products");
  } catch (err) {
    console.error("Error loading products:", err);
    alert("Failed to load products data.");
  }
}

loadProducts();

// =======================
// Actions Icons
// =======================
function actionsHTML(product) {
  return `
    <button class="btn btn-sm edit-btn border-0">
      <i class="fa-solid fa-pen-to-square edit-icon"></i>
    </button>

    <button class="btn btn-sm delete-btn border-0">
      <i class="fa-solid fa-trash delete-icon"></i>
    </button>
  `;
}

// =======================
// Caption
// =======================
function updateCaption() {
  document.getElementById("tableCaption").innerHTML = `
    <i class="fa-solid fa-box"></i> All Products (${products.length})
  `;
}

// =======================
// Pagination Info
// =======================
function updatePageInfo() {
  const total = products.length;
  const from = (currentPage - 1) * rowsPerPage + 1;
  const to = Math.min(currentPage * rowsPerPage, total);
  document.getElementById("tableInfo").textContent = `${from}–${to} of ${total}`;
  document.getElementById("pageNumber").textContent = currentPage;
}

// =======================
// Pagination Events
// =======================
document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    renderTablePage(products, actionsHTML, currentPage, rowsPerPage, "products");
    updatePageInfo();
  }
});

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentPage < Math.ceil(products.length / rowsPerPage)) {
    currentPage++;
    renderTablePage(products, actionsHTML, currentPage, rowsPerPage, "products");
    updatePageInfo();
  }
});

// =======================
// Open Add Modal
// =======================
document.getElementById("addProduct").addEventListener("click", () => {
  editIndex = null;
  document.getElementById("addProductForm").reset();
  document.getElementById("addProductModalLabel").textContent = "Add New Product";
  document.getElementById("productModalSubtitle").textContent =
    "Enter the details for the new product";

  const modal = new bootstrap.Modal(
    document.getElementById("addProductModal")
  );
  modal.show();
});

// =======================
// Submit Add / Edit
// =======================
document.getElementById("addProductForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    sku: document.getElementById("productSKU").value.trim(),
    product_name: document.getElementById("productName").value.trim(),
    category_id: document.getElementById("productCategory").value.trim(),
    quantity: document.getElementById("quantity").value.trim(),
    price: document.getElementById("Price").value.trim(),
    expire_date: document.getElementById("productExpireDate").value.trim(),
    supplier_id: document.getElementById("productSupplier").value.trim(),
    status: document.getElementById("productStatus").value.trim(),
  };

  // Validation
  for (let key in data) {
    if (!data[key]) {
      alert("Please fill all fields");
      return;
    }
  }

  try {
    if (editIndex === null) {
      await createProduct(data);
    } else {
      await updateProduct(products[editIndex].id, data);
    }

    await loadProducts();
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addProductModal")
    );
    modal.hide();
  } catch (err) {
    console.error("Error saving product:", err);
    alert("Failed to save product.");
  }
});

// =======================
// Table Events (Edit / Delete)
// =======================
document.getElementById("tableBody").addEventListener("click", function (e) {
  const row = e.target.closest("tr");
  if (!row) return;

  const index = Number(row.dataset.index);

  // EDIT
  if (e.target.closest(".edit-btn")) {
    editIndex = index;
    const p = products[index];

    document.getElementById("productSKU").value = p.sku;
    document.getElementById("productName").value = p.product_name;
    document.getElementById("productCategory").value = p.category_id;
    document.getElementById("quantity").value = p.quantity;
    document.getElementById("Price").value = p.price;
    document.getElementById("productExpireDate").value = p.expire_date;
    document.getElementById("productSupplier").value = p.supplier_id;
    document.getElementById("productStatus").value = p.status;

    document.getElementById("addProductModalLabel").textContent = "Edit Product";
    document.getElementById("productModalSubtitle").textContent =
      "Update the product information below";

    const modal = new bootstrap.Modal(
      document.getElementById("addProductModal")
    );
    modal.show();
  }

  // DELETE
  if (e.target.closest(".delete-btn")) {
    deleteIndex = index;

    const modal = new bootstrap.Modal(
      document.getElementById("deleteModal")
    );
    modal.show();
  }
});

// =======================
// Confirm Delete
// =======================
document.getElementById("confirmDelete").addEventListener("click", async () => {
  if (deleteIndex === null) return;

  const product = products[deleteIndex];

  try {
    await deleteProduct(product.id);
    await loadProducts();

    deleteIndex = null;

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("deleteModal")
    );
    modal.hide();
  } catch (err) {
    console.error("Error deleting product:", err);
    alert("Failed to delete product.");
  }
});