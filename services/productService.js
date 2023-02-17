const Product = require("../models/products");
class ProductService {
    
    async createProduct(product){
        return await Product.create(product);
    }

    async findOne(productId){
        return await Product.findOne({where: {id: productId}});
    }

    async findOrCreate(sku, defaults){
      return await Product.findOrCreate({
        where : {sku},
        defaults
      });
    }

    async findOneBySku(sku){
      return await Product.findOne({
        where : {sku}
      });
    }

    async deleteProductInfo(productId){
      return await Product.destroy({
        where : { id : productId }
      });
    }
    
    async updateProductInfo(productUpdate, productId){
      return await Product.update(productUpdate, {
        where: {
          id: productId
        }
      })
    }

}

module.exports = ProductService;
