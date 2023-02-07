const Product = require("../models/products");
class ProductService {
    
    async createProduct(product){
        return await Product.create(product);
    }

    async findOne(productId){
        return await Product.findOne({where: {id: productId}});
    }

    async updateProduct(id, payload) {
        return await Product.update(payload, {
          where: {
            id
          }
        });
      }
    

}

module.exports = ProductService;
