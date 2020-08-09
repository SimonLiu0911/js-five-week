export default {
    template: `
    <div class="row justify-content-center my-2">
        <div class="col-md-8">
            <div class="text-right mb-3">
                <button type="button" class="btn btn-outline-danger btn-sm" @click="removeAllCartItem()">
                    <i class="far fa-trash-alt">刪除所有品項</i>
                </button>
            </div>
            <table class="table text-center">
                <thead>
                    <th>品名</th>
                    <th width="150px">數量</th>
                    <th>單價</th>
                    <th>單位</th>
                    <th>刪除</th>
                </thead>
                <tbody v-if="cart.length">
                    <tr v-for="item in cart" :key="item.id">
                        <td class="align-middle">
                            {{ item.product.title }}
                        </td>
                        <td class="align-middle">
                            <div class="input-group">
                                <div class="input-group-append">
                                    <button class="btn btn-outline-primary"
                                        type="button"
                                        @click="quantityUpdata(item.product.id, item.quantity - 1)"
                                        :disabled="item.quantity === 1">
                                        -
                                    </button>
                                </div>
                                <input id="inlineFormInputGroupUsername" type="text" class="form-control text-center"
                                :value="item.quantity" @keyup.enter="quantityUpdata(item.product.id, $event.target.value)">
                                <div class="input-group-prepend">
                                    <button class="btn btn-outline-primary"
                                        type="button"
                                        @click="quantityUpdata(item.product.id, item.quantity + 1)">
                                        +
                                    </button>
                                </div>
                            </div>
                        </td>
                        <td class="align-middle text-right">
                        {{ item.product.price | money }}
                        </td>
                        <td class="align-middle">
                        {{ item.product.unit }}
                        </td>
                        <td class="align-middle">
                            <button type="button" class="btn btn-outline-danger btn-sm" @click="removeCartItem(item.product.id)">
                                <i class="far fa-trash-alt"></i>
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div id="totalcart">
                <div class="totalcart__table">
                    <table class="border-bottom">
                        <tbody>
                            <tr>
                                <th width="150px">Subtotal</th>
                                <td><span>{{ cartTotal | money }}</span></td>
                            </tr>
                        </tbody>
                    </table>
                    <button type="button" class="btn btn-dark btn-block rounded-0 mt-2" @click="goingcheckout">CHECKOUT</button>
                </div>
            </div>
            <span class="clearBoth"></span>
        </div>
    </div>
    `,
    props: ["cart", "cartTotal", "api"],
    methods: {
        removeCartItem(id) {
            console.log(this.cartTotal);
            this.$emit('loading');
            // DELETE api/{uuid}/ec/shopping/{pid}
            const url = `${this.api.APIPATH}/api/${this.api.UUID}/ec/shopping/${id}`;
            axios.delete(url).then(response => {
                alert(response.data.message);
                this.$emit('getcart');
                this.$emit('unloaing');
            })
        },
        removeAllCartItem() {
            this.$emit('loading');
            const url = `${this.api.APIPATH}/api/${this.api.UUID}/ec/shopping/all/product`;
            // DELETE api/{uuid}/ec/shopping/all/product
            axios.delete(url).then(response => {
                // console.log(response);
                alert(response.data.message);
                this.$emit('getcart');
                this.$emit('unloaing');
            })
        },
        quantityUpdata(id, num) {
            // 防止數量少於0
            if (num <= 0) { return };
            const data = {
                product: id,
                quantity: num,
            };
            this.$emit('loading');
            // PATCH api/{uuid}/ec/shopping
            const url = `${this.api.APIPATH}/api/${this.api.UUID}/ec/shopping`;
            axios.patch(url, data).then(response => {
                this.$emit('getcart');
                this.$emit('unloaing');
            })
        },
        goingcheckout() {
            // GET api/{uuid}/ec/shopping
            const url = `${this.api.APIPATH}/api/${this.api.UUID}/ec/shopping`;
            axios.get(url).then(response => {
                if (response.data.data.length === 0) {
                    alert('Please choose at least one commodity!')
                } else {
                    window.location = "checkout.html";
                };
            });
        }
    }
}