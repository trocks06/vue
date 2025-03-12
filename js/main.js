Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img :src="image" :alt="altText"/>
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p v-if="inStock">In stock</p>
            <p :class="{ lineThrough: !inStock }" v-else>Out of Stock</p>
            <product-details :details="details"></product-details>

            <div class="color-box" v-for="(variant, index) in variants" :key="variant.variantId"
                 :style="{ backgroundColor:variant.variantColor }" @mouseover="updateProduct(index)">
            </div>
            <p>Shipping: {{ shipping }}</p>
            <p v-show="onSale">{{sale}}</p>

            <button v-on:click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">Add to cart</button>
            <button v-on:click="deleteToCart">Delete to cart</button>
            <div>
            <h2>Reviews</h2>
            <p v-if="!reviews.length">There are no reviews yet.</p>
            <ul>
              <li v-for="review in reviews">
              <p>{{ review.name }}</p>
              <p>Rating: {{ review.rating }}</p>
              <p>{{ review.review }}</p>
              </li>
            </ul>
            </div>
            <product-review @review-submitted="addReview"></product-review>
        </div>
    </div>
    `,
    data() {
        return {
            product: "Socks",
            brand: 'Vue Mastery',
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            selectedVariant: 0,
            onSale: true,
            altText: "A pair of socks",
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10,
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 2,
                }
            ],
            reviews: [],
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        deleteToCart() {
            this.$emit('delete-to-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index;
            console.log(index);
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },
        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity;
        },
        sale() {
            return this.brand + ' ' + this.product + ' IS ON SALE!!!!';
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99;
            }
        }
    }
})

Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
    <ul>
        <li v-for="detail in details">{{ detail }}</li>
    </ul>
    `
});

Vue.component('product-review', {
    template: `
    <form class="review-form" @submit.prevent="onSubmit">
    <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
    </p>
    
    <p>
        <label for="review">Review:</label>
        <textarea id="review" v-model="review"></textarea>
    </p>
    
    <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
            <option>5</option>
            <option>4</option>
            <option>3</option>
            <option>2</option>
            <option>1</option>
        </select>
    </p>
    
    <p>
    <input type="submit" value="Submit"> 
    </p>
    
    </form>
    `,
    data() {
        return {
            name: null,
            review: null,
            rating: null,
        };
    },
    methods: {
        onSubmit() {
            let productReview = {
                name: this.name,
                review: this.review,
                rating: this.rating,
            }
            this.$emit('review-submitted', productReview);
            this.name = null
            this.review = null
            this.rating = null
        },
        addReview(productReview) {
            this.reviews.push(productReview);
        },

    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
        cart: [],
    },
    methods: {
        updateCart(id) {
            console.log(id);
            this.cart.push(id);
        },
        deleteCart(id) {
            let index = this.cart.indexOf(id);
            if (index !== -1) {
                this.cart.splice(index, 1);
            } else {
                console.log('Item not found in cart:', id);
            }
        }

    }
})