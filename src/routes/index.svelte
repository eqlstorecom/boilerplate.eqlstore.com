<script lang="ts">
	import Button, { Label } from '@smui/button';

	let clicked = 0;
</script>

<h1>Welcome to SvelteKit!!!!!!!</h1>
<p>
	Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the
	documentation

	<!-- materualui 테스트 -->
	<Button on:click={() => clicked++}>
		<Label>Default</Label>
	</Button>
</p>

<pre class="status">Clicked: {clicked}</pre>
