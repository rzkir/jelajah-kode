import Products from "@/models/Products";

/**
 * Update product statistics when a transaction is successful
 * - Decrease stock by quantity
 * - Increase sold by quantity
 *
 * @param products - Array of products from transaction with _id and quantity
 */
export async function updateProductStatsOnSuccess(
  products: Array<{ _id: string; quantity: number }>
): Promise<void> {
  try {
    // Update each product in the transaction
    for (const product of products) {
      const dbProduct = await Products.findById(product._id);

      if (!dbProduct) {
        console.error(`Product ${product._id} not found`);
        continue;
      }

      // Decrease stock (ensure it doesn't go below 0)
      const newStock = Math.max(0, (dbProduct.stock || 0) - product.quantity);

      // Increase sold
      const newSold = (dbProduct.sold || 0) + product.quantity;

      // Update product
      await Products.findByIdAndUpdate(product._id, {
        stock: newStock,
        sold: newSold,
        updatedAt: new Date(),
      });

      console.log(
        `Updated product ${product._id}: stock ${
          dbProduct.stock
        } -> ${newStock}, sold ${dbProduct.sold || 0} -> ${newSold}`
      );
    }
  } catch (error) {
    console.error("Error updating product stats:", error);
    // Don't throw error to avoid breaking the transaction flow
    // The transaction should still be saved even if product update fails
  }
}

/**
 * Increment download count for a product
 *
 * @param productId - Product ID to update
 */
export async function incrementProductDownloadCount(
  productId: string
): Promise<void> {
  try {
    const product = await Products.findById(productId);

    if (!product) {
      console.error(`Product ${productId} not found`);
      return;
    }

    const newDownloadCount = (product.downloadCount || 0) + 1;

    await Products.findByIdAndUpdate(productId, {
      downloadCount: newDownloadCount,
      updatedAt: new Date(),
    });

    console.log(
      `Incremented download count for product ${productId}: ${
        product.downloadCount || 0
      } -> ${newDownloadCount}`
    );
  } catch (error) {
    console.error("Error incrementing download count:", error);
    throw error;
  }
}
