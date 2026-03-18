class Supplier {
  constructor({ id, supplierName, contactName, contactEmail, contactPhone, address }) {
    this.id = id;
    this.supplier_name = supplierName;
    this.contact_name = contactName;
    this.contact_email = contactEmail;
    this.contact_phone = contactPhone;
    this.address = address;
  }
}

export default Supplier;
