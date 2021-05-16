<template>
	<div class="p-grid crud-demo">
		<div class="p-col-12">
			<div class="card">
				<Toast/>
				<Toolbar class="p-mb-4">
					<template v-slot:left>
						<Button label="New" icon="pi pi-plus" class="p-button-success p-mr-2" @click="openNew" />
						<SplitButton label="Bu AY" icon="pi pi-list" :model="items" class="p-button-secondary "></SplitButton>
					</template>

					<template v-slot:right>
						<FileUpload mode="basic" accept="image/*" :maxFileSize="1000000" label="Import" chooseLabel="Import" class="p-mr-2 p-d-inline-block" />
						<Button label="Export" icon="pi pi-upload" class="p-button-help" @click="exportCSV($event)"  />
					</template>
				</Toolbar>
				
			</div>
		</div>
	</div>

</template>

<script>
import ProductService from '../service/ProductService';

export default {
	data() {
		return {
			items: [
				{
					label: 'Ocak',
					// icon: 'pi pi-refresh',
					command: () => {
						this.$toast.add({severity:'success', summary:'Updated', detail:'Data Updated', life: 3000});
					}
				},
				{
					label: 'Şubat',
					// icon: 'pi pi-times',
					command: () => {
						this.$toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
					}
				},
				{
					label: 'Mart',
					// icon: 'pi pi-external-link',
					command: () => {
						window.location.href = 'https://vuejs.org/'
					}
				},
				{
					label: 'Nisan',
					// icon: 'pi pi-upload',
                    to: '/fileupload'
				},
				{
					label: 'Mayıs',
					// icon: 'pi pi-upload',
                    to: '/fileupload'
				},
				{
					label: 'Haziran',
					// icon: 'pi pi-upload',
                    to: '/fileupload'
				},
				{
					label: 'Temmuz',
					// icon: 'pi pi-upload',
                    to: '/fileupload'
				},
				{
					label: 'Ağustos',
					// icon: 'pi pi-upload',
                    to: '/fileupload'
				},
				{
					label: 'Eylül',
					// icon: 'pi pi-upload',
                    to: '/fileupload'
				},
				{
					label: 'Ekim',
					// icon: 'pi pi-upload',
                    to: '/fileupload'
				},
				{
					label: 'Kasım',
					// icon: 'pi pi-upload',
                    to: '/fileupload'
				},
				{
					label: 'Aralık',
					// icon: 'pi pi-upload',
                    to: '/fileupload'
				}
			],
	
		}
	},
	productService: null,
	created() {
		this.productService = new ProductService();
	},
	mounted() {
		this.productService.getProducts().then(data => this.products = data);
	},
	methods: {
		formatCurrency(value) {
			if(value)
				return value.toLocaleString('en-US', {style: 'currency', currency: 'USD'});
			return;
		},
		openNew() {
			this.product = {};
			this.submitted = false;
			this.productDialog = true;
		},
		hideDialog() {
			this.productDialog = false;
			this.submitted = false;
		},
		saveProduct() {
			this.submitted = true;
			if (this.product.name.trim()) {
			if (this.product.id) {
				this.product.inventoryStatus = this.product.inventoryStatus.value ? this.product.inventoryStatus.value: this.product.inventoryStatus;
				this.products[this.findIndexById(this.product.id)] = this.product;
				this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
				}
				else {
					this.product.id = this.createId();
					this.product.code = this.createId();
					this.product.image = 'product-placeholder.svg';
					this.product.inventoryStatus = this.product.inventoryStatus ? this.product.inventoryStatus.value : 'INSTOCK';
					this.products.push(this.product);
					this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
				}
				this.productDialog = false;
				this.product = {};
			}
		},
		editProduct(product) {
			this.product = {...product};
			this.productDialog = true;
		},
		confirmDeleteProduct(product) {
			this.product = product;
			this.deleteProductDialog = true;
		},
		deleteProduct() {
			this.products = this.products.filter(val => val.id !== this.product.id);
			this.deleteProductDialog = false;
			this.product = {};
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Product Deleted', life: 3000});
		},
		findIndexById(id) {
			let index = -1;
			for (let i = 0; i < this.products.length; i++) {
				if (this.products[i].id === id) {
					index = i;
					break;
				}
			}
			return index;
		},
		createId() {
			let id = '';
			var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			for ( var i = 0; i < 5; i++ ) {
				id += chars.charAt(Math.floor(Math.random() * chars.length));
			}
			return id;
		},
		exportCSV() {
			this.$refs.dt.exportCSV();
		},
		confirmDeleteSelected() {
			this.deleteProductsDialog = true;
		},
		deleteSelectedProducts() {
			this.products = this.products.filter(val => !this.selectedProducts.includes(val));
			this.deleteProductsDialog = false;
			this.selectedProducts = null;
			this.$toast.add({severity:'success', summary: 'Successful', detail: 'Products Deleted', life: 3000});
		}
	}
}
</script>

<style scoped lang="scss">
	.table-header {
		display: flex;
		justify-content: space-between;
	}

	.product-image {
		width: 100px;
		box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
	}

	.p-dialog .product-image {
		width: 150px;
		margin: 0 auto 2rem auto;
		display: block;
	}

	.confirmation-content {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.product-badge {
		border-radius: 2px;
		padding: .25em .5rem;
		text-transform: uppercase;
		font-weight: 700;
		font-size: 12px;
		letter-spacing: .3px;

		&.status-instock {
			background: #C8E6C9;
			color: #256029;
		}

		&.status-outofstock {
			background: #FFCDD2;
			color: #C63737;
		}

		&.status-lowstock {
			background: #FEEDAF;
			color: #8A5340;
		}
	}

	::v-deep(.p-toolbar) {
		flex-wrap: wrap;
		.p-button {
			margin-bottom: .25rem;
		}
	}
</style>
