<script>
  import { enhance } from '$app/forms';
</script>

<p>This is the protected page!</p>

<form method="post" use:enhance>
  <button>Sign out</button>
</form>
