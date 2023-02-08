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
    

}

module.exports = ProductService;
