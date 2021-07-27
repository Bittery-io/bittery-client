export class SaveInvoiceDto {
    amount: number;
    currency: string;
    invoiceValidity: string;
    itemDesc?: string;
    buyer?: string;

    constructor(amount: number, currency: string, invoiceValidity: string, itemDesc?: string, buyer?: string) {
        this.amount = amount;
        this.currency = currency;
        this.invoiceValidity = invoiceValidity;
        this.itemDesc = itemDesc;
        this.buyer = buyer;
    }
}
