export default {
    template: `
        <div id="productModal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 id="exampleModalLabel" class="modal-title">
                            {{ tempProduct.title }}
                        </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <img :src="tempProduct.image" class="img-fluid" alt>
                        <blockquote class="blockquote mt-3">
                            <p class="mb-0" v-html="tempProduct.content"></p>
                            <footer class="blockquote-footer text-right">
                                {{ tempProduct.description }}
                            </footer>
                        </blockquote>
                        <div class="d-flex justify-content-between align-items-baseline">
                            <div v-if="!tempProduct.price" class="h4">
                                {{ tempProduct.origin_price }} 元
                            </div>
                            <del v-if="tempProduct.price" class="h6">原價 {{ tempProduct.origin_price | money }} 元</del>
                            <div v-if="tempProduct.price" class="h4 text-danger">
                                Now only need {{ tempProduct.price | money }} 元
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-dark btn-block rounded-0"
                            @click="addToCart(tempProduct)">
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `,
    props: ['tempProduct'],
    methods: {
        addToCart(tempProduct) {
            this.$emit('addtocart', tempProduct);
        }
    }
}