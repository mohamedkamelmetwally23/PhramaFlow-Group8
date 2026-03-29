import Supplier from '../models/Supplier.js';
import { apiRequest } from './apiClient.js';
import { generateId } from '../utils/helpers.js';
import { getProducts } from './productsApi.js';
import { createActivityLog } from './activityLogApi.js';

// ===============================
// Get All Suppliers
export const getSuppliers = async () => apiRequest('suppliers');

// ===============================
// Get Supplier By ID
export const getSupplierById = async (id) => apiRequest(`suppliers/${id}`);

// ===============================
// Suppliers + Products Supplied Count
export const getSuppliersWithProductSupplied = async () => {
  const [suppliersRes, productsRes] = await Promise.all([
    apiRequest('suppliers'),
    getProducts(),
  ]);

  if (!suppliersRes.success) {
    return { success: false, error: suppliersRes.error };
  }
  if (!productsRes.success) {
    return { success: false, error: productsRes.error };
  }

  const suppliers = suppliersRes.data || [];
  const products = productsRes.data || [];

  const suppliersWithCount = suppliers.map((s) => {
    const count = products.filter((p) => p.supplier_id === s.id).length;
    return { ...s, ProductsSupplied: count };
  });

  return { success: true, data: suppliersWithCount };
};

// ===============================
// Create Supplier
export const createSupplier = async (data) => {
  const supplierId = generateId('SUP');

  const newSupplier = new Supplier({
    id: supplierId,
    supplierName: data.supplier_name,
    contactName: data.contact_name,
    contactEmail: data.contact_email,
    contactPhone: data.contact_phone,
    address: data.address,
  });

  const result = await apiRequest('suppliers', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newSupplier),
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await createActivityLog({
    action: 'create',
    entity_type: 'supplier',
    entity_id: supplierId,
    description: `Added new supplier: ${data.supplier_name}`,
    user_id: 'USR-4c3e2a1f',
  });

  return result;
};

// ===============================
// Update Supplier
export const updateSupplier = async (supplierId, data) => {
  const result = await apiRequest(`suppliers/${supplierId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await createActivityLog({
    action: 'update',
    entity_type: 'supplier',
    entity_id: supplierId,
    description: `Updated ${data.supplier_name} supplier data`,
    user_id: 'USR-4c3e2a1f',
  });

  return result;
};

// ===============================
// Delete Supplier
export const deleteSupplier = async (supplierId) => {
  const productsRes = await getProducts();
  if (!productsRes.success) {
    return { success: false, error: productsRes.error };
  }
  const hasProducts = productsRes.data.some(
    (p) => p.supplier_id === supplierId,
  );
  if (hasProducts) {
    return {
      success: false,
      error: 'Cannot delete supplier because it supplies products.',
    };
  }

  const result = await apiRequest(`suppliers/${supplierId}`, {
    method: 'DELETE',
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await createActivityLog({
    action: 'delete',
    entity_type: 'supplier',
    entity_id: supplierId,
    description: `Removed inactive supplier: Old Supplier`,
    user_id: 'USR-4c3e2a1f',
  });

  return result;
};
