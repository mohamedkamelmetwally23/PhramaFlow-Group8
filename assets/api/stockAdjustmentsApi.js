import { apiRequest } from './apiClient.js';
import { generateId } from '../utils/helpers.js';
import StockAdjustments from '../models/stockAdjustments.js';
import { getProductById } from './productsApi.js';
import { createActivityLog } from './activityLogApi.js';
// Get all stock adjustments
export const getAllStockAdjustments = async () => {
  return await apiRequest('stock_adjustments');
};
// Get all stock adjustments by Id
export const getAllStockAdjustmentsById = async (id) => {
  return await apiRequest(`stock_adjustments/${id}`);
};

// Get All stock adjustments and attach product name using product_id
export const getAllStockAdjustmentsByProductName = async () => {
  const stockRes = await apiRequest('stock_adjustments');
  const productRes = await apiRequest(`products`);
  const stocks = stockRes.data;
  const products = productRes.data;
  const result = stocks.map((stock) => {
    const product = products.find((prd) => prd.id == stock.product_id);
    return {
      ...stock,
      productName: product ? product.product_name : 'Unknown',
    };
  });
  return { success: true, data: result };
};

// create stock
export const createStockAdjustments = async (data) => {
  const generateStockId = generateId('STK');

  const newStockAdjustments = new StockAdjustments({
    id: generateStockId,
    product_id: data.product_id,
    adjustment_type: data.adjustment_type,
    quantity: data.quantity,
    reason: data.reason,
    timestamp: data.timestamp,
    user: data.user,
  });

  const productRes = await getProductById(data.product_id);
  const product = productRes.data;

  const result = await apiRequest('stock_adjustments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newStockAdjustments),
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await createActivityLog({
    action: 'create',
    entity_type: 'stock_adjustment',
    entity_id: generateStockId,
    description: `Adjusted stock for ${product.product_name} : ${data.adjustment_type} by ${data.quantity} units. Reason: ${data.reason}`,
    user_id: 'USR-4c3e2a1f',
  });

  return result;
};

// Update Stock
export const updateStock = async (id, data) => {
  const productRes = await getProductById(data.product_id);
  const product = productRes.data;

  const result = await apiRequest(`stock_adjustments/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await createActivityLog({
    action: 'update',
    entity_type: 'stock_adjustment',
    entity_id: id,
    description: `Adjusted stock for ${product.product_name} : ${data.adjustment_type} by ${data.quantity} units. Reason: ${data.reason}`,
    user_id: 'USR-4c3e2a1f',
  });

  return result;
};

// Delete Stock
export const deleteStock = async (id) => {
  const result = await apiRequest(`stock_adjustments/${id}`, {
    method: 'DELETE',
  });

  if (!result.success) {
    return { success: false, error: result.error };
  }

  await createActivityLog({
    action: 'delete',
    entity_type: 'stock_adjustment',
    entity_id: id,
    description: `Deleted Stock Adjustment`,
    user_id: 'USR-4c3e2a1f',
  });

  return result;
};
