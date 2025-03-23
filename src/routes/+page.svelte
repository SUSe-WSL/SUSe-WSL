<script>
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import { PCInfoStore } from '$lib/stores/AdminStore';

    $PCInfoStore = {
        icVerifierCalled: false,
        isVerified: false, 
    }
</script>

<div
	class="via flex h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#fefaf7]"
>
	<div class="flex h-screen flex-col items-center justify-center pt-32 xl:w-[80%]">
		<!-- Go to specific library -->
		<div class="flex w-3/5 flex-col gap-8">
			<div class="flex w-full flex-col gap-4 text-center">
				<h1 class="text-5xl font-medium">
					Asset Tracker and Management System
				</h1>
				<h2 class="text-lg font-normal">Choose the area you want to borrow an item in.</h2>
			</div>
			<div class="flex flex-row justify-center gap-2">
				<Button
					on:click={() => {
						goto('/area/auth/login');
					}}>Login</Button
				>
			</div>
		</div>
		<img
			src="../../placeholder.png"
			class="m-auto mt-20 h-80 object-none w-[90%] rounded-xl border border-slate-100 shadow-2xl xl:w-[68%]"
			alt="service"
		/>
	</div>
</div>
