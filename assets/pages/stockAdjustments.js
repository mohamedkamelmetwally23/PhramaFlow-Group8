import {
  getAllStockAdjustmentsByProductName,
  createStockAdjustments,
  updateStock,
  deleteStock,
} from '../api/stockAdjustmentsApi.js';
import loadLayout from '../ui/layout.js';
import { renderTablePage } from '../components/table.js';
import { getProducts } from '../api/productsApi.js';
import { formatDate } from '../utils/helpers.js';
import showNotification from '../utils/notification.js';

// ===================== ELEMENTS =====================
const productSelect = document.getElementById('productSelect');

// ===================== STATE =====================
let stocksRaw = [];
let currentPage = 1;
const rowsPerPage = 10;
let allProducts = [];
let currentEditId = null;
let editingStockData = null;
let currentDisplayData = [];
let currentFilterValue = '';

// ===================== HELPER FUNCTION =====================
function getCurrentTimestamp() {
  return new Date().toISOString();
}

function formatDateForInput(dateString) {
  if (!dateString) return '';
  return dateString.split('T')[0];
}

// ===================== LOAD PRODUCTS =====================
async function loadProducts() {
  try {
    const products = await getProducts();

    allProducts = products.data || [];

    if (allProducts.length > 0 && productSelect) {
      productSelect.innerHTML = '<option value="">Select Product</option>';
      allProducts.forEach((product) => {
        productSelect.insertAdjacentHTML(
          'beforeend',
          `<option value="${product.id}">${product.product_name}</option>`,
        );
      });
    }

    updateFilterOptions();
  } catch (err) {
    console.error('Error loading products:', err);
  }
}

// ===================== UPDATE FILTER DROPDOWN =====================
function updateFilterOptions() {
  const filterSelect = document.getElementById('filterSelect');
  if (!filterSelect) return;

  filterSelect.innerHTML = `
      <option value="">All</option>
      <option value="increase">Increase</option>
      <option value="decrease">Decrease</option>
  `;
}

// ===================== LOAD STOCK ADJUSTMENTS =====================
// async function loadStocks() {
//   try {
//     const res = await getAllStockAdjustmentsByProductName();
//     stocksRaw = res.data || [];
//     filteredStocks = res.data || [];

//     const formattedData = stocksRaw.map((item) => {
//       // ===================== STATUS BADGE =====================
//       let typeText = item.adjustment_type || 'N/A';

//       const adjustmentTypeClass = {
//         increase: 'badge bg-success',
//         decrease: 'badge bg-danger',
//         'N/A': 'badge bg-secondary',
//       };

//       return {
//         id: item.id,
//         product_name: item.productName,
//         adjustment_type: `<span class="${adjustmentTypeClass[typeText]}">${typeText}</span>`,
//         quantity: item.quantity || 0,
//         reason: item.reason || 'N/A',
//         timestamp: item.timestamp ? formatDate(item.timestamp) : 'N/A',
//         user: item.user || 'System',
//       };
//     });

//     renderTablePage(
//       formattedData,
//       actionsHTML,
//       currentPage,
//       rowsPerPage,
//       'stock_adjustments',
//     );

//     updateCards();
//     updateCaption();
//     updatePageNumber();
//     updateFilterOptions();
//   } catch (err) {
//     console.error('Error loading stocks:', err);
//   }
// }
async function loadStocks() {
  try {
    const res = await getAllStockAdjustmentsByProductName();
    stocksRaw = res.data || [];
    currentDisplayData = stocksRaw;
    currentPage = 1;
    renderCurrentPage();
    updateCards();
    updateCaption();

    const filterSelect = document.getElementById('filterSelect');
    if (filterSelect) filterSelect.value = '';
    currentFilterValue = '';
  } catch (err) {
    console.error('Error loading stocks:', err);
  }
}

function renderCurrentPage() {
  const formattedData = currentDisplayData.map((item) => {
    let typeText = item.adjustment_type || 'N/A';
    const adjustmentTypeClass = {
      increase: 'badge bg-success',
      decrease: 'badge bg-danger',
      'N/A': 'badge bg-secondary',
    };
    return {
      id: item.id,
      product_name: item.productName,
      status: {
        statusClass: adjustmentTypeClass[typeText],
        statusText: typeText,
      },
      quantity: item.quantity || 0,
      reason: item.reason || 'N/A',
      timestamp: item.timestamp ? formatDate(item.timestamp) : 'N/A',
      user: item.user || 'System',
    };
  });

  renderTablePage(
    formattedData,
    actionsHTML,
    currentPage,
    rowsPerPage,
    'stock_adjustments',
  );

  let totalIncrease = 0,
    totalDecrease = 0;
  currentDisplayData.forEach((stock) => {
    if (stock.adjustment_type === 'increase') {
      totalIncrease += Number(stock.quantity) || 0;
    } else if (stock.adjustment_type === 'decrease') {
      totalDecrease += Number(stock.quantity) || 0;
    }
  });

  const totalAdjustmentsEl = document.querySelector('#totalAdjustments');
  const totalIncreaseEl = document.querySelector('#totalIncrease');
  const totalDecreaseEl = document.querySelector('#totalDecrease');
  const totalNetChangeEl = document.querySelector('#totalNetChange');

  if (totalAdjustmentsEl)
    totalAdjustmentsEl.textContent = currentDisplayData.length;
  if (totalIncreaseEl) totalIncreaseEl.textContent = totalIncrease;
  if (totalDecreaseEl) totalDecreaseEl.textContent = totalDecrease;
  if (totalNetChangeEl)
    totalNetChangeEl.textContent = totalIncrease - totalDecrease;

  // تحديث التسمية (caption) بعدد السجلات المعروضة
  const captionEl = document.getElementById('tableCaption');
  if (captionEl) {
    captionEl.innerHTML = `
      <i class="fa-solid fa-box"></i> All Stock Adjustments (${currentDisplayData.length})
    `;
  }

  // تحديث عرض رقم الصفحة
  const pageNumberEl = document.getElementById('pageNumber');
  if (pageNumberEl) pageNumberEl.textContent = currentPage;
}

// ===================== ACTION BUTTONS HTML =====================
function actionsHTML(stock) {
  return `
    <button class="btn btn-sm edit-btn border-0" data-id="${stock.id}">
      <i class="fa-solid fa-pen-to-square text-primary"></i>
    </button>
    <button class="btn btn-sm delete-btn border-0" data-id="${stock.id}">
      <i class="fa-solid fa-trash text-danger"></i>
    </button>
  `;
}

// ===================== UPDATE STATISTICS CARDS =====================
function updateCards() {
  let totalIncrease = 0;
  let totalDecrease = 0;

  stocksRaw.forEach((stock) => {
    if (stock.adjustment_type === 'increase') {
      totalIncrease += Number(stock.quantity) || 0;
    } else if (stock.adjustment_type === 'decrease') {
      totalDecrease += Number(stock.quantity) || 0;
    }
  });

  const netChange = totalIncrease - totalDecrease;

  const totalAdjustments = document.querySelector('#totalAdjustments');
  const totalIncreaseEl = document.querySelector('#totalIncrease');
  const totalDecreaseEl = document.querySelector('#totalDecrease');
  const totalNetChangeEl = document.querySelector('#totalNetChange');

  if (totalAdjustments) totalAdjustments.textContent = stocksRaw.length;
  if (totalIncreaseEl) totalIncreaseEl.textContent = totalIncrease;
  if (totalDecreaseEl) totalDecreaseEl.textContent = totalDecrease;
  if (totalNetChangeEl) totalNetChangeEl.textContent = netChange;

  totalNetChangeEl.classList.add(
    `${netChange >= 0 ? 'text-success' : 'text-danger'}`,
  );
}

// ===================== UPDATE TABLE CAPTION =====================
function updateCaption() {
  const captionEl = document.getElementById('tableCaption');
  if (captionEl) {
    captionEl.innerHTML = `
      <i class="fa-solid fa-box"></i> All Stock Adjustments (${stocksRaw.length})
    `;
  }
}

// ===================== POPULATE FORM WITH STOCK DATA =====================
function populateFormWithStockData(stock) {
  const productSelect = document.getElementById('productSelect');
  const typeSelect = document.getElementById('Type');
  const quantityInput = document.getElementById('Quantity');
  const reasonInput = document.getElementById('reason');
  const userInput = document.getElementById('user');
  const dateInput = document.getElementById('Date');

  if (productSelect) productSelect.value = stock.product_id || '';
  if (typeSelect) typeSelect.value = stock.adjustment_type;
  if (quantityInput) quantityInput.value = stock.quantity;
  if (reasonInput) reasonInput.value = stock.reason || '';
  if (userInput) userInput.value = stock.user || '';

  if (dateInput && stock.timestamp) {
    dateInput.value = formatDateForInput(stock.timestamp);
  }
}

// ===================== MODAL OPEN HANDLER =====================
document
  .getElementById('addStockModal')
  ?.addEventListener('show.bs.modal', () => {
    const form = document.getElementById('addStockForm');
    const dateInput = document.getElementById('Date');

    if (currentEditId && editingStockData) {
      populateFormWithStockData(editingStockData);

      const modalTitle = document.getElementById('addStockModalLabel');
      if (modalTitle) modalTitle.textContent = 'Edit Stock Adjustment';

      const subtitle = document.getElementById('productModalSubtitle');
      if (subtitle)
        subtitle.textContent = 'Update the stock adjustment information below';
    } else {
      if (form) form.reset();

      if (dateInput) {
        dateInput.value = formatDateForInput(getCurrentTimestamp());
      }

      const modalTitle = document.getElementById('addStockModalLabel');
      if (modalTitle) modalTitle.textContent = 'Add New Stock Adjustment';

      const subtitle = document.getElementById('productModalSubtitle');
      if (subtitle)
        subtitle.textContent = 'Enter the details for the new stock adjustment';
    }
  });

// ===================== FORM SUBMIT HANDLER =====================
document
  .getElementById('addStockForm')
  ?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const editId = currentEditId;
    const currentTimestamp = getCurrentTimestamp();

    const data = {
      product_id: document.getElementById('productSelect')?.value.trim(),
      adjustment_type: document.getElementById('Type')?.value.trim(),
      quantity: Number(document.getElementById('Quantity')?.value),
      reason: document.getElementById('reason')?.value.trim(),
      user: document.getElementById('user')?.value.trim(),
      timestamp: currentTimestamp,
    };

    if (
      !data.product_id ||
      !data.adjustment_type ||
      !data.quantity ||
      !data.reason ||
      !data.user
    ) {
      showNotification('warning', 'Please fill all required fields');
      return;
    }

    let result;

    if (editId && editId !== 'null' && editId !== 'undefined') {
      result = await updateStock(editId, data);
      result.success &&
        showNotification('success', 'Updated Stock successfully');
    } else {
      result = await createStockAdjustments(data);
      result.success &&
        showNotification('success', 'Created Stock successfully');
    }

    if (result && result.success) {
      await loadStocks();

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('addStockModal'),
      );
      if (modal) modal.hide();

      currentEditId = null;
      editingStockData = null;
    } else {
      showNotification('error', 'Failed to save stock adjustment, Try Again');
    }
  });

// ===================== TABLE & CARDS EVENT HANDLER (EDIT/DELETE) =====================
const handleActionClick = function (e) {
  const container = e.target.closest('[data-id]');
  if (!container) return;

  const id = container.dataset.id;
  const stock = stocksRaw.find((s) => s.id == id);

  // --- EDIT ---
  if (e.target.closest('.edit-btn')) {
    if (stock) {
      currentEditId = id;
      editingStockData = { ...stock };

      const modal = new bootstrap.Modal(
        document.getElementById('addStockModal'),
      );
      modal.show();
    }
  }

  // --- DELETE ---
  if (e.target.closest('.delete-btn')) {
    window.currentDeleteId = id;
    const modal = new bootstrap.Modal(document.getElementById('deleteModal'));
    modal.show();
  }
};

document
  .getElementById('tableBody')
  ?.addEventListener('click', handleActionClick);
document
  .getElementById('cardsContainer')
  ?.addEventListener('click', handleActionClick);

// ===================== CONFIRM DELETE HANDLER =====================
document
  .getElementById('confirmDelete')
  ?.addEventListener('click', async () => {
    if (!window.currentDeleteId) return;

    const result = await deleteStock(window.currentDeleteId);

    console.log(result);

    if (result.success) {
      await loadStocks();
      showNotification('success', 'Deleted Stock successfully');

      const modal = bootstrap.Modal.getInstance(
        document.getElementById('deleteModal'),
      );
      if (modal) modal.hide();
    } else {
      showNotification('error', 'Failed to delete stock, Try Again');
    }
  });

// ===================== FILTER HANDLER =====================
document.getElementById('filterSelect')?.addEventListener('change', (e) => {
  currentFilterValue = e.target.value;
  let filtered = [];

  if (!currentFilterValue) {
    filtered = stocksRaw;
  } else if (currentFilterValue === 'increase') {
    filtered = stocksRaw.filter(
      (stock) => stock.adjustment_type === 'increase',
    );
  } else if (currentFilterValue === 'decrease') {
    filtered = stocksRaw.filter(
      (stock) => stock.adjustment_type === 'decrease',
    );
  } else if (currentFilterValue.startsWith('product_')) {
    const productName = currentFilterValue.replace('product_', '');
    filtered = stocksRaw.filter((stock) => {
      const stockProductName = stock.productName || stock.product_name;
      return stockProductName === productName;
    });
  }

  currentDisplayData = filtered;
  currentPage = 1;
  renderCurrentPage();
});

// ===================== PAGINATION HANDLERS =====================
document.getElementById('prevBtn')?.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    renderCurrentPage();
  }
});

document.getElementById('nextBtn')?.addEventListener('click', () => {
  const totalPages = Math.ceil(stocksRaw.length / rowsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    renderCurrentPage();
  }
});

// ===================== MODAL CLOSE HANDLER =====================
document
  .getElementById('addStockModal')
  ?.addEventListener('hidden.bs.modal', () => {
    const form = document.getElementById('addStockForm');
    if (form && !currentEditId) {
      form.reset();
    }

    currentEditId = null;
    editingStockData = null;

    const modalTitle = document.getElementById('addStockModalLabel');
    if (modalTitle) modalTitle.textContent = 'Add New Stock Adjustment';

    const subtitle = document.getElementById('productModalSubtitle');
    if (subtitle)
      subtitle.textContent = 'Enter the details for the new stock adjustment';
  });

// ===================== INITIALIZATION =====================
async function init() {
  loadLayout('Stock Adjustments');
  await loadProducts();
  await loadStocks();
}

init();
