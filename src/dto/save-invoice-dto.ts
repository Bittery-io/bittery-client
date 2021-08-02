export class SaveInvoiceDto {
    amount: string;
    currency: string;
    invoiceValidity: string;
    itemDesc?: string;
    buyer?: string;

    constructor(amount: string, currency: string, invoiceValidity: string, itemDesc?: string, buyer?: string) {
        this.amount = amount;
        this.currency = currency;
        this.invoiceValidity = invoiceValidity;
        this.itemDesc = itemDesc;
        this.buyer = buyer;
    }
}
