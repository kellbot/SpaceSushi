<template>
	<v-container class="fill-height">
		<v-responsive class="align-center text-center fill-height">

			<v-card>
				<v-tabs v-model="tab" bg-color="primary">
					<v-tab value="one">Item One</v-tab>
					<v-tab value="two">Item Two</v-tab>
					<v-tab value="three">Item Three</v-tab>
				</v-tabs>

				<v-card-text>
					<v-window v-model="tab">
						<v-window-item value="one">
							<ItemButton />
						</v-window-item>

						<v-window-item value="two">
							Two
						</v-window-item>

						<v-window-item value="three">
							Three
						</v-window-item>
					</v-window>
				</v-card-text>
			</v-card>



		</v-responsive>
	</v-container>
</template>

<script>
import ItemButton from '@/components/itemButton.vue';
export default {
    data: () => ({
      tab: null,
    }),  
		components: {
    ItemButton
		}
  }
</script>
