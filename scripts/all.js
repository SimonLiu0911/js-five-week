import Cart from "./components/Cart.js";
import ProductDetail from "./components/ProductDetail.js";
import Footer from "./components/footer.js";
// 中文語言包
// import zh from './zh_TW.js';

Vue.component("Cart", Cart);
Vue.component("Productdetail", ProductDetail);
Vue.component("FooterBottom", Footer);

// 載入自訂規則包(中文語言包)
// VeeValidate.localize('tw', zh);
// 將 VeeValidate input 驗證工具載入 作為全域註冊
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);
// 將 VeeValidate form 驗證工具載入 作為全域註冊
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

Vue.use(VueLoading);
Vue.component('loading', VueLoading);

// 自定義設定檔案，錯誤的 className
VeeValidate.configure({
    classes: {
        valid: 'is-valid',
        invalid: 'is-invalid',
    },
});

Vue.filter('money', function (num) {
    var parts = num.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.join('.');
})


new Vue({
    el: "#app",
    data: {
        products: [],
        tempProduct: {},
        isLoading: false,
        status: {
            id: ''
        },
        cart: {},
        cartTotal: 0,
        api: {
            UUID: 'd5ab7a96-794d-433e-9fc9-13fa71ebe3d6',
            APIPATH: 'https://course-ec-api.hexschool.io'
        },
        form: {
            name: '',
            email: '',
            tel: '',
            address: '',
            payment: '',
            message: '',
        }
    },
    methods: {
        Loading() {
            this.isLoading = true;
        },
        unLoaing() {
            this.isLoading = false
        },
        getProducts(page = 1) {
            this.isLoading = true;
            // GET api/{uuid}/ec/products
            const url = `${this.api.APIPATH}/api/${this.api.UUID}/ec/products?page=${page}`
            axios.get(url).then(response => {
                this.products = response.data.data;
                this.isLoading = false;
            })
        },
        getCart() {
            this.cartTotal = 0;
            // GET api/{uuid}/ec/shopping
            const url = `${this.api.APIPATH}/api/${this.api.UUID}/ec/shopping`;
            axios.get(url).then(response => {
                this.cart = response.data.data;
                this.cart.forEach(item => {
                    this.cartTotal += item.product.price * item.quantity;
                })
            })
        },
        addToCart(item, quantity = 1) {

            this.isLoading = true;
            this.cart = {
                product: item.id,
                quantity
            };
            // POST api/{uuid}/ec/shopping
            const url = `${this.api.APIPATH}/api/${this.api.UUID}/ec/shopping`;
            axios.post(url, this.cart).then(response => {
                this.getCart();
                this.isLoading = false;
                $("#productModal").modal("hide");
            }).catch(error => {
                this.getCart();
                this.isLoading = false;
                alert(error.response.data.errors[0]);
                $("#productModal").modal("hide");
            })
        },
        getDetailed(item) {
            this.isLoading = true;
            // GET api/{uuid}/ec/product/{id}
            const url = `${this.api.APIPATH}/api/${this.api.UUID}/ec/product/${item.id}`
            axios.get(url).then(response => {
                this.tempProduct = response.data.data;
                $('#productModal').modal('show');
                this.isLoading = false;
            })
        },
        beingLoading() {
            this.isLoading = true;
            console.log(1)
        },
        createOrder() {
            this.isLoading = true;
            // POST api/{uuid}/ec/orders
            const url = `${this.api.APIPATH}/api/${this.api.UUID}/ec/orders`;
            axios.post(url, this.form).then((response) => {
                if (response.data.data.id) {
                    this.isLoading = false;
                    // 跳出提示訊息
                    $('#orderModal').modal('show');

                    // 重新渲染購物車
                    this.getCart();
                }
            }).catch((error) => {
                this.isLoading = false;
                console.log(error.response.data.errors);
            });
        }
    },
    created() {
        this.getProducts();
        this.getCart();
    }
})