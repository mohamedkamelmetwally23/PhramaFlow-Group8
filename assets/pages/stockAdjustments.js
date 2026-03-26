import {
  getAllStockAdjustmentsByProductName,
  createStockAdjustments,
  updateStock,
  deleteStock,
  getProductNames,
} from "../api/stockAdjustmentsApi.js";
import loadLayout from "../ui/layout.js";

// ===================== ELEMENTS =====================
const productSelect = document.getElementById("productSelect");
const stockForm = document.querySelector("#addStockForm");
const tableBody = document.querySelector(".table-body");
const filterSelect = document.getElementById("filterSelect");
const addBtn = document.querySelector('[data-action="add"]');
const modalEl = document.getElementById("addStockModal");
const modalTitle = document.getElementById("addStockModalLabel");

const totalAdjustments = document.querySelector("#totalAdjustments");
const totalIncrease = document.querySelector("#totalIncrease");
const totalDecrease = document.querySelector("#totalDecrease");
const totalNetChange = document.querySelector("#totalNetChange");

// ===================== STATE =====================
let allStocks = [];

// ===================== LOAD PRODUCTS =====================
const loadProducts = async () => {
  const products = await getProductNames();
  if (products.length) {
    productSelect.innerHTML = '<option value="">Select Product</option>';
    products.forEach((product) => {
      productSelect.insertAdjacentHTML(
        "beforeend",
        `<option value="${product.id}">${product.name}</option>`,
      );
    });
  }
};

// ===================== CALCULATIONS =====================
const getStats = (stocks) => {
  let increase = 0,
    decrease = 0;

  stocks.forEach((stock) => {
    if (stock.adjustment_type === "increase")
      increase += Number(stock.quantity);
    if (stock.adjustment_type === "decrease")
      decrease += Number(stock.quantity);
  });

  return {
    total: stocks.length,
    increase,
    decrease,
    net: increase - decrease,
  };
};

const updateCards = (stats) => {
  totalAdjustments.textContent = stats.total;
  totalIncrease.textContent = stats.increase;
  totalDecrease.textContent = stats.decrease;
  totalNetChange.textContent = stats.net;
};

// ===================== TABLE =====================
const renderStockRow = (stock) => {
  const markup = `
    <tr>
      <td class="text-muted">${stock.productName}</td>
      <td class="text-muted">${stock.adjustment_type}</td>
      <td class="text-muted">${stock.quantity}</td>
      <td class="text-muted">${stock.reason}</td>
      <td class="text-muted">${stock.timestamp}</td>
      <td class="text-muted">${stock.user}</td>
      <td>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-sm p-0 border-0 bg-transparent edit-btn" 
            data-bs-toggle="modal" data-bs-target="#addStockModal"
            data-id="${stock.id}" data-product-id="${stock.product_id}"
            data-type="${stock.adjustment_type}" data-quantity="${stock.quantity}"
            data-reason="${stock.reason}" data-user="${stock.user}">
            <i class="fa-solid fa-pen-to-square text-primary"></i>
          </button>
          <button class="btn btn-sm p-0 border-0 bg-transparent delete-btn" 
            data-id="${stock.id}">
            <i class="fa-solid fa-trash text-danger"></i>
          </button>
        </div>
      </td>
    </tr>
  `;
  tableBody.insertAdjacentHTML("beforeend", markup);
};

const renderTable = (stocks) => {
  tableBody.innerHTML = "";

  if (!stocks?.length) {
    tableBody.innerHTML =
      '<tr><td colspan="7" class="text-center">No Stock found.</td></tr>';
    return;
  }

  stocks.forEach(renderStockRow);
};

// ===================== LOAD DATA =====================
const loadData = async () => {
  const res = await getAllStockAdjustmentsByProductName();

  if (res.success) {
    allStocks = res.data;
    renderTable(allStocks);
    updateCards(getStats(allStocks));
  } else {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-danger">Error: ${res.error}</td></tr>`;
  }
};

// ===================== FILTER =====================
const filterStocks = (type) => {
  const filtered = type ? allStocks.filter((s) => s.type === type) : allStocks;
  renderTable(filtered);
  updateCards(getStats(filtered));
};

filterSelect.addEventListener("change", (e) => filterStocks(e.target.value));

// ===================== DELETE & EDIT =====================
tableBody.addEventListener("click", async (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) {
    if (confirm("Are you sure?")) {
      const result = await deleteStock(deleteBtn.dataset.id);
      if (result.success) loadData();
      else alert(result.error);
    }
    return;
  }

  const editBtn = e.target.closest(".edit-btn");
  if (editBtn) {
    productSelect.value = editBtn.dataset.productId;
    document.getElementById("Type").value = editBtn.dataset.type;
    document.getElementById("Quantity").value = editBtn.dataset.quantity;
    document.getElementById("reason").value = editBtn.dataset.reason;
    document.getElementById("user").value = editBtn.dataset.user;
    stockForm.dataset.editId = editBtn.dataset.id;
    modalTitle.textContent = "Edit Stock";
  }
});

// ===================== FORM SUBMIT =====================
stockForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const stockData = {
    product_id: productSelect.value,
    type: document.getElementById("Type").value,
    quantity: document.getElementById("Quantity").value,
    status: document.getElementById("reason").value,
    note: document.getElementById("Note").value,
    user: document.getElementById("user").value,
  };

  const id = stockForm.dataset.editId;
  const result = id
    ? await updateStock(id, stockData)
    : await createStockAdjustments(stockData);

  if (result.success) {
    await loadData();
    stockForm.reset();
    delete stockForm.dataset.editId;
    bootstrap.Modal.getInstance(modalEl).hide();
  } else {
    alert(result.error);
  }
});

// ===================== RESET FORM =====================
const resetForm = () => {
  stockForm.reset();
  delete stockForm.dataset.editId;
  modalTitle.textContent = "Add New Stock Adjustments";
};

addBtn.addEventListener("click", resetForm);
modalEl.addEventListener("hidden.bs.modal", resetForm);

// ===================== INIT =====================
loadLayout("Stock Adjustments");
loadProducts();
loadData();
