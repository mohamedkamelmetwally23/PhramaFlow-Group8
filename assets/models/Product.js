class Product {
  constructor({ id, sku, product_name, category_id, quantity, price, expire_date, supplier_id, status }) {
    this.id = id;
    this.sku = sku;
    this.product_name = product_name;
    this.category_id = category_id;
    this.quantity = quantity;
    this.price = price;
    this.expire_date = expire_date;
    this.supplier_id = supplier_id;
    this.status = status;
  }
}

export default Product;